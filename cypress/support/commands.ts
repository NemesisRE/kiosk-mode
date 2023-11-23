/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import 'cypress-wait-until';
import compareSnapshotCommand from 'cypress-visual-regression/dist/command';

compareSnapshotCommand({
    capture: 'viewport',
    errorThreshold: 0.25
});

const HA_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzM2U0OGE1Nzk4NDU0YTI5YTBkZjgxMTlkZjgzMmRjMSIsImlhdCI6MTcwMDcwNzIwMiwiZXhwIjoyMDE2MDY3MjAyfQ.JTRycmen2kDa74OVUe_y1IEXE4aiKH7Hnhw6Wx5u5Bg';

Cypress.Commands.add('haRequest', function (entity: string, state: boolean) {

    cy.request({
        url: `/api/services/input_boolean/turn_${state ? 'on' : 'off'}`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HA_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: {
            entity_id: `input_boolean.${entity}`
        }
    });

    cy.wait(100);

});

Cypress.Commands.add('ingress', function (params: string[] = []) {

    const urlParams = params.reduce((acc: Record<string, string>, param: string): Record<string, string> => {
        acc[param] = '';
        return acc;
    }, {} as Record<string, string>);

    cy
        .visit('/', {
            qs: urlParams
        });

    cy.waitForHomeAssistantDOM();

});

Cypress.Commands.add('waitForHomeAssistantDOM', function() {

    cy.waitUntil(function() {
        return cy
            .get('home-assistant')
            .shadow()
            .find('home-assistant-main')
            .shadow()
            .find('ha-drawer partial-panel-resolver ha-panel-lovelace')
            .shadow()
            .find('hui-root')
            .shadow()
            .find('hui-masonry-view')
    });

    cy
        .get('home-assistant')
        .shadow()
        .as('home-assistant')

        .find('home-assistant-main')
        .shadow()
        .find('ha-drawer')
        .as('ha-drawer')

        .find('ha-sidebar')
        .as('ha-sidebar');

    cy
        .get('@ha-drawer')
        .find('ha-panel-lovelace')
        .shadow()
        .find('hui-root')
        .shadow()
        .as('hui-root')

        .find('hui-masonry-view')
        .shadow()
        .find('hui-entities-card')
        .shadow()
        .find('#states div')
        .as('states-divs');

    cy
        .get('@hui-root')
        .find('.header .action-items ha-button-menu')
        .as('overflow-menu')

        .shadow()
        .find('mwc-menu')
        .shadow()
        .find('mwc-menu-surface')
        .as('overflow-menu-surface');

});

Cypress.Commands.add('checkOverflowMenuItem', function(
    entity: string,
    dataSelector: string,
    snapshotName: string
) {

    cy.haRequest(entity, true);

    cy
        .get('@overflow-menu')
        .click();

    cy
        .get('@overflow-menu-surface')
        .should('have.attr', 'open');

    cy
        .get('@overflow-menu')
        .find(`mwc-list-item[data-selector="${dataSelector}"]`)
        .should('be.hidden');

    cy.compareSnapshot(snapshotName);

    cy.haRequest(entity, false);

});

Cypress.Commands.add('waitForDialogOpen', function() {

    cy.waitUntil(function() {
        return cy
            .get('home-assistant')
            .shadow()
            .find('ha-more-info-dialog')
            .shadow()
            .find('ha-dialog')
            .should('have.attr', 'open')
    });

});

Cypress.Commands.add('waitForDialogClose', function() {

    cy.waitUntil(function() {
        return cy
            .get('home-assistant')
            .shadow()
            .find('ha-more-info-dialog')
            .shadow()
            .children()
            .should('have.length', 0)
    });

});