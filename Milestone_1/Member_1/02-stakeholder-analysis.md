# 2. Stakeholder analysis

Version 0.2 | 7 September 2026 | Responsible student: Ryno Goetz | Updated working baseline; team review pending

## 2.1 Method and evidence limits

This is a scenario-based analysis. Requester, staff and management roles come directly from the Master brief [S4, section 3]. Coordination, operational support and assessment roles below are analytical groupings inferred from the described responsibilities and lifecycle controls. They do not assert that separate departments or named client representatives exist. One person may perform several organisational roles; the final permission model must distinguish responsibilities rather than assume one job title equals one software role.

Influence means ability to affect scope, priorities, acceptance or policy. Interest means how directly the stakeholder is affected by the system's outcomes. High/medium ratings are qualitative judgements for engagement planning, not measured survey results. All ratings and conflicts require review.

## 2.2 Stakeholder register

| ID | Stakeholder and basis | Needs/expectations | Influence / interest | Proposed engagement |
| --- | --- | --- | --- | --- |
| STK-001 | Requesters; explicit in S4 section 3 | Submit understandable, appropriately classified requests; see their status/history and meaningful feedback; protect sensitive details | Medium / high: directly affected, but no policy authority is stated | Validate submission and feedback scenarios; ask what acknowledgement and progress information are useful |
| STK-002 | Authorised service staff; explicit in S4 section 3 | Find relevant work and details, take responsibility, apply permitted state changes and record actions/resolutions | High / high: workflow feasibility and data quality depend on staff use | Walk through assignment, reassignment, rejection, resolution and closure cases; verify access and required information |
| STK-003 | Management/oversight; explicit in S4 section 3 | Dependable activity views, identification of overdue/open/resolved/closed work, accountability and useful analysis | High / high: influences priorities, reporting definitions and acceptance | Agree reporting meaning and visibility; validate summaries against a known request set |
| STK-004 | Service coordination responsibility; inferred from assignment/prioritisation problems in S4 section 2; may be held by STK-002 or STK-003 | Clear responsibility, controlled categories and consistent handling of unassigned or incorrectly routed work | High / high for workflow policy | Clarify who may assign, change category, reassign or close work; validate boundary cases |
| STK-005 | Organisation's operational/security support responsibility; inferred from S4 sections 16-18; named owner unconfirmed | Appropriate access, manageable configuration, protected credentials, recoverability and sustainable operation | Medium / high; actual authority must be confirmed | Review sensitive-data questions and later deployment/support constraints without choosing a stack in M1 |
| STK-006 | Project team: Ryno, Steven and Willem; S2 and S4 sections 7.1-8 | Clear scope and dependencies, feasible workload, shared understanding and maintainable engineering evidence | High / high for engineering choices within the brief | Daily WhatsApp/Discord discussions, meetings every second day after 11:00, issues, meaningful two-reviewer PRs and joint baseline review |
| STK-007 | SEN381 lecturer/assessor; S4 sections 19, 20 and 23 | A defensible product and authentic individual/team evidence that meets the project controls | High / high for assessment; not assumed to be the real organisation's management | Clarify ambiguous assessment requirements and demonstrate controlled evidence at milestones |

## 2.3 Stakeholder needs for requirements derivation

