describe('kiosk-mode tests', () => {

	beforeEach(() => {

		cy.ingress();
		cy.waitForHomeAssistantDOM();

		cy
			.get('home-assistant')
			.shadow()
			.find('home-assistant-main')
			.shadow()
			.find('ha-drawer')
			.as('ha-drawer');

		cy
			.get('@ha-drawer')
			.find('ha-sidebar')
			.as('ha-sidebar');

		cy
			.get('@ha-drawer')
			.find('ha-panel-lovelace')
			.shadow()
			.find('hui-root')
			.shadow()
			.as('hui-root');

		cy
			.get('@hui-root')
			.find('.header .action-items ha-button-menu')
			.as('overflow-menu');

		cy
			.get('@overflow-menu')
			.shadow()
			.find('mwc-menu')
			.shadow()
			.find('mwc-menu-surface')
			.as('overflow-menu-surface');

		cy.wait(100);

	});

	it('Option: kiosk', () => {

		cy.clickEntity(0);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

		cy.compareSnapshot('kiosk');

		cy.clickEntity(0);

	});

	it('Option: hide_header', () => {

		cy.clickEntity(1);

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

		cy.compareSnapshot('hide_header');

		cy.clickEntity(1);

	});

	it('Option: hide_sidebar', () => {

		cy.clickEntity(2);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

		cy.compareSnapshot('hide_sidebar');

		cy.clickEntity(2);

	});

	it('Option: hide_menubutton', () => {

		cy.clickEntity(3);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.menu ha-icon-button')
			.should('be.hidden');

		cy.compareSnapshot('hide_menubutton');

		cy.clickEntity(3);

	});

	it('Option: hide_notifications', () => {

		cy.clickEntity(4);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.notifications-container')
			.should('be.hidden');

		cy.compareSnapshot('hide_notifications');

		cy.clickEntity(4);

	});

	it('Option: hide_account', () => {

		cy.clickEntity(5);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('a.profile')
			.should('be.hidden');

		cy.compareSnapshot('hide_account');

		cy.clickEntity(5);

	});

	it('Option: hide_search', () => {

		cy.clickEntity(6);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="SEARCH"]')
			.should('be.hidden');

		cy.compareSnapshot('hide_search');

		cy.clickEntity(6);

	});

	it('Option: hide_assistant', () => {

		cy.clickEntity(7);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="ASSIST"]')
			.should('be.hidden');

		cy.compareSnapshot('hide_assistant');

		cy.clickEntity(7);

	});

	it('Option: hide_overflow', () => {

		cy.clickEntity(8);

		cy
			.get('@overflow-menu')
			.should('be.hidden');

		cy.compareSnapshot('hide_overflow');

		cy.clickEntity(8);

	});

	it('Option: hide_refresh', () => {

		cy.checkOverflowMenuItem(
			9,
			'REFRESH',
			'hide_refresh'
		);

	});

	it('Option: hide_unused_entities', () => {

		cy.checkOverflowMenuItem(
			10,
			'UNUSED_ENTITIES',
			'hide_unused_entities'
		);

	});

	it('Option: hide_reload_resources', () => {

		cy.checkOverflowMenuItem(
			11,
			'RELOAD_RESOURCES',
			'hide_reload_resources'
		);

	});

	it('Option: hide_edit_dashboard', () => {

		cy.checkOverflowMenuItem(
			12,
			'EDIT_DASHBOARD',
			'hide_edit_dashboard'
		);

	});

	it('Option: block_overflow', () => {

		cy.clickEntity(13);

		cy
			.get('@overflow-menu')
			.should('have.css', 'pointer-events', 'none');

		cy.clickEntity(13);

	});

	it('Option: block_context_menu', () => {

		cy
			.window()
			.then((win) => {

				const listener = cy.stub().as('listener');
				
				win.addEventListener('contextmenu', listener);

				cy
					.get('@hui-root')
					.find('.header')
					.rightclick();

				cy
					.get('@listener')
					.should('be.calledOnce');

				cy.clickEntity(15);

				cy.wait(100);

				cy
					.get('@hui-root')
					.find('.header')
					.rightclick();

				cy
					.get('@listener')
					.should('not.be.calledTwice');

				cy.clickEntity(15);

			});

	});

});