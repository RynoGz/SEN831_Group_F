# CivicConnect

CivicConnect is a community service request management platform developed for the SEN381 integrated team project. This repository is the controlled engineering workspace for requirements, architecture, decisions, risks, traceability, application evidence and the software produced across the four milestones.

## Current status

| Item | Status |
| --- | --- |
| Current phase | Milestone 2 engineering baseline |
| Controlled baseline | PED v2.0 |
| Baseline date | 30 September 2026 |
| Team approval | Approved by all three members |
| Application | Initial authenticated request submission and requester retrieval path implemented |

The current controlled document is [SEN381 CivicConnect PED v2.0](Milestone_2/SEN381_CivicConnect_PED_v2.0.docx). It extends the approved [PED v1.0](Milestone_1/SEN381_CivicConnect_PED_v1.0.docx) without replacing the Milestone 1 requirements baseline.

PED v2.0 integrates the approved architecture, technology, persistence and detailed-design decisions; the evolved Requirements Traceability Matrix (RTM); application and verification evidence; risks; assumptions; forward-engineering considerations; decision history; AI usage; and known limitations.

## Project purpose

CivicConnect replaces fragmented community service request handling with one controlled workflow. The platform is intended to help requesters submit and follow requests, authorised staff manage work and responsibility, and management view dependable service information.

The controlled requirements cover:

- Submission and controlled categorisation of service requests.
- Request status, history and in-application feedback.
- Authorised work views, request details, search and filtering.
- Assignment, controlled status changes and recorded actions.
- Resolution and closure using an agreed request lifecycle.
- Management views and reporting using justified dimensions.
- Least-privilege access, sensitive-information handling and attributable changes.

The Master Project Brief remains the governing source. Features that are designed or planned are not treated as implemented until repository and verification evidence exists.

## Milestone 2 baseline

The selected architecture is a modular monolith implemented as one Next.js application with clear internal presentation, request-operation, domain-policy and Supabase adapter boundaries.

The accepted stack is:

| Area | Selection |
| --- | --- |
| Language | JavaScript using ECMAScript modules |
| Application | Next.js App Router 16.3.7 |
| User interface | React and React DOM 19.3.0 |
| Runtime | Node.js 24.x and npm 11.x |
| Database and authentication | Supabase PostgreSQL and Supabase Auth |
| Attachment direction | Private Supabase Storage; implementation deferred |
| Deployment direction | Vercel; no production deployment is claimed |
| Verification | Node test runner, browser checks and ESLint |

Primary contribution evidence is retained in the member folders:

