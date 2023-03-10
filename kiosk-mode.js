class KioskMode {
  constructor() {
    window.kioskModeEntities = {};
    if (this.queryString("clear_km_cache")) this.setCache(["kmHeader", "kmSidebar", "kmOverflow", "kmMenuButton", "kmAccount", "kmSearch"], "false");
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
    if (this.queryString("disable_km") || !lovelace) return;
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
    this.hideHeader = this.hideSidebar = this.hideOverflow = this.hideAccount = this.hideSearch = this.ignoreEntity = this.ignoreMobile = false;

    // Retrieve localStorage values & query string options.
    const queryStringsSet =
      this.cached(["kmHeader", "kmSidebar", "kmOverflow", "kmMenuButton", "kmAccount", "kmSearch"]) || this.queryString(["kiosk", "hide_sidebar", "hide_header", "hide_overflow", "hide_menubutton", "hide_account", "hide_search"]);
    if (queryStringsSet) {
      this.hideHeader = this.cached("kmHeader") || this.queryString(["kiosk", "hide_header"]);
      this.hideSidebar = this.cached("kmSidebar") || this.queryString(["kiosk", "hide_sidebar"]);
      this.hideOverflow = this.cached("kmOverflow") || this.queryString(["kiosk", "hide_overflow"]);
      this.hideMenuButton = this.cached("kmMenuButton") || this.queryString(["kiosk", "hide_menubutton"]);
      this.hideAccount = this.cached("kmAccount") || this.queryString(["kiosk", "hide_account"]);
      this.hideSearch = this.cached("kmSearch") || this.queryString(["kiosk", "hide_search"]);
    }

    // Use config values only if config strings and cache aren't used.
    this.hideHeader = queryStringsSet ? this.hideHeader : config.kiosk || config.hide_header;
    this.hideSidebar = queryStringsSet ? this.hideSidebar : config.kiosk || config.hide_sidebar;
    this.hideOverflow = queryStringsSet ? this.hideOverflow : config.kiosk || config.hide_overflow;
    this.hideMenuButton = queryStringsSet ? this.hideMenuButton : config.kiosk || config.hide_menubutton;
    this.hideAccount = queryStringsSet ? this.hideAccount : config.kiosk || config.hide_account;
    this.hideSearch = queryStringsSet ? this.hideSearch : config.kiosk || config.hide_search;

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
          if ("hide_header" in conf) this.hideHeader = conf.hide_header;
          if ("hide_sidebar" in conf) this.hideSidebar = conf.hide_sidebar;
          if ("hide_overflow" in conf) this.hideOverflow = conf.hide_overflow;
          if ("hide_account" in conf) this.hideAccount = conf.hide_account;
          if ("hide_search" in conf) this.hideSearch = conf.hide_search;
          if ("hide_menubutton" in conf) this.hideMenuButton = conf.hide_menubutton;
          if ("kiosk" in conf) this.hideHeader = this.hideSidebar = conf.kiosk;
        }
      }
    }

    this.insertStyles(lovelace);
  }

  insertStyles(lovelace) {
    const huiRoot = lovelace.shadowRoot.querySelector("hui-root").shadowRoot;
    const drawerLayout = this.main.querySelector("app-drawer-layout");
    const appToolbar = huiRoot.querySelector("app-toolbar");
    const overflowStyle = "ha-icon-button{display:none !important;}";
    const appDrawerRoot = drawerLayout.querySelector("app-drawer").querySelector("ha-sidebar").shadowRoot;
    const searchStyle = "ha-icon-button{display:none !important;}";
    const headerStyle = "#view{min-height:100vh !important;--header-height:0;}app-header{display:none;}";

    if (this.hideHeader || this.hideOverflow) {
      this.addStyle(`${this.hideHeader ? headerStyle : ""}${this.hideOverflow ? overflowStyle : ""}`, huiRoot);
      if (this.queryString("cache")) {
        if (this.hideHeader) this.setCache("kmHeader", "true");
        if (this.hideOverflow) this.setCache("kmOverflow", "true");
      }
    } else {
      this.removeStyle(huiRoot);
    }

    if (this.hideSidebar) {
      this.addStyle(":host{--app-drawer-width:0 !important;}#drawer{display:none;}", drawerLayout);
      this.addStyle("ha-menu-button{display:none !important;}", appToolbar);
      if (this.queryString("cache")) this.setCache("kmSidebar", "true");
    } else {
      this.removeStyle([appToolbar, drawerLayout]);
    }

    if (this.hideMenuButton) {
      this.addStyle("ha-menu-button{display:none !important;}", appToolbar);
      if (this.queryString("cache")) this.setCache("kmMenuButton", "true");
    } else {
      this.removeStyle(appToolbar);
    }

    if (this.hideAccount) {
      this.addStyle(".profile{display:none !important;}", appDrawerRoot);
      if (this.queryString("cache")) this.setCache("kmAccount", "true");
    } else {
      this.removeStyle(appDrawerRoot);
    }

    if (this.hideSidebar || this.hideSearch) {
      this.addStyle("ha-icon-button{display:none !important;}", appToolbar);
      if (this.queryString("cache")) this.setCache("kmSearch", "true");
      /* } else {
        this.removeStyle(huiRoot); */
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
    return elem.querySelector(`#kiosk_mode_${elem.localName}`);
  }

  addStyle(css, elem) {
    if (!this.styleExists(elem)) {
      const style = document.createElement("style");
      style.setAttribute("id", `kiosk_mode_${elem.localName}`);
      style.innerHTML = css;
      elem.appendChild(style);
    }
  }

  removeStyle(elements) {
    this.array(elements).forEach((elem) => {
      if (this.styleExists(elem)) elem.querySelector(`#kiosk_mode_${elem.localName}`).remove();
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
