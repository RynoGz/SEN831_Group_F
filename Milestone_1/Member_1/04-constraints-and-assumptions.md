# 4. Constraints and assumptions

Version 0.1 | 7 September 2026 | Responsible student: Ryno Goetz | Draft for review

## 4.1 Constraint register

The Master brief defines constraints on scope, four-milestone delivery, cost, quality, security and technology decisions. The following analysis applies those constraints to this team and CivicConnect's request workflow [S4, sections 4 and 18]. Proposed IDs support traceability and do not replace Willem's Risk Register.

| ID | Category and constraint | Source/status | Engineering implication and planned response |
| --- | --- | --- | --- |
| CON-001 | Exactly three team members; each must contribute and defend the full project | S4 sections 7.1-8; S2 records Ryno, Steven and Willem | Assign primary owners and both non-author reviewers. Plan review capacity; specialisation does not remove shared understanding |
| CON-002 | Four hours per member per day, confirmed by Ryno | S3; availability for specific days remains unconfirmed | If all three work on a day, gross capacity is 12 person-hours. Budget discussion, meetings, review and corrections within it; record actual effort separately |
| CON-003 | Delivery through four formal milestones within the module period | S4 sections 4 and 20; actual milestone dates not supplied | Obtain official dates, set internal review targets, and track variance. Ryno's wish to finish quickly supports early handoff but is not a deadline |
| CON-004 | WhatsApp/Discord, daily discussions and a meeting every second day | S3; detailed workflow proposed in the working agreement | Use frequent updates for dependencies; transfer material decisions/actions to controlled repository records |
| CON-005 | Every minimum business capability must remain in controlled product scope; additions need justification | S4 sections 3-4; SCP-001 to SCP-016 map the minimums | Protect the core lifecycle and oversight. Assess integrations/analytics separately; do not silently drop feedback, overdue views or authorised closure |
| CON-006 | Requirements and quality expectations need traceable, measurable evidence | S4 sections 11 and 15; S1 section 3 | Define useful performance/usability/reliability criteria and test conditions with Steven. Avoid unsupported adjectives or invented traffic targets |
| CON-007 | One controlled repository, protected main, PRs and two independent non-author approvals; no substantive direct development on main | S4 section 9; actual remote settings not verified | Use task branches and meaningful reviews for documents as well as code. Schedule both reviews and capture authentic evidence |
| CON-008 | PED/RTM evolve with controlled history; evidence and AI accountability must be authentic | S4 sections 6, 8, 10-11 and 23 | Preserve identifiers/version history, record real contributions and verification, and integrate approved Member 1 content into the PED |
| CON-009 | Prefer free/low-cost services where practical while recognising limits and likely ongoing costs | S4 sections 4 and 18; no numeric budget supplied | Evaluate future service quotas, storage, messaging and operating cost. Optional external notifications may affect both budget and reliability |
| CON-010 | Request data may be sensitive; security is required throughout the lifecycle | S4 sections 2, 4 and 16 | Define authorised visibility, least privilege, permitted status actions and sensitive-information handling. Verify denial as well as authorised use later; record residual risk |
| CON-011 | No prescribed stack; the team must justify capability and environment compatibility | S4 sections 4, 18.1 and 25 | Do not choose a stack in M1 without evidence. Assess learning curve, available devices/environment, security, testing and hosting fit before a later decision |
| CON-012 | Development, test, staging and production have distinct verification and operational concerns | S4 section 17 | Identify configuration, recovery and operational evidence needs now, for Willem's forward considerations. M1 does not implement production deployment |

## 4.2 Assumptions requiring validation

| ID | Assumption used in the proposal | Impact if wrong | Owner/action |
| --- | --- | --- | --- |
| ASM-001 | One organisation's service-request workflow is the initial planning context; no multi-tenant product commitment | Multiple independent organisations could alter identity, isolation, reporting, costs and administration | Ryno validates intended deployment context before baseline |
| ASM-002 | In-platform feedback could satisfy the brief without mandatory external messaging | Urgent or off-platform feedback needs could require channels, delivery retries and added costs | Ryno/Steven resolve Q-005; Willem assesses risk/decision implications |
| ASM-003 | Service coordination can be a responsibility within staff/management, not a separate mandatory software role | Distinct responsibilities may require additional permissions and workflow cases | Ryno validates Q-002 with the stakeholder role analysis |
| ASM-004 | The daily four-hour allowance includes meetings and reviews; members can agree specific working days | Less available capacity or review overlap could delay the baseline | Each member confirms availability through the working agreement |
| ASM-005 | Illustrative/non-sensitive test requests can be used for early verification | A need for real records would introduce approval, access and data-handling constraints | Ryno confirms permitted evidence/data; Willem records any resulting risk |

