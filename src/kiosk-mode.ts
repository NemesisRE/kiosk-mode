import { STYLES_PREFIX, CACHE, OPTION } from '@constants';

class KioskMode {
  constructor() {
    window.kioskModeEntities = {};
    if (this.queryString(OPTION.CLEAR_CACHE)) {
      this.setCache([
        CACHE.HEADER,
        CACHE.SIDEBAR,
        CACHE.OVERFLOW,
        CACHE.MENU_BUTTON,
        CACHE.ACCOUNT,
        CACHE.SEARCH,
        CACHE.ASSISTANT
      ], "false");
    }
    this.ha = document.querySelector("home-assistant");
    this.main = this.ha.shadowRoot.querySelector("home-assistant-main").shadowRoot;
    this.user = this.ha.hass.user;
    this.llAttempts = 0;
    this.run();
    this.entityWatch();
    new MutationObserver(this.watchDashboards).observe(this.main.querySelector("partial-panel-resolver"), {
      childList: true,
    });
  }

  run(lovelace = this.main.querySelector("ha-panel-lovelace")) {
    if (this.queryString(OPTION.DISABLE_KIOSK_MODE) || !lovelace) return;
    this.getConfig(lovelace);
  }

  getConfig(lovelace) {
    this.llAttempts++;
    try {
      const llConfig = lovelace.lovelace.config;
      const config = llConfig.kiosk_mode || {};
      this.processConfig(lovelace, config);
    } catch (e) {
      if (this.llAttempts < 200) {
        setTimeout(() => this.getConfig(lovelace), 50);
      } else {
        console.log("Lovelace config not found, continuing with default configuration.");
        console.log(e);
        this.processConfig(lovelace, {});
      }
    }
  }

