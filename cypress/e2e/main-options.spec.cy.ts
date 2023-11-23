describe('Kiosk-mode: Main Options', function () {

	beforeEach(function () {
		cy.ingress();
	});

	it('Option: kiosk', function (){

		cy.haRequest('kiosk', true);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

		cy.compareSnapshot('kiosk');

		cy.haRequest('kiosk', false);

	});

	it('Option: hide_header', function () {

		cy.haRequest('kiosk_hide_header', true);

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

		cy.compareSnapshot('hide_header');

		cy.haRequest('kiosk_hide_header', false);

	});

	it('Option: hide_sidebar', function () {

		cy.haRequest('kiosk_hide_sidebar', true);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

		cy.compareSnapshot('hide_sidebar');

		cy.haRequest('kiosk_hide_sidebar', false);

	});

	it('Option: hide_menubutton', function () {

		cy.haRequest('kiosk_hide_menubutton', true);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.menu ha-icon-button')
			.should('be.hidden');

		cy.compareSnapshot('hide_menubutton');

		cy.haRequest('kiosk_hide_menubutton', false);

	});

	it('Option: hide_notifications', function () {

		cy.haRequest('kiosk_hide_notifications', true);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.notifications-container')
			.should('be.hidden');

		cy.compareSnapshot('hide_notifications');

		cy.haRequest('kiosk_hide_notifications', false);

	});

	it('Option: hide_account', function () {

		cy.haRequest('kiosk_hide_account', true);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('a.profile')
			.should('be.hidden');

		cy.compareSnapshot('hide_account');

		cy.haRequest('kiosk_hide_account', false);

	});

	it('Option: hide_search', function () {

		cy.haRequest('kiosk_hide_search', true);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="SEARCH"]')
			.should('be.hidden');

		cy.compareSnapshot('hide_search');

		cy.haRequest('kiosk_hide_search', false);

	});

	it('Option: hide_assistant', function () {

		cy.haRequest('kiosk_hide_assistant', true);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="ASSIST"]')
			.should('be.hidden');

		cy.compareSnapshot('hide_assistant');

		cy.haRequest('kiosk_hide_assistant', false);

	});

	it('Option: hide_overflow', function () {

		cy.haRequest('kiosk_hide_overflow', true);

		cy
			.get('@overflow-menu')
			.should('be.hidden');

		cy.compareSnapshot('hide_overflow');

		cy.haRequest('kiosk_hide_overflow', false);

	});

	it('Option: hide_refresh', function () {

		cy.checkOverflowMenuItem(
			'kiosk_hide_refresh',
			'REFRESH',
			'hide_refresh'
		);

	});

	it('Option: hide_unused_entities', function () {

		cy.checkOverflowMenuItem(
			'kiosk_hide_unused_entities',
			'UNUSED_ENTITIES',
			'hide_unused_entities'
		);

	});

	it('Option: hide_reload_resources', function () {

		cy.checkOverflowMenuItem(
			'kiosk_hide_reload_resources',
			'RELOAD_RESOURCES',
			'hide_reload_resources'
		);

	});

	it('Option: hide_edit_dashboard', function () {

		cy.checkOverflowMenuItem(
			'kiosk_hide_edit_dashboard',
			'EDIT_DASHBOARD',
			'hide_edit_dashboard'
		);

	});

	it('Option: block_overflow', function () {

		cy.haRequest('kiosk_block_overflow', true);

		cy
			.get('@overflow-menu')
			.should('have.css', 'pointer-events', 'none');

		cy.haRequest('kiosk_block_overflow', false);

	});

	it('Option: block_context_menu', function () {

		cy
			.window()
			.then(function (win) {

				const listener = cy.stub().as('listener');
				
				win.addEventListener('contextmenu', listener);

				cy
					.get('@hui-root')
					.find('.header')
					.rightclick();

				cy
					.get('@listener')
					.should('be.calledOnce');

				cy.haRequest('kiosk_block_context_menu', true);

				cy.wait(100);

				cy
					.get('@hui-root')
					.find('.header')
					.rightclick();

				cy
					.get('@listener')
					.should('not.be.calledTwice');

				cy.haRequest('kiosk_block_context_menu', false);

			});

	});

});