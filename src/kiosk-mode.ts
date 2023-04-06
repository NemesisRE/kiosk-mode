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
  STATE_CHANGED_EVENT
} from '@constants';
import {
  toArray,
  queryString,
  setCache,
  cached,
  addStyle,
  removeStyle
} from '@utilities';

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
        CACHE.MOUSE
      ], FALSE);
    }
    this.ha = document.querySelector<HomeAssistant>(ELEMENT.HOME_ASSISTANT);
    this.main = this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN).shadowRoot;
    this.user = this.ha.hass.user;
    this.llAttempts = 0;
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
  private llAttempts: number;

  // Kiosk Mode options
  private hideHeader: boolean;
  private hideSidebar: boolean;
  private hideOverflow: boolean;
  private hideMenuButton: boolean;
  private hideAccount: boolean;
  private hideSearch: boolean;
  private hideAssistant: boolean;
  private blockMouse: boolean;
  private ignoreEntity: boolean;
  private ignoreMobile: boolean;

  public run(lovelace = this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE)) {
    if (queryString(OPTION.DISABLE_KIOSK_MODE) || !lovelace) {
      return;
    }
    this.getConfig(lovelace);
  }

  protected getConfig(lovelace: Lovelace) {
    this.llAttempts++;
    try {
      const llConfig = lovelace.lovelace.config;
      const config = llConfig.kiosk_mode || {};
      this.processConfig(lovelace, config);
    } catch (e) {
      if (this.llAttempts < 200) {
        setTimeout(() => this.getConfig(lovelace), 50);
      } else {
        console.log('Lovelace config not found, continuing with default configuration.');
        console.log(e);
        this.processConfig(lovelace, {});
      }
    }
  }

  protected processConfig(lovelace: Lovelace, config: KioskConfig) {
    const dash = this.ha.hass.panelUrl;
    if (!window.kioskModeEntities[dash]) {
      window.kioskModeEntities[dash] = [];
    }
    this.hideHeader     = false;
    this.hideSidebar    = false;
    this.hideOverflow   = false;
    this.hideMenuButton = false;
    this.hideAccount    = false;
    this.hideSearch     = false;
    this.hideAssistant  = false;
    this.blockMouse     = false;
    this.ignoreEntity   = false;
    this.ignoreMobile   = false;

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
        OPTION.BLOCK_MOUSE
      ])
    );
    if (queryStringsSet) {
      this.hideHeader     = cached(CACHE.HEADER)      || queryString([OPTION.KIOSK, OPTION.HIDE_HEADER]);
      this.hideSidebar    = cached(CACHE.SIDEBAR)     || queryString([OPTION.KIOSK, OPTION.HIDE_SIDEBAR]);
      this.hideOverflow   = cached(CACHE.OVERFLOW)    || queryString([OPTION.KIOSK, OPTION.HIDE_OVERFLOW]);
      this.hideMenuButton = cached(CACHE.MENU_BUTTON) || queryString([OPTION.KIOSK, OPTION.HIDE_MENU_BUTTON]);
      this.hideAccount    = cached(CACHE.ACCOUNT)     || queryString([OPTION.KIOSK, OPTION.HIDE_ACCOUNT]);
      this.hideSearch     = cached(CACHE.SEARCH)      || queryString([OPTION.KIOSK, OPTION.HIDE_SEARCH]);
      this.hideAssistant  = cached(CACHE.ASSISTANT)   || queryString([OPTION.KIOSK, OPTION.HIDE_ASSISTANT]);
      this.blockMouse     = cached(CACHE.MOUSE)       || queryString([OPTION.BLOCK_MOUSE]);
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
          if (OPTION.HIDE_HEADER in conf)      this.hideHeader     = conf.hide_header;
          if (OPTION.HIDE_SIDEBAR in conf)     this.hideSidebar    = conf.hide_sidebar;
          if (OPTION.HIDE_OVERFLOW in conf)    this.hideOverflow   = conf.hide_overflow;
          if (OPTION.HIDE_MENU_BUTTON in conf) this.hideMenuButton = conf.hide_menubutton;
          if (OPTION.HIDE_ACCOUNT in conf)     this.hideAccount    = conf.hide_account;
          if (OPTION.HIDE_SEARCH in conf)      this.hideSearch     = conf.hide_search;
          if (OPTION.HIDE_ASSISTANT in conf)   this.hideAssistant  = conf.hide_assistant;
          if (OPTION.BLOCK_MOUSE in conf)      this.blockMouse     = conf.block_mouse;
          if (OPTION.KIOSK in conf)            this.hideHeader     = this.hideSidebar = conf.kiosk;
        }
      }
    }

    this.insertStyles(lovelace);
  }

  protected insertStyles(lovelace: Lovelace) {
    const huiRoot = lovelace.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;
    const drawerLayout = this.main.querySelector<HTMLElement>(ELEMENT.APP_DRAWER_LAYOUT);
    const appToolbar = huiRoot.querySelector<HTMLElement>(ELEMENT.APP_TOOLBAR);
    const sideBarRoot = drawerLayout.querySelector(ELEMENT.APP_DRAWER).querySelector(ELEMENT.HA_SIDEBAR).shadowRoot;

    const mouseStyle = 'body::after{content:"";display:block;position:fixed;top:0;right:0;bottom:0;left:0;cursor:none;z-index:999999}';
    const overflowStyle = 'app-toolbar > ha-button-menu{display:none !important;}';
    const menuButtonStyle = 'ha-menu-button{display:none !important;}';
    const searchStyle = 'app-toolbar > ha-icon-button:first-of-type{display:none !important;}';
    const assistantStyle = 'app-toolbar > ha-icon-button:nth-of-type(2){display:none !important;}';
    const headerStyle = '#view{min-height:100vh !important;--header-height:0;}app-header{display:none;}';
  
    if (this.hideHeader || this.hideOverflow) {
      const styles = [
          this.hideHeader ? headerStyle : '',
          this.hideOverflow ? overflowStyle : ''
      ];
      addStyle(styles.join(''), huiRoot);
      if (queryString(OPTION.CACHE)) {
        if (this.hideHeader) setCache(CACHE.HEADER, TRUE);
        if (this.hideOverflow) setCache(CACHE.OVERFLOW, TRUE);
      }
    } else {
      removeStyle(huiRoot);
    }

    if (this.hideSidebar) {
      addStyle(':host{--app-drawer-width:0 !important;}#drawer{display:none;}', drawerLayout);
      if (queryString(OPTION.CACHE)) setCache(CACHE.SIDEBAR, TRUE);
    } else {
      removeStyle(drawerLayout);
    }

    if (
      this.hideAccount ||
      this.hideMenuButton
    ) {
      const styles = [
          this.hideAccount ? '.profile{display:none !important;}' : '',
          this.hideMenuButton ? '.menu ha-icon-button{display:none !important;}' : ''
      ];
      addStyle(styles.join(''), sideBarRoot);
      if (this.hideAccount && queryString(OPTION.CACHE)) setCache(CACHE.ACCOUNT, TRUE);
    } else {
      removeStyle(sideBarRoot);
    }

    if (
      this.hideSearch ||
      this.hideAssistant ||
      this.hideMenuButton ||
      this.hideSidebar
    ) {
      const styles = [
          this.hideSearch ? searchStyle : '',
          this.hideAssistant ? assistantStyle : '',
          this.hideMenuButton ||  this.hideSidebar ? menuButtonStyle : ''
      ];
      addStyle(styles.join(''), appToolbar);
      if (queryString(OPTION.CACHE)) {
          if (this.hideSearch) setCache(CACHE.SEARCH, TRUE);
          if (this.hideAssistant) setCache(CACHE.ASSISTANT, TRUE);
          if (this.hideMenuButton) setCache(CACHE.MENU_BUTTON, TRUE);
      }
    } else {
      removeStyle(appToolbar);
    }

    if (this.blockMouse) {
      addStyle(mouseStyle, document.body);
      if (queryString(OPTION.CACHE)) setCache(CACHE.MOUSE, TRUE);
    } else {
      removeStyle(document.body);
    }

    // Resize window to 'refresh' view.
    window.dispatchEvent(new Event('resize'));

    this.llAttempts = 0;
  }

  // Run on dashboard change.
  protected watchDashboards(mutations: MutationRecord[]) {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node: Element) => {
        if (node.localName === ELEMENT.HA_PANEL_LOVELACE) {
          window.KioskMode.run(node as Lovelace);
        }
      });
    });
  }

  // Run on entity change.
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
    this.hideHeader     = config.kiosk || config.hide_header;
    this.hideSidebar    = config.kiosk || config.hide_sidebar;
    this.hideOverflow   = config.kiosk || config.hide_overflow;
    this.hideMenuButton = config.kiosk || config.hide_menubutton;
    this.hideAccount    = config.kiosk || config.hide_account;
    this.hideSearch     = config.kiosk || config.hide_search;
    this.hideAssistant  = config.kiosk || config.hide_assistant;
    this.blockMouse     = config.block_mouse;
    this.ignoreEntity   = config.ignore_entity_settings;
    this.ignoreMobile   = config.ignore_mobile_settings;
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
