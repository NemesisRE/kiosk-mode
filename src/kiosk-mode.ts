import {
	HAQuerySelector,
	HAQuerySelectorEvent,
	OnLovelacePanelLoadDetail,
	OnMoreInfoDialogOpenDetail,
	OnHistoryAndLogBookDialogOpenDetail
} from 'home-assistant-query-selector';
import { HomeAssistantStylesManager } from 'home-assistant-styles-manager';
import { getPromisableResult } from 'get-promisable-result';
import HomeAssistantJavaScriptTemplates, {
	HomeAssistantJavaScriptTemplatesRenderer,
	HassConnection
} from 'home-assistant-javascript-templates';
import {
	KioskModeRunner,
	HomeAsssistantExtended,
	ButtonItemTooltip,
	Lovelace,
	KioskConfig,
	HaSidebar,
	Options,
	SubscriberTemplate,
	MoreInfoDialog,
	Version
} from '@types';
import {
	OPTION,
	CONDITIONAL_OPTION,
	DEBUG_CONFIG_OPTION,
	SPECIAL_QUERY_PARAMS,
	ELEMENT,
	TRUE,
	CUSTOM_MOBILE_WIDTH_DEFAULT,
	TOGGLE_MENU_EVENT,
	MC_DRAWER_CLOSED_EVENT,
	CONTEXT_MENU_EVENT,
	RESIZE_EVENT,
	RENDER_TEMPLATE_EVENT,
	JS_TEMPLATE_REG,
	JINJA_TEMPLATE_REG,
	WINDOW_RESIZE_DELAY,
	STYLES_PREFIX,
	NAMESPACE,
	NON_CRITICAL_WARNING,
	MAX_ATTEMPTS,
	RETRY_DELAY
} from '@constants';
import {
	queryString,
	setCache,
	cached,
	getMenuTranslations,
	addMenuItemsDataSelectors,
	addDialogsMenuItemsDataSelectors,
	parseVersion,
	resetCache
} from '@utilities';
import { STYLES } from '@styles';

import { ConsoleMessenger } from './console-messenger';

class KioskMode implements KioskModeRunner {
	constructor() {

		if (queryString(SPECIAL_QUERY_PARAMS.CLEAR_CACHE)) {
			resetCache();
		}

		this.panelOptions = new Map<string, Options>();

		this.styleManager = new HomeAssistantStylesManager({
			prefix: STYLES_PREFIX,
			throwWarnings: false
		});

		const selector = new HAQuerySelector();

		selector.addEventListener(HAQuerySelectorEvent.ON_LOVELACE_PANEL_LOAD, async (event) => {

			this.HAElements = event.detail;

			const {
				HOME_ASSISTANT,
				HOME_ASSISTANT_MAIN,
				HUI_ROOT,
				HA_DRAWER,
				HEADER,
				HA_SIDEBAR
			} = this.HAElements;

			this.ha = await HOME_ASSISTANT.element as HomeAsssistantExtended;
			this.main = await HOME_ASSISTANT_MAIN.selector.$.element;
			this.huiRoot = await HUI_ROOT.selector.$.element;
			this.drawerLayout = await HA_DRAWER.element as HaSidebar;
			this.appToolbar = await HEADER.selector.query(ELEMENT.TOOLBAR).element;
			this.sideBarRoot = await HA_SIDEBAR.selector.$.element;

			this.user = await getPromisableResult(
				(): HomeAsssistantExtended['hass']['user'] => this.ha?.hass?.user,
				(user: HomeAsssistantExtended['hass']['user']) => !!user,
				{
					retries: MAX_ATTEMPTS,
					delay: RETRY_DELAY,
					rejectMessage: `${NAMESPACE}: Cannot select ${ELEMENT.HOME_ASSISTANT} > hass > user after {{ retries }} attempts. Giving up!`
				}
			);

			this._renderer = await new HomeAssistantJavaScriptTemplates(this.ha).getRenderer();

			this.version = parseVersion(this.ha.hass?.config?.version);

			this.run();

		});

		selector.addEventListener(HAQuerySelectorEvent.ON_MORE_INFO_DIALOG_OPEN, (event) => {
			this.HAMoreInfoDialogElements = event.detail;
			this.insertMoreInfoDialogStyles();
		});

		selector.addEventListener(HAQuerySelectorEvent.ON_HISTORY_AND_LOGBOOK_DIALOG_OPEN, (event) => {
			this.HAMoreInfoDialogElements = event.detail;
			this.insertMoreInfoDialogStyles();
		});

		selector.listen();
		this.resizeWindowBinded = this.resizeWindow.bind(this);

	}

