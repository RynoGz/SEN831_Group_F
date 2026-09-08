# CivicConnect - Member 1 contribution

| Document control | Value |
| --- | --- |
| Responsible student | Ryno Goetz |
| Reviewers | Steven Riaan Piek and Willem Booysen |
| Version/date | 0.2 / 7 September 2026 |
| Status | Updated working baseline; working agreement confirmed, formal scope/PED sign-off still pending |
| Purpose | Member 1 source artefacts for integration into the evolving Project Engineering Document (PED) v1.0 |

## 1. Read in this order

| Artefact | What it contains |
| --- | --- |
| [1. Problem and business need](01-problem-and-business-need.md) | CivicConnect-specific problem analysis, business value and proposed success evidence |
| [2. Stakeholder analysis](02-stakeholder-analysis.md) | Stakeholder register, needs, influence/interest, conflicts and examples for requirements derivation |
| [3. Proposed scope baseline](03-scope-baseline.md) | All minimum business capabilities, proposed exclusions, future scope, M1 boundaries and change control |
| [4. Constraints and assumptions](04-constraints-and-assumptions.md) | Scope, time, cost/resources, quality and security constraints; trade-offs and open facts |
| [5. Team Working Agreement](05-team-working-agreement.md) | Named responsibilities, WhatsApp/Discord use, daily discussions, meetings, review and approval |
| [6. GitHub governance](06-github-governance.md) | Master-required controls, reviewer allocation, practical workflow and authentic evidence still needed |
| [7. Review and defence notes](07-review-and-defence-notes.md) | Handoffs, review checklist, draft AI-register entry and Ryno's presentation preparation |

These files are components of one evolving PED, not separate milestone reports. Willem should integrate the reviewed content into the team's PED and preserve source/version links [S4, sections 6-6.1]. Folder structure is illustrative in the Master brief, so this pack follows the repository's existing `Milestone_1` layout [S4, Appendix C].

Start with [STAGES.md](STAGES.md) for four separate review/commit stages. The files now include the decisions and confirmations reported by Ryno on 7 September 2026. Commit each coherent stage only after actually checking it; generating this pack does not create commits, peer reviews or PED sign-off.

## 2. Basis and status

The analysis is based on both supplied briefs and the team's recorded arrangements. The scenario describes a generic community-focused organisation; it does not identify Belgium Campus as the client. No interviews, user research or production measurements are claimed. Steven and Willem have agreed to the responsibilities and working arrangement, but formal scope/PED sign-off and genuine GitHub review evidence remain separate requirements.

To prevent avoidable delay, this version records a recommended M1 working baseline: one organisation; controlled request fields and categories; role-based access; the lifecycle Submitted -> Accepted -> Assigned -> In Progress -> Resolved -> Closed, with authorised rejection, reassignment and reopening; an explicit overdue rule; and in-application feedback. Optional integrations, billing/inventory and physical fulfilment are recommended exclusions, while mobile/offline support, AI, historic migration, external notifications and final technical design remain deferred. These are usable inputs for requirements work, but the team must still review and formally sign off the scope baseline [S1, section 3; S4, sections 3 and 11].

`STK-*`, `NEED-*`, `SCP-*`, `CON-*`, `ASM-*`, `VAL-*` and `Q-*` are proposed stable identifiers for these artefacts. Steven should preserve their meaning and link them to his `FR-*`/`NFR-*` requirements and acceptance criteria in the single RTM. This pack does not assign approved requirement IDs or claim that later design/test evidence exists.

## 3. Source register

| ID | Source | Use and limitation |
| --- | --- | --- |
| S1 | SEN381 Teaching Team. *SEN381 CivicConnect Project: Milestone 1 (M1) - Engineering Foundation & Requirements Baseline*, supplied as `SEN381 Project Milestone 1 (1).pdf` | M1 outputs, boundaries, evidence and individual defence; section references are given in the artefacts |
| S2 | Team repository, [README.md](../../README.md), read 7 September 2026 | Recorded member identities and responsibilities; does not prove remote settings or registration |
| S3 | Ryno Goetz, project-planning conversation, 7 September 2026 | M1 due 9 September 2026; all members available daily for four hours each; daily WhatsApp/Discord discussions; a meeting every second day after 11:00; no additional resource limitations; working arrangement agreed; all members have full repository access; exact retention may be confirmed later; no separate rubric received |
| S4 | SEN381 Teaching Team (2026). *CivicConnect Master Project Brief: Community Service Request Management Platform*, version 1.1, supplied as `SEN381 Master Project Brief.pdf` | Authoritative project scenario, minimum capabilities and project-wide controls |

Sources are cited by ID and section in each file. These briefs establish the assignment context; stakeholder influence assessments, resolutions and optional exclusions are analysis/proposals derived from that context. AI assistance is recorded separately, not cited as authoritative evidence. Preserve citations and this reference register when incorporating the pack into the PED.

## 4. Items requiring confirmation before baseline

- Formal team sign-off of the recommended scope baseline and its derived requirements/acceptance criteria.
- Evidence that the three-person team registration was completed; repository access does not prove registration.
- Exact retention period and quantitative workload/performance targets when the organisation or lecturer supplies them.
- Actual PRs, both non-author reviews, controlled merge evidence and full main-branch protection compliance.
- Review against the M1 Excel Rubric and Marking Guide if it is supplied later; Ryno confirmed that no separate rubric has been received.

These items are explicit limits of the draft, not reasons to postpone useful review. Ryno can hand the current analysis to Steven and Willem now.

## 5. Version history

| Version | Date | Change | Review/approval |
| --- | --- | --- | --- |
| 0.1 | 7 September 2026 | Initial AI-assisted Member 1 pack grounded in the supplied Master and M1 briefs and reported team arrangements | Human verification and both peer reviews pending |
| 0.2 | 7 September 2026 | Added confirmed deadline, availability, meeting time, resource/access status and agreed working arrangement; recorded recommended M1 policy baseline and remaining evidence gaps | Working agreement reported agreed; formal scope/PED approval and repository evidence pending |
