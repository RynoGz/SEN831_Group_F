# CivicConnect

CivicConnect is Group F's SEN381 service request application. Requesters report issues and follow updates, staff handle authorised work, and managers oversee assignment, closure and service information.

## Final project baseline

- Final engineering record: [PED v4.0 PDF](Milestone_4/SEN381_CivicConnect_PED_v4.0.pdf) and [editable Word copy](Milestone_4/SEN381_CivicConnect_PED_v4.0.docx).
- Repository: [RynoGz/SEN831_Group_F](https://github.com/RynoGz/SEN831_Group_F).
- Assessed application commit: [`b5b5ecaa291aea7a49608768c904035a88f76f08`](https://github.com/RynoGz/SEN831_Group_F/commit/b5b5ecaa291aea7a49608768c904035a88f76f08), the reviewed PR #41 merge.
- Application version: **0.3.0**. The exact commit identifies the assessed product; the package version was not changed for documentation closure.
- Member evidence/documentation baseline: [`bd25d70`](https://github.com/RynoGz/SEN831_Group_F/commit/bd25d709b12eaa8ac99e2f21560de3c87f4ccbbf), after PRs #42 and #43. Application, test, migration, script and build/dependency contents are unchanged from the assessed application commit.
- Live demonstration: [sen-381-group-f.vercel.app](https://sen-381-group-f.vercel.app/).
- Final deployment decision: **controlled simulated-production demonstration over HTTPS using fictional data**, with real hosted Supabase Auth, Database and private Storage. The hosted app does not use the local simulation provider.
- Final acceptance: **97.01% scope completion**, **110 Met / 7 Partially Met / 0 Not Met**, across 117 applicable approved acceptance criteria. All 80 Must functional criteria are Met. The seven partial criteria are recorded in PED section 34.

The approved S2 snapshot was 96.58% with 109 Met and eight Partial criteria. Final README/PED integration closes its NFR-008 AC2 documentation inconsistency, giving (110 + 7 x 0.5) / 117 x 100 = 97.01%. Fully met criteria are reported separately as 94.02%. The Master Project Brief remains authoritative; PED v4.0 preserves the M1-M3 history and concludes the existing RTM and registers.

The release recommendation is bounded to the stated demonstration. It does not establish unrestricted production capacity, representative-user acceptance or scheduled hosted disaster recovery. Ryno confirmed approval of the merged work and authorised final document integration on 18 October 2026; actual contribution reviews remain in GitHub.

## Implemented application

- Sign-in, validated request submission, confirmation, automatic timestamp and initial Submitted status.
- Controlled categories; requester-owned lists/details; staff/manager access restricted by role, category and sensitive-information clearance.
- Request lists with server pagination, database-side search/status/category filters and stable ordering. Default 25 rows per page, maximum 100; filters and pages persist in the URL.
- Complete matching summary counts and management category/status totals across all authorised records, independent of the displayed page. The former 1,000-record cutoff is corrected by migration 011.
- Staff acceptance, eligible manager assignment/reassignment, required reassignment reasons, controlled progress, resolution and manager closure.
- Requester-visible updates, private staff comments/reasons and attributable lifecycle/assignment history. Reopening requests are recorded; automatic reopening is not claimed.
- One private PDF, PNG or JPEG attachment per request, up to **4 MiB (4,194,304 bytes)** for new uploads, with matching signatures, bounded body validation, protected download and truthful cleanup handling.
- Atomic workflow changes and version checks that reject stale updates with a reload message.
- Responsive pages, keyboard feedback, reduced motion, expired-session recovery and retained form input after failed submission.

The architecture remains a **modular monolith with layers**: presentation, protected entry points, workflow services, domain rules and Supabase adapters in one Next.js application. The stack is JavaScript, Next.js 16.3.8, React 19.3.0 and Supabase PostgreSQL/Auth/private Storage. Use **Node.js 24.x and npm 11.x**, with the committed lockfile.

## Hosted setup and Vercel

Install dependencies with `npm ci`. Copy `.env.example` to the ignored `.env.local` if creating a new local environment:

```powershell
Copy-Item .env.example .env.local
```

Set the intended hosted project's public client settings:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never commit environment files, passwords, tokens or privileged credentials. Normal application runtime needs no service-role key or direct database connection string. Privileged keys must never use a NEXT_PUBLIC_ name.

On Vercel select the repository root, Next.js and Node.js 24. [vercel.json](vercel.json) uses `npm ci` and `npm run build`. Set the public variables separately for the intended Preview and Production environments, then redeploy after environment changes. Production follows the team's reviewed main branch. Do not set local simulation values or use `build:simulation` on Vercel.

The assessed candidate has successful Vercel status: [deployment Cc7nDKQsBWSzhN2tytFrdYAeG4X2](https://vercel.com/rynogzs-projects/sen-381-group-f/Cc7nDKQsBWSzhN2tytFrdYAeG4X2). Source identity follows the recorded status and team handoff; no separate hosting-admin inspection is claimed. Later documentation-only deployments do not change the application evidence.

### Database migrations

For a new hosted project apply the SQL files under [supabase/migrations](supabase/migrations) in numeric order:

| Migration | Purpose |
| --- | --- |
| 001 | Initial request/category/status/requester schema |
| 002 | Initial status history |
| 003 | Request ownership RLS |
| 004 | Secure status triggers |
| 005 | Roles, scopes, workflow, history and versioned operations |
| 006 | Private attachments and linking/storage access |
| 007 | Controlled reassignment reason |
| 008 | Prompt PT409 business-version conflict response |
| 009 | Trusted authenticated request creation timestamps |
| 010 | Private bucket limit for new 4 MiB uploads |
| 011 | Complete scoped pagination, filtering and aggregate totals |

Apply only missing reviewed migrations to an existing project. The W2 handoff confirms hosted 009-011, and the successful paginated API functionally supports 011 availability; no independent administrator migration-ledger inspection was recorded. For an authorised, linked Supabase CLI environment:

```bash
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
```

Inspect the dry run first. If manually applied older migrations appear pending, reconcile the actual schema and migration history with the database operator rather than blindly replaying them or marking unknown changes applied.

### Accounts and permissions

Create fictional users in Supabase Auth. Submitting accounts need a matching `public.requesters` row. Staff/managers need `public.service_members` entries and explicit category scopes in `public.service_scopes`. Use [the provisioning example](supabase/m3-test-users.example.sql) with actual Auth UUIDs. An Auth account alone does not grant a requester profile or operational role.

Managers can assign only staff eligible for the request category and sensitivity. Hosted scopes differ from local fixtures; inspect the actual directory instead of assuming Maintenance or a role name implies clearance. The team provides assessor account access separately; hosted passwords are not committed here.

### Run locally against hosted Supabase

```bash
npm run dev -- --hostname 127.0.0.1 --port 3104
```

Open [http://127.0.0.1:3104](http://127.0.0.1:3104). For a hosted-configuration production build:

```bash
npm run build
npm start -- --hostname 127.0.0.1 --port 3104
```

Public settings are embedded at build time. Stop the relevant production server and rebuild before switching provider environments. Plain `npm run dev` defaults to port 3000 and does not start the simulation provider.

## Optional local simulation

Local simulation remains repeatable CI and rehearsal infrastructure. It runs separately from Vercel:

```bash
npm ci
npm run build:simulation
npm run staging:simulation
```

Open [http://127.0.0.1:3103](http://127.0.0.1:3103). The provider runs on 54329 and applies actual SQL migrations/policies to a temporary PGlite database with simulated Auth and file storage. Restarting clears temporary requests and attachments. Leave the staging terminal running; Ctrl+C stops it. All presenters sharing a simulated request must use the same running provider.

These **simulation-only** accounts use `Fictional-test-password-1!`:

| Account | Purpose |
| --- | --- |
| requester@example.test | Submit and retrieve owned requests |
| other@example.test | Different requester for isolation checks |
| staff@example.test | Maintenance staff with sensitive clearance |
| manager@example.test | Maintenance manager without sensitive clearance |
| restricted@example.test | Maintenance staff without sensitive clearance |
| admin@example.test | Administration without automatic request access |

Staff/manager fixtures have no requester profile, so submit through a requester. Use a non-sensitive Maintenance request for the shared workflow. These are not hosted credentials. Ordinary simulation restart is not backup/recovery evidence.

## Verification and evidence

Unit/database tests need no hosted keys. Stop manual simulation servers first because browser/performance commands start their own services on ports 3103 and 54329:

```bash
npm run lint
npm run check:secrets
npm audit --omit=dev --audit-level=high
npm test
npm run test:integration
npx playwright install chromium
npm run build:simulation
npm run test:e2e
npm run test:performance
npm run test:recovery
```

Browser tests use the production simulation and seed 3,300 fictional requests; performance uses its separately recorded dataset. Reports go to ignored `test-results`. Running these commands does not automatically replace dated submitted evidence. The [quality workflow](.github/workflows/m3-quality.yml), historically named M3, remains the application gate on PRs and main.

| Evidence | Recorded result and scope |
| --- | --- |
| [PR41 implementation and local verification](Milestone_4/M4_Request_Pagination_and_Reporting.md) | 32 unit + 39 database + 25 browser cases passed; 96 unique local cases, including pagination, permissions and 3,300 seeded browser records. |
| [CI32](https://github.com/RynoGz/SEN831_Group_F/actions/runs/39145690243) | Passed configured build, lint, secret/dependency, unit/database/browser, performance and recovery gates for PR41. |
| [Pagination reports](Milestone_4/Verification/2026-10-18_Pagination) | Selected local paginated-read p95 235.52 ms; 60 reads, three identities, zero errors over a 3,300-record seed. Not a full hosted workload. |
| [W2 quality closure](Milestone_4/M4_Quality_and_Release_Closure.docx) | Earlier regression and authorised HTTPS workflows retained with initial harness failures and corrected follow-ups. |
| [W2 pagination follow-up](Milestone_4/Verification/2026-10-18_W2_Pagination_Followup) | Eight focused local cases and 13 read-only hosted groups passed for the assessed candidate. Hosted populations were below 1,000; local traversal proved 1,258 owned records. |
| [W2 historical reports](Milestone_4/Verification/2026-10-18_W2) | Earlier performance p95 65.94 ms and local recovery 380.25 ms / simulated loss 388 ms retain their original candidate and bounded scenario. |
| [Approved S2 assessment](Milestone_4/M4_Data_and_Acceptance_ClosureFinal.docx) | Criterion scores and evidence, with its 96.58% snapshot. Final PED documents the subsequent README/PED consistency correction. |
| [M3 historical evidence](Milestone_3/Verification_2026-10-15_Final) | Preserved original regression, hosted, performance, recovery and source hashes; not a new measurement of the final application. |

Repeated W2 checks are not added to the 96-case total as new unique tests. Contract fixtures explicitly simulate selected interface failures/loading/empty states. The full hosted pagination follow-up did not create or clean up fixtures. No application tests were rerun solely for this final documentation integration; unchanged source and existing verified evidence support the record.

## Final limitations

- NFR-004 AC1/AC4: representative-user task evaluation is not evidenced, although scripted interface/hosted tasks pass.
- NFR-006 AC1/AC2/AC3: the full 1,000-record, three-concurrent-user retrieval/search/filter/sort/management workload and submission target are not established. Local page timing and small-data hosted checks do not prove sustained cloud capacity.
- NFR-007 AC1/AC4: controlled local recovery passes, but reliable scheduling, coordinated hosted Database/Auth/Storage recovery and the documented working-target/platform review remain incomplete.
- A final retention duration is unresolved; no automatic deletion policy or infinite-storage promise is introduced.
- Natural hosted token expiry/transparent renewal was not forced; sign-out, denied access and re-entry were checked.
- No global bucket inventory or requester-visible hosted legacy attachment above 4 MiB was verified. New uploads use 4 MiB; historical objects are preserved.
- Offset pages may shift during concurrent writes and do not provide a frozen multi-page snapshot.
- The historical post-workload timeout remains unexplained despite passing focused 409 retests.
- The recorded production audit has zero findings; five high-severity development dependency findings remain. Secret scanning is a bounded heuristic, not a penetration or full-history audit.
- Production monitoring and broader operational acceptance are not inferred from the controlled demonstration.

The old 1,000-record application cutoff is **resolved**, not a current limitation. PED sections 20, 34 and 38 give final statuses and owners. Four labelled W2 fixtures remain in terminal states by agreement; further cleanup is controlled separately.

## Repository and team

```text
src/app/                         Pages and protected API routes
src/components/                  Shared interface components
src/domain/requests/             Lifecycle, reason and reporting rules
src/features/requests/           Request form, validation and entry points
src/features/workflow/           Services, pagination and role-aware workspaces
src/features/attachments/        Private attachment adapter
src/lib/supabase/                Browser/server clients
src/proxy.js                     Session refresh boundary
supabase/migrations/             Reviewed migrations 001 through 011
supabase/m3-test-users.example.sql Hosted provisioning example
tests/                           Unit, database and browser tests; provider
scripts/                         Build, staging, verification and local recovery
.github/workflows/               Quality gate
Milestone_1/                     Historical PED v1.0 and original baseline
Milestone_2/                     Historical PED v2.0 and design contributions
Milestone_3/                     Historical PED v3.0 and dated M3 evidence
Milestone_4/                     Final PED v4.0, closure contributions and evidence
```

| Member | Final contribution |
| --- | --- |
| Ryno Goetz | Architecture/setup/frontend, integration, deployment handoff, pagination/reporting correction and final PED/README |
| Steven Riaan Piek | Data/backend integrity, directory/session work, requirements traceability and criterion-level acceptance |
| Willem Booysen | Design rules, private attachments, verification, CI and quality/release conclusions |

All members must understand the combined product. The team process requires focused branches, meaningful commits, passing agreed checks and both non-author reviews for substantive PRs. Reviews and merges for the final contributions are recorded in PRs #37-43. Material AI assistance and actual verification are disclosed in the PED; students remain responsible for understanding and defending the work.

## Final submission and presentation

Submit PED v4.0, this repository URL, the exact assessed commit/tag/release identifier and the assessor access information required by the portal. The final RTM and registers are continued in the PED; no disconnected duplicate report or source-code ZIP is required unless specifically requested. The final product demonstration and individual engineering defence are live. Earlier milestone files remain historical baselines.
