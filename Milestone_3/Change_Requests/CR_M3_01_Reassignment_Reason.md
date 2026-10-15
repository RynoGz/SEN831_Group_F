# CR-M3-01 Reassignment reason

## Change control record

| Field | Record |
| --- | --- |
| Date | 15 October 2026 |
| Type | Simulated client change request jointly selected by all three team members |
| Request source | Ryno Goetz, Steven Riaan Piek and Willem Booysen jointly decided on the reassignment-reason change |
| Implementation approval | Ryno Goetz, Steven Riaan Piek and Willem Booysen jointly approved implementation on 15 October 2026 |
| External approval | This request is not represented as issued or approved by the lecturer or an external client |
| Implementation branch | Ryno_branch |
| Peer review and merge | Not completed by this local implementation record; the implementation remains subject to the existing two non-author review process |
| Governing baseline | Master Project Brief section 20.3; PED v2.0 FR-009, FR-016, NFR-001, NFR-002, NFR-003, NFR-005 and NFR-008 |

## Formal simulated request

When a manager changes a request from one responsible staff member to another, require a reason for the change. Record that reason with the assignment so that authorised users can understand why responsibility changed. First assignment must remain possible without a reason. Preserve existing permissions, internal-note visibility and request history.

## Before and after

Previously, a permitted reassignment could be saved without an explanation. An optional assignment note was stored as a comment, but the assignment record did not contain the reason.

After this change, a different assignee requires a non-whitespace reason of no more than 4,000 characters. Initial assignment and retaining the same assignee keep the note optional. Accepted assignment notes are stored with the new assignment, its actor and timestamp; the existing comment record is retained. Earlier assignments and comments are preserved. Legacy rows have no invented reason.

## Controlled acceptance criteria

FR-009 retains its original five acceptance criteria. CR-M3-01 adds supplemental criterion AC6: changing an existing responsible staff member to a different staff member requires a valid reason, saved with the attributable assignment history. The existing FR-009 permission criteria remain authoritative.

| Case | Required outcome |
| --- | --- |
| First assignment with no reason | Permitted when the existing role, category, sensitivity and lifecycle rules allow it |
| Save the same assignee | Reason remains optional |
| Different assignee with an omitted, empty or whitespace-only reason | Rejected before mutation; assignment, target, lifecycle and version remain unchanged |
| Valid reason | Trimmed and saved with the new assignee, acting user and assignment timestamp |
| Length boundary | 4,000 ASCII characters accepted; 4,001 rejected. Browser and service validation also bound JavaScript input length |
| Existing assignment history | Retained without rewriting prior reasons or inventing missing ones |
| Unauthorised, out-of-scope or stale operation | Rejected even when a valid reason is supplied |
| Internal reason | Available only to authorised operational users; not disclosed through requester history or direct column reads |
| Requester-visible reason | Visible through the authorised request detail and assignment history |

## Impact analysis

| Area | Impact and decision |
| --- | --- |
| Business need | Extends accountability for changes in responsibility under NEED-005 and NEED-008 |
| Requirements | FR-009 receives AC6; FR-016 and NFR-003 gain reason-history evidence. Stable requirement IDs and original acceptance criteria are retained |
| Interface | The existing Assignment form identifies required reassignment reasons, shows inline errors, focuses the reason field and preserves input after failure. Assignment history displays saved reasons with actors and timestamps |
| Application boundary | Shared assignmentReasonError supports browser and server checks. The database independently enforces the rule so direct RPC callers cannot bypass it |
| Persistence | Additive migration 007 adds reason and reason_requester_visible to assignments, updates the existing atomic workflow function and adds m3_assignment_history |
| Privacy and access | Existing manager/staff powers, category scopes and sensitive clearance are retained. Direct access to the new reason columns is restricted. The history RPC returns internal reasons only to callers allowed to work on the request |
| Integration | The request-detail service reads assignment history through the protected RPC. The simulation provider implements the same RPC contract |
| Verification | Unit boundary cases, database policy/transaction cases, migration-upgrade testing, a browser/API journey and recovery regression cover the change |
| Architecture and decisions | The modular monolith, ADR-001, ADR-002 and central lifecycle policy remain. D10 gains the assignment-history contract; D12 gains migration 007. A separate architecture ADR is unnecessary for this bounded extension |
| Dependencies and cost | No package or paid service is added. Change cost is limited to the existing form, service, migration, simulator and verification records; no unmeasured effort estimate is claimed |
| Delivery | Apply migration 007 before deploying the changed service. A fresh database requires migrations 001 through 007 in order |

## Implementation evidence