  processConfig(lovelace, config) {
    const dash = this.ha.hass.panelUrl;
    if (!window.kioskModeEntities[dash]) window.kioskModeEntities[dash] = [];
    this.hideHeader = this.hideSidebar = this.hideOverflow = this.hideAccount = this.hideSearch = this.hideAssistant = this.ignoreEntity = this.ignoreMobile = false;

    // Retrieve localStorage values & query string options.
    const queryStringsSet = (
      this.cached([
        CACHE.HEADER,
        CACHE.SIDEBAR,
        CACHE.OVERFLOW,
        CACHE.MENU_BUTTON,
        CACHE.ACCOUNT,
        CACHE.SEARCH,
        CACHE.ASSISTANT
      ]) ||
      this.queryString([
        OPTION.KIOSK,
        OPTION.HIDE_HEADER,
        OPTION.HIDE_SIDEBAR,
        OPTION.HIDE_OVERFLOW,
        OPTION.HIDE_MENU_BUTTON,
        OPTION.HIDE_ACCOUNT,
        OPTION.HIDE_SEARCH,
        OPTION.HIDE_ASSISTANT
      ])
    );
    if (queryStringsSet) {
      this.hideHeader     = this.cached(CACHE.HEADER)      || this.queryString([OPTION.KIOSK, OPTION.HIDE_HEADER]);
      this.hideSidebar    = this.cached(CACHE.SIDEBAR)     || this.queryString([OPTION.KIOSK, OPTION.HIDE_SIDEBAR]);
      this.hideOverflow   = this.cached(CACHE.OVERFLOW)    || this.queryString([OPTION.KIOSK, OPTION.HIDE_OVERFLOW]);
      this.hideMenuButton = this.cached(CACHE.MENU_BUTTON) || this.queryString([OPTION.KIOSK, OPTION.HIDE_MENU_BUTTON]);
      this.hideAccount    = this.cached(CACHE.ACCOUNT)     || this.queryString([OPTION.KIOSK, OPTION.HIDE_ACCOUNT]);
      this.hideSearch     = this.cached(CACHE.SEARCH)      || this.queryString([OPTION.KIOSK, OPTION.HIDE_SEARCH]);
      this.hideAssistant  = this.cached(CACHE.ASSISTANT)   || this.queryString([OPTION.KIOSK, OPTION.HIDE_ASSISTANT]);
    }

    // Use config values only if config strings and cache aren't used.
    this.hideHeader = queryStringsSet ? this.hideHeader : config.kiosk || config.hide_header;
    this.hideSidebar = queryStringsSet ? this.hideSidebar : config.kiosk || config.hide_sidebar;
    this.hideOverflow = queryStringsSet ? this.hideOverflow : config.kiosk || config.hide_overflow;
    this.hideMenuButton = queryStringsSet ? this.hideMenuButton : config.kiosk || config.hide_menubutton;
    this.hideAccount = queryStringsSet ? this.hideAccount : config.kiosk || config.hide_account;
    this.hideSearch = queryStringsSet ? this.hideSearch : config.kiosk || config.hide_search;
    this.hideAssistant = queryStringsSet ? this.hideAssistant : config.kiosk || config.hide_assistant;

    const adminConfig = this.user.is_admin ? config.admin_settings : config.non_admin_settings;
    if (adminConfig) this.setOptions(adminConfig);

    if (config.user_settings) {
      for (let conf of this.array(config.user_settings)) {
        if (this.array(conf.users).some((x) => x.toLowerCase() == this.user.name.toLowerCase())) this.setOptions(conf);
      }
    }

    const mobileConfig = this.ignoreMobile ? null : config.mobile_settings;
    if (mobileConfig) {
      const mobileWidth = mobileConfig.custom_width ? mobileConfig.custom_width : 812;
      if (window.innerWidth <= mobileWidth) this.setOptions(mobileConfig);
    }

    const entityConfig = this.ignoreEntity ? null : config.entity_settings;
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
          if (OPTION.KIOSK in conf)            this.hideHeader     = this.hideSidebar      = conf.kiosk;
        }
      }
    }

    this.insertStyles(lovelace);
  }

  insertStyles(lovelace) {
    const huiRoot = lovelace.shadowRoot.querySelector("hui-root").shadowRoot;
    const drawerLayout = this.main.querySelector("app-drawer-layout");
    const appToolbar = huiRoot.querySelector("app-toolbar");
    const overflowStyle = "app-toolbar > ha-button-menu{display:none !important;}";
    const sideBarRoot = drawerLayout.querySelector("app-drawer").querySelector("ha-sidebar").shadowRoot;
    const menuButtonStyle = "ha-menu-button{display:none !important;}";
    const searchStyle = "app-toolbar > ha-icon-button:first-of-type{display:none !important;}";
    const assistantStyle = "app-toolbar > ha-icon-button:nth-of-type(2){display:none !important;}";
    const headerStyle = "#view{min-height:100vh !important;--header-height:0;}app-header{display:none;}";
  
    if (this.hideHeader || this.hideOverflow) {
      const styles = [
          this.hideHeader ? headerStyle : "",
          this.hideOverflow ? overflowStyle : ""
      ];
      this.addStyle(styles.join(""), huiRoot);
      if (this.queryString(OPTION.CACHE)) {
        if (this.hideHeader) this.setCache(CACHE.HEADER, "true");
        if (this.hideOverflow) this.setCache(CACHE.OVERFLOW, "true");
      }
    } else {
      this.removeStyle(huiRoot);
    }

    if (this.hideSidebar) {
      this.addStyle(":host{--app-drawer-width:0 !important;}#drawer{display:none;}", drawerLayout);
      if (this.queryString(OPTION.CACHE)) this.setCache(CACHE.SIDEBAR, "true");
    } else {
      this.removeStyle(drawerLayout);
    }

    if (
      this.hideAccount ||
      this.hideMenuButton
    ) {
      const styles = [
          this.hideAccount ? ".profile{display:none !important;}" : "",
          this.hideMenuButton ? ".menu ha-icon-button{display:none !important;}" : ""
      ];
      this.addStyle(styles.join(""), sideBarRoot);
      if (this.hideAccount && this.queryString(OPTION.CACHE)) this.setCache(CACHE.ACCOUNT, "true");
    } else {
      this.removeStyle(sideBarRoot);
    }

    if (
      this.hideSearch ||
      this.hideAssistant ||
      this.hideMenuButton ||
      this.hideSidebar
    ) {
      const styles = [
          this.hideSearch ? searchStyle : "",
          this.hideAssistant ? assistantStyle : "",
          this.hideMenuButton ||  this.hideSidebar ? menuButtonStyle : ""
      ];
      this.addStyle(styles.join(""), appToolbar);
      if (this.queryString(OPTION.CACHE)) {
          if (this.hideSearch) this.setCache(CACHE.SEARCH, "true");
          if (this.hideAssistant) this.setCache(CACHE.ASSISTANT, "true");
          if (this.hideMenuButton) this.setCache(CACHE.MENU_BUTTON, "true");
      }
    } else {
      this.removeStyle(appToolbar);
    }

    // Resize window to "refresh" view.
    window.dispatchEvent(new Event("resize"));

    this.llAttempts = 0;
  }

  // Run on dashboard change.
  watchDashboards(mutations) {
    mutations.forEach(({ addedNodes }) => {
      for (let node of addedNodes) if (node.localName == "ha-panel-lovelace") window.KioskMode.run(node);
    });
  }

  // Run on entity change.
  async entityWatch() {
    (await window.hassConnection).conn.subscribeMessage((e) => this.entityWatchCallback(e), {
      type: "subscribe_events",
      event_type: "state_changed",
    });
  }

  entityWatchCallback(event) {
    const entities = window.kioskModeEntities[this.ha.hass.panelUrl] || [];
    if (
      entities.length &&
      event.event_type == "state_changed" &&
      entities.includes(event.data.entity_id) &&
      (!event.data.old_state || event.data.new_state.state != event.data.old_state.state)
    ) {
      this.run();
    }
  }

  setOptions(config) {
    this.hideHeader = config.kiosk || config.hide_header;
    this.hideSidebar = config.kiosk || config.hide_sidebar;
    this.hideOverflow = config.kiosk || config.hide_overflow;
    this.hideMenuButton = config.kiosk || config.hide_menubutton;
    this.hideAccount = config.kiosk || config.hide_account;
    this.hideSearch = config.kiosk || config.hide_search;
    this.hideAssistant = config.kiosk || config.hide_assistant;
    this.ignoreEntity = config.ignore_entity_settings;
    this.ignoreMobile = config.ignore_mobile_settings;
  }

  // Convert to array.
  array(x) {
    return Array.isArray(x) ? x : [x];
  }

  // Return true if keyword is found in query strings.
  queryString(keywords) {
    return this.array(keywords).some((x) => window.location.search.includes(x));
  }

  // Set localStorage item.
  setCache(k, v) {
    this.array(k).forEach((x) => window.localStorage.setItem(x, v));
  }

  // Retrieve localStorage item as bool.
  cached(key) {
    return this.array(key).some((x) => window.localStorage.getItem(x) == "true");
  }

  styleExists(elem) {
    return elem.querySelector(`#${STYLES_PREFIX}_${elem.localName}`);
  }

  addStyle(css, elem) {
    let style = this.styleExists(elem);
    if (!style) {
      style = document.createElement("style");
      style.setAttribute("id", `${STYLES_PREFIX}_${elem.localName}`);
      elem.appendChild(style);
    }
    style.innerHTML = css;
  }

  removeStyle(elements) {
    this.array(elements).forEach((elem) => {
      if (this.styleExists(elem)) elem.querySelector(`#${STYLES_PREFIX}_${elem.localName}`).remove();
    });
  }
}

// Overly complicated console tag.
const conInfo = { header: "%c≡ kiosk-mode".padEnd(27), ver: "%cversion *DEV " };
const br = "%c\n";
const maxLen = Math.max(...Object.values(conInfo).map((el) => el.length));
for (const [key] of Object.entries(conInfo)) {
  if (conInfo[key].length <= maxLen) conInfo[key] = conInfo[key].padEnd(maxLen);
  if (key == "header") conInfo[key] = `${conInfo[key].slice(0, -1)}⋮ `;
}
const header =
  "display:inline-block;border-width:1px 1px 0 1px;border-style:solid;border-color:#424242;color:white;background:#03a9f4;font-size:12px;padding:4px 4.5px 5px 6px;";
const info = "border-width:0px 1px 1px 1px;padding:7px;background:white;color:#424242;line-height:0.7;";
console.info(conInfo.header + br + conInfo.ver, header, "", `${header} ${info}`);

// Initial Run
Promise.resolve(customElements.whenDefined("hui-view")).then(() => {
  window.KioskMode = new KioskMode();
});
