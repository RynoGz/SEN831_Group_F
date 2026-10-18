# W2 focused pagination follow up

Candidate: b5b5ecaa291aea7a49608768c904035a88f76f08 (PR #41). Local branch merged this main candidate before checking. Application and test sources were unchanged by this follow-up.

Migration 011: Willem explicitly confirmed applied on 18 October 2026 before hosted verification. Successful authenticated paginated API responses functionally confirm the new RPC is available. This is not an administrative migration-ledger inspection. GitHub Vercel status for candidate was success, target https://vercel.com/rynogzs-projects/sen-381-group-f/Cc7nDKQsBWSzhN2tytFrdYAeG4X2 . The stable production URL was used; an independent hosting-admin commit binding was not inspected.

## Execution

Eight local cases: `node --test --test-reporter=junit tests/integration/request-pagination.test.js`, using bundled Node 24 and isolated PGlite fixtures. First diagnostic run passed 8/8; a second focused run captured integration.xml. No full regression suite was repeated. PAGE01 traverses 1,258 owned records, PAGE02 finds an old literal record beyond the former cap, PAGE03 combines filters and totals, PAGE04/05 check scoped permissions, PAGE06 handles bounds, PAGE07 checks API boundary and PAGE08 preserves migration data/policies/history.

Hosted: `w2-pagination-followup.mjs` executed with Playwright and the existing browser installation. Supply the fictional-account password through W2_TEST_PASSWORD; credentials, tokens and cookies are not recorded. Method retains the exact workstation paths used for repeatability on this workstation. It only signs in and reads existing requests; no fixture creation, deployment, migration execution or cleanup. Ryno retains ownership of further cleanup.

13/13 hosted groups passed. Page size two traversed all accessible rows: requester 19, other requester 3, manager 25, staff 22, restricted staff 17. No duplicate IDs; repeated oldest page stable; category/status totals and summary-only work responses matched traversal. Each identity found its oldest reference with combined category/status filters; empty sets, clamped pages, four invalid inputs, disjoint requester populations, sensitive clearance, denied work and anonymous access checked. UI Next/Previous, reload and old-reference search passed. Results reflect the recorded time; concurrent writes can change offset pages.

Hosted populations were below 1,000; large-scale reachability is local evidence. Full performance, scheduled/hosted recovery, retention, natural token expiry and larger legacy attachment limits remain qualified. Historical W2 results and scripts are unchanged.

## Hash corrections and rendering

hash-corrections.json preserves the old three manifest values and SHA-256 corrections over exact committed blobs at 8fbb961e0bec01efac7b4c28176159f266c2a834. These scripts are unchanged in this follow-up. Git blob bytes avoid checkout newline/whitespace differences. The existing hosted manifest now contains the corrected values. New evidence hashes also use staged Git blob bytes, rather than checkout bytes; the manifest excludes itself.

Report QA: all seven pages rendered from actual DOCX using the existing docx-preview/Chromium fallback and visually inspected after font correction. The packaged renderer previously failed due to unavailable LibreOffice; native Word pagination remains unverified. No rendered intermediate is published as evidence.
