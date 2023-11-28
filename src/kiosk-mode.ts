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
    OPTION,
    CONDITIONAL_OPTION,
    SPECIAL_QUERY_PARAMS,
    ELEMENT,
    TRUE,
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
    parseVersion,
    resetCache
} from '@utilities';
import { STYLES } from '@styles';

import { ConInfo } from './conf-info';

class KioskMode implements KioskModeRunner {
    constructor() {
        window.kioskModeEntities = {};
        this.options = {};

        if (queryString(SPECIAL_QUERY_PARAMS.CLEAR_CACHE)) {
            resetCache();
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
    private options: Partial<
		Record<
			OPTION | CONDITIONAL_OPTION,
			boolean
		>
	>;

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

        // Set all the options to false
        Object.values(OPTION).forEach((option: OPTION) => {
            this.options[option] = false;
        });
        Object.values(CONDITIONAL_OPTION).forEach((option: CONDITIONAL_OPTION) => {
            this.options[option] = false;
        });

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
        if (
            cached(
                Object.values(OPTION)
            ) ||
            queryString(
                Object.values(OPTION)
            )
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
            toArray(config.user_settings).forEach((conf) => {
                if (toArray(conf.users).some((x) => x.toLowerCase() === this.user.name.toLowerCase())) {
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
            addStyle(STYLES.HEADER, this.huiRoot);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.HIDE_HEADER, TRUE);
        } else {
            removeStyle(this.huiRoot);
        }

        // Remove toggle menu event
        this.main?.host?.removeEventListener(TOGGLE_MENU_EVENT, this.blockEventHandler, true);

        if (
            this.options[OPTION.KIOSK] ||
			this.options[OPTION.HIDE_SIDEBAR]
        ) {
            this.main?.host?.addEventListener(TOGGLE_MENU_EVENT, this.blockEventHandler, true);
            addStyle(STYLES.SIDEBAR, this.drawerLayout);
            addStyle(STYLES.ASIDE, this.drawerLayout.shadowRoot);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.HIDE_SIDEBAR, TRUE);
        } else {
            removeStyle(this.drawerLayout);
            removeStyle(this.drawerLayout.shadowRoot);
        }

        if (
            this.options[OPTION.HIDE_ACCOUNT] ||
			this.options[OPTION.HIDE_NOTIFICATIONS] ||
			this.options[OPTION.HIDE_MENU_BUTTON]
        ) {
            const styles = [
                this.options[OPTION.HIDE_ACCOUNT]
                    ? STYLES.ACCOUNT : '',
                this.options[OPTION.HIDE_NOTIFICATIONS]
                    ? STYLES.NOTIFICATIONS : '',
                this.options[OPTION.HIDE_ACCOUNT] && this.options[OPTION.HIDE_NOTIFICATIONS]
                    ? STYLES.DIVIDER
                    : '',
                this.options[OPTION.HIDE_ACCOUNT] || this.options[OPTION.HIDE_NOTIFICATIONS]
                    ? STYLES.PEPER_LISTBOX(
                        this.options[OPTION.HIDE_ACCOUNT],
                        this.options[OPTION.HIDE_NOTIFICATIONS]
                    )
                    : '',
                this.options[OPTION.HIDE_MENU_BUTTON]
                    ? STYLES.MENU_BUTTON : '',
            ];
            addStyle(styles.join(''), this.sideBarRoot);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
                if (this.options[OPTION.HIDE_ACCOUNT])       setCache(OPTION.HIDE_ACCOUNT, TRUE);
                if (this.options[OPTION.HIDE_NOTIFICATIONS]) setCache(OPTION.HIDE_NOTIFICATIONS, TRUE);
            }
        } else {
            removeStyle(this.sideBarRoot);
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
                    ? STYLES.SEARCH : '',
                this.options[OPTION.HIDE_ASSISTANT]
                    ? STYLES.ASSISTANT : '',
                this.options[OPTION.HIDE_REFRESH]
                    ? STYLES.REFRESH : '',
                this.options[OPTION.HIDE_UNUSED_ENTITIES]
                    ? STYLES.UNUSED_ENTITIES : '',
                this.options[OPTION.HIDE_RELOAD_RESOURCES]
                    ? STYLES.RELOAD_RESOURCES : '',
                this.options[OPTION.HIDE_EDIT_DASHBOARD]
                    ? STYLES.EDIT_DASHBOARD : '',
                this.options[OPTION.HIDE_OVERFLOW]
                    ? STYLES.OVERFLOW_MENU : '',
                this.options[OPTION.BLOCK_OVERFLOW]
                    ? STYLES.BLOCK_OVERFLOW : '',
                this.options[OPTION.HIDE_MENU_BUTTON] || this.options[OPTION.HIDE_SIDEBAR]
                    ? STYLES.MENU_BUTTON_BURGER : '',
            ];
            addStyle(styles.join(''), this.appToolbar);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
                if (this.options[OPTION.HIDE_SEARCH])           setCache(OPTION.HIDE_SEARCH, TRUE);
                if (this.options[OPTION.HIDE_ASSISTANT])        setCache(OPTION.HIDE_ASSISTANT, TRUE);
                if (this.options[OPTION.HIDE_REFRESH])          setCache(OPTION.HIDE_REFRESH, TRUE);
                if (this.options[OPTION.HIDE_UNUSED_ENTITIES])  setCache(OPTION.HIDE_UNUSED_ENTITIES, TRUE);
                if (this.options[OPTION.HIDE_RELOAD_RESOURCES]) setCache(OPTION.HIDE_RELOAD_RESOURCES, TRUE);
                if (this.options[OPTION.HIDE_EDIT_DASHBOARD])   setCache(OPTION.HIDE_EDIT_DASHBOARD, TRUE);
                if (this.options[OPTION.HIDE_OVERFLOW])         setCache(OPTION.HIDE_OVERFLOW, TRUE);
                if (this.options[OPTION.BLOCK_OVERFLOW])        setCache(OPTION.BLOCK_OVERFLOW, TRUE);
                if (this.options[OPTION.HIDE_MENU_BUTTON])      setCache(OPTION.HIDE_MENU_BUTTON, TRUE);
            }
        } else {
            removeStyle(this.appToolbar);
        }

