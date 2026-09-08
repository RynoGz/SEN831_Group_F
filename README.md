# CivicConnect

CivicConnect is a community service request management platform developed for the SEN381 integrated team project. This repository is the controlled engineering workspace for requirements, decisions, risks, project evidence and the software produced across the four milestones.

## Current status

| Item | Status |
| --- | --- |
| Current phase | Milestone 1 completed |
| Controlled baseline | PED v1.0 |
| Baseline date | 8 September 2026 |
| Gate outcome | ACCEPTED |
| Next phase | Milestone 2 — Architecture, Design and Engineering Decisions |

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
├── README.md
├── Milestone_1/
│   ├── SEN381_CivicConnect_PED_v1.0.docx
│   ├── Member_1/
│   │   ├── 01-problem-and-business-need.md
│   │   ├── 02-stakeholder-analysis.md
│   │   ├── 03-scope-baseline.md
│   │   ├── 04-constraints-and-assumptions.md
│   │   ├── 05-team-working-agreement.md
│   │   ├── 06-github-governance.md
│   │   └── 07-review-and-defence-notes.md
│   ├── Member_2/
│       ├── 01-requirements-and-acceptance-criteria.md
│       ├── 02-requirements-traceability-matrix.md
│       └── CivicConnect_Member_2_Requirements_and_RTM_Clean.docx
│   └── Member_3/
│       └── Risk_management.docx
├── Milestone_2/
├── Milestone_3/
└── Milestone_4/
```

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
