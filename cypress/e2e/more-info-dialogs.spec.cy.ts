describe('Kiosk-mode: More-info Dialogs', function () {

    beforeEach(function () {

        cy.ingress();

        cy
            .get('@states-divs')
            .eq(18)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@home-assistant')
            .find('ha-more-info-dialog')
            .shadow()
            .find('ha-dialog ha-dialog-header')
            .as('dialog-header')

            .find('ha-icon-button[data-selector="DIALOG_DISMISS"]')
            .as('close-dialog');

        cy
            .get('@home-assistant')
            .find('ha-more-info-dialog')
            .shadow()
            .find('ha-dialog .content ha-more-info-info')
            .shadow()
            .as('dialog-body');

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

    });

    it('By default all elements should be visible', function () {

        cy
            .get('@states-divs')
            .eq(18)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-header')
            .find('ha-icon-button[data-selector="DIALOG_HISTORY"]')
            .should('be.visible');

        cy
            .get('@dialog-header')
            .find('ha-icon-button[data-selector="DIALOG_SETTINGS"]')
            .should('be.visible');

        cy
            .get('@dialog-header')
            .find('ha-button-menu')
            .should('be.visible');

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy
            .get('@states-divs')
            .eq(19)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-body')
            .find('ha-more-info-history')
            .should('be.visible');

        cy
            .get('@dialog-body')
            .find('ha-more-info-history')
            .shadow()
            .find('.header a')
            .should('be.visible');

        cy
            .get('@dialog-body')
            .find('more-info-content more-info-default')
            .shadow()
            .find('ha-attributes')
            .should('be.visible');

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

    });

    it('Option: hide_dialog_header_history', function () {

        cy.haRequest('kiosk_hide_dialog_header_history', true);

        cy
            .get('@states-divs')
            .eq(18)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-header')
            .find('ha-icon-button[data-selector="DIALOG_HISTORY"]')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_header_history');

        cy.haRequest('kiosk_hide_dialog_header_history', false);

	});


    it('Option: hide_dialog_header_settings', function () {

        cy.haRequest('kiosk_hide_dialog_header_settings', true);

        cy
            .get('@states-divs')
            .eq(18)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-header')
            .find('ha-icon-button[data-selector="DIALOG_SETTINGS"]')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_header_settings');

        cy.haRequest('kiosk_hide_dialog_header_settings', false);

	});

    it('Option: hide_dialog_header_overflow', function () {

        cy.haRequest('kiosk_hide_dialog_header_overflow', true);

        cy
            .get('@states-divs')
            .eq(18)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-header')
            .find('ha-button-menu')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_header_overflow');

        cy.haRequest('kiosk_hide_dialog_header_overflow', false);

	});

    it('Option: hide_dialog_header_action_items', function () {

        cy.haRequest('kiosk_hide_dialog_header_action_items', true);

        cy
            .get('@states-divs')
            .eq(18)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-header')
            .find('ha-icon-button[data-selector="DIALOG_HISTORY"]')
            .should('not.be.visible');

        cy
            .get('@dialog-header')
            .find('ha-icon-button[data-selector="DIALOG_SETTINGS"]')
            .should('not.be.visible');

        cy
            .get('@dialog-header')
            .find('ha-button-menu')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_header_action_items');

        cy.haRequest('kiosk_hide_dialog_header_action_items', false);

	});

    it('Option: hide_dialog_history', function () {

        cy.haRequest('kiosk_hide_dialog_history', true);

        cy
            .get('@states-divs')
            .eq(19)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-body')
            .find('ha-more-info-history')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_history');

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.haRequest('kiosk_hide_dialog_history', false);

	});

    it('Option: hide_dialog_attributes', function () {

        cy.haRequest('kiosk_hide_dialog_attributes', true);

        cy
            .get('@states-divs')
            .eq(19)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-body')
            .find('more-info-content more-info-default')
            .shadow()
            .find('ha-attributes')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_attributes');

        cy.haRequest('kiosk_hide_dialog_attributes', false);

	});

    it('Option: hide_dialog_history_show_more', function () {

        cy.haRequest('kiosk_hide_dialog_history_show_more', true);

        cy
            .get('@states-divs')
            .eq(19)
            .click();

        cy.waitForDialogOpen();

        cy
            .get('@dialog-body')
            .find('ha-more-info-history')
            .shadow()
            .find('.header a')
            .should('not.be.visible');

        cy.compareSnapshot('hide_dialog_history_show_more');

        cy.haRequest('kiosk_hide_dialog_history_show_more', false);

	});

});