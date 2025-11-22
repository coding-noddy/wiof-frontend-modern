#!/usr/bin/env node
/**
 * Pre-deploy safety check
 * - Ensures `firebase/firebase.config.ts` points to the staging project.
 * - Allows override when ALLOW_PROD_DEPLOY=true (set in CI secrets for controlled prod deploys).
 */
const fs = require('fs');
const path = require('path');

const ALLOW = process.env.ALLOW_PROD_DEPLOY === 'true' || process.env.CI_ALLOW_PROD === 'true';
if (ALLOW) {
  console.log('ALLOW_PROD_DEPLOY set — allowing deploy (trusted override).');
  process.exit(0);
}

const configPath = path.resolve(__dirname, '..', 'firebase', 'firebase.config.ts');
if (!fs.existsSync(configPath)) {
  console.error('ERROR: firebase config not found at', configPath);
  process.exit(1);
}

const content = fs.readFileSync(configPath, 'utf8');
const m = content.match(/projectId\s*:\s*['"]([^'"]+)['"]/);
if (!m) {
  console.error('ERROR: Could not find projectId in firebase.config.ts — aborting deploy.');
  process.exit(1);
}

const projectId = m[1];
const allowedStaging = ['wiof-modern-staging', 'wiof-staging'];
if (!allowedStaging.includes(projectId)) {
  console.error(`ERROR: Blocked deploy — firebase.config.ts projectId = "${projectId}".`);
  console.error('Only staging project IDs are allowed by default to prevent accidental production deploys.');
  console.error('If you intend to deploy to production, set ALLOW_PROD_DEPLOY=true in CI or use a protected release pipeline.');
  process.exit(1);
}

console.log(`Detected staging project "${projectId}". Deploy allowed.`);
process.exit(0);
