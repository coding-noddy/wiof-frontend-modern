# Deployment Guide — Staging (and safety notes)

This document explains how to build and deploy the `wiof-frontend-modern` application to the staging Firebase project and the safety measures we put in place to prevent accidental production deployments.

This repo is configured to contain only the staging Firebase configuration. Production credentials must never be committed — use CI secrets or a secrets manager for production deploys.

## Quick summary
- Staging project id: `wiof-modern-staging`
- Pre-deploy safety check: `scripts/check-deploy.js` (runs automatically from `npm run firebase:deploy`)
- CI workflow: `.github/workflows/deploy-staging.yml` — builds and deploys to staging on push to `main` or manual dispatch

---

## Local staging deploy (developer)

1. Build the app locally:

```cmd
cd C:\Users\nmaul\wiof-frontend-modern
npm ci
npm run build
```

2. Ensure `firebase` CLI is installed and you're logged in:

```cmd
npm install -g firebase-tools
firebase login
```

3. Run the deploy (the safety check runs automatically):

```cmd
npm run firebase:deploy -- --only hosting
```

Notes:
- The project contains `.firebaserc` which maps the default Firebase project to `wiof-modern-staging`.
- `npm run firebase:deploy` executes `npm run check-deploy` first; that script blocks deploys unless the projectId in `firebase/firebase.config.ts` is a known staging project id or the environment variable `ALLOW_PROD_DEPLOY=true` is present.

## Non-interactive CI deploy (recommended)

The repository contains a GitHub Actions workflow at `.github/workflows/deploy-staging.yml`. To run the workflow non-interactively you must add the following secret to the repository:

- `FIREBASE_TOKEN` — generate locally with:

```bash
# Run locally (your browser will open and ask you to login)
firebase login:ci
# Copy the token printed by the command and add it to GitHub Secrets
```

Add the `FIREBASE_TOKEN` secret in GitHub: Settings → Security → Secrets and variables → Actions → New repository secret.

Once the secret is present you can:
- Push to `main` (the workflow triggers on `push` to `main`).
- Or trigger the workflow manually from the Actions tab (select "Build and Deploy to Staging" → Run workflow).

## Allowing deliberate production deploys (VERY careful)

We intentionally removed production config from the repo. If you do need to run a production deploy from CI, follow these rules:

1. Do NOT set `ALLOW_PROD_DEPLOY` as a regular secret available to all workflows. Instead create a GitHub environment (Environments → Production) and add `ALLOW_PROD_DEPLOY` as a secret scoped to that environment only.
2. Protect the `production` environment so only approved reviewers can run jobs that access the secret.
3. The deploy job should run only on a protected branch or as a manual workflow with required approvals.

Example (CI job) snippet:

```yaml
env:
  ALLOW_PROD_DEPLOY: ${{ secrets.ALLOW_PROD_DEPLOY }}
# The job must target the protected environment that contains the secret
environment: production
```

Alternatively, use a short-lived service account token and rotate it regularly.

## Safety checklist for maintainers

- [ ] Do not commit production credentials.
- [ ] Keep `firebase/firebase.config.ts` staging-only in the repo.
- [ ] Store any production tokens or service-account keys in the CI secret manager or a dedicated secret store.
- [ ] Use GitHub Environments and required reviewers for any job exposing `ALLOW_PROD_DEPLOY`.
- [ ] Rotate tokens if they become public or after a key user leaves.

## Troubleshooting

- If the pre-deploy script prints `Blocked deploy — firebase.config.ts projectId = "..."`, verify `firebase/firebase.config.ts` contains the staging project id and try again.
- If the workflow fails during `npm run build`, check Actions logs for the Angular build error. Building locally (`npm run build`) often gives faster iteration.
- For non-interactive CI deploys ensure `FIREBASE_TOKEN` is valid (regenerate with `firebase login:ci` if needed).

## Next steps / recommendations

- Add a PR workflow that runs `ng build --noEmit` and linter on every PR to catch TypeScript and lint issues early (we have this on the todo list).
- Add a monitoring page in staging to verify health after deploy.

---

If you want, I can also add a short PR template reminding contributors not to commit prod credentials and a GitHub Environment for `production` with reviewers configured.
