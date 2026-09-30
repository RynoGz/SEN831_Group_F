# CivicConnect

CivicConnect is a community service request management platform developed for the SEN381 integrated team project. This repository is the controlled engineering workspace for requirements, decisions, risks, project evidence and the software produced across the four milestones.

## Current status

| Item | Status |
| --- | --- |
| Current phase | Milestone 2 in progress |
| Controlled baseline | PED v1.0 |
| Baseline date | 8 September 2026 |
| Gate outcome | ACCEPTED |
| Application | Next.js frontend preview; server integration pending |

The approved Milestone 1 baseline is available in [SEN381 CivicConnect PED v1.0](Milestone_1/SEN381_CivicConnect_PED_v1.0.docx). It is the primary controlled document for the problem analysis, stakeholder needs, scope, constraints, requirements, traceability, risks, decisions, governance controls and AI usage record.

## Project purpose

CivicConnect replaces fragmented community service request handling with one controlled workflow. The platform is intended to help requesters submit and follow requests, authorised staff manage work and responsibility, and management view dependable service information.

The approved baseline covers:

- Submission and controlled categorisation of service requests.
- Request status, history and in-application feedback.
- Authorised staff work views, search, filtering and request details.
- Assignment, reassignment, controlled status changes and recorded actions.
- Resolution and closure using an agreed request lifecycle.
- Management views for open, overdue, resolved and closed work.
- Reporting by category, status and other justified dimensions.
- Role-based access, sensitive-information handling and traceable changes.

Milestone 1 does not select the final technology stack or architecture and does not claim implementation, testing or deployment evidence that belongs to later milestones.

## Milestone 2 contribution and application status

The Master Project Brief remains the governing source. M2 extends the existing PED and requires meaningful application evidence; a frontend preview alone does not complete the milestone's integrated request path.