These are not confirmed client facts. Material assumptions should be reviewed for risk treatment under S4 section 12.

## 4.3 Constraint interactions and trade-offs

**Visibility versus sensitive information (CON-005/CON-010).** SCP-003 and SCP-008 require meaningful views, while the scenario includes sensitive requests. Showing every field to every user would simplify a display but violate role-related access needs. Define requester-visible progress separately from restricted information and then derive a permission matrix. This affects requirements, data/API/UI boundaries, audit information and negative tests; the actual authentication technology remains a later decision.

**Fast completion versus review capacity (CON-001/CON-002/CON-007).** Each author needs the other two members' approvals. Completing Ryno's drafts early cannot by itself complete the baseline if Steven or Willem is unavailable. Submit the four coherent stages described in STAGES.md, reserve daily review time and resolve cross-artefact questions at the every-second-day meeting. Maintain meaningful review instead of treating approval as administrative overhead.

**Feedback versus cost and delivery reliability (CON-005/CON-006/CON-009).** Feedback is a required capability, but an external notification service adds delivery failure states, usage limits, configuration and likely operating costs. Propose evaluating an in-platform mechanism first, while keeping Q-005 open. If stakeholder timing needs require external delivery, assess scope, service reliability, security, tests and budget together rather than silently discarding feedback or claiming all channels are free.

**Overdue reporting versus ambiguous workflow (CON-005/CON-006).** A management view cannot reliably label work overdue without an agreed due-time rule and treatment of resolved/closed states. Guessing a time threshold would embed policy into later logic and tests. Resolve Q-003/Q-004 before approving the related requirements; link the outcome to SCP-010/SCP-012/SCP-014, Steven's RTM and Willem's Decision Log if a genuine decision is made.

**Technology familiarity versus future operation (CON-003/CON-009/CON-011/CON-012).** A familiar development tool may reduce initial effort but still create compatibility, hosting, recovery or service-cost problems. Keep stack selection open in M1 and gather the evidence needed for M2. The institution does not guarantee that every chosen technology will run on its environment [S4, sections 18.1 and 25].

## 4.4 Open policy questions for the baseline review

These are focused elicitation items, not reasons to invent policies. Where the scenario cannot answer them, the team should formulate explicit proposals and validate them with the appropriate lecturer/client representative.

| ID | Question | Affected work | Responsible follow-up |
| --- | --- | --- | --- |
| Q-001 | What information is required for each request, which categories are initially allowed, and who may change them? | SCP-001/SCP-002; validation, classification and quality criteria | Ryno with Steven |
| Q-002 | Which roles may see which requests/details, assign/reassign, resolve or close, and which actions require accountability records? | SCP-006/SCP-008 to SCP-012/SCP-016/SCP-017 | Ryno with Steven; Willem reviews security risk |
| Q-003 | Which states and transitions are permitted, including rejection, resolved versus closed and any reopening? | SCP-003/SCP-005/SCP-010/SCP-012/SCP-014 | Ryno with Steven |
| Q-004 | What makes a request overdue, what time basis applies, and how are different states treated? | SCP-014 and reporting acceptance cases | Ryno with Steven; management/representative clarification |
| Q-005 | How quickly and through which mechanism must each feedback outcome reach a requester? | SCP-005, FUT-004, cost/reliability/security | Ryno with Steven; Willem assesses alternatives |
| Q-006 | What information is sensitive, who needs it, how long is request/history data retained, and what test data is permitted? | SCP-004/SCP-008/SCP-016/SCP-017 and recovery concerns | Ryno with Steven/Willem |
| Q-007 | What user volumes, operating hours and devices/connectivity should measurable quality criteria cover? | Performance, usability, reliability and operational requirements | Ryno with Steven/Willem |

Official milestone dates, budget/resources and team-registration evidence remain project-administration confirmations. The Master lists 31 August 2026 as the team-registration deadline, not the M1 submission date [S4, section 7.1]. No missed registration is inferred from the absence of evidence in this pack.

## 4.5 Handoff

Steven links constraints, assumptions and policy answers to requirements and the RTM. Willem assesses risks such as review delay, ambiguous overdue policy, inappropriate data visibility and future service costs, using his required probability/impact/mitigation fields. When an assumption is validated or rejected, update this record and affected scope/requirements/risks under review; after baseline apply formal change control [S4, sections 11-14].

**References:** [Source register](README.md#3-source-register), S4 sections 2-4, 6-18, 20, 23 and 25; S1 sections 3-5; S2 and S3.
