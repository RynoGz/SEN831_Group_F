# CivicConnect

CivicConnect is the SEN381 team project. This repository is the controlled workspace for the project's requirements, engineering artefacts, decisions, risks, evidence, and later software implementation.

> **Current phase:** Milestone 1 - Engineering Foundation and Requirements Baseline

## Project purpose

The team is currently establishing what CivicConnect must achieve, who it serves, which constraints apply, and what will be formally included in the initial engineering baseline. The project-specific problem statement and business value will be added after they have been reviewed and approved by the team.

## Team

| Member | Primary responsibility for Milestone 1 |
| --- | --- |
| Member 1 - *Name to be added* | Problem analysis, stakeholders, scope, constraints, Team Working Agreement, and GitHub governance |
| Member 2 - *Name to be added* | Functional and non-functional requirements, acceptance criteria, and Requirements Traceability Matrix |
| Member 3 - *Name to be added* | Risks, forward engineering considerations, decision log, AI usage register, PED integration, and baseline sign-off |

Although each member has primary responsibilities, all members must review, understand, present, and defend every controlled project artefact.

## Milestone 1 deliverables

- Problem and business-need analysis
- Stakeholder analysis
- Scope baseline and constraint analysis
- Prioritised functional and non-functional requirements
- Testable acceptance criteria
- Requirements Traceability Matrix (RTM)
- Initial Risk Register
- Forward Engineering Considerations Register
- Engineering Decision Log
- GitHub and team-governance evidence
- AI Usage Register
- Project Engineering Document (PED) v1.0 and baseline sign-off

## Proposed repository structure

```text
.
|-- README.md
|-- docs/
|   |-- ped/
|   |-- requirements/
|   |-- registers/
|   `-- evidence/
|-- src/                  # Application source code in later milestones
|-- tests/                # Automated tests in later milestones
`-- .github/
    |-- ISSUE_TEMPLATE/
    `-- pull_request_template.md
```

The structure may change as the project develops. Significant structural changes should be discussed and recorded through an issue or decision entry.

## Collaboration workflow

1. Create or select a GitHub issue for the work.
2. Create a branch from the latest `main` branch.
3. Make focused changes and use meaningful commit messages.
4. Open a Pull Request that links to the relevant issue.
5. Obtain reviews and approval from both team members who did not author the change.
6. Resolve comments and merge only when the change is ready.
7. Update related artefacts, such as the RTM, risk register, or decision log, when necessary.

Suggested branch names:

```text
docs/stakeholder-analysis
docs/requirements-baseline
docs/risk-register
feature/short-description
fix/short-description
```

## Document control

- Store editable, text-based source files in the repository whenever practical.
- Use stable identifiers such as `FR-001`, `NFR-001`, `RISK-001`, and `DEC-001`.
- Keep identifiers consistent across requirements, acceptance criteria, the RTM, risks, and decisions.
- Record meaningful changes through commits and Pull Requests rather than replacing files without history.
- Treat approved PED versions and milestone artefacts as controlled baselines.
- Do not change a baseline without analysing and recording the effect of the change.

## AI usage and academic integrity

Any material AI-assisted contribution must be recorded in the AI Usage Register and verified by a team member. AI output is not a source and does not replace credible research, project evidence, in-text citations, or a reference list. Each team member remains accountable for submitted work bearing their name.

## Getting started

Clone the repository and create a working branch:

```bash
git clone <repository-url>
cd <repository-folder>
git switch main
git pull
git switch -c docs/<short-task-name>
```

Replace the placeholders in this README once the repository URL, member names, approved project description, and technical setup are available.

## Project status

This README is an initial project overview and will be updated progressively as requirements are baselined and later milestones introduce architecture, implementation, testing, deployment, and operational evidence.