- [Ryno's architecture and frontend contribution v0.2](Milestone_2/Member_1/CivicConnect_M2_Ryno_Architecture_and_Frontend_v0.2.docx), with a [Markdown review copy](Milestone_2/Member_1/Ryno_Architecture_and_Frontend.md). This supersedes Ryno's earlier Phase 1 draft, which remains as historical material.
- [Accepted technology decision ADR-001](Milestone_2/Member_2/ADR-001-technology-stack.md).
- [Steven's data model](Milestone_2/Member_2/CivicConnect_M2_Step_3_Data_Model_Baseline.docx).
- [Frontend implementation and integration handoff](Milestone_2/Member_1/frontend-handoff.md).

Ryno owns the Next.js bootstrap and frontend. Steven owns the schema, authentication/data integration, protected request operations and related verification. Willem owns the detailed design decisions and PED integration, with implementation contributions in the relevant modules. The shared ADR's older bootstrap ownership wording is awaiting the team's separate update.

The frontend currently provides:

- Home, new-request and requests pages, plus a clearly labelled fictional details example.
- The approved category labels, required-field feedback and explicit sensitivity selection.
- Responsive layouts, keyboard focus, labelled controls and accessible error/status messages.
- A form integration point for a future protected submission function.

**Not implemented:** authentication, database migrations, request persistence/retrieval, private attachment upload, staff workflows and management reports. The preview does not save data, send requests or use browser storage. It displays no real user records. FR-001 remains partially implemented; its optional-attachment capability and integrated acceptance checks remain outstanding.

## Run the frontend locally

Use Node.js **24.x** and npm **11.x**. Bootstrap was prepared with Node.js **24.16.0** and npm **11.13.0**. The application uses JavaScript, Next.js **16.3.7**, React/React DOM **19.3.0**, ESLint **9.39.5** and eslint-config-next **16.3.7**. Exact dependencies are pinned in `package.json` and `package-lock.json`.

From the repository root:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database or environment variables are needed for the current preview. Use fictional information only. The **Check request** button validates input and explicitly confirms that nothing was saved.

```bash
npm run lint
npm test
npm run build
npm start
```

`npm start` serves the production build and requires `npm run build` first. Stop an existing development server before starting on the same port. The Node tests check frontend input handling; they do not prove server authorisation, persistence or end-to-end acceptance. `next build` is separate from lint and tests.

**Tooling limitation:** npm flags ESLint 9.39.5 as unsupported. ESLint 10.11.0 was tried, but the selected Next.js lint parser failed with `scopeManager.addGlobals is not a function`. Version 9.39.5 is pinned for the working lint configuration; revisit it when the Next.js configuration supports the newer major. This concerns development tooling, not the application runtime.

`.env.example` reserves public configuration names for the later Supabase integration. When needed, copy it to `.env.local` and use a nonproduction project. Currently these values are not read and entering them does not enable the backend. Never commit credentials or put privileged keys in `NEXT_PUBLIC_` variables. Database setup instructions will be added with Steven's actual migrations; there is no schema command to run yet.

For Vercel, the intended root directory is this repository root, with the Next.js preset and Node.js 24.x. No hosted deployment is claimed. Confirm plan eligibility, environment isolation and configuration before connecting a deployment; frontend preview builds need no Supabase credentials.

## Team

| Member | Primary Milestone 1 responsibility |
| --- | --- |
| Ryno Goetz | Problem and business need, stakeholder analysis, scope, constraints, Team Working Agreement and GitHub governance |
| Steven Riaan Piek | Functional and non-functional requirements, acceptance criteria and Requirements Traceability Matrix |
| Willem Booysen | Risk Register, forward engineering considerations, Engineering Decision Log, AI Usage Register and PED integration |

Primary ownership does not limit shared accountability. Every member must understand, review, present and defend the complete controlled baseline.

## Repository structure

```text
.
├── src/
│   ├── app/                    Next.js pages, layout and global styles
│   └── features/requests/      Form, details, preview fixtures and browser validation
├── tests/                     Node frontend validation checks
├── package.json               Application dependencies and commands
├── package-lock.json          Reproducible dependency tree
├── .env.example               Empty future configuration placeholders
├── Milestone_1/               Approved PED v1.0 and supporting artefacts
├── Milestone_2/
│   ├── Member_1/               Ryno's architecture, frontend and handoff evidence
│   ├── Member_2/               Steven's requirements, technology and data evidence
│   ├── Assignment_2/           Supporting design research
│   └── Assignment_3/           Supporting quality, security and readiness research
├── Milestone_3/
└── Milestone_4/
```

`src/server/` and `supabase/` are proposed future locations in the architecture, not implemented modules. The frontend imports no database client. Its seven category IDs are labelled preview fixtures and must be replaced by real category identifiers during integration.

The member folders retain supporting source artefacts and revision history. The approved PED is the unified Milestone 1 baseline.

## Team workflow

- Short progress discussions take place daily through WhatsApp and Discord.
- A team meeting is held every second day after 11:00.
- Each member plans for four project hours per day, including meetings, drafting, review and corrections.
- All three members have full repository access.
- Important decisions, conflicts and changes are recorded in the appropriate controlled artefact.

## GitHub governance

1. Represent substantive work with a clear task or issue.
2. Create a focused branch from the latest approved `main` state.
3. Use meaningful commits that describe the engineering change.
4. Open a Pull Request and explain its purpose, affected artefacts and verification.
5. Obtain meaningful approval from both team members who did not author the change.
6. Address review findings and obtain re-review when necessary.
7. Merge only after the change satisfies the required controls.
8. Update related requirements, traceability, risks and decisions when a change affects them.

Direct substantive development on `main` is not permitted. The `main` branch is treated as the controlled project state.

Suggested branch naming:

```text
docs/short-description
feature/short-description
fix/short-description
```

## Baseline and change control

PED v1.0 is the approved Milestone 1 engineering baseline. Later work must use its identifiers and relationships consistently, including `STK-*`, `NEED-*`, `SCP-*`, `FR-*`, `NFR-*`, `R*` and `D*` records.

An approved baseline must not be silently overwritten. A material change should record:

- The requested change and its reason or expected value.
- Affected scope, requirements and traceability.
- Schedule, resource and cost implications.
- Architecture, data, interface, security and quality implications where relevant.
- Risk impact, decision, approval and verification.

## Responsible AI use

Material AI-assisted work is disclosed in the PED AI Usage Register:

- Ryno Goetz — OpenAI Codex.
- Steven Riaan Piek — ChatGPT.
- Willem Booysen — Copilot.

AI output is treated as a suggestion, not authoritative evidence. Each responsible student verifies important claims, records accepted or corrected contributions and remains able to explain and modify the submitted work. Credentials, confidential material and inappropriate personal or sensitive information must not be submitted to external AI systems.

## Getting started

Clone the repository and create a task branch from the current controlled state:

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
- **Milestone 2:** Architecture, design and engineering decisions.
- **Milestone 3:** Controlled construction, integration, quality and release readiness.
- **Milestone 4:** Final product, project success and engineering defence.

The PED evolves through these milestones. Later versions must preserve the approved history and trace changes back to the relevant requirement, decision, risk and project evidence.

## Academic integrity

All submitted work must use appropriate citations and references. Repository evidence must be authentic and progressively produced. Each team member is accountable for personal contributions, reviews, AI-assisted work and the ability to defend the complete team baseline.
