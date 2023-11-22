declare global {
  namespace Cypress {
    interface Chainable {
      ingress(params?: string[]): Chainable<void>;
      waitForHomeAssistantDOM(): Chainable<void>;
      clickEntity(index: number): Chainable<void>;
      checkOverflowMenuItem(
        entityIndex: number,
        dataSelector: string,
        snapshotName: string
      ): Chainable<void>;
      waitForDialogOpen(): Chainable<void>;
      waitForDialogClose(): Chainable<void>;
    }
  }
}

export {};