/**
 * Cypress configuration for Equatorial Coffee Website
 * 
 * Production-ready E2E testing setup with performance and
 * accessibility testing capabilities.
 */
import { defineConfig } from 'cypress';
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse';
import { pa11y } from '@cypress-audit/pa11y';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    
    // Enhanced error reporting
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    
    // Setup for audit checks (lighthouse, pa11y)
    setupNodeEvents(on, config) {
      on('before:browser:launch', (_browser, launchOptions) => {
        prepareAudit(launchOptions);
        return launchOptions;
      });
      
      // Register performance and accessibility audits
      on('task', {
        lighthouse: lighthouse({
          performance: 90,
          accessibility: 90,
          'best-practices': 85,
          seo: 90,
          pwa: 50,
        }),
        pa11y: pa11y(),
      });

      // Custom tasks for tracking performance metrics
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });
      
      return config;
    },
  },
  
  // Component testing configuration
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },

  // Retry settings for better stability in CI
  retries: {
    runMode: 2,
    openMode: 0,
  },

  // Enhanced screenshot quality
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  trashAssetsBeforeRuns: true,
  
  // Accessibility standards
  includeShadowDom: true,
});
