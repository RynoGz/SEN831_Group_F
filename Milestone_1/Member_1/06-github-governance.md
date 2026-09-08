# 6. GitHub governance and evidence plan

Version 0.2 | 7 September 2026 | Coordinator: Ryno Goetz | Status: all members have full access; remote protection still to be verified

## 6.1 Repository and mandatory controls

The local repository's configured remote is [RynoGz/SEN831_Group_F](https://github.com/RynoGz/SEN831_Group_F). Its tracked layout currently includes the README and Milestone_1 through Milestone_4 folders. Ryno confirmed that all three members have full repository access. This does not prove team registration or that branch controls are enabled.

| Control ID | Required control | Governing source | Evidence Ryno must collect |
| --- | --- | --- | --- |
| GOV-001 | One controlled team repository unless an alternative is justified and approved | S4 section 9 | Repository identity and member access; any approved exception |
| GOV-002 | Protect main and treat it as the controlled product state | S4 section 9 | Actual main-branch protection/rule settings and their scope |
| GOV-003 | No substantive direct development on main; use PRs for substantive changes entering it | S4 section 9 | Real task branch, PR and controlled merge history |
| GOV-004 | At least two approvals from team members other than the author; self-approval is not accepted | S4 section 9 | Actual approval requirement and genuine approvals from both non-author members |
| GOV-005 | Reviews must meaningfully inspect the work | S4 sections 9-9.1 | Review comments/findings, author responses, corrections and re-review where needed |
| GOV-006 | Meaningful engineering work appears in a project board/backlog and is linked where practical | S4 section 9 | Real issues/tasks, owners, status and relevant artefact/PR links |
| GOV-007 | Do not commit passwords, keys, tokens or confidential credentials | S4 section 9 | Review of controlled changes and appropriate configuration practices; never include a secret in evidence |
| GOV-008 | Commits, PRs, reviews, merges and changes must be progressive and authentic | S4 sections 9 and 23 | Actual dated history of work as it occurs |

Remote protection checks remain pending until the live GitHub settings are inspected. Ryno requested a main-branch rule requiring at least one approval. That is a useful minimum control, but it does not satisfy GOV-004: the Master brief requires approvals from both non-author members. Configure two required approvals if the repository plan/settings permit it, or document the one-approval limitation and obtain the lecturer's resolution before claiming full compliance.

## 6.2 Author and reviewer responsibilities

| Author | Required reviewers |
| --- | --- |
| Ryno Goetz | Steven Riaan Piek and Willem Booysen |
| Steven Riaan Piek | Ryno Goetz and Willem Booysen |
| Willem Booysen | Ryno Goetz and Steven Riaan Piek |

For Ryno's analysis, Steven should particularly check whether needs/scope produce testable, traceable requirements. Willem should particularly check risks, assumptions and decision consequences. Both reviewers inspect the complete change before approving; the focus areas do not divide their responsibility into separate partial approvals.

## 6.3 Document workflow

1. Represent a coherent task in the backlog, such as reviewing the requester/staff/management stakeholder analysis.
2. Create a task branch from the latest approved main state.
3. Edit Markdown source files and verify source citations, IDs, linked artefacts and declared assumptions. Use descriptive commits for actual completed increments.
4. Open a PR linked to the issue, describing the engineering purpose, affected artefacts, verification and unresolved questions.
5. Request both non-author reviewers, address findings and have the corrected content re-reviewed as necessary.
6. Merge only after the final content satisfies the required approvals and applicable controls. Link the result to the issue and update dependent work.

Multiple commits on one branch can be reviewed in one PR. Separate PRs are also appropriate for independently reviewable changes; each substantive PR still needs both approvals. A commit records a change locally; a merge brings the approved branch change into main. Writing Markdown files or generating a commit message does not supply approval evidence.

Follow [STAGES.md](STAGES.md) for Ryno's four review/commit units. Stage only the listed files, inspect the staged diff, then commit. Keep history truthful: all initial files are AI-assisted drafts prepared together; later commits can record the actual checks, corrections and decisions made as each stage is reviewed [S4, sections 9-10 and 23].

## 6.4 Suggested task and PR contents

An issue should identify its owner, output, source/requirement links, dependencies and completion criteria. Record an agreed target date when available. A PR should link the issue and explain why the change is needed, what it affects, what was actually checked, what remains open and how material AI assistance was verified.

For documentation review, check at least these relevant questions: Does the statement match its source? Is a proposal being mistaken for an approved fact? Does scope preserve every required capability? Are identifiers consistent? Does this change affect requirements, risks or future verification? Are approvals based on the final content? For code in later milestones, extend review to implementation correctness, tests/regression, dependencies, maintainability and security [S4, section 9.1 and Appendix A].

## 6.5 Evidence record to complete during real work

| Evidence item | Current status | Record when available |
| --- | --- | --- |
| Main protection and review settings | Not yet inspected remotely; requested minimum is one approval, while the brief requires two | Dated live settings reference and relevant rule scope; record any compliance gap |
| Member access/registration | Full access for Ryno, Steven and Willem confirmed by Ryno; registration evidence not verified | Appropriate repository access evidence and separate team registration record |
| Stage 1 issue/branch/PR | Not created by this drafting task | Actual links and content reviewed |
| Two independent reviews of Ryno's change | Not performed by this task | Reviewer identities, findings, corrections and approvals |
| Controlled merge/version | Not performed by this task | Actual merge and baseline references |

Screenshots may support evidence, but use live/traceable artefacts where practical. Do not backdate entries or manufacture reviews to make the history appear longer [S4, section 23; S1, section 3.1]. M1 documentation provides valid engineering evidence before application coding or a CI pipeline is implemented [S1, sections 3.1 and 5].

## 6.6 Baseline readiness

Before Member 1's material contributes to PED v1.0 sign-off, verify the actual governance controls, resolve review findings and preserve source/version/approval links. The team then checks scope, requirements/traceability and risk readiness alongside governance under the baseline process. Use the outcome actually reached; do not preselect ACCEPTED [S4, Appendix D].

**References:** [Source register](README.md#3-source-register), S4 sections 6-11, 23 and Appendices A/D; S1 sections 3.1, 5, 7 and 10. Local repository observations were made on 7 September 2026.
