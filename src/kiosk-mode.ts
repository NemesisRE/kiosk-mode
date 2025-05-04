import {
	HAQuerySelector,
	HAQuerySelectorEvent,
	OnLovelacePanelLoadDetail,
	OnMoreInfoDialogOpenDetail,
	OnHistoryAndLogBookDialogOpenDetail
} from 'home-assistant-query-selector';
import { HomeAssistantStylesManager } from 'home-assistant-styles-manager';
import { getPromisableResult } from 'get-promisable-result';
import {
	KioskModeRunner,
	HomeAssistant,
	User,
	ButtonItemTooltip,
	Lovelace,
	KioskConfig,
	ConditionalKioskConfig,
	SuscriberEvent,
	EntitySetting,
	HaSidebar,
	Version
} from '@types';
import {
	OPTION,
	CONDITIONAL_OPTION,
	SPECIAL_QUERY_PARAMS,
	ELEMENT,
	TRUE,
	CUSTOM_MOBILE_WIDTH_DEFAULT,
	SUSCRIBE_EVENTS_TYPE,
	STATE_CHANGED_EVENT,
	TOGGLE_MENU_EVENT,
	MC_DRAWER_CLOSED_EVENT,
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

import { ConInfo } from './conf-info';

class KioskMode implements KioskModeRunner {
	constructor() {

		if (queryString(SPECIAL_QUERY_PARAMS.CLEAR_CACHE)) {
			resetCache();
		}

		window.kioskModeEntities = {};

		this.options = {};

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

			this.ha = await HOME_ASSISTANT.element as HomeAssistant;
			this.main = await HOME_ASSISTANT_MAIN.selector.$.element;
			this.huiRoot = await HUI_ROOT.selector.$.element;
			this.drawerLayout = await HA_DRAWER.element as HaSidebar;
			this.appToolbar = await HEADER.selector.query(ELEMENT.TOOLBAR).element;
			this.sideBarRoot = await HA_SIDEBAR.selector.$.element;

			this.user = await getPromisableResult(
				(): User => this.ha?.hass?.user,
				(user: User) => !!user,
				{
					retries: MAX_ATTEMPTS,
					delay: RETRY_DELAY,
					rejectMessage: `${NAMESPACE}: Cannot select ${ELEMENT.HOME_ASSISTANT} > hass > user after {{ retries }} attempts. Giving up!`
				}
			);

			this.version = parseVersion(this.ha.hass?.config?.version);

			// Start kiosk-mode
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
		this.entityWatch();
		this.resizeWindowBinded = this.resizeWindow.bind(this);

	}

	// Elements
	private HAElements: OnLovelacePanelLoadDetail;
	private HAMoreInfoDialogElements: OnMoreInfoDialogOpenDetail | OnHistoryAndLogBookDialogOpenDetail;
	private styleManager: HomeAssistantStylesManager;
	private ha: HomeAssistant;
	private main: ShadowRoot;
	private user: User;
	private huiRoot: ShadowRoot;
	private drawerLayout: HaSidebar;
	private appToolbar: Element;
	private sideBarRoot: ShadowRoot;
	private menuTranslations: Record<string, string>;
	private resizeDelay: number;
	private resizeWindowBinded: () => void;
	private version: Version | null;

	// Kiosk Mode options
	private options: Partial<
		Record<
			OPTION | CONDITIONAL_OPTION,
			boolean
		>
	>;

	public async run() {

		const lovelace = this.main.querySelector<Lovelace>(ELEMENT.HA_PANEL_LOVELACE);

		if (!lovelace) {
			return;
		}

		// Get the configuration and process it
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

	public runDialogs(dialog: Element = this.ha?.shadowRoot?.querySelector(ELEMENT.HA_MORE_INFO_DIALOG)) {
		if (!dialog) return;
		this.insertMoreInfoDialogStyles();
	}

	protected async processConfig(config: KioskConfig) {

		const dash = this.ha.hass.panelUrl;

		if (!window.kioskModeEntities[dash]) {
			window.kioskModeEntities[dash] = [];
		}

		// Set all the options to false
		Object.values(OPTION).forEach((option: OPTION) => {
			this.options[option] = false;
		});
		Object.values(CONDITIONAL_OPTION).forEach((option: CONDITIONAL_OPTION) => {
			this.options[option] = false;
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
				this.options[option] = cached(option) || queryString(option);
			});
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
			config.user_settings.forEach((conf) => {
				if (conf.users.some((x) => x.toLowerCase() === this.user.name.toLowerCase())) {
					this.setOptions(conf, true);
				}
			});
		}

		// Mobile config
		const mobileConfig = this.options[CONDITIONAL_OPTION.IGNORE_MOBILE_SETTINGS]
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
		const entityConfig = this.options[CONDITIONAL_OPTION.IGNORE_ENTITY_SETTINGS]
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
			queryString(SPECIAL_QUERY_PARAMS.DISABLE_KIOSK_MODE) &&
			!this.options[CONDITIONAL_OPTION.IGNORE_DISABLE_KM]
		) {
			return;
		}

		this.insertStyles();
	}

	// INSERT REGULAR STYLES
	protected insertStyles() {

		if (
			this.options[OPTION.KIOSK] ||
			this.options[OPTION.HIDE_HEADER]
		) {
			this.styleManager.addStyle(STYLES.HEADER, this.huiRoot);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.HIDE_HEADER);
		} else {
			this.styleManager.removeStyle(this.huiRoot);
		}

		// Remove toggle menu event
		this.main?.host?.removeEventListener(TOGGLE_MENU_EVENT, this.blockEventHandler, true);

		if (
			this.options[OPTION.KIOSK] ||
			this.options[OPTION.HIDE_SIDEBAR]
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
			this.options[OPTION.HIDE_ACCOUNT] ||
			this.options[OPTION.HIDE_NOTIFICATIONS] ||
			this.options[OPTION.HIDE_MENU_BUTTON]
		) {
			const styles = [
				this.options[OPTION.HIDE_ACCOUNT]
					&& STYLES.ACCOUNT,
				this.options[OPTION.HIDE_NOTIFICATIONS]
					&& STYLES.NOTIFICATIONS,
				this.options[OPTION.HIDE_ACCOUNT] && this.options[OPTION.HIDE_NOTIFICATIONS]
					&& STYLES.DIVIDER,
				(
					this.options[OPTION.HIDE_MENU_BUTTON] ||
					this.options[OPTION.HIDE_NOTIFICATIONS] ||
					this.options[OPTION.HIDE_ACCOUNT]
				)
					&& STYLES.SIDEBAR_ITEMS_CONTAINER(
						this.options[OPTION.HIDE_MENU_BUTTON],
						this.options[OPTION.HIDE_NOTIFICATIONS],
						this.options[OPTION.HIDE_ACCOUNT],
					),
				this.options[OPTION.HIDE_MENU_BUTTON]
					&& STYLES.MENU_BUTTON,
			];
			this.styleManager.addStyle(styles, this.sideBarRoot);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (this.options[OPTION.HIDE_ACCOUNT])       setCache(TRUE, OPTION.HIDE_ACCOUNT);
				if (this.options[OPTION.HIDE_NOTIFICATIONS]) setCache(TRUE, OPTION.HIDE_NOTIFICATIONS);
			}
		} else {
			this.styleManager.removeStyle(this.sideBarRoot);
		}

		if (
			this.options[OPTION.HIDE_SEARCH] ||
			this.options[OPTION.HIDE_ASSISTANT] ||
			this.options[OPTION.HIDE_REFRESH] ||
			this.options[OPTION.HIDE_UNUSED_ENTITIES] ||
			this.options[OPTION.HIDE_RELOAD_RESOURCES] ||
			this.options[OPTION.HIDE_EDIT_DASHBOARD] ||
			this.options[OPTION.HIDE_OVERFLOW] ||
			this.options[OPTION.BLOCK_OVERFLOW] ||
			this.options[OPTION.HIDE_SIDEBAR] ||
			this.options[OPTION.HIDE_MENU_BUTTON]
		) {
			const styles = [
				this.options[OPTION.HIDE_SEARCH]
					&& STYLES.SEARCH,
				this.options[OPTION.HIDE_ASSISTANT]
					&& STYLES.ASSISTANT,
				this.options[OPTION.HIDE_REFRESH]
					&& STYLES.REFRESH,
				this.options[OPTION.HIDE_UNUSED_ENTITIES]
					&& STYLES.UNUSED_ENTITIES,
				this.options[OPTION.HIDE_RELOAD_RESOURCES]
					&& STYLES.RELOAD_RESOURCES,
				this.options[OPTION.HIDE_EDIT_DASHBOARD]
					&& STYLES.EDIT_DASHBOARD,
				this.options[OPTION.HIDE_OVERFLOW]
					&& STYLES.OVERFLOW_MENU,
				this.options[OPTION.BLOCK_OVERFLOW]
					&& STYLES.BLOCK_OVERFLOW,
				(this.options[OPTION.HIDE_MENU_BUTTON] || this.options[OPTION.HIDE_SIDEBAR])
					&& STYLES.MENU_BUTTON_BURGER
			];
			this.styleManager.addStyle(styles, this.appToolbar);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (this.options[OPTION.HIDE_SEARCH])           setCache(TRUE, OPTION.HIDE_SEARCH);
				if (this.options[OPTION.HIDE_ASSISTANT])        setCache(TRUE, OPTION.HIDE_ASSISTANT);
				if (this.options[OPTION.HIDE_REFRESH])          setCache(TRUE, OPTION.HIDE_REFRESH);
				if (this.options[OPTION.HIDE_UNUSED_ENTITIES])  setCache(TRUE, OPTION.HIDE_UNUSED_ENTITIES);
				if (this.options[OPTION.HIDE_RELOAD_RESOURCES]) setCache(TRUE, OPTION.HIDE_RELOAD_RESOURCES);
				if (this.options[OPTION.HIDE_EDIT_DASHBOARD])   setCache(TRUE, OPTION.HIDE_EDIT_DASHBOARD);
				if (this.options[OPTION.HIDE_OVERFLOW])         setCache(TRUE, OPTION.HIDE_OVERFLOW);
				if (this.options[OPTION.BLOCK_OVERFLOW])        setCache(TRUE, OPTION.BLOCK_OVERFLOW);
				if (this.options[OPTION.HIDE_MENU_BUTTON])      setCache(TRUE, OPTION.HIDE_MENU_BUTTON);
			}
		} else {
			this.styleManager.removeStyle(this.appToolbar);
		}

		if (this.options[OPTION.BLOCK_MOUSE]) {
			this.styleManager.addStyle(STYLES.MOUSE, document.body);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.BLOCK_MOUSE);
		} else {
			this.styleManager.removeStyle(document.body);
		}

		window.removeEventListener('contextmenu', this.blockEventHandler, true);

		if (this.options[OPTION.BLOCK_CONTEXT_MENU]) {
			window.addEventListener('contextmenu', this.blockEventHandler, true);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(TRUE, OPTION.BLOCK_CONTEXT_MENU);
		}

		// Resize event
		window.removeEventListener('resize', this.resizeWindowBinded);
		window.addEventListener('resize', this.resizeWindowBinded);

		// Resize window to 'refresh' view.
		window.dispatchEvent(new Event('resize'));
	}

	// INSERT MORE INFO DIALOG STYLES
	protected async insertMoreInfoDialogStyles() {

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
			this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] ||
			this.options[OPTION.HIDE_DIALOG_HEADER_HISTORY] ||
			this.options[OPTION.HIDE_DIALOG_HEADER_SETTINGS] ||
			this.options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW]
		) {
			const styles = [
				(this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || this.options[OPTION.HIDE_DIALOG_HEADER_HISTORY])
					&& STYLES.DIALOG_HEADER_HISTORY,
				(this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || this.options[OPTION.HIDE_DIALOG_HEADER_SETTINGS])
					&& STYLES.DIALOG_HEADER_SETTINGS,
				(this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || this.options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW])
					&& STYLES.DIALOG_HEADER_OVERFLOW
			];
			this.styleManager.addStyle(styles, dialog);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS]) setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS);
				if (this.options[OPTION.HIDE_DIALOG_HEADER_HISTORY])      setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_HISTORY);
				if (this.options[OPTION.HIDE_DIALOG_HEADER_SETTINGS])     setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_SETTINGS);
				if (this.options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW])     setCache(TRUE, OPTION.HIDE_DIALOG_HEADER_OVERFLOW);
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
				this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
				this.options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS]
			) {
				this.styleManager.addStyle(STYLES.DIALOG_CLIMATE_CONTROL_SELECT, haDialogClimate);
				if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
					if (this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_CLIMATE_ACTIONS);
					if (this.options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS]) setCache(TRUE, OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS);
				}
			} else {
				this.styleManager.removeStyle(haDialogClimate);
			}
		});

		haDialogClimateTemperature.element.then((haDialogClimateTemperature: ShadowRoot): void => {
			if (
				this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
				this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]
			) {
				this.styleManager.addStyle(STYLES.DIALOG_CLIMATE_TEMPERATURE_BUTTONS, haDialogClimateTemperature);
				if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
					if (this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]) setCache(TRUE, OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS);
				}
			} else {
				this.styleManager.removeStyle(haDialogClimateTemperature);
			}
		});

		haDialogClimateCircularSlider.element.then((haDialogClimateCircularSlider: ShadowRoot) => {
			if (
				this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
				this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]
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
					this.options[OPTION.HIDE_DIALOG_ATTRIBUTES] ||
					this.options[OPTION.HIDE_DIALOG_TIMER_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_CAMERA_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS]
				) {
					const styles = [
						this.options[OPTION.HIDE_DIALOG_ATTRIBUTES]
							&& STYLES.DIALOG_ATTRIBUTES,
						this.options[OPTION.HIDE_DIALOG_TIMER_ACTIONS] &&
						dialogChild.host.localName === ELEMENT.HA_DIALOG_TIMER
							&& STYLES.DIALOG_TIMER_ACTIONS,
						this.options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS] &&
						dialogChild.host.localName === ELEMENT.HA_DIALOG_MEDIA_PLAYER
							&& STYLES.DIALOG_MEDIA_ACTIONS,
						this.options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS] &&
						dialogChild.host.localName === ELEMENT.HA_DIALOG_UPDATE
							&& STYLES.DIALOG_UPDATE_ACTIONS,
						dialogChild.host.localName === ELEMENT.HA_DIALOG_CAMERA
							&& STYLES.DIALOG_CAMERA_ACTIONS,
						(
							this.options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
							this.options[OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS]
						)
							&& STYLES.DIALOG_LIGHT_CONTROL_ACTIONS,
						(
							this.options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
							this.options[OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS]
						)
							&& STYLES.DIALOG_LIGHT_COLOR_ACTIONS,
						(
							this.options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS] ||
							this.options[OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS]
						)
							&& STYLES.DIALOG_LIGHT_SETTINGS_ACTIONS
					];
					this.styleManager.addStyle(styles, dialogChild);
					if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
						if (this.options[OPTION.HIDE_DIALOG_ATTRIBUTES])             setCache(TRUE, OPTION.HIDE_DIALOG_ATTRIBUTES);
						if (this.options[OPTION.HIDE_DIALOG_TIMER_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_TIMER_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_MEDIA_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS])         setCache(TRUE, OPTION.HIDE_DIALOG_UPDATE_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_CAMERA_ACTIONS])         setCache(TRUE, OPTION.HIDE_DIALOG_CAMERA_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_LIGHT_ACTIONS])          setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS])  setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_CONTROL_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS])    setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_COLOR_ACTIONS);
						if (this.options[OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS]) setCache(TRUE, OPTION.HIDE_DIALOG_LIGHT_SETTINGS_ACTIONS);
					}
				} else {
					this.styleManager.removeStyle(dialogChild);
				}

			});

		// History and Logbook
		if (
			this.options[OPTION.HIDE_DIALOG_HISTORY] ||
			this.options[OPTION.HIDE_DIALOG_LOGBOOK]
		) {
			const styles = [
				this.options[OPTION.HIDE_DIALOG_HISTORY]
					&& STYLES.DIALOG_HISTORY,
				this.options[OPTION.HIDE_DIALOG_LOGBOOK]
					&& STYLES.DIALOG_LOGBOOK
			];
			this.styleManager.addStyle(styles, moreInfo);
			if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
				if (this.options[OPTION.HIDE_DIALOG_HISTORY]) setCache(TRUE, OPTION.HIDE_DIALOG_HISTORY);
				if (this.options[OPTION.HIDE_DIALOG_LOGBOOK]) setCache(TRUE, OPTION.HIDE_DIALOG_LOGBOOK);
			}
		} else {
			this.styleManager.removeStyle(moreInfo);
		}

		MORE_INFO_CHILD_ROOT
			.query(ELEMENT.HA_DIALOG_HISTORY)
			.$
			.element
			.then((dialogHistory: ShadowRoot) => {
				if (this.options[OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE]) {
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
				if (this.options[OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE]) {
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
						if (
							overflowMenuItem &&
							overflowMenuItem.dataset &&
							!overflowMenuItem.dataset.selector
						) {
							const textContent = overflowMenuItem.textContent.trim();
							overflowMenuItem.dataset.selector = this.menuTranslations[textContent];
						}
					});
				});
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
		const entities = window.kioskModeEntities[this.ha?.hass?.panelUrl] || [];
		if (
			entities.length &&
			event.event_type === STATE_CHANGED_EVENT &&
			entities.includes(event.data.entity_id) &&
			(
				!event.data.old_state ||
				event.data.new_state.state !== event.data.old_state.state
			)
		) {
			await this.run();
			this.runDialogs();
		}
	}

	protected blockEventHandler(event: Event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}

	protected setOptions(config: ConditionalKioskConfig, conditional: boolean) {
		Object.values(OPTION).forEach((option: OPTION): void => {
			if (option in config) {
				this.options[option] = config[option];
			}
		});
		if (conditional) {
			Object.values(CONDITIONAL_OPTION).forEach((option: CONDITIONAL_OPTION): void => {
				if (option in config) {
					this.options[option] = config[option];
				}
			});
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
