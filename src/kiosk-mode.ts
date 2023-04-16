import {
  KioskModeRunner,
  HomeAssistant,
  User,
  Lovelace,
  KioskConfig,
  ConditionalKioskConfig,
  SuscriberEvent
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
  LOVELACE_MODE,
  MAX_ATTEMPTS,
  RETRY_DELAY,
  WINDOW_RESIZE_DELAY,
  NAMESPACE
} from '@constants';
import {
  isLegacyVersion,
  toArray,
  queryString,
  setCache,
  cached,
  addStyle,
  removeStyle,
  getMenuTranslations,
  getMenuItems
} from '@utilities';
import { getStyles } from '@styles';

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
        CACHE.SEARCH,
        CACHE.ASSISTANT,
        CACHE.REFRESH,
        CACHE.UNUSED_ENTITIES,
        CACHE.RELOAD_RESOURCES,
        CACHE.EDIT_DASHBOARD,
        CACHE.MOUSE
      ], FALSE);
    }
    this.ha = document.querySelector<HomeAssistant>(ELEMENT.HOME_ASSISTANT);
    this.language = this.ha.hass.language;
    this.menuTranslations = getMenuTranslations(this.ha.hass.resources[this.language]);
    this.main = this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN).shadowRoot;
    this.user = this.ha.hass.user;
    this.isLegacy = isLegacyVersion(this.ha.hass?.config?.version);
    this.llAttempts = 0;
    this.resizeWindowBinded = this.resizeWindow.bind(this);
    this.run();
    this.entityWatch();
    
    new MutationObserver(this.watchDashboards).observe(this.main.querySelector(ELEMENT.PARTIAL_PANEL_RESOLVER), {
      childList: true,
    });
  }

  // Elements
  private ha: HomeAssistant;
  private main: ShadowRoot;
  private isLegacy: boolean;
  private user: User;
  private huiRoot: ShadowRoot;
  private lovelace: Lovelace;
  private drawerLayout: HTMLElement;
  private appToolbar: HTMLElement;
  private sideBarRoot: ShadowRoot;
  private overlayMenu: HTMLElement;
  private mode: string;
  private language: string;
  private menuTranslations: Record<string, string>;
  private llAttempts: number;
  private resizeDelay: number;
  private resizeWindowBinded: () => void;

  // Kiosk Mode options
  private hideHeader: boolean;
  private hideSidebar: boolean;
  private hideOverflow: boolean;
  private hideMenuButton: boolean;
  private hideAccount: boolean;
  private hideSearch: boolean;
  private hideAssistant: boolean;
  private hideRefresh: boolean;
  private hideUnusedEntities: boolean;
  private hideReloadResources: boolean;
  private hideEditDashboard: boolean;
  private blockMouse: boolean;
  private ignoreEntity: boolean;
  private ignoreMobile: boolean;

  public run(lovelace = this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE)) {
    if (queryString(OPTION.DISABLE_KIOSK_MODE) || !lovelace) {
      return;
    }
    this.lovelace = lovelace;
    this.getConfig();
  }

  protected getConfig() {
    this.llAttempts++;
    try {
      const llConfig = this.lovelace.lovelace.config;
      const config = llConfig.kiosk_mode || {};
      this.processConfig(config);
    } catch (e) {
      if (this.llAttempts < MAX_ATTEMPTS) {
        setTimeout(() => this.getConfig(), RETRY_DELAY);
      } else {
        console.log('Lovelace config not found, continuing with default configuration.');
        console.log(e);
        this.processConfig({});
      }
    }
  }

  protected processConfig(config: KioskConfig) {
    const dash = this.ha.hass.panelUrl;
    if (!window.kioskModeEntities[dash]) {
      window.kioskModeEntities[dash] = [];
    }
    this.hideHeader          = false;
    this.hideSidebar         = false;
    this.hideOverflow        = false;
    this.hideMenuButton      = false;
    this.hideAccount         = false;
    this.hideSearch          = false;
    this.hideAssistant       = false;
    this.hideRefresh         = false;
    this.hideUnusedEntities  = false;
    this.hideReloadResources = false;
    this.hideEditDashboard   = false;
    this.blockMouse          = false;
    this.ignoreEntity        = false;
    this.ignoreMobile        = false;

    this.mode = this.lovelace.lovelace.mode;
    this.huiRoot = this.lovelace.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;

    if (this.isLegacy) {
      // Legacy Home Assistant
      this.drawerLayout = this.main.querySelector<HTMLElement>(ELEMENT.APP_DRAWER_LAYOUT);
      this.appToolbar = this.huiRoot.querySelector<HTMLElement>(ELEMENT.APP_TOOLBAR);
      const appDrawer = this.drawerLayout.querySelector(ELEMENT.APP_DRAWER);
      this.sideBarRoot = appDrawer.querySelector(ELEMENT.HA_SIDEBAR).shadowRoot;
      this.overlayMenu = this.appToolbar.querySelector<HTMLElement>(`:scope > ${ELEMENT.OVERLAY_MENU}`);
    } else {
      // Home Assistant >= 2023.4.x
      this.drawerLayout = this.main.querySelector<HTMLElement>(ELEMENT.HA_DRAWER);
      this.appToolbar = this.huiRoot.querySelector<HTMLElement>(ELEMENT.TOOLBAR);
      this.sideBarRoot = this.drawerLayout.querySelector(ELEMENT.HA_SIDEBAR).shadowRoot;
      this.overlayMenu = this.appToolbar.querySelector<HTMLElement>(`:scope > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.OVERLAY_MENU}`);
    }

    // Retrieve localStorage values & query string options.
    const queryStringsSet = (
      cached([
        CACHE.HEADER,
        CACHE.SIDEBAR,
        CACHE.OVERFLOW,
        CACHE.MENU_BUTTON,
        CACHE.ACCOUNT,
        CACHE.SEARCH,
        CACHE.ASSISTANT,
        CACHE.REFRESH,
        CACHE.UNUSED_ENTITIES,
        CACHE.RELOAD_RESOURCES,
        CACHE.EDIT_DASHBOARD,
        CACHE.MOUSE
      ]) ||
      queryString([
        OPTION.KIOSK,
        OPTION.HIDE_HEADER,
        OPTION.HIDE_SIDEBAR,
        OPTION.HIDE_OVERFLOW,
        OPTION.HIDE_MENU_BUTTON,
        OPTION.HIDE_ACCOUNT,
        OPTION.HIDE_SEARCH,
        OPTION.HIDE_ASSISTANT,
        OPTION.HIDE_REFRESH,
        OPTION.HIDE_RELOAD_RESOURCES,
        OPTION.HIDE_UNUSED_ENTITIES,
        OPTION.HIDE_EDIT_DASHBOARD,
        OPTION.BLOCK_MOUSE
      ])
    );
    if (queryStringsSet) {
      this.hideHeader          = cached(CACHE.HEADER)           || queryString([OPTION.KIOSK, OPTION.HIDE_HEADER]);
      this.hideSidebar         = cached(CACHE.SIDEBAR)          || queryString([OPTION.KIOSK, OPTION.HIDE_SIDEBAR]);
      this.hideOverflow        = cached(CACHE.OVERFLOW)         || queryString([OPTION.KIOSK, OPTION.HIDE_OVERFLOW]);
      this.hideMenuButton      = cached(CACHE.MENU_BUTTON)      || queryString([OPTION.KIOSK, OPTION.HIDE_MENU_BUTTON]);
      this.hideAccount         = cached(CACHE.ACCOUNT)          || queryString([OPTION.KIOSK, OPTION.HIDE_ACCOUNT]);
      this.hideSearch          = cached(CACHE.SEARCH)           || queryString([OPTION.KIOSK, OPTION.HIDE_SEARCH]);
      this.hideAssistant       = cached(CACHE.ASSISTANT)        || queryString([OPTION.KIOSK, OPTION.HIDE_ASSISTANT]);
      this.hideRefresh         = cached(CACHE.REFRESH)          || queryString([OPTION.KIOSK, OPTION.HIDE_REFRESH]);
      this.hideUnusedEntities  = cached(CACHE.UNUSED_ENTITIES)  || queryString([OPTION.KIOSK, OPTION.HIDE_UNUSED_ENTITIES]);
      this.hideReloadResources = cached(CACHE.RELOAD_RESOURCES) || queryString([OPTION.KIOSK, OPTION.HIDE_RELOAD_RESOURCES]);
      this.hideEditDashboard   = cached(CACHE.EDIT_DASHBOARD)   || queryString([OPTION.KIOSK, OPTION.HIDE_EDIT_DASHBOARD]);
      this.blockMouse          = cached(CACHE.MOUSE)            || queryString([OPTION.BLOCK_MOUSE]);
    }

    // Use config values only if config strings and cache aren't used.
    this.hideHeader = queryStringsSet
      ? this.hideHeader
      : config.kiosk || config.hide_header;
    this.hideSidebar = queryStringsSet
      ? this.hideSidebar
      : config.kiosk || config.hide_sidebar;
    this.hideOverflow = queryStringsSet
      ? this.hideOverflow
      : config.kiosk || config.hide_overflow;
    this.hideMenuButton = queryStringsSet
      ? this.hideMenuButton
      : config.kiosk || config.hide_menubutton;
    this.hideAccount = queryStringsSet
      ? this.hideAccount
      : config.kiosk || config.hide_account;
    this.hideSearch = queryStringsSet
      ? this.hideSearch
      : config.kiosk || config.hide_search;
    this.hideAssistant = queryStringsSet
      ? this.hideAssistant
      : config.kiosk || config.hide_assistant;
    this.hideRefresh = queryStringsSet
      ? this.hideRefresh
      : config.kiosk || config.hide_refresh;
    this.hideUnusedEntities = queryStringsSet
      ? this.hideUnusedEntities
      : config.kiosk || config.hide_unused_entities;
    this.hideReloadResources = queryStringsSet
      ? this.hideReloadResources
      : config.kiosk || config.hide_reload_resources;
    this.hideEditDashboard = queryStringsSet
      ? this.hideEditDashboard
      : config.kiosk || config.hide_edit_dashboard;
    this.blockMouse = queryStringsSet
      ? this.blockMouse
      : config.block_mouse;

    // Admin non-admin config
    const adminConfig = this.user.is_admin
      ? config.admin_settings
      : config.non_admin_settings;

    if (adminConfig) {
      this.setOptions(adminConfig);
    }

    // User settings config
    if (config.user_settings) {
      toArray(config.user_settings).forEach((conf) => {
        if (toArray(conf.users).some((x) => x.toLowerCase() === this.user.name.toLowerCase())) {
          this.setOptions(conf);
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
        this.setOptions(mobileConfig);
      }
    }

    // Entity config
    const entityConfig = this.ignoreEntity
      ? null
      : config.entity_settings;

    if (entityConfig) {
      for (let conf of entityConfig) {
        const entity = Object.keys(conf.entity)[0];
        if (!window.kioskModeEntities[dash].includes(entity)) window.kioskModeEntities[dash].push(entity);
        if (this.ha.hass.states[entity].state == conf.entity[entity]) {
          if (OPTION.HIDE_HEADER in conf)           this.hideHeader          = conf[OPTION.HIDE_HEADER];
          if (OPTION.HIDE_SIDEBAR in conf)          this.hideSidebar         = conf[OPTION.HIDE_SIDEBAR];
          if (OPTION.HIDE_OVERFLOW in conf)         this.hideOverflow        = conf[OPTION.HIDE_OVERFLOW];
          if (OPTION.HIDE_MENU_BUTTON in conf)      this.hideMenuButton      = conf[OPTION.HIDE_MENU_BUTTON];
          if (OPTION.HIDE_ACCOUNT in conf)          this.hideAccount         = conf[OPTION.HIDE_ACCOUNT];
          if (OPTION.HIDE_SEARCH in conf)           this.hideSearch          = conf[OPTION.HIDE_SEARCH];
          if (OPTION.HIDE_ASSISTANT in conf)        this.hideAssistant       = conf[OPTION.HIDE_ASSISTANT];
          if (OPTION.HIDE_REFRESH in conf)          this.hideRefresh         = conf[OPTION.HIDE_REFRESH];
          if (OPTION.HIDE_UNUSED_ENTITIES in conf)  this.hideUnusedEntities  = conf[OPTION.HIDE_UNUSED_ENTITIES];
          if (OPTION.HIDE_RELOAD_RESOURCES in conf) this.hideReloadResources = conf[OPTION.HIDE_RELOAD_RESOURCES];
          if (OPTION.HIDE_EDIT_DASHBOARD in conf)   this.hideEditDashboard   = conf[OPTION.HIDE_EDIT_DASHBOARD];
          if (OPTION.BLOCK_MOUSE in conf)           this.blockMouse          = conf[OPTION.BLOCK_MOUSE];
          if (OPTION.KIOSK in conf)                 this.hideHeader          = this.hideSidebar = conf[OPTION.KIOSK];
        }
      }
    }

    this.insertStyles();
  }

  protected insertStyles() {  
    
    const STYLES = getStyles(this.isLegacy);
  
    if (this.hideHeader) {
      addStyle(STYLES.HEADER, this.huiRoot);
      if (queryString(OPTION.CACHE)) setCache(CACHE.HEADER, TRUE);
    } else {
      removeStyle(this.huiRoot);
    }

    if (this.hideSidebar) {
      addStyle(STYLES.SIDEBAR, this.drawerLayout);
      if (!this.isLegacy) {
        addStyle(STYLES.ASIDE, this.drawerLayout.shadowRoot);
      }
      if (queryString(OPTION.CACHE)) setCache(CACHE.SIDEBAR, TRUE);
    } else {
      removeStyle(this.drawerLayout);
      if (!this.isLegacy) {
        removeStyle(this.drawerLayout.shadowRoot);
      }
    }

    if (
      this.hideAccount ||
      this.hideMenuButton
    ) {
      const styles = [
          this.hideAccount ? STYLES.ACCOUNT : '',
          this.hideMenuButton ? STYLES.MENU_BUTTON : ''
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
          this.hideEditDashboard &&
          (
            this.mode === LOVELACE_MODE.STORAGE ||
            (
              this.mode === LOVELACE_MODE.YAML &&
              this.hideRefresh &&
              this.hideUnusedEntities &&
              this.hideReloadResources
            )
          )
            ? STYLES.OVERFLOW_MENU_EMPTY_DESKTOP
            : '',
          this.hideSearch &&
          this.hideAssistant &&
          this.hideEditDashboard &&
          (
            this.mode === LOVELACE_MODE.STORAGE ||
            (
              this.mode === LOVELACE_MODE.YAML &&
              this.hideRefresh &&
              this.hideUnusedEntities &&
              this.hideReloadResources
            )
          )
            ? STYLES.OVERFLOW_MENU_EMPTY_MOBILE
            : '',
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

    this.llAttempts = 0;
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

  // Run on button menu change
  protected updateMenuItemsLabels() {

    const getToolbarMenuItems = (): NodeListOf<HTMLElement> => {
      return this.isLegacy
        ? this.appToolbar.querySelectorAll<HTMLElement>(`:scope > ${ELEMENT.MENU_ITEM}`)
        : this.appToolbar.querySelectorAll<HTMLElement>(`:scope > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.MENU_ITEM}`);
    };

    const getOverflowMenuItems = (): NodeListOf<HTMLElement> => this.appToolbar.querySelectorAll(ELEMENT.OVERLAY_MENU_ITEM);

    getMenuItems(getToolbarMenuItems)
      .then((menuItems: NodeListOf<HTMLElement>) => {
        menuItems.forEach((menuItem: HTMLElement): void => {
          if (
            menuItem &&
            menuItem.dataset &&
            !menuItem.dataset.selector
          ) {
            const icon = menuItem.shadowRoot.querySelector<HTMLElement>(ELEMENT.MENU_ITEM_ICON);
            menuItem.dataset.selector = this.menuTranslations[icon.title];
          }
        });
      })
      .catch(() => {
        console.error(`${NAMESPACE} Cannot select app toolbar menu items`);
      });

    getMenuItems(getOverflowMenuItems)
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
    
        if (
          this.overlayMenu &&
          this.overlayMenu.dataset
        ) {
          this.overlayMenu.dataset.children = `${overflowMenuItems.length}`;
    
          if (!this.overlayMenu.dataset.lovelaceMode) {
            this.overlayMenu.dataset.lovelaceMode = this.mode;
          }
        } 
      })
      .catch(() => {
        console.error(`${NAMESPACE} Cannot select overflow menu items`);
      });
    
  }

  // Run on entity change
  protected async entityWatch() {
    (await window.hassConnection).conn.subscribeMessage((e) => this.entityWatchCallback(e), {
      type: SUSCRIBE_EVENTS_TYPE,
      event_type: STATE_CHANGED_EVENT,
    });
  }

  protected entityWatchCallback(event: SuscriberEvent) {
    const entities = window.kioskModeEntities[this.ha.hass.panelUrl] || [];
    if (
      entities.length &&
      event.event_type === STATE_CHANGED_EVENT &&
      entities.includes(event.data.entity_id) &&
      (!event.data.old_state || event.data.new_state.state !== event.data.old_state.state)
    ) {
      this.run();
    }
  }

  protected setOptions(config: ConditionalKioskConfig) {
    this.hideHeader          = config.kiosk || config.hide_header;
    this.hideSidebar         = config.kiosk || config.hide_sidebar;
    this.hideOverflow        = config.kiosk || config.hide_overflow;
    this.hideMenuButton      = config.kiosk || config.hide_menubutton;
    this.hideAccount         = config.kiosk || config.hide_account;
    this.hideSearch          = config.kiosk || config.hide_search;
    this.hideAssistant       = config.kiosk || config.hide_assistant;
    this.hideRefresh         = config.kiosk || config.hide_refresh;
    this.hideUnusedEntities  = config.kiosk || config.hide_unused_entities;
    this.hideReloadResources = config.kiosk || config.hide_reload_resources;
    this.hideEditDashboard   = config.kiosk || config.hide_edit_dashboard;
    this.blockMouse          = config.block_mouse;
    this.ignoreEntity        = config.ignore_entity_settings;
    this.ignoreMobile        = config.ignore_mobile_settings;
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