| Need ID | Need | Stakeholder/source | Priority basis and scope link |
| --- | --- | --- | --- |
| NEED-001 | A valid new request can be recorded with enough information to act on it | STK-001, STK-002; S4 section 3, requester submission | Required minimum; SCP-001 |
| NEED-002 | Requests use a controlled category mechanism that supports routing and reporting | STK-001, STK-004; S4 section 3, requester categorisation | Required minimum; SCP-002 |
| NEED-003 | Requesters can find their earlier requests, inspect current status and understand submission/lifecycle outcomes | STK-001; S4 section 3, requester visibility and feedback | Required minimum; SCP-003 to SCP-005 |
| NEED-004 | Staff can locate relevant authorised work and inspect its details using useful search/filter/sort criteria | STK-002; S4 section 3, staff visibility/search/details | Required minimum; SCP-006 to SCP-008 |
| NEED-005 | A request has explicit responsibility that can be assigned or accepted under agreed permissions | STK-002, STK-004; S4 sections 2 and 3 | Required minimum; SCP-009 |
| NEED-006 | Changes, actions and resolution/closure follow defined responsibilities and permitted transitions | STK-002, STK-004; S4 section 3, staff lifecycle and actions | Required minimum; SCP-010 to SCP-012 |
| NEED-007 | Management can identify service activity and distinguish open, overdue, resolved and closed work | STK-003; S4 section 3, management oversight | Required minimum; SCP-013, SCP-014 |
| NEED-008 | Management can analyse work by useful dimensions and obtain sufficient information to explain responsibility and progress | STK-003; S4 section 3, management analysis/accountability | Required minimum; SCP-015, SCP-016 |
| NEED-009 | Access and disclosure match justified responsibilities, including treatment of sensitive request information | STK-001, STK-002, STK-005; S4 sections 2, 3 and 16 | Cross-cutting security obligation; SCP-006, SCP-017 |
| NEED-010 | The platform can be verified, operated and recovered using available resources | STK-005, STK-006; S4 sections 4, 15, 17 and 18 | Lifecycle obligation; SCP-018; CON-002, CON-009, CON-012 |
| NEED-011 | The team can demonstrate controlled collaboration and defend evidence individually | STK-006, STK-007; S4 sections 8-11 and 19 | Project/process obligation; CON-001, CON-007, CON-008 |

These needs are not the final functional/non-functional requirements. Steven must add unique requirement IDs, priority, precise behaviour and measurable acceptance criteria and link them through the RTM [S4, section 11].

## 2.4 Meaningful conflicts and proposed resolutions

| Conflict | Competing expectations | Proposed resolution for validation | Consequence for later work |
| --- | --- | --- | --- |
| Visibility versus confidentiality | Requesters and management want useful progress information; staff/support must prevent inappropriate disclosure | Separate requester-visible progress from restricted details; define a permission/visibility matrix before baselining access requirements | Shapes UI/API access checks, data exposure rules and negative security tests; does not justify an unrestricted management role |
| Quick submission versus actionable information | Requesters benefit from a short form; staff need enough context to categorise and act | Agree only the necessary required fields, validate them clearly, and record how missing information is handled | Affects validation, acceptance criteria, data collection and usability; field list remains Q-001 |
| Flexible handling versus accountable status | Staff need to correct assignments and update work efficiently; management needs consistent history | Define authorised transitions and retain attributable changes; decide how correction, rejection and closure are represented | Shapes lifecycle requirements, reporting definitions and tests; exact transitions remain Q-003 |
| Rich reports versus sustainable scope | Management could benefit from exports and predictive analysis; the three-person team has limited capacity | Deliver the mandatory oversight views first; propose advanced analytics as future scope subject to impact analysis | Preserves required reporting while controlling extra security, implementation, testing and cost obligations |
| Fast completion versus independent review | Ryno wants to finish promptly; team governance requires both other members to review substantive changes | Submit coherent artefact units early and reserve review time within daily capacity | Requires authentic PR/review evidence and prevents approval becoming a last-minute dependency |

These conflicts are reasoned from the scenario and project constraints, not claims of observed stakeholder disputes.

## 2.5 Examples to hand to Steven

**Example A - requester visibility.** S4 section 3 -> STK-001 -> NEED-003 -> SCP-003/SCP-004. Candidate behaviour: an authorised requester can retrieve the current status and history/list of their submitted requests. Candidate acceptance scenario: seed two requesters with distinct requests; verify each sees the correct own list and current state after a permitted staff update. Whether either may see another person's requests must follow the agreed access policy, with denied-access cases included. Steven assigns final FR/NFR and acceptance IDs after review.

**Example B - overdue reporting.** S4 section 3 -> STK-003 -> NEED-007 -> SCP-014. Working behaviour: a request is overdue when its agreed target date/time has passed and it is not Resolved, Closed or Rejected. The target is set by authorised staff or a manager during acceptance/assignment. Candidate acceptance scenario: use records either side of the due-time boundary and records in excluded states; compare the result to this rule. Steven should convert the rule into a testable requirement and the team should formally approve it.

These examples demonstrate currently available traceability. Design, implementation, test execution and release evidence are added later, not marked complete now [S1, section 3; S4, section 11.1].

**References:** [Source register](README.md#3-source-register), S4 sections 2-4, 8, 11, 16-19; S1 section 3; S2 and S3.
