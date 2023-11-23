describe('Kiosk-mode: URL Parameters', function () {

	it('URL Parameter: ?kiosk', function () {

		cy.ingress(['kiosk']);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_header', function () {

		cy.ingress(['hide_header']);

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_sidebar', function () {

		cy.ingress(['hide_sidebar']);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_menubutton', function () {

		cy.ingress(['hide_menubutton']);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.menu ha-icon-button')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_notifications', function () {

		cy.ingress(['hide_notifications']);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.notifications-container')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_account', function () {

		cy.ingress(['hide_account']);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('a.profile')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_search', function () {

		cy.ingress(['hide_search']);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="SEARCH"]')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_assistant', function () {

		cy.ingress(['hide_assistant']);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="ASSIST"]')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_overflow', function () {

		cy.ingress(['hide_overflow']);

		cy
			.get('@overflow-menu')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_refresh', function () {

		cy.ingress(['hide_refresh']);

		cy
			.get('@overflow-menu')
			.click();

		cy
			.get('@overflow-menu-surface')
			.should('have.attr', 'open');

		cy
			.get('@overflow-menu')
			.find(`mwc-list-item[data-selector="REFRESH"]`)
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_unused_entities', function () {

		cy.ingress(['hide_unused_entities']);

		cy
			.get('@overflow-menu')
			.click();

		cy
			.get('@overflow-menu-surface')
			.should('have.attr', 'open');

		cy
			.get('@overflow-menu')
			.find(`mwc-list-item[data-selector="UNUSED_ENTITIES"]`)
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_reload_resources', function () {

		cy.ingress(['hide_reload_resources']);

		cy
			.get('@overflow-menu')
			.click();

		cy
			.get('@overflow-menu-surface')
			.should('have.attr', 'open');

		cy
			.get('@overflow-menu')
			.find(`mwc-list-item[data-selector="RELOAD_RESOURCES"]`)
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_edit_dashboard', function () {

		cy.ingress(['hide_edit_dashboard']);

		cy
			.get('@overflow-menu')
			.click();

		cy
			.get('@overflow-menu-surface')
			.should('have.attr', 'open');

		cy
			.get('@overflow-menu')
			.find(`mwc-list-item[data-selector="EDIT_DASHBOARD"]`)
			.should('be.hidden');

	});

	it('URL Parameter: ?block_overflow', function () {

		cy.ingress(['block_overflow']);

		cy
			.get('@overflow-menu')
			.should('have.css', 'pointer-events', 'none');

	});

	it('URL Parameter: ?block_context_menu', function () {

		cy.ingress(['block_context_menu']);

		cy
			.window()
			.then((win) => {

				expect(true).to.equal(true);

				const listener = cy.stub().as('listener');
				
				win.addEventListener('contextmenu', listener);

				cy
					.get('@hui-root')
					.find('.header')
					.rightclick();

				cy
					.get('@listener')
					.should('not.be.called');

			});

	});

});