	// Elements
	private HAElements: OnLovelacePanelLoadDetail;
	private HAMoreInfoDialogElements: OnMoreInfoDialogOpenDetail | OnHistoryAndLogBookDialogOpenDetail;
	private styleManager: HomeAssistantStylesManager;
	private ha: HomeAsssistantExtended;
	private main: ShadowRoot;
	private user: HomeAsssistantExtended['hass']['user'];
	private huiRoot: ShadowRoot;
	private drawerLayout: HaSidebar;
	private appToolbar: Element;
	private sideBarRoot: ShadowRoot;
	private menuTranslations: Record<string, string>;
	private resizeDelay: number;
	private resizeWindowBinded: () => void;
	private _renderer: HomeAssistantJavaScriptTemplatesRenderer;
	private _runTimeout: number;
	private version: Version | null;

	// Kiosk Mode options
	private panelOptions: Map<string, Options>;

	private _getPanelUrl(): string {
		return this.ha.hass.panelUrl;
	}

	private _hasStoredOptions(): boolean {
		const panelUrl = this._getPanelUrl();
		return this.panelOptions.has(panelUrl);
	}

	private _getOptions(): Options {
		const panelUrl = this._getPanelUrl();
		return this.panelOptions.get(panelUrl);
	}

	private _storeOptions(options: Options): void {
		const panelUrl = this._getPanelUrl();
		this.panelOptions.set(panelUrl, options);
	}

	private _isDebug(debug: unknown): boolean {
		return typeof debug === 'boolean' && debug;
	}

	private _isKioskModeDisabled(options: Options): boolean {
		if (
			!options ||
			(
				queryString(SPECIAL_QUERY_PARAMS.DISABLE_KIOSK_MODE) &&
				!options[CONDITIONAL_OPTION.IGNORE_DISABLE_KM]
			)
		) {
			return true;
		}
		return false;
	}

	private runThrottle() {
		window.clearTimeout(this._runTimeout);
		this._runTimeout = window.setTimeout(() => {
			this.run();
			this.runDialogs();
		}, RETRY_DELAY);
	}

	public async run() {

		const lovelace = this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE);

		if (!lovelace) {
			return;
		}