        if (this.options[OPTION.BLOCK_MOUSE]) {
            addStyle(STYLES.MOUSE, document.body);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.BLOCK_MOUSE, TRUE);
        } else {
            removeStyle(document.body);
        }

        window.removeEventListener('contextmenu', this.blockEventHandler, true);

        if (this.options[OPTION.BLOCK_CONTEXT_MENU]) {
            window.addEventListener('contextmenu', this.blockEventHandler, true);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.BLOCK_CONTEXT_MENU, TRUE);
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
            .catch((message) => {
                console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} ${message}`);
            });

        if (
            this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] ||
			this.options[OPTION.HIDE_DIALOG_HEADER_HISTORY] ||
			this.options[OPTION.HIDE_DIALOG_HEADER_SETTINGS] ||
			this.options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW]
        ) {
            const styles = [
                this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || this.options[OPTION.HIDE_DIALOG_HEADER_HISTORY]
                    ? STYLES.DIALOG_HEADER_HISTORY : '',
                this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || this.options[OPTION.HIDE_DIALOG_HEADER_SETTINGS]
                    ? STYLES.DIALOG_HEADER_SETTINGS : '',
                this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS] || this.options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW]
                    ? STYLES.DIALOG_HEADER_OVERFLOW : ''
            ];
            addStyle(styles.join(''), dialog);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
                if (this.options[OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS]) setCache(OPTION.HIDE_DIALOG_HEADER_ACTION_ITEMS, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_HEADER_HISTORY])      setCache(OPTION.HIDE_DIALOG_HEADER_HISTORY, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_HEADER_SETTINGS])     setCache(OPTION.HIDE_DIALOG_HEADER_SETTINGS, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_HEADER_OVERFLOW])     setCache(OPTION.HIDE_DIALOG_HEADER_OVERFLOW, TRUE);
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
            this.options[OPTION.HIDE_DIALOG_HISTORY] ||
			this.options[OPTION.HIDE_DIALOG_LOGBOOK] ||
			this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
			this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS] ||
			this.options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS]
        ) {
            const styles = [
                this.options[OPTION.HIDE_DIALOG_HISTORY]
                    ? STYLES.DIALOG_HISTORY : '',
                this.options[OPTION.HIDE_DIALOG_LOGBOOK]
                    ? STYLES.DIALOG_LOGBOOK : '',
                this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] && legacyClimateInfoDialog
                    ? STYLES.DIALOG_CLIMATE_ACTIONS
                    : ''
            ];
            addStyle(styles.join(''), moreInfo);
            if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
                if (this.options[OPTION.HIDE_DIALOG_HISTORY])                     setCache(OPTION.HIDE_DIALOG_HISTORY, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_LOGBOOK])                     setCache(OPTION.HIDE_DIALOG_LOGBOOK, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS])             setCache(OPTION.HIDE_DIALOG_CLIMATE_ACTIONS, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]) setCache(OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS, TRUE);
                if (this.options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS])    setCache(OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS, TRUE);
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

                    if (
                        this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
						this.options[OPTION.HIDE_DIALOG_CLIMATE_SETTINGS_ACTIONS]
                    ) {
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

                            if (
                                this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
								this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]
                            ) {
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

                                    if (
                                        this.options[OPTION.HIDE_DIALOG_CLIMATE_ACTIONS] ||
										this.options[OPTION.HIDE_DIALOG_CLIMATE_TEMPERATURE_ACTIONS]
                                    ) {
                                        addStyle(STYLES.DIALOG_CLIMATE_CIRCULAR_SLIDER_INTERACTION, haDialogClimateCircularSlider);
                                    } else {
                                        removeStyle(haDialogClimateCircularSlider);
                                    }

                                })
                                .catch(() => { /* ignore if it doesn‘t exist */ });

                        })
                        .catch(() => { /* ignore if it doesn‘t exist */ });

                })
                .catch(() => { /* ignore if it doesn‘t exist */ });
        }

        getPromisableElement(
            (): ShadowRoot => moreInfo.querySelector(ELEMENT.HA_DIALOG_HISTORY)?.shadowRoot,
            (dialogHistory: ShadowRoot) => !!dialogHistory,
            ''
        )
            .then((dialogHistory: ShadowRoot) => {
                if (this.options[OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE]) {
                    addStyle(STYLES.DIALOG_SHOW_MORE, dialogHistory);
                    if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.HIDE_DIALOG_HISTORY_SHOW_MORE, TRUE);
                } else {
                    removeStyle(dialogHistory);
                }
            })
            .catch(() => { /* ignore if it doesn‘t exist */ });

        getPromisableElement(
            (): ShadowRoot => moreInfo.querySelector(ELEMENT.HA_DIALOG_LOGBOOK)?.shadowRoot,
            (dialogLogbook: ShadowRoot) => !!dialogLogbook,
            ''
        )
            .then((dialogLogbook: ShadowRoot) => {
                if (this.options[OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE]) {
                    addStyle(STYLES.DIALOG_SHOW_MORE, dialogLogbook);
                    if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.HIDE_DIALOG_LOGBOOK_SHOW_MORE, TRUE);
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
                    this.options[OPTION.HIDE_DIALOG_ATTRIBUTES] ||
					this.options[OPTION.HIDE_DIALOG_TIMER_ACTIONS] ||
					this.options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS]
                ) {
                    const styles = [
                        this.options[OPTION.HIDE_DIALOG_ATTRIBUTES] ? STYLES.DIALOG_ATTRIBUTES : '',
                        this.options[OPTION.HIDE_DIALOG_TIMER_ACTIONS] ? STYLES.DIALOG_TIMER_ACTIONS : '',
                        (
                            this.options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS] &&
							dialogChild.host.localName === ELEMENT.HA_DIALOG_MEDIA_PLAYER
                        )
                            ? STYLES.DIALOG_MEDIA_ACTIONS
                            : '',
                    ];
                    addStyle(styles.join(''), dialogChild);
                    if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) {
                        if (this.options[OPTION.HIDE_DIALOG_ATTRIBUTES])    setCache(OPTION.HIDE_DIALOG_ATTRIBUTES, TRUE);
                        if (this.options[OPTION.HIDE_DIALOG_TIMER_ACTIONS]) setCache(OPTION.HIDE_DIALOG_TIMER_ACTIONS, TRUE);
                        if (this.options[OPTION.HIDE_DIALOG_MEDIA_ACTIONS]) setCache(OPTION.HIDE_DIALOG_MEDIA_ACTIONS, TRUE);
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
                if (this.options[OPTION.HIDE_DIALOG_UPDATE_ACTIONS]) {
                    addStyle(STYLES.DIALOG_UPDATE_ACTIONS, dialogChild);
                    if (queryString(SPECIAL_QUERY_PARAMS.CACHE)) setCache(OPTION.HIDE_DIALOG_UPDATE_ACTIONS, TRUE);
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
            .catch((message) => {
                console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} ${message}`);
            });

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
                .catch((message) => {
                    console.warn(`${NAMESPACE}: ${NON_CRITICAL_WARNING} ${message}`);
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
        const entities = window.kioskModeEntities[this.ha.hass.panelUrl] || [];
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
            this
                .runDialogs()
                .catch(() => { /* ignore if it doesn‘t exist */ });
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
