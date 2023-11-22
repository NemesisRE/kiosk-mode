describe('Kiosk-mode: More-info Dialogs', () => {

    beforeEach(() => {

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
            .as('dialog-header');

        cy
            .get('@dialog-header')
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

    it('By default all elements should be visible', () => {

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

    it('Option: hide_dialog_header_history', () => {

        cy.clickEntity(16);

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

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.clickEntity(16);

	});


    it('Option: hide_dialog_header_settings', () => {

        cy.clickEntity(17);

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

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.clickEntity(17);

	});

    it('Option: hide_dialog_header_overflow', () => {

        cy.clickEntity(18);

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

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.clickEntity(18);

	});

    it('Option: hide_dialog_header_action_items', () => {

        cy.clickEntity(19);

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

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.clickEntity(19);

	});

    it('Option: hide_dialog_history', () => {

        cy.clickEntity(20);

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

        cy.clickEntity(20);

	});

    it('Option: hide_dialog_attributes', () => {

        cy.clickEntity(20);
        cy.clickEntity(22);

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

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.clickEntity(20);
        cy.clickEntity(22);

	});

    it('Option: hide_dialog_history_show_more', () => {

        cy.clickEntity(25);

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

        cy
            .get('@close-dialog')
            .click();

        cy.waitForDialogClose();

        cy.clickEntity(25);

	});

});