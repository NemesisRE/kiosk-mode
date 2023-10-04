import {
  KioskModeRunner,
  HomeAssistant,
  User,
  Lovelace,
  KioskConfig,
  ConditionalKioskConfig,
  SuscriberEvent,
  EntitySetting,
  Version
} from '@types';
import {
  CACHE,
  OPTION,
  ELEMENT,
  TRUE,
  FALSE,
  CUSTOM_MOBILE_WIDTH_DEFAULT,
  SUSCRIBE_EVENTS_TYPE,
  STATE_CHANGED_EVENT,
  TOGGLE_MENU_EVENT,
  WINDOW_RESIZE_DELAY,
  NAMESPACE,
  NON_CRITICAL_WARNING,
  SHADOW_ROOT_SUFFIX
} from '@constants';
import {
  toArray,
  queryString,
  setCache,
  cached,
  addStyle,
  removeStyle,
  getMenuTranslations,
  getPromisableElement,
  addMenuItemsDataSelectors,
  parseVersion
} from '@utilities';
import { STYLES } from '@styles';

import { ConInfo } from './conf-info';

class KioskMode implements KioskModeRunner {
  constructor() {
    window.kioskModeEntities = {};
    if (queryString(OPTION.CLEAR_CACHE)) {
      setCache([
        CACHE.HEADER,
        CACHE.SIDEBAR,
        CACHE.OVERFLOW,
        CACHE.MENU_BUTTON,
        CACHE.ACCOUNT,
        CACHE.NOTIFICATIONS,
        CACHE.SEARCH,
        CACHE.ASSISTANT,
        CACHE.REFRESH,
        CACHE.UNUSED_ENTITIES,
        CACHE.RELOAD_RESOURCES,
        CACHE.EDIT_DASHBOARD,
        CACHE.DIALOG_HEADER_ACTION_ITEMS,
        CACHE.DIALOG_HEADER_HISTORY,
        CACHE.DIALOG_HEADER_SETTINGS,
        CACHE.DIALOG_HEADER_OVERFLOW,
        CACHE.DIALOG_HISTORY,
        CACHE.DIALOG_LOGBOOK,
        CACHE.DIALOG_ATTRIBUTES,
        CACHE.DIALOG_MEDIA_ACTIONS,
        CACHE.DIALOG_UPDATE_ACTIONS,
        CACHE.DIALOG_CLIMATE_ACTIONS,
        CACHE.DIALOG_TIMER_ACTIONS,
        CACHE.DIALOG_HISTORY_SHOW_MORE,
        CACHE.DIALOG_LOGBOOK_SHOW_MORE,
        CACHE.OVERFLOW_MOUSE,
        CACHE.MOUSE
      ], FALSE);
    }

    const selectMainElements = async () => {

      // Select ha
      this.ha = await getPromisableElement(
        (): HomeAssistant => document.querySelector<HomeAssistant>(ELEMENT.HOME_ASSISTANT),
        (ha: HomeAssistant) => !!(ha && ha.shadowRoot),
        ELEMENT.HOME_ASSISTANT
      );

      // Select home assistant main
      this.main = await getPromisableElement(
        (): ShadowRoot => this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN)?.shadowRoot,
        (main: ShadowRoot) => !!main,
        `${ELEMENT.HOME_ASSISTANT_MAIN}${SHADOW_ROOT_SUFFIX}`
      );

      // Select user
      this.user = await getPromisableElement(
        (): User => this.ha?.hass?.user,
        (user: User) => !!user,
        `${ELEMENT.HOME_ASSISTANT} > hass > user`
      );

      this.version = parseVersion(this.ha.hass?.config?.version);

      // Select partial panel resolver
      const partialPanelResolver = await getPromisableElement(
        (): Element => this.main.querySelector(ELEMENT.PARTIAL_PANEL_RESOLVER),
        (partialPanelResolver: Element) => !!partialPanelResolver,
        `${ELEMENT.HOME_ASSISTANT_MAIN} > ${ELEMENT.PARTIAL_PANEL_RESOLVER}`
      );

      this.panelResolverObserver = new MutationObserver(this.watchDashboards);
      this.dialogsMutationObserver = new MutationObserver(this.watchMoreInfoDialogs);
      this.dialogContentMutationObserver = new MutationObserver(this.watchMoreInfoDialogsContent);

      // Start the mutation observer for partial panel resolver
      this.panelResolverObserver.observe(partialPanelResolver, {
        childList: true,
      });

      // Start the mutation observer for more info dialog
      this.dialogsMutationObserver.observe(this.ha.shadowRoot, {
        childList: true,
      });

      // Start kiosk-mode
      this.run();
      this.entityWatch();

    };

    selectMainElements();

