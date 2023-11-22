declare global {
  namespace Cypress {
    interface Chainable {
      ingress(): Chainable<void>;
      waitForHomeAssistantDOM(): Chainable<void>;
      clickEntity(index: number): Chainable<void>;
      checkOverflowMenuItem(
        entityIndex: number,
        dataSelector: string,
        snapshotName: string
      ): Chainable<void>;
    }
  }
}

export {};