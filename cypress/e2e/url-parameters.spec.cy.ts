describe('Kiosk-mode: URL Parameters', () => {

	it('URL Parameter: ?kiosk', () => {

		cy.ingress(['kiosk']);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_header', () => {

		cy.ingress(['hide_header']);

		cy
			.get('@hui-root')
			.find('.header')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_sidebar', () => {

		cy.ingress(['hide_sidebar']);

		cy
			.get('@ha-sidebar')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_menubutton', () => {

		cy.ingress(['hide_menubutton']);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.menu ha-icon-button')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_notifications', () => {

		cy.ingress(['hide_notifications']);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('.notifications-container')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_account', () => {

		cy.ingress(['hide_account']);

		cy
			.get('@ha-sidebar')
			.shadow()
			.find('a.profile')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_search', () => {

		cy.ingress(['hide_search']);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="SEARCH"]')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_assistant', () => {

		cy.ingress(['hide_assistant']);

		cy
			.get('@hui-root')
			.find('.header .action-items ha-icon-button[data-selector="ASSIST"]')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_overflow', () => {

		cy.ingress(['hide_overflow']);

		cy
			.get('@overflow-menu')
			.should('be.hidden');

	});

	it('URL Parameter: ?hide_refresh', () => {

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

	it('URL Parameter: ?hide_unused_entities', () => {

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

	it('URL Parameter: ?hide_reload_resources', () => {

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

	it('URL Parameter: ?hide_edit_dashboard', () => {

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

	it('URL Parameter: ?block_overflow', () => {

		cy.ingress(['block_overflow']);

		cy
			.get('@overflow-menu')
			.should('have.css', 'pointer-events', 'none');

	});

	it('URL Parameter: ?block_context_menu', () => {

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