    this.resizeWindowBinded = this.resizeWindow.bind(this);   
    
  }

  // Elements
  private ha: HomeAssistant;
  private main: ShadowRoot;
  private user: User;
  private huiRoot: ShadowRoot;
  private lovelace: Lovelace;
  private drawerLayout: HTMLElement;
  private appToolbar: HTMLElement;
  private sideBarRoot: ShadowRoot;
  private menuTranslations: Record<string, string>;
  private resizeDelay: number;
  private resizeWindowBinded: () => void;
  private panelResolverObserver: MutationObserver;
  private dialogsMutationObserver: MutationObserver;
  private dialogContentMutationObserver: MutationObserver;
  private version: Version | null;

  // Kiosk Mode options
  private hideHeader: boolean;
  private hideSidebar: boolean;
  private hideOverflow: boolean;
  private hideMenuButton: boolean;
  private hideAccount: boolean;
  private hideNotifications: boolean;
  private hideSearch: boolean;
  private hideAssistant: boolean;
  private hideRefresh: boolean;
  private hideUnusedEntities: boolean;
  private hideReloadResources: boolean;
  private hideEditDashboard: boolean;
  private hideDialogHeaderActionItems: boolean;
  private hideDialogHeaderHistory: boolean;
  private hideDialogHeaderSettings: boolean;
  private hideDialogHeaderOverflow: boolean;
  private hideDialogHistory: boolean;
  private hideDialogLogbook: boolean;
  private hideDialogAttributes: boolean;
  private hideDialogMediaActions: boolean;
  private hideDialogUpdateActions: boolean;
  private hideDialogClimateActions: boolean;
  private hideDialogTimerActions: boolean;
  private hideDialogHistoryShowMore: boolean;
  private hideDialogLogbookShowMore: boolean;
  private blockOverflow: boolean;
  private blockMouse: boolean;
  private ignoreEntity: boolean;
  private ignoreMobile: boolean;
  private ignoreDisableKm: boolean;

  public run(lovelace = this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE)) {
    if (!lovelace) {
      return;
    }
    this.lovelace = lovelace;

    // Get the configuration and process it
    return getPromisableElement(
      () => lovelace?.lovelace?.config,
      (config: Lovelace['lovelace']['config']) => !!config,
      'Lovelace config'
    )
      .then((config: Lovelace['lovelace']['config']) => {
        return this.processConfig(
          config.kiosk_mode || {}
        );
      });
  }

  public async runDialogs(
    moreInfoDialog: Element = this.ha?.shadowRoot?.querySelector(ELEMENT.HA_MORE_INFO_DIALOG)
  ) {

    if (!moreInfoDialog) {
      return;
    }

    const moreInfoDialogShadowRoot = await getPromisableElement(
      () => moreInfoDialog?.shadowRoot,
      (shadowRoot: ShadowRoot) => !!shadowRoot,
      `${ELEMENT.HA_MORE_INFO_DIALOG}:${SHADOW_ROOT_SUFFIX}`
    );

    const dialog = await getPromisableElement(
      () => moreInfoDialogShadowRoot.querySelector<HTMLElement>(ELEMENT.HA_DIALOG),
      (dialog: HTMLElement) => !!dialog,
      `${ELEMENT.HA_MORE_INFO_DIALOG}:${SHADOW_ROOT_SUFFIX} > ${ELEMENT.HA_DIALOG}`
    );

    const content = await getPromisableElement(
      (): Element => dialog.querySelector(ELEMENT.HA_DIALOG_CONTENT),
      (content: Element) => !!content,
      `${ELEMENT.HA_DIALOG} > ${ELEMENT.HA_DIALOG_CONTENT}`
    );

    getPromisableElement(
      (): Element => content.querySelector(`${ELEMENT.HA_DIALOG_MORE_INFO}, ${ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK}`),
      (content: Element) => !!content,
      `${ELEMENT.HA_DIALOG} > ${ELEMENT.HA_DIALOG_CONTENT} > child`
    )
      .then((contentChild) => {
        // Start the mutation observer for more info dialog
        this.dialogContentMutationObserver.disconnect();
        this.dialogContentMutationObserver.observe(content, {
          childList: true,
        });
        this.runDialogsChildren(contentChild);
      })
      .catch(() => { /* ignore if it doesn‘t exist */ });

    this.insertDialogStyles(dialog);

  }

  public async runDialogsChildren(child: Element) {

    if (
      !child ||
      (
        child.localName !== ELEMENT.HA_DIALOG_MORE_INFO &&
        child.localName !== ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK
      )
    ) {
      return;
    }

    const childShadowRoot = await getPromisableElement(
      () => child.shadowRoot,
      (moreInfo: ShadowRoot) => !!moreInfo,
      `${ELEMENT.HA_DIALOG} > ${ELEMENT.HA_DIALOG_CONTENT} > ${child.localName}:${SHADOW_ROOT_SUFFIX}`
    );

    this.insertDialogChildStyles(childShadowRoot);

  }

  protected async processConfig(config: KioskConfig) {
    const dash = this.ha.hass.panelUrl;
    if (!window.kioskModeEntities[dash]) {
      window.kioskModeEntities[dash] = [];
    }
    this.hideHeader                  = false;
    this.hideSidebar                 = false;
    this.hideOverflow                = false;
    this.hideMenuButton              = false;
    this.hideAccount                 = false;
    this.hideNotifications           = false;
    this.hideSearch                  = false;
    this.hideAssistant               = false;
    this.hideRefresh                 = false;
    this.hideUnusedEntities          = false;
    this.hideReloadResources         = false;
    this.hideEditDashboard           = false;
    this.hideDialogHeaderActionItems = false;
    this.hideDialogHeaderHistory     = false;
    this.hideDialogHeaderSettings    = false;
    this.hideDialogHeaderOverflow    = false;
    this.hideDialogHistory           = false;
    this.hideDialogLogbook           = false;
    this.hideDialogAttributes        = false;
    this.hideDialogMediaActions      = false;
    this.hideDialogUpdateActions     = false;
    this.hideDialogClimateActions    = false;
    this.hideDialogTimerActions      = false;
    this.hideDialogHistoryShowMore   = false;
    this.hideDialogLogbookShowMore   = false;
    this.blockOverflow               = false;
    this.blockMouse                  = false;
    this.ignoreEntity                = false;
    this.ignoreMobile                = false;
    this.ignoreDisableKm             = false;

    this.huiRoot = await getPromisableElement(
      (): ShadowRoot => this.lovelace?.shadowRoot?.querySelector(ELEMENT.HUI_ROOT)?.shadowRoot,
      (huiRoot: ShadowRoot) => !!huiRoot,
      `${ELEMENT.HUI_ROOT}${SHADOW_ROOT_SUFFIX}`
    );
    
    this.drawerLayout = await getPromisableElement(
      (): HTMLElement => this.main.querySelector<HTMLElement>(ELEMENT.HA_DRAWER),
      (drawerLayout: HTMLElement) => !!drawerLayout,
      ELEMENT.HA_DRAWER
    );
    
    this.appToolbar = await getPromisableElement(
      (): HTMLElement => this.huiRoot.querySelector<HTMLElement>(ELEMENT.TOOLBAR),
      (appToolbar: HTMLElement) => !!appToolbar,
      ELEMENT.TOOLBAR
    );

    this.sideBarRoot = await getPromisableElement(
      (): ShadowRoot => this.drawerLayout.querySelector(ELEMENT.HA_SIDEBAR)?.shadowRoot,
      (sideBarRoot: ShadowRoot) => !!sideBarRoot,
      `${ELEMENT.HA_SIDEBAR}${SHADOW_ROOT_SUFFIX}`
    );

    // Get menu translations
    getMenuTranslations(this.ha)
      .then((menuTranslations: Record<string, string>) => {
        this.menuTranslations = menuTranslations;
        this.updateMenuItemsLabels();
      })
      .catch(() => {
        console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} Cannot get resources translations`);
      });

    // Retrieve localStorage values & query string options.
    const cachedOptionsSet = cached([
      CACHE.HEADER,
      CACHE.SIDEBAR,
      CACHE.OVERFLOW,
      CACHE.MENU_BUTTON,
      CACHE.ACCOUNT,
      CACHE.NOTIFICATIONS,
      CACHE.SEARCH,
      CACHE.ASSISTANT,
      CACHE.REFRESH,
      CACHE.UNUSED_ENTITIES,
      CACHE.RELOAD_RESOURCES,
      CACHE.EDIT_DASHBOARD,
      CACHE.DIALOG_HEADER_ACTION_ITEMS,
      CACHE.DIALOG_HEADER_HISTORY,
      CACHE.DIALOG_HEADER_SETTINGS,
      CACHE.DIALOG_HEADER_OVERFLOW,
      CACHE.DIALOG_HISTORY,
      CACHE.DIALOG_LOGBOOK,
      CACHE.DIALOG_ATTRIBUTES,
      CACHE.DIALOG_MEDIA_ACTIONS,
      CACHE.DIALOG_UPDATE_ACTIONS,
      CACHE.DIALOG_CLIMATE_ACTIONS,
      CACHE.DIALOG_TIMER_ACTIONS,
      CACHE.DIALOG_HISTORY_SHOW_MORE,
      CACHE.DIALOG_LOGBOOK_SHOW_MORE,
      CACHE.OVERFLOW_MOUSE,
      CACHE.MOUSE
    ]);

    const queryStringsSet = queryString([
      OPTION.KIOSK,
      OPTION.HIDE_HEADER,
      OPTION.HIDE_SIDEBAR,
      OPTION.HIDE_OVERFLOW,
      OPTION.HIDE_MENU_BUTTON,
      OPTION.HIDE_ACCOUNT,
      OPTION.HIDE_NOTIFICATIONS,
      OPTION.HIDE_SEARCH,
      OPTION.HIDE_ASSISTANT,
      OPTION.HIDE_REFRESH,
      OPTION.HIDE_RELOAD_RESOURCES,
      OPTION.HIDE_UNUSED_ENTITIES,
      OPTION.HIDE_EDIT_DASHBOARD,
      OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS,
      OPTION.HIDE_DIALOG_HEADER_HISTORY,
      OPTION.HIDE_DIALOG_HEADER_SETTINGS,
      OPTION.HIDE_DIALOG_HEADER_OVERFLOW,
      OPTION.HIDE_DIALOG_HISTORY,
      OPTION.HIDE_DIALOG_LOGBOOK,
      OPTION.HIDE_DIALOG_ATTRIBUTES,
      OPTION.HIDE_DIALOG_MEDIA_ACTIONS,
      OPTION.HIDE_DIALOG_UPDATE_ACTIONS,
      OPTION.HIDE_DIALOG_CLIMATE_ACTIONS,
      OPTION.HIDE_DIALOG_TIMER_ACTIONS,
      OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE,
      OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE,
      OPTION.BLOCK_OVERFLOW,
      OPTION.BLOCK_MOUSE
    ]);

    const cachedOptionsOrQueryStringsSet = cachedOptionsSet || queryStringsSet;
    if (cachedOptionsOrQueryStringsSet) {
      this.hideHeader                  = cached(CACHE.HEADER)                     || queryString([OPTION.KIOSK, OPTION.HIDE_HEADER]);
      this.hideSidebar                 = cached(CACHE.SIDEBAR)                    || queryString([OPTION.KIOSK, OPTION.HIDE_SIDEBAR]);
      this.hideOverflow                = cached(CACHE.OVERFLOW)                   || queryString(OPTION.HIDE_OVERFLOW);
      this.hideMenuButton              = cached(CACHE.MENU_BUTTON)                || queryString(OPTION.HIDE_MENU_BUTTON);
      this.hideAccount                 = cached(CACHE.ACCOUNT)                    || queryString(OPTION.HIDE_ACCOUNT);
      this.hideNotifications           = cached(CACHE.NOTIFICATIONS)              || queryString(OPTION.HIDE_NOTIFICATIONS);
      this.hideSearch                  = cached(CACHE.SEARCH)                     || queryString(OPTION.HIDE_SEARCH);
      this.hideAssistant               = cached(CACHE.ASSISTANT)                  || queryString(OPTION.HIDE_ASSISTANT);
      this.hideRefresh                 = cached(CACHE.REFRESH)                    || queryString(OPTION.HIDE_REFRESH);
      this.hideUnusedEntities          = cached(CACHE.UNUSED_ENTITIES)            || queryString(OPTION.HIDE_UNUSED_ENTITIES);
      this.hideReloadResources         = cached(CACHE.RELOAD_RESOURCES)           || queryString(OPTION.HIDE_RELOAD_RESOURCES);
      this.hideEditDashboard           = cached(CACHE.EDIT_DASHBOARD)             || queryString(OPTION.HIDE_EDIT_DASHBOARD);
      this.hideDialogHeaderActionItems = cached(CACHE.DIALOG_HEADER_ACTION_ITEMS) || queryString(OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS);
      this.hideDialogHeaderHistory     = cached(CACHE.DIALOG_HEADER_HISTORY)      || queryString(OPTION.HIDE_DIALOG_HEADER_HISTORY);
      this.hideDialogHeaderSettings    = cached(CACHE.DIALOG_HEADER_SETTINGS)     || queryString(OPTION.HIDE_DIALOG_HEADER_SETTINGS);
      this.hideDialogHeaderOverflow    = cached(CACHE.DIALOG_HEADER_OVERFLOW)     || queryString(OPTION.HIDE_DIALOG_HEADER_OVERFLOW);
      this.hideDialogHistory           = cached(CACHE.DIALOG_HISTORY)             || queryString(OPTION.HIDE_DIALOG_HISTORY);
      this.hideDialogLogbook           = cached(CACHE.DIALOG_LOGBOOK)             || queryString(OPTION.HIDE_DIALOG_LOGBOOK);
      this.hideDialogAttributes        = cached(CACHE.DIALOG_ATTRIBUTES)          || queryString(OPTION.HIDE_DIALOG_ATTRIBUTES);
      this.hideDialogMediaActions      = cached(CACHE.DIALOG_MEDIA_ACTIONS)       || queryString(OPTION.HIDE_DIALOG_MEDIA_ACTIONS);
      this.hideDialogUpdateActions     = cached(CACHE.DIALOG_UPDATE_ACTIONS)      || queryString(OPTION.HIDE_DIALOG_UPDATE_ACTIONS);
      this.hideDialogClimateActions    = cached(CACHE.DIALOG_CLIMATE_ACTIONS)     || queryString(OPTION.HIDE_DIALOG_CLIMATE_ACTIONS);
      this.hideDialogTimerActions      = cached(CACHE.DIALOG_TIMER_ACTIONS)       || queryString(OPTION.HIDE_DIALOG_TIMER_ACTIONS);
      this.hideDialogHistoryShowMore   = cached(CACHE.DIALOG_HISTORY_SHOW_MORE)   || queryString(OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE);
      this.hideDialogLogbookShowMore   = cached(CACHE.DIALOG_LOGBOOK_SHOW_MORE)   || queryString(OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE);
      this.blockOverflow               = cached(CACHE.OVERFLOW_MOUSE)             || queryString(OPTION.BLOCK_OVERFLOW);
      this.blockMouse                  = cached(CACHE.MOUSE)                      || queryString(OPTION.BLOCK_MOUSE);
    } else {
      // Use config values only if config strings and cache aren't used.
      this.setOptions(config, false);
    }

    // Admin non-admin config
    const adminConfig = this.user.is_admin
      ? config.admin_settings
      : config.non_admin_settings;

    if (adminConfig) {
      this.setOptions(adminConfig, true);
    }

    // User settings config
    if (config.user_settings) {
      toArray(config.user_settings).forEach((conf) => {
        if (toArray(conf.users).some((x) => x.toLowerCase() === this.user.name.toLowerCase())) {
          this.setOptions(conf, true);
        }
      });
    }

    // Mobile config
    const mobileConfig = this.ignoreMobile
      ? null
      : config.mobile_settings;

    if (mobileConfig) {
      const mobileWidth = mobileConfig.custom_width
        ? mobileConfig.custom_width
        : CUSTOM_MOBILE_WIDTH_DEFAULT;
      if (window.innerWidth <= mobileWidth) {
        this.setOptions(mobileConfig, true);
      }
    }

    // Entity config
    const entityConfig = this.ignoreEntity
      ? null
      : config.entity_settings;

    if (entityConfig) {
      entityConfig.forEach((conf: EntitySetting) => {
        const entity = Object.keys(conf.entity)[0];
        if (!window.kioskModeEntities[dash].includes(entity)) {
          window.kioskModeEntities[dash].push(entity);
        }
        if (this.ha.hass.states[entity].state == conf.entity[entity]) {
          this.setOptions(conf, false);
        }
      });
    }

    // Do not run kiosk-mode if it is disabled
    if (
      queryString(OPTION.DISABLE_KIOSK_MODE) &&
      !this.ignoreDisableKm
    ) {
      return;
    }

    this.insertStyles();
  }

  // INSERT REGULAR STYLES
  protected insertStyles() {

    // Remove toggle menu event
    this.main?.host?.removeEventListener(TOGGLE_MENU_EVENT, this.blockToggleMenuGesture, true);

    if (this.hideSidebar) {
      this.main?.host?.addEventListener(TOGGLE_MENU_EVENT, this.blockToggleMenuGesture, true);
    }
  
    if (this.hideHeader) {
      addStyle(STYLES.HEADER, this.huiRoot);
      if (queryString(OPTION.CACHE)) setCache(CACHE.HEADER, TRUE);
    } else {
      removeStyle(this.huiRoot);
    }

    if (this.hideSidebar) {
      addStyle(STYLES.SIDEBAR, this.drawerLayout);
      addStyle(STYLES.ASIDE, this.drawerLayout.shadowRoot);
      if (queryString(OPTION.CACHE)) setCache(CACHE.SIDEBAR, TRUE);
    } else {
      removeStyle(this.drawerLayout);
      removeStyle(this.drawerLayout.shadowRoot);
    }

    if (
      this.hideAccount ||
      this.hideNotifications ||
      this.hideMenuButton
    ) {
      const styles = [
          this.hideAccount ? STYLES.ACCOUNT : '',
          this.hideNotifications ? STYLES.NOTIFICATIONS : '',
          this.hideAccount && this.hideNotifications
            ? STYLES.DIVIDER
            : '',
          this.hideAccount || this.hideNotifications
            ? STYLES.PEPER_LISTBOX(this.hideAccount, this.hideNotifications)
            : '',
          this.hideMenuButton ? STYLES.MENU_BUTTON : '',
      ];
      addStyle(styles.join(''), this.sideBarRoot);
      if (this.hideAccount && queryString(OPTION.CACHE)) setCache(CACHE.ACCOUNT, TRUE);
    } else {
      removeStyle(this.sideBarRoot);
    }

    if (
      this.hideSearch ||
      this.hideAssistant ||
      this.hideRefresh ||
      this.hideUnusedEntities ||
      this.hideReloadResources ||
      this.hideEditDashboard ||
      this.hideMenuButton ||
      this.hideOverflow ||
      this.blockOverflow ||
      this.hideSidebar
    ) {
      const styles = [
          this.hideSearch ? STYLES.SEARCH : '',
          this.hideAssistant ? STYLES.ASSISTANT : '',
          this.hideRefresh ? STYLES.REFRESH : '',
          this.hideUnusedEntities ? STYLES.UNUSED_ENTITIES : '',
          this.hideReloadResources ? STYLES.RELOAD_RESOURCES : '',
          this.hideEditDashboard ? STYLES.EDIT_DASHBOARD : '',
          this.hideOverflow ? STYLES.OVERFLOW_MENU : '',
          this.blockOverflow ? STYLES.BLOCK_OVERFLOW : '',
          this.hideMenuButton || this.hideSidebar ? STYLES.MENU_BUTTON_BURGER : '',
      ];
      addStyle(styles.join(''), this.appToolbar);
      if (queryString(OPTION.CACHE)) {
          if (this.hideSearch) setCache(CACHE.SEARCH, TRUE);
          if (this.hideAssistant) setCache(CACHE.ASSISTANT, TRUE);
          if (this.hideRefresh) setCache(CACHE.REFRESH, TRUE);
          if (this.hideUnusedEntities) setCache(CACHE.UNUSED_ENTITIES, TRUE);
          if (this.hideReloadResources) setCache(CACHE.RELOAD_RESOURCES, TRUE);
          if (this.hideEditDashboard) setCache(CACHE.EDIT_DASHBOARD, TRUE);
          if (this.hideOverflow) setCache(CACHE.OVERFLOW, TRUE);
          if (this.blockOverflow) setCache(CACHE.OVERFLOW_MOUSE, TRUE);
          if (this.hideMenuButton) setCache(CACHE.MENU_BUTTON, TRUE);
      }
    } else {
      removeStyle(this.appToolbar);
    }

    if (this.blockMouse) {
      addStyle(STYLES.MOUSE, document.body);
      if (queryString(OPTION.CACHE)) setCache(CACHE.MOUSE, TRUE);
    } else {
      removeStyle(document.body);
    }

    // Resize event
    window.removeEventListener('resize', this.resizeWindowBinded);
    window.addEventListener('resize', this.resizeWindowBinded);

    // Resize window to 'refresh' view.
    window.dispatchEvent(new Event('resize'));
  }

  // INSERT MORE INFO DIALOG STYLES
  protected async insertDialogStyles(dialog: HTMLElement) {

    getPromisableElement(
      (): NodeListOf<HTMLElement> => dialog.querySelectorAll<HTMLElement>(`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}`),
      (elements: NodeListOf<HTMLElement>): boolean => !!elements,
      `:scope > ${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}`
    )
      .then((menuItems: NodeListOf<HTMLElement>) => {
        addMenuItemsDataSelectors(menuItems, this.menuTranslations);
      })
      .catch((message) => { console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} ${message}`) });

    if (
      this.hideDialogHeaderActionItems ||
      this.hideDialogHeaderHistory ||
      this.hideDialogHeaderSettings ||
      this.hideDialogHeaderOverflow
    ) {
      const styles = [
        this.hideDialogHeaderActionItems || this.hideDialogHeaderHistory ? STYLES.DIALOG_HEADER_HISTORY : '',
        this.hideDialogHeaderActionItems || this.hideDialogHeaderSettings ? STYLES.DIALOG_HEADER_SETTINGS : '',
        this.hideDialogHeaderActionItems || this.hideDialogHeaderOverflow ? STYLES.DIALOG_HEADER_OVERFLOW : ''
      ];
      addStyle(styles.join(''), dialog);
      if (queryString(OPTION.CACHE)) {
        if (this.hideDialogHeaderActionItems) setCache(CACHE.DIALOG_HEADER_ACTION_ITEMS, TRUE);
        if (this.hideDialogHeaderHistory) setCache(CACHE.DIALOG_HEADER_HISTORY, TRUE);
        if (this.hideDialogHeaderSettings) setCache(CACHE.DIALOG_HEADER_SETTINGS, TRUE);
        if (this.hideDialogHeaderOverflow) setCache(CACHE.DIALOG_HEADER_OVERFLOW, TRUE);
      }
    } else {
      removeStyle(dialog);
    }

  }

  // INSERT MORE INFO DIALOG CHILDREN STYLES
  protected async insertDialogChildStyles(moreInfo: ShadowRoot) {

    const legacyClimateInfoDialog = Boolean(
      this.version &&
      (
        this.version[0] < 2023 ||
        (
          this.version[0] === 2023 &&
          this.version[1] < 9
        )
      )
    );

    if (
      this.hideDialogHistory ||
      this.hideDialogLogbook ||
      this.hideDialogClimateActions
    ) {
      const styles = [
          this.hideDialogHistory ? STYLES.DIALOG_HISTORY : '',
          this.hideDialogLogbook ? STYLES.DIALOG_LOGBOOK : '',
          this.hideDialogClimateActions && legacyClimateInfoDialog
            ? STYLES.DIALOG_CLIMATE_ACTIONS
            : ''            
      ];
      addStyle(styles.join(''), moreInfo);
      if (queryString(OPTION.CACHE)) {
        if (this.hideDialogHistory) setCache(CACHE.DIALOG_HISTORY, TRUE);
        if (this.hideDialogLogbook) setCache(CACHE.DIALOG_LOGBOOK, TRUE);
        if (this.hideDialogClimateActions) setCache(CACHE.DIALOG_CLIMATE_ACTIONS, TRUE);
      }
    } else {
      removeStyle(moreInfo);
    }

    if (!legacyClimateInfoDialog) {

      getPromisableElement(
        (): ShadowRoot => moreInfo.querySelector(ELEMENT.HA_DIALOG_CLIMATE)?.shadowRoot,
        (haDialogClimate: ShadowRoot) => !!haDialogClimate,
        ''
      )
        .then((haDialogClimate: ShadowRoot) => {

          if (this.hideDialogClimateActions) {
            addStyle(STYLES.DIALOG_CLIMATE_CONTROL_SELECT, haDialogClimate);
          } else {
            removeStyle(haDialogClimate);
          }

          getPromisableElement(
            (): ShadowRoot => haDialogClimate.querySelector(ELEMENT.HA_DIALOG_CLIMATE_TEMPERATURE)?.shadowRoot,
            (haDialogClimateTemperature: ShadowRoot) => !!haDialogClimateTemperature,
            ''
          )
            .then((haDialogClimateTemperature: ShadowRoot) => {

              if (this.hideDialogClimateActions) {
                addStyle(STYLES.DIALOG_CLIMATE_TEMPERATURE_BUTTONS, haDialogClimateTemperature);
              } else {
                removeStyle(haDialogClimateTemperature);
              }

              getPromisableElement(
                (): ShadowRoot => haDialogClimateTemperature.querySelector(ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER)?.shadowRoot,
                (haDialogClimateCircularSlider: ShadowRoot) => !!haDialogClimateCircularSlider,
                ''
              )
                .then((haDialogClimateCircularSlider: ShadowRoot) => {
                  
                  if (this.hideDialogClimateActions) {
                    addStyle(STYLES.DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION, haDialogClimateCircularSlider);
                  } else {
                    removeStyle(haDialogClimateCircularSlider);
                  }

                })
                .catch((e) => { /* ignore if it doesn‘t exist */ });

            })
            .catch((e) => { /* ignore if it doesn‘t exist */ });

        })
        .catch((e) => { /* ignore if it doesn‘t exist */ });
    }

    getPromisableElement(
      (): ShadowRoot => moreInfo.querySelector(ELEMENT.HA_DIALOG_HISTORY)?.shadowRoot,
      (dialogHistory: ShadowRoot) => !!dialogHistory,
      ''
    )
      .then((dialogHistory: ShadowRoot) => {
        if (this.hideDialogHistoryShowMore) {
          addStyle(STYLES.DIALOG_SHOW_MORE, dialogHistory);
          if (queryString(OPTION.CACHE)) setCache(CACHE.DIALOG_HISTORY_SHOW_MORE, TRUE);
        } else {
          removeStyle(dialogHistory);
        }
      })
      .catch((e) => { /* ignore if it doesn‘t exist */ });

    getPromisableElement(
      (): ShadowRoot => moreInfo.querySelector(ELEMENT.HA_DIALOG_LOGBOOK)?.shadowRoot,
      (dialogLogbook: ShadowRoot) => !!dialogLogbook,
      ''
    )
      .then((dialogLogbook: ShadowRoot) => {
        if (this.hideDialogLogbookShowMore) {
          addStyle(STYLES.DIALOG_SHOW_MORE, dialogLogbook);
          if (queryString(OPTION.CACHE)) setCache(CACHE.DIALOG_LOGBOOK_SHOW_MORE, TRUE);
        } else {
          removeStyle(dialogLogbook);
        }
      })
      .catch(() => { /* ignore if it doesn‘t exist */ });

    getPromisableElement(
      (): ShadowRoot => moreInfo.querySelector(
        [
          `${ELEMENT.HA_DIALOG_MORE_INFO_CONTENT} > ${ELEMENT.HA_DIALOG_DEFAULT}`,
          `${ELEMENT.HA_DIALOG_MORE_INFO_CONTENT} > ${ELEMENT.HA_DIALOG_VACUUM}`,
          `${ELEMENT.HA_DIALOG_MORE_INFO_CONTENT} > ${ELEMENT.HA_DIALOG_TIMER}`,
          `${ELEMENT.HA_DIALOG_MORE_INFO_CONTENT} > ${ELEMENT.HA_DIALOG_LIGHT}`,
          `${ELEMENT.HA_DIALOG_MORE_INFO_CONTENT} > ${ELEMENT.HA_DIALOG_MEDIA_PLAYER}`
        ].join(',')
      )?.shadowRoot,
      (dialogChild: ShadowRoot) => !!dialogChild,
      ''
    )
      .then((dialogChild: ShadowRoot) => {
        if (
          this.hideDialogAttributes ||
          this.hideDialogTimerActions ||
          this.hideDialogMediaActions
        ) {
          const styles = [
            this.hideDialogAttributes ? STYLES.DIALOG_ATTRIBUTES : '',
            this.hideDialogTimerActions ? STYLES.DIALOG_TIMER_ACTIONS : '',
            this.hideDialogMediaActions ? STYLES.DIALOG_MEDIA_ACTIONS : '',
          ];
          addStyle(styles.join(''), dialogChild);
          if (queryString(OPTION.CACHE)) {
            if (this.hideDialogAttributes) setCache(CACHE.DIALOG_ATTRIBUTES, TRUE);
            if (this.hideDialogTimerActions) setCache(CACHE.DIALOG_TIMER_ACTIONS, TRUE);
            if (this.hideDialogMediaActions) setCache(CACHE.DIALOG_MEDIA_ACTIONS, TRUE);
          }
        } else {
          removeStyle(dialogChild);
        }
      })
      .catch(() => { /* ignore if it doesn‘t exist */ });

      getPromisableElement(
        (): ShadowRoot => moreInfo.querySelector(`${ELEMENT.HA_DIALOG_MORE_INFO_CONTENT} > ${ELEMENT.HA_DIALOG_UPDATE}`)?.shadowRoot,
        (dialogChild: ShadowRoot) => !!dialogChild,
        ''
      )
        .then((dialogChild: ShadowRoot) => {
          if (this.hideDialogUpdateActions) {
            addStyle(STYLES.DIALOG_UPDATE_ACTIONS, dialogChild);
            if (queryString(OPTION.CACHE)) setCache(CACHE.DIALOG_UPDATE_ACTIONS, TRUE);
          } else {
            removeStyle(dialogChild);
          }
        })
        .catch(() => { /* ignore if it doesn‘t exist */ });

  }

  // Resize event
  protected resizeWindow() {
    window.clearTimeout(this.resizeDelay);
    this.resizeDelay = window.setTimeout(() => {
      this.updateMenuItemsLabels();
    }, WINDOW_RESIZE_DELAY);
  }

  // Run on dashboard change
  protected watchDashboards(mutations: MutationRecord[]) {
    mutations.forEach(({ addedNodes }): void => {
      addedNodes.forEach((node: Element): void => {
        if (node.localName === ELEMENT.HA_PANEL_LOVELACE) {
          window.KioskMode.run(node as Lovelace);
        }
      });
    });
  }

  // Run on more info dialogs change
  protected watchMoreInfoDialogs(mutations: MutationRecord[]) {
    mutations.forEach(({ addedNodes }): void => {
      addedNodes.forEach((node: Element): void => {
        if (node.localName === ELEMENT.HA_MORE_INFO_DIALOG) {
          window.KioskMode
            .runDialogs(node)
            .catch((error: Error) => console.warn(`${NON_CRITICAL_WARNING} ${error?.message}`));
        }
      });
    });
  }

  // Run on more info dialogs content change
  protected watchMoreInfoDialogsContent(mutations: MutationRecord[]) {
    mutations.forEach(({ addedNodes }): void => {
      addedNodes.forEach((node: Element): void => {
        if (
          node.localName === ELEMENT.HA_DIALOG_MORE_INFO ||
          node.localName === ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK
        ) {
          window.KioskMode
            .runDialogsChildren(node)
            .catch((error: Error) => console.warn(`${NON_CRITICAL_WARNING} ${error?.message}`));
        }
      });
    });
  }

  // Run on button menu change
  protected updateMenuItemsLabels() {

    if (!this.menuTranslations) return;    

    getPromisableElement(
      (): NodeListOf<HTMLElement> => this.appToolbar.querySelectorAll<HTMLElement>(`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.MENU_ITEM}`),
      (elements: NodeListOf<HTMLElement>): boolean => !!elements,
      `:scope > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.MENU_ITEM}`
    )
      .then((menuItems: NodeListOf<HTMLElement>) => {
        addMenuItemsDataSelectors(menuItems, this.menuTranslations);
      })
      .catch((message) => { console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} ${message}`) });

    if (this.user.is_admin) {

      getPromisableElement(
        (): NodeListOf<HTMLElement> => this.appToolbar.querySelectorAll(ELEMENT.OVERLAY_MENU_ITEM),
        (elements: NodeListOf<HTMLElement>) => !!(elements && elements.length),
        `${ELEMENT.TOOLBAR} > ${ELEMENT.OVERLAY_MENU_ITEM}`
      )
        .then((overflowMenuItems: NodeListOf<HTMLElement>) => {
          overflowMenuItems.forEach((overflowMenuItem: HTMLElement): void => {
            if (
              overflowMenuItem &&
              overflowMenuItem.dataset &&
              !overflowMenuItem.dataset.selector
            ) {
              const textContent = overflowMenuItem.textContent.trim();
              overflowMenuItem.dataset.selector = this.menuTranslations[textContent];
            }
          });
        })
        .catch((message) => { console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} ${message}`) });
    }
    
  }

  // Run on entity change
  protected async entityWatch() {
    (await window.hassConnection).conn.subscribeMessage((e) => this.entityWatchCallback(e), {
      type: SUSCRIBE_EVENTS_TYPE,
      event_type: STATE_CHANGED_EVENT,
    });
  }

  protected async entityWatchCallback(event: SuscriberEvent) {
    const entities = window.kioskModeEntities[this.ha.hass.panelUrl] || [];
    if (
      entities.length &&
      event.event_type === STATE_CHANGED_EVENT &&
      entities.includes(event.data.entity_id) &&
      (!event.data.old_state || event.data.new_state.state !== event.data.old_state.state)
    ) {
      await this.run();
      this
        .runDialogs()
        .catch(() => { /* ignore if it doesn‘t exist */ });
    }
  }

  protected blockToggleMenuGesture(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  protected setOptions(config: ConditionalKioskConfig, conditional: boolean) {

    if (OPTION.HIDE_HEADER in config)                     this.hideHeader                  = config[OPTION.HIDE_HEADER];
    if (OPTION.HIDE_SIDEBAR in config)                    this.hideSidebar                 = config[OPTION.HIDE_SIDEBAR];
    if (OPTION.HIDE_OVERFLOW in config)                   this.hideOverflow                = config[OPTION.HIDE_OVERFLOW];
    if (OPTION.HIDE_MENU_BUTTON in config)                this.hideMenuButton              = config[OPTION.HIDE_MENU_BUTTON];
    if (OPTION.HIDE_ACCOUNT in config)                    this.hideAccount                 = config[OPTION.HIDE_ACCOUNT];
    if (OPTION.HIDE_NOTIFICATIONS in config)              this.hideNotifications           = config[OPTION.HIDE_NOTIFICATIONS];
    if (OPTION.HIDE_SEARCH in config)                     this.hideSearch                  = config[OPTION.HIDE_SEARCH];
    if (OPTION.HIDE_ASSISTANT in config)                  this.hideAssistant               = config[OPTION.HIDE_ASSISTANT];
    if (OPTION.HIDE_REFRESH in config)                    this.hideRefresh                 = config[OPTION.HIDE_REFRESH];
    if (OPTION.HIDE_UNUSED_ENTITIES in config)            this.hideUnusedEntities          = config[OPTION.HIDE_UNUSED_ENTITIES];
    if (OPTION.HIDE_RELOAD_RESOURCES in config)           this.hideReloadResources         = config[OPTION.HIDE_RELOAD_RESOURCES];
    if (OPTION.HIDE_EDIT_DASHBOARD in config)             this.hideEditDashboard           = config[OPTION.HIDE_EDIT_DASHBOARD];
    if (OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS in config) this.hideDialogHeaderActionItems = config[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS];         
    if (OPTION.HIDE_DIALOG_HEADER_HISTORY in config)      this.hideDialogHeaderHistory     = config[OPTION.HIDE_DIALOG_HEADER_HISTORY];
    if (OPTION.HIDE_DIALOG_HEADER_SETTINGS in config)     this.hideDialogHeaderSettings    = config[OPTION.HIDE_DIALOG_HEADER_SETTINGS];
    if (OPTION.HIDE_DIALOG_HEADER_OVERFLOW in config)     this.hideDialogHeaderOverflow    = config[OPTION.HIDE_DIALOG_HEADER_OVERFLOW];
    if (OPTION.HIDE_DIALOG_HISTORY in config)             this.hideDialogHistory           = config[OPTION.HIDE_DIALOG_HISTORY];
    if (OPTION.HIDE_DIALOG_LOGBOOK in config)             this.hideDialogLogbook           = config[OPTION.HIDE_DIALOG_LOGBOOK];
    if (OPTION.HIDE_DIALOG_ATTRIBUTES in config)          this.hideDialogAttributes        = config[OPTION.HIDE_DIALOG_ATTRIBUTES];
    if (OPTION.HIDE_DIALOG_MEDIA_ACTIONS in config)       this.hideDialogMediaActions      = config[OPTION.HIDE_DIALOG_MEDIA_ACTIONS];
    if (OPTION.HIDE_DIALOG_UPDATE_ACTIONS in config)      this.hideDialogUpdateActions     = config[OPTION.HIDE_DIALOG_UPDATE_ACTIONS];
    if (OPTION.HIDE_DIALOG_CLIMATE_ACTIONS in config)     this.hideDialogClimateActions    = config[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS];
    if (OPTION.HIDE_DIALOG_TIMER_ACTIONS in config)       this.hideDialogTimerActions      = config[OPTION.HIDE_DIALOG_TIMER_ACTIONS];
    if (OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE in config)   this.hideDialogHistoryShowMore   = config[OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE];
    if (OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE in config)   this.hideDialogLogbookShowMore   = config[OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE];
    if (OPTION.BLOCK_OVERFLOW in config)                  this.blockOverflow               = config[OPTION.BLOCK_OVERFLOW];
    if (OPTION.BLOCK_MOUSE in config)                     this.blockMouse                  = config[OPTION.BLOCK_MOUSE];
    if (OPTION.KIOSK in config)                           this.hideHeader                  = this.hideSidebar = config[OPTION.KIOSK];

    if (conditional) {
      if (OPTION.IGNORE_ENTITY_SETTINGS in config)        this.ignoreEntity              = config[OPTION.IGNORE_ENTITY_SETTINGS];
      if (OPTION.IGNORE_MOBILE_SETTINGS in config)        this.ignoreMobile              = config[OPTION.IGNORE_MOBILE_SETTINGS];
      if (OPTION.IGNORE_DISABLE_KM in config)             this.ignoreDisableKm           = config[OPTION.IGNORE_DISABLE_KM];
    }
    
  }

}

// Console tag
const info = new ConInfo();
info.log();

// Initial Run
Promise.resolve(customElements.whenDefined(ELEMENT.HUI_VIEW))
  .then(() => {
    window.KioskMode = new KioskMode();
  });