- [Ryno's architecture and frontend contribution](Milestone_2/Member_1/CivicConnect_M2_Ryno_Architecture_and_Frontend_v0.2.docx) and [integration handoff](Milestone_2/Member_1/frontend-handoff.md).
- [ADR-001: Technology Stack Decision](Milestone_2/Member_2/ADR-001-technology-stack.md), Steven's data and persistence artefacts, migrations and [RTM v0.4](Milestone_2/Member_2/CivicConnect_M2_RTM_v0.4.docx).
- [Willem's design and register updates](Milestone_2/Member_3/CivicConnect_M2_Member_3_Design_and_Register_Updates.docx) and request-transition policy implementation.

Every member remains responsible for understanding, reviewing and defending the complete integrated baseline.

## Implemented application slice

The repository currently contains:

- Home, login, new-request, request-list and request-details pages.
- Browser validation and accessible field/status feedback.
- Supabase browser and server clients using authenticated sessions.
- Controlled category retrieval from PostgreSQL.
- Protected request submission with server-side required-field and category checks.
- Automatic initial `Submitted` status and initial status-history creation through database triggers.
- Requester-scoped request list and details retrieval using row-level security (RLS).
- A framework-independent request-transition policy covering the seven approved statuses.
- Versioned schema, seed data, integrity constraints, indexes, triggers, grants and RLS migrations.
- Six request-input tests and eight transition-policy tests.

The integrated slice demonstrates the path:

```text
Sign in → submit request → validate → persist → confirm → retrieve requester-owned request
```

The following remain incomplete or deferred:

- Optional private attachment upload, limits, cleanup and coordinated recovery.
- Staff assignment and management workflows.
- Integration of the transition policy with an authorised atomic database status operation.
- Complete actor attribution for the initial history record.
- Cross-user RLS denial evidence and broader staff/management permission policies.
- Quantitative performance and recovery verification.
- Production deployment and production-readiness evidence.

## Local setup

Use Node.js **24.x** and npm **11.x**. Exact package versions are recorded in `package.json` and `package-lock.json`.

Install dependencies from the repository root:

```bash
npm ci
```

Create a nonproduction Supabase project and copy the environment template:

```bash
copy .env.example .env.local
```

On macOS or Linux, use:

```bash
cp .env.example .env.local
```

Set these values in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=your-nonproduction-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never commit `.env.local`, credentials or service-role keys. A privileged key must never use a `NEXT_PUBLIC_` name.

Apply the SQL files in `supabase/migrations/` to the same nonproduction project in numerical order:

1. `001_initial_schema.sql`
2. `002_initial_status_history.sql`
3. `003_request_rls.sql`
4. `004_secure_status_triggers.sql`

Use the Supabase SQL editor or the team's controlled migration workflow. The migrations create the relational schema, controlled categories and statuses, initial-status/history triggers, requester grants and row-level policies.

For a local demonstration, create a fictional test user in Supabase Auth and add a matching `public.requesters` row whose `auth_user_id` equals that Auth user's ID. Use fictional, non-sensitive request data only.

Start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification commands

```bash
npm run lint
npm test
npm run build
npm start
```

`npm start` requires a successful production build first.

Recorded on 30 September 2026:

- `npm run lint` passed.
- `npm test` passed all 14 unit tests.
- Steven's Supabase demonstration recorded successful submission, persistence, initial-history creation and requester retrieval.
- `npm run build` did not pass the final merged audit because the fictional example route imports a removed default `RequestDetails` component. A clean production build must be recorded after that integration defect is corrected.

These results support the Milestone 2 engineering baseline. They do not claim completion of all CivicConnect requirements or production readiness.

## Repository structure

```text
.
├── src/
│   ├── app/                         Next.js routes, layout and global states
│   ├── domain/requests/             Framework-independent lifecycle policy
│   ├── features/requests/           Request UI, validation and server operations
│   └── lib/supabase/                Browser and server Supabase clients
├── supabase/migrations/             Versioned PostgreSQL schema and security changes
├── tests/                           Request validation and transition-policy tests
├── package.json                     Application dependencies and commands
├── package-lock.json                Reproducible dependency tree
├── .env.example                     Supabase environment-variable template
├── Milestone_1/                     Approved PED v1.0 and supporting artefacts
├── Milestone_2/
│   ├── SEN381_CivicConnect_PED_v2.0.docx
│   ├── Member_1/                    Architecture, frontend and handoff evidence
│   ├── Member_2/                    Requirements, stack, persistence and RTM evidence
│   ├── Member_3/                    Design decisions and register evidence
│   ├── Assignment_2/                Supporting design research
│   └── Assignment_3/                Supporting quality and readiness research
├── Milestone_3/
└── Milestone_4/
```

## Team

| Member | Primary Milestone 2 contribution |
| --- | --- |
| Ryno Goetz | Architecture, technology alignment, Next.js setup, frontend and README/PED integration |
| Steven Riaan Piek | Requirements review, data model, persistence, migrations, authentication/request integration and RTM |
| Willem Booysen | Detailed design decisions, registers, request-transition policy and PED integration |

Primary ownership does not limit shared accountability. All three members must understand the architecture, data model, technology and design decisions.

## Team workflow and GitHub governance

1. Represent substantive work with a clear task or issue.
2. Create a focused branch from the latest approved `main` state.
3. Use meaningful commits describing the engineering change.
4. Open a pull request explaining its purpose, affected artefacts and verification.
5. Obtain meaningful approval from both non-author team members.
6. Address review findings and obtain re-review where necessary.
7. Merge only after the change satisfies the agreed controls.
8. Update related requirements, traceability, risks and decisions when affected.

Direct substantive development on `main` is not permitted. `main` is the controlled project state.

Suggested branch naming:

```text
docs/short-description
feature/short-description
fix/short-description
```

## Baseline and change control

PED v2.0 is the approved Milestone 2 engineering baseline. It preserves the approved Milestone 1 requirement identifiers and relationships, including `STK-*`, `NEED-*`, `SCP-*`, `FR-*`, `NFR-*`, `RG-ASR-*`, `R*` and `D*` records.

An approved baseline must not be silently overwritten. A material change must record the reason, affected scope and requirements, traceability, architecture/data/interface impact, risk, decision, approval and verification evidence.

## Responsible AI use

Material AI-assisted work is disclosed in the PED AI Usage Register:

- Ryno Goetz — OpenAI Codex.
- Steven Riaan Piek — ChatGPT.
- Willem Booysen — OpenAI Codex.

AI output is treated as a suggestion rather than authoritative evidence. Each responsible student verifies important claims, records accepted or corrected contributions and remains able to explain and modify the submitted work.

## Getting started with Git

```bash
git clone https://github.com/RynoGz/SEN831_Group_F.git
cd SEN831_Group_F
git switch main
git pull
git switch -c docs/short-description
```

Before committing, review the changed artefacts and confirm that linked identifiers, references and document versions remain consistent.

## Milestone progression

- **Milestone 1:** Engineering foundation and requirements baseline — completed.
- **Milestone 2:** Architecture, technology, initial design and application foundation — baseline prepared.
- **Milestone 3:** Controlled construction, integration, quality and release readiness.
- **Milestone 4:** Final product, project success and engineering defence.

## Academic integrity

All submitted work must use appropriate citations and references. Repository evidence must be authentic and progressively produced. Each team member is accountable for personal contributions, reviews, AI-assisted work and the ability to defend the complete team baseline.
