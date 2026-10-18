# W2 verification method

Application candidate: 79f503a270599a1c4ecbd4b9a4fa28cdc0e46fc8. Date: 18 October 2026. No application code was changed.

Use Node 24 and npm 11 with the lockfile. Execute npm test, npm run test:integration, npm run lint, npm run check:secrets, npm audit --omit=dev --json, npm audit --json, npm run build:simulation, npm run test:e2e, npm run test:performance and npm run test:recovery. Reports normally go to ignored test-results. The full audit exits nonzero for the retained development findings.

For this Windows run, Playwright used the same complete test directory, one worker and normal simulation base URL, with no grep or exclusions. Provider and Next.js were separately managed Node children; a temporary config set webServer undefined and JSON reporting. All cases completed and the runner exited 0. This avoids the prior Windows child-webServer shutdown delay without changing tests. Performance started a fresh provider with TEST_SEED_COUNT=1000 and invoked the existing performance.mjs after warmup. Those services were stopped afterwards. Recovery used a writable workspace TEMP/TMP directory; it remained isolated.

Public checks used unauthenticated GET against the homepage, login, session, staff directory with a fictional UUID and the attachment endpoint with that UUID. Save only status, safe error, content type and request identifier; no cookies or protected data. These reads do not establish authenticated behavior, migration installation or public-alias source identity. No hosted mutation or destructive recovery was run.

The selected browser-cases report omits raw traces and temporary screenshots. Historical reports remain unchanged. Preserve the recovery script's original workingTreeChanges field and interpret it with the source hash manifest, rather than rewriting emitted evidence.

PR evidence: https://github.com/RynoGz/SEN831_Group_F/pull/36 through /40. PR #37 review asks for migration 010 after merge; it does not confirm execution. PR #40 remains provisional and its older UI wording observation is not automatically current.

DOCX QA: the packaged renderer failed because LibreOffice is unavailable; Word COM export was denied by the sandbox. The actual DOCX was rendered with docx-preview in local Chromium, all five explicit pages inspected and no page overflow found. Native Word pagination was not independently checked.
