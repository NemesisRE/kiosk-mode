import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin';

export default defineConfig({
  env: {
    type: 'actual',
    screenshotsFolder: './cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    video: false,
    failSilently: false,
    ALWAYS_GENERATE_DIFF: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      getCompareSnapshotsPlugin(on, config);
      return config;
    },
    baseUrl: 'http://localhost:8123',
    testIsolation: true,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 15000
  },
  screenshotOnRunFailure: true,
  retries: {
    runMode: 2,
    openMode: 2
  }
});
