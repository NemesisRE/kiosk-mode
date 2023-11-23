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
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.args.push('--window-size=1280,768')
        launchOptions.args.push('--force-device-scale-factor=2');
        launchOptions.args.push('--disable-gpu');
        launchOptions.args.push('--force-color-profile=srgb');
        return launchOptions;
      });
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