		if (this._hasStoredOptions()) {
			// Insert styles
			this.insertStyles();
		} else {
			// Get the configuration from the lovalace panel and process it
			return getPromisableResult(
				() => lovelace?.lovelace?.config,
				(config: Lovelace['lovelace']['config']) => !!config,
				{
					retries: MAX_ATTEMPTS,
					delay: RETRY_DELAY,
					rejectMessage: `${NAMESPACE}: Cannot select Lovelace config after {{ retries }} attempts. Giving up!`
				}
			)
				.then((config: Lovelace['lovelace']['config']) => {
					return this.processConfig(
						config.kiosk_mode || {}
					);
				});
		}
	}

	public runDialogs() {
		const dialog = this.ha?.shadowRoot?.querySelector(ELEMENT.HA_MORE_INFO_DIALOG);
		const haDialog = dialog?.shadowRoot.querySelector<MoreInfoDialog>(ELEMENT.HA_DIALOG);
		if (
			!haDialog ||
			!haDialog.__open
		) {
			return;
		}
		this.insertMoreInfoDialogStyles();
	}

	protected async processConfig(config: KioskConfig) {

		if (this._isDebug(config.debug)) {
			ConsoleMessenger.debugRawConfig(config, this._getPanelUrl());
		}

		let mergedConfig: KioskConfig = {};
		const options: Options = {};

		// Set all the options to false
		Object.values(OPTION).forEach((option: OPTION) => {
			mergedConfig[option] = false;
			options[option] = false;
		});
		Object.values(CONDITIONAL_OPTION).forEach((option: CONDITIONAL_OPTION) => {
			mergedConfig[option] = false;
			options[option] = false;
		});
		Object.values(DEBUG_CONFIG_OPTION).forEach((option: DEBUG_CONFIG_OPTION) => {
			mergedConfig[option] = false;
			options[option] = false;
		});

		getMenuTranslations(this.ha)
			.then((menuTranslations: Record<string, string>) => {
				this.menuTranslations = menuTranslations;
				this.updateMenuItemsLabels();
			})
			.catch(() => {
				console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} Cannot get resources translations`);
			});

		// Retrieve localStorage values & query string options.
		if (
			cached(...Object.values(OPTION)) ||
			queryString(...Object.values(OPTION))
		) {
			Object.values(OPTION).forEach((option: OPTION): void => {
				mergedConfig[option] = cached(option) || queryString(option);
			});
		} else {
			// Use config values only if config strings and cache aren't used.
			mergedConfig = {
				...mergedConfig,
				...config
			};
		}

		// Admin non-admin config
		const adminConfig = this.user.is_admin
			? config.admin_settings
			: config.non_admin_settings;

		if (adminConfig) {
			mergedConfig = {
				...mergedConfig,
				...adminConfig
			};
		}

		// User settings config
		if (config.user_settings) {
			config.user_settings.forEach((userConfig) => {
				if (userConfig.users.some((user) => user.toLowerCase() === this.user.name.toLowerCase())) {
					mergedConfig = {
						...mergedConfig,
						...userConfig
					};
				}
			});
		}

		// Mobile config
		const mobileConfig = options[CONDITIONAL_OPTION.IGNORE_MOBILE_SETTINGS]
			? null
			: config.mobile_settings;

		if (mobileConfig) {
			const mobileWidth = mobileConfig.custom_width
				? mobileConfig.custom_width
				: CUSTOM_MOBILE_WIDTH_DEFAULT;
			if (window.innerWidth <= mobileWidth) {
				mergedConfig = {
					...mergedConfig,
					...mobileConfig
				};
			}
		}

		if (this._isDebug(mergedConfig.debug)) {
			ConsoleMessenger.debugFinalConfig(mergedConfig, this._getPanelUrl());
		}

		this.setOptions(options, mergedConfig);
		this._storeOptions(options);

		this.insertStyles();
	}

	// INSERT REGULAR STYLES
	protected insertStyles() {

		const options = this._getOptions();

		// Do not run kiosk-mode if it is disabled
		if (this._isKioskModeDisabled(options)) {
			return;
		}

		if (
			options[OPTION.KIOSK] ||
			options[OPTION.HIDE_HEADER]
		) {
			this.styleManager.addStyle(STYLES.HEADER, this.huiRoot);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.HIDE_HEADER);
		} else {
			this.styleManager.removeStyle(this.huiRoot);
		}

		// Remove toggle menu event
		this.main?.host?.removeEventListener(TOGGLE_MENU_EVENT, this.blockEventHandler, true);

		if (
			options[OPTION.KIOSK] ||
			options[OPTION.HIDE_SIDEBAR]
		) {

			const hideSidebarCommands = (): void => {
				this.main?.host?.addEventListener(TOGGLE_MENU_EVENT, this.blockEventHandler, true);
				this.styleManager.addStyle(STYLES.SIDEBAR, this.drawerLayout);
				this.styleManager.addStyle(STYLES.ASIDE, this.drawerLayout.shadowRoot);
				if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.HIDE_SIDEBAR);
				this.drawerLayout.removeEventListener(MC_DRAWER_CLOSED_EVENT, hideSidebarCommands);
			};

			// Workaround for Companion App, before hiding the sidebar it is needed to wait for the MC Drawer to close
			// Check the next issue: https://github.com/NemesisRE/kiosk-mode/issues/275
			if (
				this.drawerLayout.type === 'modal' &&
				this.drawerLayout.appContent?.inert
			) {
				this.drawerLayout.addEventListener(MC_DRAWER_CLOSED_EVENT, hideSidebarCommands);
			} else {
				hideSidebarCommands();
			}
		} else {
			this.styleManager.removeStyle(this.drawerLayout);
			this.styleManager.removeStyle(this.drawerLayout.shadowRoot);
		}

		if (
			options[OPTION.HIDE_ACCOUNT] ||
			options[OPTION.HIDE_NOTIFICATIONS] ||
			options[OPTION.HIDE_MENU_BUTTON]
		) {
			const styles = [
				options[OPTION.HIDE_ACCOUNT]
					&& STYLES.ACCOUNT,
				options[OPTION.HIDE_NOTIFICATIONS]
					&& STYLES.NOTIFICATIONS,
				options[OPTION.HIDE_ACCOUNT] && options[OPTION.HIDE_NOTIFICATIONS]
					&& STYLES.DIVIDER,
				(
					options[OPTION.HIDE_MENU_BUTTON] ||
					options[OPTION.HIDE_NOTIFICATIONS] ||
					options[OPTION.HIDE_ACCOUNT]
				)
					&& STYLES.SIDEBAR_ITEMS_CONTAINER(
						options[OPTION.HIDE_MENU_BUTTON],
						options[OPTION.HIDE_NOTIFICATIONS],
						options[OPTION.HIDE_ACCOUNT]
					),
				options[OPTION.HIDE_MENU_BUTTON]
					&& STYLES.MENU_BUTTON
			];
			this.styleManager.addStyle(styles, this.sideBarRoot);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (options[OPTION.HIDE_ACCOUNT])       setCache(TRUE, OPTION.HIDE_ACCOUNT);
				if (options[OPTION.HIDE_NOTIFICATIONS]) setCache(TRUE, OPTION.HIDE_NOTIFICATIONS);
			}
		} else {
			this.styleManager.removeStyle(this.sideBarRoot);
		}

		if (
			options[OPTION.HIDE_SEARCH] ||
			options[OPTION.HIDE_ASSISTANT] ||
			options[OPTION.HIDE_REFRESH] ||
			options[OPTION.HIDE_UNUSED_ENTITIES] ||
			options[OPTION.HIDE_RELOAD_RESOURCES] ||
			options[OPTION.HIDE_EDIT_DASHBOARD] ||
			options[OPTION.HIDE_OVERFLOW] ||
			options[OPTION.BLOCK_OVERFLOW] ||
			options[OPTION.HIDE_SIDEBAR] ||
			options[OPTION.HIDE_MENU_BUTTON]
		) {
			const styles = [
				options[OPTION.HIDE_SEARCH]
					&& STYLES.SEARCH,
				options[OPTION.HIDE_ASSISTANT]
					&& STYLES.ASSISTANT,
				options[OPTION.HIDE_REFRESH]
					&& STYLES.REFRESH,
				options[OPTION.HIDE_UNUSED_ENTITIES]
					&& STYLES.UNUSED_ENTITIES,
				options[OPTION.HIDE_RELOAD_RESOURCES]
					&& STYLES.RELOAD_RESOURCES,
				options[OPTION.HIDE_EDIT_DASHBOARD]
					&& STYLES.EDIT_DASHBOARD,
				options[OPTION.HIDE_OVERFLOW]
					&& STYLES.OVERFLOW_MENU,
				options[OPTION.BLOCK_OVERFLOW]
					&& STYLES.BLOCK_OVERFLOW,
				(options[OPTION.HIDE_MENU_BUTTON] || options[OPTION.HIDE_SIDEBAR])
					&& STYLES.MENU_BUTTON_BURGER
			];
			this.styleManager.addStyle(styles, this.appToolbar);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (options[OPTION.HIDE_SEARCH])           setCache(TRUE, OPTION.HIDE_SEARCH);
				if (options[OPTION.HIDE_ASSISTANT])        setCache(TRUE, OPTION.HIDE_ASSISTANT);
				if (options[OPTION.HIDE_REFRESH])          setCache(TRUE, OPTION.HIDE_REFRESH);
				if (options[OPTION.HIDE_UNUSED_ENTITIES])  setCache(TRUE, OPTION.HIDE_UNUSED_ENTITIES);
				if (options[OPTION.HIDE_RELOAD_RESOURCES]) setCache(TRUE, OPTION.HIDE_RELOAD_RESOURCES);
				if (options[OPTION.HIDE_EDIT_DASHBOARD])   setCache(TRUE, OPTION.HIDE_EDIT_DASHBOARD);
				if (options[OPTION.HIDE_OVERFLOW])         setCache(TRUE, OPTION.HIDE_OVERFLOW);
				if (options[OPTION.BLOCK_OVERFLOW])        setCache(TRUE, OPTION.BLOCK_OVERFLOW);
				if (options[OPTION.HIDE_MENU_BUTTON])      setCache(TRUE, OPTION.HIDE_MENU_BUTTON);
			}
		} else {
			this.styleManager.removeStyle(this.appToolbar);
		}

		if (options[OPTION.BLOCK_MOUSE]) {
			this.styleManager.addStyle(STYLES.MOUSE, document.body);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.BLOCK_MOUSE);
		} else {
			this.styleManager.removeStyle(document.body);
		}

		window.removeEventListener(CONTEXT_MENU_EVENT, this.blockEventHandler, true);

		if (options[OPTION.BLOCK_CONTEXT_MENU]) {
			window.addEventListener('contextmenu', this.blockEventHandler, true);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.BLOCK_CONTEXT_MENU);
		}

		// Resize event
		window.removeEventListener(RESIZE_EVENT, this.resizeWindowBinded);
		window.addEventListener(RESIZE_EVENT, this.resizeWindowBinded);

		// Resize window to 'refresh' view.
		window.dispatchEvent(new Event(RESIZE_EVENT));
	}

	// INSERT MORE INFO DIALOG STYLES
	protected async insertMoreInfoDialogStyles() {

		const options = this._getOptions();

		// Do not run kiosk-mode if it is disabled
		if (this._isKioskModeDisabled(options)) {
			return;
		}

		this.HAMoreInfoDialogElements.HA_DIALOG
			.selector.query(`${ELEMENT.HA_DIALOG_HEADER} > ${ELEMENT.MENU_ITEM}`)
			.all
			.then((menuItems: NodeListOf<HTMLElement>) => {
				addDialogsMenuItemsDataSelectors(menuItems, this.menuTranslations);
			});

		const dialog = await this.HAMoreInfoDialogElements.HA_DIALOG.element;
		const moreInfoDialogContent = this.HAMoreInfoDialogElements.HA_DIALOG_CONTENT;
		const MORE_INFO_CHILD_ROOT = moreInfoDialogContent
			.selector
			.query(`${ELEMENT.HA_DIALOG_MORE_INFO}, ${ELEMENT.HA_DIALOG_MORE_INFO_HISTORY_AND_LOGBOOK}`)
			.$;
		const moreInfo = await MORE_INFO_CHILD_ROOT.element;

		// General dialog elements
		if (
			options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] ||
			options[OPTION.HIDE_DIALOG_HEADER_HISTORY] ||
			options[OPTION.HIDE_DIALOG_HEADER_SETTINGS] ||
			options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW]
		) {
			const styles = [
				(options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || options[OPTION.HIDE_DIALOG_HEADER_HISTORY])
					&& STYLES.DIALOG_HEADER_HISTORY,
				(options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || options[OPTION.HIDE_DIALOG_HEADER_SETTINGS])
					&& STYLES.DIALOG_HEADER_SETTINGS,
				(options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW])
					&& STYLES.DIALOG_HEADER_OVERFLOW
			];
			this.styleManager.addStyle(styles, dialog);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS]) setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS);
				if (options[OPTION.HIDE_DIALOG_HEADER_HISTORY])      setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_HISTORY);
				if (options[OPTION.HIDE_DIALOG_HEADER_SETTINGS])     setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_SETTINGS);
				if (options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW])     setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_OVERFLOW);
			}
		} else {
			this.styleManager.removeStyle(dialog);
		}

		// Climate dialog
		const haDialogClimate = MORE_INFO_CHILD_ROOT
			.query(ELEMENT.HA_DIALOG_MORE_INFO_CONTENT)
			.$
			.query(ELEMENT.HA_DIALOG_CLIMATE)
			.$;

		const haDialogClimateTemperature = haDialogClimate
			.query(ELEMENT.HA_STATE_CONTROL_CLIMATE_TEMPERATURE)
			.$;

		const haDialogClimateCircularSlider = haDialogClimateTemperature
			.query(ELEMENT.HA_DIALOG_CLIMATE_CIRCULAR_SLIDER)
			.$;

		haDialogClimate.element.then((haDialogClimate: ShadowRoot): void => {
			if (
				options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
				options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS]
			) {
				this.styleManager.addStyle(STYLES.DIALOG_CLIMATE_CONTROL_SELECT, haDialogClimate);
				if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
					if (options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_CLIMATE_ACTIONS);
					if (options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS]) setCache(TRUE, OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS);
				}
			} else {
				this.styleManager.removeStyle(haDialogClimate);
			}
		});

		haDialogClimateTemperature.element.then((haDialogClimateTemperature: ShadowRoot): void => {
			if (
				options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
				options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]
			) {
				this.styleManager.addStyle(STYLES.DIALOG_CLIMATE_TEMPERATURE_BUTTONS, haDialogClimateTemperature);
				if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
					if (options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]) setCache(TRUE, OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS);
				}
			} else {
				this.styleManager.removeStyle(haDialogClimateTemperature);
			}
		});

		haDialogClimateCircularSlider.element.then((haDialogClimateCircularSlider: ShadowRoot) => {
			if (
				options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
				options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]
			) {
				this.styleManager.addStyle(STYLES.DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION, haDialogClimateCircularSlider);
			} else {
				this.styleManager.removeStyle(haDialogClimateCircularSlider);
			}
		});

		// Dialog children
		MORE_INFO_CHILD_ROOT
			.query(ELEMENT.HA_DIALOG_MORE_INFO_CONTENT)
			.$
			.query(
				[
					ELEMENT.HA_DIALOG_DEFAULT,
					ELEMENT.HA_DIALOG_LIGHT,
					ELEMENT.HA_DIALOG_LOCK,
					ELEMENT.HA_DIALOG_MEDIA_PLAYER,
					ELEMENT.HA_DIALOG_PERSON,
					ELEMENT.HA_DIALOG_SIREN,
					ELEMENT.HA_DIALOG_TIMER,
					ELEMENT.HA_DIALOG_UPDATE,
					ELEMENT.HA_DIALOG_VACUUM,
					ELEMENT.HA_DIALOG_CAMERA
				].join(',')
			)
			.$
			.element
			.then((dialogChild: ShadowRoot) => {

				if (
					options[OPTION.HIDE_DIALOG_ATTRIBUTES] ||
					options[OPTION.HIDE_DIALOG_TIMER_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_CAMERA_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS] ||
					options[OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS]
				) {
					const styles = [
						options[OPTION.HIDE_DIALOG_ATTRIBUTES]
							&& STYLES.DIALOG_ATTRIBUTES,
						options[OPTION.HIDE_DIALOG_TIMER_ACTIONS] &&
						dialogChild.host.localName === ELEMENT.HA_DIALOG_TIMER
							&& STYLES.DIALOG_TIMER_ACTIONS,
						options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS] &&
						dialogChild.host.localName === ELEMENT.HA_DIALOG_MEDIA_PLAYER
							&& STYLES.DIALOG_MEDIA_ACTIONS,
						options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS] &&
						dialogChild.host.localName === ELEMENT.HA_DIALOG_UPDATE
							&& STYLES.DIALOG_UPDATE_ACTIONS,
						dialogChild.host.localName === ELEMENT.HA_DIALOG_CAMERA
							&& STYLES.DIALOG_CAMERA_ACTIONS,
						(
							options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
							options[OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS]
						)
							&& STYLES.DIALOG_LIGHT_CONTROL_ACTIONS,
						(
							options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
							options[OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS]
						)
							&& STYLES.DIALOG_LIGHT_COLOR_ACTIONS,
						(
							options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
							options[OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS]
						)
							&& STYLES.DIALOG_LIGHT_SETTINGS_ACTIONS
					];
					this.styleManager.addStyle(styles, dialogChild);
					if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
						if (options[OPTION.HIDE_DIALOG_ATTRIBUTES])             setCache(TRUE, OPTION.HIDE_DIALOG_ATTRIBUTES);
						if (options[OPTION.HIDE_DIALOG_TIMER_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_TIMER_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_MEDIA_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS])         setCache(TRUE, OPTION.HIDE_DIALOG_UPDATE_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_CAMERA_ACTIONS])         setCache(TRUE, OPTION.HIDE_DIALOG_CAMERA_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS])  setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS])    setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS);
						if (options[OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS]) setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS);
					}
				} else {
					this.styleManager.removeStyle(dialogChild);
				}

			});

		// History and Logbook
		if (
			options[OPTION.HIDE_DIALOG_HISTORY] ||
			options[OPTION.HIDE_DIALOG_LOGBOOK]
		) {
			const styles = [
				options[OPTION.HIDE_DIALOG_HISTORY]
					&& STYLES.DIALOG_HISTORY,
				options[OPTION.HIDE_DIALOG_LOGBOOK]
					&& STYLES.DIALOG_LOGBOOK
			];
			this.styleManager.addStyle(styles, moreInfo);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (options[OPTION.HIDE_DIALOG_HISTORY]) setCache(TRUE, OPTION.HIDE_DIALOG_HISTORY);
				if (options[OPTION.HIDE_DIALOG_LOGBOOK]) setCache(TRUE, OPTION.HIDE_DIALOG_LOGBOOK);
			}
		} else {
			this.styleManager.removeStyle(moreInfo);
		}

		MORE_INFO_CHILD_ROOT
			.query(ELEMENT.HA_DIALOG_HISTORY)
			.$
			.element
			.then((dialogHistory: ShadowRoot) => {
				if (options[OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE]) {
					this.styleManager.addStyle(STYLES.DIALOG_SHOW_MORE, dialogHistory);
					if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE);
				} else {
					this.styleManager.removeStyle(dialogHistory);
				}
			});

		MORE_INFO_CHILD_ROOT
			.query(ELEMENT.HA_DIALOG_LOGBOOK)
			.$
			.element
			.then((dialogLogbook: ShadowRoot) => {
				if (options[OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE]) {
					this.styleManager.addStyle(STYLES.DIALOG_SHOW_MORE, dialogLogbook);
					if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE);
				} else {
					this.styleManager.removeStyle(dialogLogbook);
				}
			});

	}

	// Resize event
	protected resizeWindow() {
		window.clearTimeout(this.resizeDelay);
		this.resizeDelay = window.setTimeout(() => {
			this.updateMenuItemsLabels();
		}, WINDOW_RESIZE_DELAY);
	}

	// Run on button menu change
	protected updateMenuItemsLabels() {

		if (!this.menuTranslations) return;

		this.HAElements.HEADER.selector.query(`${ELEMENT.TOOLBAR} > ${ELEMENT.ACTION_ITEMS} > ${ELEMENT.TOOLTIP}`).all
			.then((buttonItemsTooltips: NodeListOf<ButtonItemTooltip>) => {
				addMenuItemsDataSelectors(buttonItemsTooltips, this.menuTranslations);
			});

		if (this.user.is_admin) {
			this.HAElements.HEADER.selector.query(`${ELEMENT.TOOLBAR} ${ELEMENT.OVERLAY_MENU_ITEM}`).all
				.then((overflowMenuItems: NodeListOf<HTMLElement>) => {
					overflowMenuItems.forEach((overflowMenuItem: HTMLElement): void => {
						if (!overflowMenuItem?.dataset?.selector) {
							const textContent = overflowMenuItem.textContent.trim();
							overflowMenuItem.dataset.selector = this.menuTranslations[textContent];
						}
					});
				});
		}
	}

	protected blockEventHandler(event: Event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected setOptions(
		options: Options,
		mergedConfig: KioskConfig
	) {
		Object.values({
			...DEBUG_CONFIG_OPTION,
			...OPTION
		}).forEach((option: DEBUG_CONFIG_OPTION | OPTION) => {
			if (option in mergedConfig) {
				this.setOptionsOrSubscribeToSetOptions(options, mergedConfig, option);
			}
		});
	}

	protected setOptionsOrSubscribeToSetOptions(
		options: Options,
		mergedConfig: KioskConfig,
		option: OPTION | DEBUG_CONFIG_OPTION
	) {
		const panelUrl = this._getPanelUrl();
		const value = mergedConfig[option];

		const executeRendering = (value: string, result: unknown): void => {
			if (this._getPanelUrl() === panelUrl) {
				if (option === DEBUG_CONFIG_OPTION.DEBUG_TEMPLATE) {
					ConsoleMessenger.debugTemplate(value, result);
				} else {
					if (this._isDebug(options.debug)) {
						ConsoleMessenger.debug(option, value, result);
					}
					this.runThrottle();
				}
			}
		};

		if (typeof value === 'boolean') {

			options[option] = value;

		} else if (JS_TEMPLATE_REG.test(value)) {

			const renderingFunction = (result: unknown): void => {
				// Set the compiled option
				options[option] = typeof result === 'boolean'
					? result
					: false;
				executeRendering(value, result);
			};

			this._renderer.trackTemplate(
				value.replace(JS_TEMPLATE_REG, '$1'),
				renderingFunction
			);

		} else if (JINJA_TEMPLATE_REG.test(value)) {

			window.hassConnection.then((hassConnection: HassConnection): void => {
				hassConnection.conn.subscribeMessage<SubscriberTemplate>(
					(message: SubscriberTemplate): void => {
						const result = message.result;
						options[option] = typeof result === 'boolean'
							? result
							: false;
						executeRendering(value, result);
					},
					{
						type: RENDER_TEMPLATE_EVENT,
						template: value,
						variables: {
							user_name: this.ha.hass.user.name,
							user_is_admin: this.ha.hass.user.is_admin,
							user_is_owner: this.ha.hass.user.is_owner,
							user_agent: window.navigator.userAgent
						}
					}
				);
			});

		} else {
			throw SyntaxError(`${NAMESPACE}: the value "${value}" of the option "${option}" is not a well formed JavaScript or Jinja template`);
		}
	}
}

// Console tag
ConsoleMessenger.logInfo();

// Initial Run
Promise.resolve(customElements.whenDefined(ELEMENT.HUI_VIEW))
	.then(() => {
		window.KioskMode = new KioskMode();
	});
