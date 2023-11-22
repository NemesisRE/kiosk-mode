import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  env: {
    type: 'base',
    screenshotsFolder: './cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    video: false,
    failSilently: false,
    ALWAYS_GENERATE_DIFF: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
      return config;
    },
    testIsolation: false,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 15000
  },
  screenshotOnRunFailure: false,

});
