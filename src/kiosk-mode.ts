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
  BOOLEAN,
  CUSTOM_MOBILE_WIDTH_DEFAULT,
  SUSCRIBE_EVENTS_TYPE,
  STATE_CHANGED_EVENT,
  LOVELACE_MODE,
  MAX_ATTEMPTS,
  WINDOW_RESIZE_DELAY,
  NAMESPACE
} from '@constants';
import {
  toArray,
  queryString,
  setCache,
  cached,
  addStyle,
  removeStyle,
  getLovelaceConfig,
  getMenuTranslations,
  getMenuItems
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
        CACHE.OVERFLOW_LIST,
        CACHE.MENU_BUTTON,
        CACHE.ACCOUNT,
        CACHE.SEARCH,
        CACHE.ASSISTANT,
        CACHE.REFRESH,
        CACHE.UNUSED_ENTITIES,
        CACHE.RELOAD_RESOURCES,
        CACHE.EDIT_DASHBOARD,
        CACHE.OVERFLOW_MOUSE,
        CACHE.MOUSE
      ], FALSE);
    }
    this.ha = document.querySelector<HomeAssistant>(ELEMENT.HOME_ASSISTANT);
    this.main = this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN).shadowRoot;
    this.user = this.ha.hass.user;
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
  private user: User;
  private huiRoot: ShadowRoot;
  private lovelace: Lovelace;
  private drawerLayout: HTMLElement;
  private appToolbar: HTMLElement;
  private sideBarRoot: ShadowRoot;
  private overlayMenu: HTMLElement;
  private overlayMenuRoot: ShadowRoot;
  private mode: string;
  private menuTranslations: Record<string, string>;
  private resizeDelay: number;
  private resizeWindowBinded: () => void;

  // Kiosk Mode options
  private hideHeader: boolean;
  private hideSidebar: boolean;
  private hideOverflow: boolean;
  private hideOverflowList: boolean;
  private hideMenuButton: boolean;
  private hideAccount: boolean;
  private hideSearch: boolean;
  private hideAssistant: boolean;
  private hideRefresh: boolean;
  private hideUnusedEntities: boolean;
  private hideReloadResources: boolean;
  private hideEditDashboard: boolean;
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
    getLovelaceConfig(this.lovelace)
      .then((config) => {
        this.processConfig(
          config.kiosk_mode || {}
        );
        // Get menu translations
        getMenuTranslations(this.ha)
          .then((menuTranslations: Record<string, string>) => {
            this.menuTranslations = menuTranslations;
            this.updateMenuItemsLabels();
          })
          .catch(() => {
            console.info(`${NAMESPACE} Cannot get resources translations`);
          });
      })
      .catch(() => {
        throw new Error(`Lovelace config not found. Giving up after ${ MAX_ATTEMPTS } attempts.`);
      });
  }

  protected processConfig(config: KioskConfig) {
    const dash = this.ha.hass.panelUrl;
    if (!window.kioskModeEntities[dash]) {
      window.kioskModeEntities[dash] = [];
    }
    this.hideHeader          = false;
    this.hideSidebar         = false;
    this.hideOverflow        = false;
    this.hideOverflowList    = false;
    this.hideMenuButton      = false;
    this.hideAccount         = false;
    this.hideSearch          = false;
    this.hideAssistant       = false;
    this.hideRefresh         = false;
    this.hideUnusedEntities  = false;
    this.hideReloadResources = false;
    this.hideEditDashboard   = false;
    this.blockOverflow       = false;
    this.blockMouse          = false;
    this.ignoreEntity        = false;
    this.ignoreMobile        = false;
    this.ignoreDisableKm     = false;

    this.mode = this.lovelace?.lovelace?.mode || LOVELACE_MODE.STORAGE;
    this.huiRoot = this.lovelace.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;

    this.drawerLayout = this.main.querySelector<HTMLElement>(ELEMENT.HA_DRAWER);
    this.appToolbar = this.huiRoot.querySelector<HTMLElement>(ELEMENT.TOOLBAR);
    this.sideBarRoot = this.drawerLayout.querySelector(ELEMENT.HA_SIDEBAR).shadowRoot;
    this.overlayMenu = this.appToolbar.querySelector<HTMLElement>(`:scope > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.OVERLAY_MENU}`);
    this.overlayMenuRoot = this.overlayMenu.shadowRoot;

    // Retrieve localStorage values & query string options.
    const queryStringsSet = (
      cached([
        CACHE.HEADER,
        CACHE.SIDEBAR,
        CACHE.OVERFLOW,
        CACHE.OVERFLOW_LIST,
        CACHE.MENU_BUTTON,
        CACHE.ACCOUNT,
        CACHE.SEARCH,
        CACHE.ASSISTANT,
        CACHE.REFRESH,
        CACHE.UNUSED_ENTITIES,
        CACHE.RELOAD_RESOURCES,
        CACHE.EDIT_DASHBOARD,
        CACHE.OVERFLOW_MOUSE,
        CACHE.MOUSE
      ]) ||
      queryString([
        OPTION.KIOSK,
        OPTION.HIDE_HEADER,
        OPTION.HIDE_SIDEBAR,
        OPTION.HIDE_OVERFLOW,
        OPTION.HIDE_OVERFLOW_LIST,
        OPTION.HIDE_MENU_BUTTON,
        OPTION.HIDE_ACCOUNT,
        OPTION.HIDE_SEARCH,
        OPTION.HIDE_ASSISTANT,
        OPTION.HIDE_REFRESH,
        OPTION.HIDE_RELOAD_RESOURCES,
        OPTION.HIDE_UNUSED_ENTITIES,
        OPTION.HIDE_EDIT_DASHBOARD,
        OPTION.BLOCK_OVERFLOW,
        OPTION.BLOCK_MOUSE
      ])
    );
    if (queryStringsSet) {
      this.hideHeader          = cached(CACHE.HEADER)           || queryString([OPTION.KIOSK, OPTION.HIDE_HEADER]);
      this.hideSidebar         = cached(CACHE.SIDEBAR)          || queryString([OPTION.KIOSK, OPTION.HIDE_SIDEBAR]);
      this.hideOverflow        = cached(CACHE.OVERFLOW)         || queryString([OPTION.KIOSK, OPTION.HIDE_OVERFLOW]);
      this.hideOverflowList    = cached(CACHE.OVERFLOW_LIST)    || queryString([OPTION.HIDE_OVERFLOW_LIST]);
      this.hideMenuButton      = cached(CACHE.MENU_BUTTON)      || queryString([OPTION.KIOSK, OPTION.HIDE_MENU_BUTTON]);
      this.hideAccount         = cached(CACHE.ACCOUNT)          || queryString([OPTION.KIOSK, OPTION.HIDE_ACCOUNT]);
      this.hideSearch          = cached(CACHE.SEARCH)           || queryString([OPTION.KIOSK, OPTION.HIDE_SEARCH]);
      this.hideAssistant       = cached(CACHE.ASSISTANT)        || queryString([OPTION.KIOSK, OPTION.HIDE_ASSISTANT]);
      this.hideRefresh         = cached(CACHE.REFRESH)          || queryString([OPTION.KIOSK, OPTION.HIDE_REFRESH]);
      this.hideUnusedEntities  = cached(CACHE.UNUSED_ENTITIES)  || queryString([OPTION.KIOSK, OPTION.HIDE_UNUSED_ENTITIES]);
      this.hideReloadResources = cached(CACHE.RELOAD_RESOURCES) || queryString([OPTION.KIOSK, OPTION.HIDE_RELOAD_RESOURCES]);
      this.hideEditDashboard   = cached(CACHE.EDIT_DASHBOARD)   || queryString([OPTION.KIOSK, OPTION.HIDE_EDIT_DASHBOARD]);
      this.blockOverflow       = cached(CACHE.OVERFLOW_MOUSE)   || queryString([OPTION.BLOCK_OVERFLOW]);
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
    this.hideOverflowList = queryStringsSet
      ? this.hideOverflowList
      : config.hide_overflow_list;
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
    this.blockOverflow = queryStringsSet
      ? this.blockOverflow
      : config.block_overflow;
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
          if (OPTION.HIDE_OVERFLOW_LIST in conf)    this.hideOverflowList    = conf[OPTION.HIDE_OVERFLOW_LIST];
          if (OPTION.HIDE_MENU_BUTTON in conf)      this.hideMenuButton      = conf[OPTION.HIDE_MENU_BUTTON];
          if (OPTION.HIDE_ACCOUNT in conf)          this.hideAccount         = conf[OPTION.HIDE_ACCOUNT];
          if (OPTION.HIDE_SEARCH in conf)           this.hideSearch          = conf[OPTION.HIDE_SEARCH];
          if (OPTION.HIDE_ASSISTANT in conf)        this.hideAssistant       = conf[OPTION.HIDE_ASSISTANT];
          if (OPTION.HIDE_REFRESH in conf)          this.hideRefresh         = conf[OPTION.HIDE_REFRESH];
          if (OPTION.HIDE_UNUSED_ENTITIES in conf)  this.hideUnusedEntities  = conf[OPTION.HIDE_UNUSED_ENTITIES];
          if (OPTION.HIDE_RELOAD_RESOURCES in conf) this.hideReloadResources = conf[OPTION.HIDE_RELOAD_RESOURCES];
          if (OPTION.HIDE_EDIT_DASHBOARD in conf)   this.hideEditDashboard   = conf[OPTION.HIDE_EDIT_DASHBOARD];
          if (OPTION.BLOCK_OVERFLOW in conf)        this.blockOverflow       = conf[OPTION.BLOCK_OVERFLOW];
          if (OPTION.BLOCK_MOUSE in conf)           this.blockMouse          = conf[OPTION.BLOCK_MOUSE];
          if (OPTION.KIOSK in conf)                 this.hideHeader          = this.hideSidebar = conf[OPTION.KIOSK];
        }
      }
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

  protected insertStyles() {
  
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

    if (this.hideOverflowList) {
      addStyle(STYLES.OVERFLOW_MENU_LIST, this.overlayMenuRoot);
      if (queryString(OPTION.CACHE)) setCache(CACHE.OVERFLOW_LIST, TRUE);
    } else {
      removeStyle(this.overlayMenuRoot);
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

    if (!this.menuTranslations) return;

    const getToolbarMenuItems = (): NodeListOf<HTMLElement> => {
      return this.appToolbar.querySelectorAll<HTMLElement>(`:scope > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.MENU_ITEM}`);
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
      .catch(() => { /* ignore */ });

    if (this.user.is_admin) {

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
      })
      .catch(() => { /* ignore */ });

    }
    
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
    this.hideOverflowList    = config.hide_overflow_list;
    this.hideMenuButton      = config.kiosk || config.hide_menubutton;
    this.hideAccount         = config.kiosk || config.hide_account;
    this.hideSearch          = config.kiosk || config.hide_search;
    this.hideAssistant       = config.kiosk || config.hide_assistant;
    this.hideRefresh         = config.kiosk || config.hide_refresh;
    this.hideUnusedEntities  = config.kiosk || config.hide_unused_entities;
    this.hideReloadResources = config.kiosk || config.hide_reload_resources;
    this.hideEditDashboard   = config.kiosk || config.hide_edit_dashboard;
    this.blockOverflow       = config.block_overflow;
    this.blockMouse          = config.block_mouse;
    this.ignoreEntity        = typeof config.ignore_entity_settings === BOOLEAN
      ? config.ignore_entity_settings
      : this.ignoreEntity;
    this.ignoreMobile        = typeof config.ignore_mobile_settings === BOOLEAN
      ? config.ignore_mobile_settings
      : this.ignoreMobile;
    this.ignoreDisableKm     = typeof config.ignore_disable_km === BOOLEAN
      ? config.ignore_disable_km
      : this.ignoreDisableKm;
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
