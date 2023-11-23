declare global {
  namespace Cypress {
    interface Chainable {
      ingress(params?: string[]): Chainable<void>;
      waitForHomeAssistantDOM(): Chainable<void>;
      haRequest(entity: string, state: boolean): Chainable<void>;
      checkOverflowMenuItem(
        entity: string,
        dataSelector: string,
        snapshotName: string
      ): Chainable<void>;
      waitForDialogOpen(): Chainable<void>;
      waitForDialogClose(): Chainable<void>;
    }
  }
}

export {};