| Responsibility | Repository evidence |
| --- | --- |
| Shared validation | src/domain/requests/assignment-reason.js |
| Server validation and protected history | src/features/workflow/service.js |
| Form, inline feedback and history | src/features/workflow/request-workspace.js |
| Persistent enforcement and privacy | supabase/migrations/007_m3_reassignment_reason.sql |
| Local provider contract | tests/support/provider.mjs |
| Migration-aware fixtures | tests/support/database.js |

## Requirement and verification trace

| Requirement or concern | Test evidence | Expected result |
| --- | --- | --- |
| FR-009 AC6 and first-assignment compatibility | CR01, CR02, CR03; CRDB01, CRDB02, CRDB04 | Optional first note; required valid reassignment reason; clear boundaries |
| FR-016 and NFR-003 attributable history | CRDB03; CRE2E01 | Original assignment retained; new assignee, reason, actor and timestamp retrievable after reload |
| NFR-001 permissions and NFR-005 stale updates | CRDB05 | A reason does not bypass authority, scope or expected version |
| NFR-002 internal information | CRDB06 | Internal reason hidden from requesters and protected against direct column reads |
| NFR-005 atomicity | CRDB02, CRDB04, CRDB05 | Failed operations preserve request and assignment state |
| NFR-008 controlled migration | CRDB07 | Existing assignment data and comments survive the upgrade; new rule then applies |
| NFR-004 form feedback | CRE2E01 | Required-field error is visible and associated; focus moves to the reason; mobile layout remains usable |
| NFR-007 recovery regression | scripts/test-recovery.mjs | Reassignment reason survives snapshot/restore with its visibility restrictions |

Unit cases are in tests/assignment-reason.test.js, database cases in tests/integration/reassignment.test.js, and the browser/API journey in tests/e2e/workflow.spec.js. Execution results are indexed in ../Verification_2026-10-15/verification-summary.json. Earlier 13 October reports remain historical evidence.

## Risk and debt continuation

R11 remains open: reason, assignee, actor and request version must remain consistent. Failed-write tests and the transaction boundary mitigate it. R12 remains open: concurrent managers can act on stale data; expected-version validation is retained. R3 and R14 remain open: the new history boundary could expose internal information; protected RPC access and direct-read denial are explicitly tested. Hosted migration application and hosted provider parity remain unverified by the local tests.

The new RPC adds a small compatibility obligation. Consumers must use m3_assignment_history for reason-bearing history; direct select of every assignments column is intentionally denied to authenticated clients. Public legacy metadata columns retain column-level read permission under the existing row policy. No existing risk is automatically closed and no acceptance criterion is waived.

## Deployment and rollback

The local database fixture applies the new migration automatically when the simulation starts. This does not apply it to a hosted Supabase project. A trusted operator applies migration 007 after 001 through 006 before deploying this version there.

For a controlled rollback, pause writes and preserve a coordinated pre-change backup of the database, attachments and configuration. Restore that pre-change database snapshot and the matching application release together. Do not deploy the old detail service alone against the migrated database: it selects every assignment column, which the new reason-column protections intentionally prohibit. A forward correction retaining history protection is preferable when preserving post-change data. Backup timing and post-backup data loss must be assessed before any restore. No destructive rollback or hosted migration was executed here.

## Verification finding and correction

The initial browser run passed the seven existing cases but failed CRE2E01 because its broad alert selector also matched the Next.js route announcer. This was a test-selector ambiguity, not evidence that reassignment validation accepted blank input. The selector was narrowed to the associated assignment-error element and the suite was rerun. The authentic initial report is retained as ../Verification_2026-10-15/e2e-initial-selector-failure.json.

## AI assistance and human accountability

Ryno authorised Codex implementation on 15 October 2026. Codex inspected the existing workflow and privacy policy, implemented the change and tests, corrected the browser selector and prepared this impact/traceability record. Automated checks provide the recorded verification; they do not replace the two independent PR reviews or lecturer acceptance of the simulated scenario. Ryno and the team remain accountable for reviewing and submitting the change.

## Execution outcome on 15 October 2026

24 unit, 21 database integration and 8 browser/API cases passed: 53 cases in total. Lint, the secret-pattern scan, simulation production build and strict UI audit passed. The 1,000-request recovery regression passed, including restored reassignment reasons and private visibility. Restore and validation took 483.05 ms with a measured simulated loss window of 495 ms. The local listing performance scenario passed with a p95 of 72.13 ms, 60 samples and zero errors. Production audit findings are recorded in the evidence summary. Hosted behavior, operational backup scheduling, final peer review and remote CI are not inferred.
