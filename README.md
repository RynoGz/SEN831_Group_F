# CivicConnect

CivicConnect is Group F's SEN381 service request application. Requesters report issues and follow updates, staff handle authorised work, and managers oversee assignment, closure and service information.

## Milestone 3 baseline

The current engineering document is [PED v3.0 PDF](Milestone_3/SEN381_CivicConnect_PED_v3.0.pdf), with an [editable Word copy](Milestone_3/SEN381_CivicConnect_PED_v3.0.docx). It continues the M1/M2 requirements and project history. The Master Project Brief remains the governing source.

- Application version: **0.3.0**.
- Verified application commit: [374c21e7c2b3d9ecc01add9ec2b957ca53139a97](https://github.com/RynoGz/SEN831_Group_F/commit/374c21e7c2b3d9ecc01add9ec2b957ca53139a97).
- Integration: [PR #34](https://github.com/RynoGz/SEN831_Group_F/pull/34), approved by Steven and Willem and merged into main as 9e71bd9f230328ef4a0268c64402b370c9ae20ea.
- CI: [M3 quality gate run #13](https://github.com/RynoGz/SEN831_Group_F/actions/runs/38874694724) passed for the verified application commit.
- Release classification: **CONDITIONALLY READY for the defined M3 demonstration**. Remaining acceptance and operational limits are recorded in PED sections 19, 28, 29 and 32. This is not a production-readiness claim.

## Implemented application

- Sign-in, request submission, required-field/category validation, saved confirmation, automatic time and initial Submitted status.
- Requester-owned lists/details and staff/manager work restricted by role, category and sensitive-information clearance.
- Assignment and controlled status changes through Submitted, Accepted, Assigned, In Progress, Resolved and Closed, with rejection from Submitted.
- Required reasons when replacing an existing assignee, with attributable history under [CR-M3-01](Milestone_3/Change_Requests/CR_M3_01_Reassignment_Reason.md).
- Public updates, internal comments, resolution/closure notes and recorded reopening requests.
- One private PDF, PNG or JPEG attachment per request, up to 5 MiB, with size/type checks, protected download and cleanup handling.
- Search, filters, sorting and scoped management summaries, including overdue work.
- Atomic changes, status history and version checks that reject stale updates with a reload message.
- Responsive pages, keyboard feedback and reduced-motion support for the tested tasks.

The architecture remains a **modular monolith with layers**: one Next.js application with separate presentation, protected entry points, workflow services, domain rules and Supabase adapters. The stack is JavaScript, Next.js 16.3.8, React 19.3.0 and Supabase PostgreSQL/Auth/private Storage. Use **Node.js 24.x and npm 11.x**; the lockfile records resolved packages. Vercel remains a hosting option; no public production deployment is claimed.

## Option 1 Local simulation for the M3 demonstration

From the repository root:

```bash
npm ci
npm run build:simulation
npm run staging:simulation
```

Open **[http://127.0.0.1:3103](http://127.0.0.1:3103)**. Leave the terminal running; Ctrl+C stops staging.

The simulation starts the production application build on **3103** and its provider on **54329**. It applies the actual SQL migrations and access policies to a temporary PostgreSQL-compatible PGlite database, with simulated authentication and temporary file storage. It needs no hosted keys. Restarting clears its temporary requests and attachments.

All these local accounts use **Fictional-test-password-1!**:

| Account | Role and access |
| --- | --- |
| requester@example.test | Submit and retrieve owned requests |
| other@example.test | A different requester for denied-access checks |
| staff@example.test | Maintenance staff with sensitive clearance |
| manager@example.test | Maintenance manager without sensitive clearance |
| restricted@example.test | Maintenance staff without sensitive clearance |
| admin@example.test | Administration without automatic operational request access |

Staff and manager fixtures have no requester profile, so submit through a requester. Use a **non-sensitive Maintenance request** for the shared demonstration. Use separate browser profiles or sign out before switching users. All presenters must continue the same running simulation to share the same request data.

These are simulation accounts, not hosted Supabase credentials. Local simulation does not establish hosted authentication security, cloud performance, scheduled backups or hosted disaster recovery.

## Option 2 Use hosted nonproduction Supabase

Install dependencies with npm ci if needed. Copy the environment template:

```powershell
Copy-Item .env.example .env.local
```

On macOS/Linux use cp .env.example .env.local. Set the public client values in the ignored .env.local:

```text
NEXT_PUBLIC_SUPABASE_URL=your-nonproduction-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never commit environment files, passwords or privileged credentials. Service-role or secret keys must never use a NEXT_PUBLIC_ name.

For a fresh hosted project, apply these SQL files from supabase/migrations in order through a trusted database operator and Supabase's SQL editor or the controlled migration workflow:

1. 001_initial_schema.sql
2. 002_initial_status_history.sql
3. 003_request_rls.sql
4. 004_secure_status_triggers.sql
5. 005_m3_workflow.sql
6. 006_m3_private_attachments.sql
7. 007_m3_reassignment_reason.sql
8. 008_m3_version_conflict.sql

Apply only missing migrations to an existing project; do not blindly rerun all files. Migration 008 preserves workflow and permissions while returning PT409 for business version conflicts instead of a retryable serialization error.

Create fictional test users in Supabase Auth. Each submitting account needs a public.requesters row with the matching Auth UUID. Staff and managers also need public.service_members records and explicit category scopes in public.service_scopes. Adapt [the provisioning example](supabase/m3-test-users.example.sql) to actual Auth IDs before use. An Auth account alone does not grant application roles.

Managers can only assign staff authorised for the request's category and sensitivity. An empty list can mean no eligible staff member has been provisioned. Earlier hosted test staff had **IT support** scope, unlike the simulation's Maintenance fixtures. The team supplies hosted credentials and checks current scope; do not assume the simulation password works in Supabase.

Start development on a distinct port:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3104
```

Open **[http://127.0.0.1:3104](http://127.0.0.1:3104)** and use actual hosted test credentials. Development mode is separate from the production-build measurements recorded in the PED.

For a production build using the same hosted configuration:

```bash
npm run build
npm start -- --hostname 127.0.0.1 --port 3104
```

Public settings are embedded at build time. Stop running production instances before switching providers, then rebuild for the chosen environment. A simulation build is not a hosted build. Plain npm run dev defaults to port 3000 and does not start the simulation provider.

## Verification and CI

Stop manual staging first: browser and performance commands start their own services on ports 3103 and 54329.

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

Browser tests require the simulation production build. Unit/database tests need no hosted keys. Performance measures a selected local workload; recovery is a controlled local snapshot/restore. New reports go into ignored test-results and do not automatically replace submitted dated evidence.

[The M3 quality workflow](.github/workflows/m3-quality.yml) runs on PRs and pushes to main. It restores dependencies, checks quality/security, runs tests, builds the simulation, verifies performance/recovery and retains reports even after failure.

### Recorded M3 evidence

The [final verification folder](Milestone_3/Verification_2026-10-15_Final) contains dated results, methods and the [source/report hash manifest](Milestone_3/Verification_2026-10-15_Final/verification-summary.json). Its source hashes match the verified application. Its original base-commit/working-tree fields describe evidence collection time; PR #34 and run #13 identify the later committed and reviewed candidate.

| Check | Recorded result |
| --- | --- |
| Local regression | 24 unit + 22 database + 9 browser/API cases, all passed; 55 unique local cases |
| Hosted checks | 10 selected browser checks plus focused conflict verification passed |
| Static/security | Lint, bounded secret-pattern check and production builds passed; production dependency audit recorded zero findings |
| Local performance | 1000 requests, three concurrent identities, 60 reads, zero errors; list p95 72.15 ms against 2000 ms |
| Hosted performance | Small-data p95 targets passed; one management read exceeded two seconds; NFR-006 remains partial |
| Local recovery | Coordinated 1000-request restore/check 468.60 ms; simulated loss 507 ms; integrity/privacy checks passed |
| Candidate CI | Actions run #13 passed for 374c21e |

These are dated results, not checks rerun for every documentation edit. Passing selected cases does not establish every acceptance criterion or complete security.

## Remaining limitations

- Wider NFR-006 coverage, including all relevant operations at 1000 hosted rows and sustained hosted capacity, remains incomplete.
- Local recovery does not establish reliable daily scheduling, changing-data backups or hosted database/Auth/Storage disaster restore.
- Production monitoring, retention decisions and broader acceptance validation remain final-submission work.
- Queries are bounded to 1000 records, so larger datasets can yield incomplete summaries.
- The unexplained hosted timeout remains recorded despite successful retests.
- Earlier high-severity development dependency findings remain separate from the passing production audit.

The PED RTM, Risk Register, Defect Register and Technical Debt Register retain statuses and owners. Reopening requests are recorded; automatic reopening and every future review workflow are not claimed.

## Repository structure

```text
src/app/                         Pages and protected API routes
src/components/                  Shared interface components
src/domain/requests/             Lifecycle, reason and reporting rules
src/features/requests/           Request form, validation and entry points
src/features/workflow/           Services and role-aware workspaces
src/features/attachments/        Private attachment adapter
src/lib/supabase/                Browser/server clients
supabase/migrations/             Migrations 001 through 008
supabase/m3-test-users.example.sql Hosted provisioning example
tests/                          Unit, database and browser/API tests; provider
scripts/                        Build, staging, verification and recovery
.github/workflows/               CI
Milestone_1/                    PED v1.0 and original baseline
Milestone_2/                    PED v2.0 and design contributions
Milestone_3/                    PED v3.0, change record and dated evidence
```

## Team and change control

| Member | Primary M3 contribution |
| --- | --- |
| Ryno Goetz | Architecture, setup, frontend, staging, recovery verification and integration |
| Steven Riaan Piek | Data/persistence, backend workflow and requirements traceability |
| Willem Booysen | Design rules, attachments/reporting, quality checks, CI and release evidence |

All members must understand the complete application and PED. Use focused branches, meaningful commits and substantive PRs. Protected main requires the agreed checks and two non-author approvals. Review code and documentation together, and control affected requirements, decisions, risks and verification evidence.

Material AI assistance is disclosed in the PED AI Usage Register; students remain accountable for checking and understanding their work. PED v1.0/v2.0 remain historical baselines. PED v3.0 is the current M3 evidence index.
