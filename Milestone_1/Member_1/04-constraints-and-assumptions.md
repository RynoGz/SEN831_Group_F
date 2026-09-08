# 4. Constraints and assumptions

Version 0.2 | 7 September 2026 | Responsible student: Ryno Goetz | Confirmed constraints and selected working policies; review pending

## 4.1 Constraint register

The Master brief defines constraints on scope, four-milestone delivery, cost, quality, security and technology decisions. The following analysis applies those constraints to this team and CivicConnect's request workflow [S4, sections 4 and 18]. Proposed IDs support traceability and do not replace Willem's Risk Register.

| ID | Category and constraint | Source/status | Engineering implication and planned response |
| --- | --- | --- | --- |
| CON-001 | Exactly three team members; each must contribute and defend the full project | S4 sections 7.1-8; S2 records Ryno, Steven and Willem | Assign primary owners and both non-author reviewers. Plan review capacity; specialisation does not remove shared understanding |
| CON-002 | All three members are available every day for four hours each | S3; confirmed by Ryno | Gross daily capacity is 12 person-hours. Discussion, meetings, review and corrections count within it; record actual effort separately |
| CON-003 | Delivery through four formal milestones; M1 is due 9 September 2026 | S4 sections 4 and 20; S3 confirms the M1 date | Complete author checks and handoff early enough for two genuine non-author reviews; later milestone dates still need the formal schedule |
| CON-004 | WhatsApp/Discord, daily discussions and a meeting every second day after 11:00 | S3; working arrangement agreed by all three members | Use frequent updates for dependencies; transfer material decisions/actions to controlled repository records |
| CON-005 | Every minimum business capability must remain in controlled product scope; additions need justification | S4 sections 3-4; SCP-001 to SCP-016 map the minimums | Protect the core lifecycle and oversight. Assess integrations/analytics separately; do not silently drop feedback, overdue views or authorised closure |
| CON-006 | Requirements and quality expectations need traceable, measurable evidence | S4 sections 11 and 15; S1 section 3 | Define useful performance/usability/reliability criteria and test conditions with Steven. Avoid unsupported adjectives or invented traffic targets |
| CON-007 | One controlled repository, protected main, PRs and two independent non-author approvals; no substantive direct development on main | S4 section 9; all three members have full repository access, but protection/evidence must be checked | Use task branches and meaningful reviews for documents as well as code. A one-approval setting alone would not meet the brief's two-approval rule |
| CON-008 | PED/RTM evolve with controlled history; evidence and AI accountability must be authentic | S4 sections 6, 8, 10-11 and 23 | Preserve identifiers/version history, record real contributions and verification, and integrate approved Member 1 content into the PED |
| CON-009 | Prefer free/low-cost services where practical while recognising limits and likely ongoing costs | S4 sections 4 and 18; Ryno reported no additional budget, device, connectivity or software limitations | Evaluate future service quotas, storage, messaging and operating cost. Optional external notifications may affect both budget and reliability |
| CON-010 | Request data may be sensitive; security is required throughout the lifecycle | S4 sections 2, 4 and 16 | Define authorised visibility, least privilege, permitted status actions and sensitive-information handling. Verify denial as well as authorised use later; record residual risk |
| CON-011 | No prescribed stack; the team must justify capability and environment compatibility | S4 sections 4, 18.1 and 25 | Do not choose a stack in M1 without evidence. Assess learning curve, available devices/environment, security, testing and hosting fit before a later decision |
| CON-012 | Development, test, staging and production have distinct verification and operational concerns | S4 section 17 | Identify configuration, recovery and operational evidence needs now, for Willem's forward considerations. M1 does not implement production deployment |

## 4.2 Assumptions requiring validation

| ID | Assumption used in the proposal | Impact if wrong | Owner/action |
| --- | --- | --- | --- |
| ASM-001 | One organisation's service-request workflow is the selected initial context; no multi-tenant product commitment | Multiple independent organisations could alter identity, isolation, reporting, costs and administration | Team confirms during formal scope review |
| ASM-002 | In-application feedback is the selected initial mechanism; external messaging is deferred | A later off-platform need could require delivery retries, privacy controls and added costs | Steven specifies in-app outcomes; Willem records the deferment/risk |
| ASM-003 | Coordination/management is a responsibility set rather than proof of a separate organisational department | A real distinct role could require adjusted permissions and workflow cases | Validate when an organisational representative becomes available |
| ASM-004 | Four hours per member per day includes meetings and reviews, and all members are available daily | Confirmed by Ryno on 7 September 2026 | Plan and record effort on this basis; update if availability changes |
| ASM-005 | Fictional, non-sensitive test requests will be used for early verification | A later need for real records would introduce approval, access and data-handling constraints | Steven/Willem preserve this test-data rule and record any exception |

Except for ASM-004, these are team-selected planning positions rather than confirmed client facts. Material assumptions should be reviewed for risk treatment under S4 section 12.

## 4.3 Constraint interactions and trade-offs

**Visibility versus sensitive information (CON-005/CON-010).** SCP-003 and SCP-008 require meaningful views, while the scenario includes sensitive requests. Showing every field to every user would simplify a display but violate role-related access needs. Define requester-visible progress separately from restricted information and then derive a permission matrix. This affects requirements, data/API/UI boundaries, audit information and negative tests; the actual authentication technology remains a later decision.

**Fast completion versus review capacity (CON-001/CON-002/CON-007).** Each author needs the other two members' approvals. Completing Ryno's drafts early cannot by itself complete the baseline if Steven or Willem is unavailable. Submit the four coherent stages described in STAGES.md, reserve daily review time and resolve cross-artefact questions at the every-second-day meeting. Maintain meaningful review instead of treating approval as administrative overhead.

**Feedback versus cost and delivery reliability (CON-005/CON-006/CON-009).** Feedback is required. The working baseline uses in-application feedback and defers external notification services, which would add delivery failure states, usage limits, configuration and likely operating costs. If later evidence requires external delivery, assess scope, reliability, security, tests and budget together.

**Overdue reporting versus workflow policy (CON-005/CON-006).** The selected rule marks work overdue when its agreed target date/time has passed and it is not Resolved, Closed or Rejected; authorised staff or a manager sets the target during acceptance/assignment. Steven must make the time boundary testable and link the outcome to SCP-010/SCP-012/SCP-014 and the RTM.

**Technology familiarity versus future operation (CON-003/CON-009/CON-011/CON-012).** A familiar development tool may reduce initial effort but still create compatibility, hosting, recovery or service-cost problems. Keep stack selection open in M1 and gather the evidence needed for M2. The institution does not guarantee that every chosen technology will run on its environment [S4, sections 18.1 and 25].

## 4.4 Policy answers and remaining questions

The team can use the following working answers now and validate them with an appropriate lecturer/client representative when required.

| ID | Question | Affected work | Responsible follow-up |
| --- | --- | --- | --- |
| Q-001 | Use the request fields and seven categories in scope section 3.1.1; category changes are controlled by authorised management/administration. | SCP-001/SCP-002; validation, classification and quality criteria | Steven converts to requirements; team reviews |
| Q-002 | Requesters see their own work; authorised staff see relevant work; coordinators/managers assign and report; management has no blanket sensitive access; administration does not imply business-data access. | SCP-006/SCP-008 to SCP-012/SCP-016/SCP-017 | Steven specifies permission cases; Willem reviews security risk |
| Q-003 | Submitted -> Accepted -> Assigned -> In Progress -> Resolved -> Closed, with authorised rejection, reassignment and requested reopening; all changes attributable. | SCP-003/SCP-005/SCP-010/SCP-012/SCP-014 | Steven specifies transitions and acceptance cases |
| Q-004 | Overdue means the target date/time has passed and state is not Resolved, Closed or Rejected; authorised staff/manager sets target on acceptance/assignment. | SCP-014 and reporting acceptance cases | Steven makes the boundary testable |
| Q-005 | Provide in-application feedback for accepted, rejected, updated, resolved and closed events; external channels are deferred. Exact response-time targets remain to be agreed. | SCP-005, FUT-004, cost/reliability/security | Steven specifies behaviour; Willem records deferment |
| Q-006 | Apply least privilege, a sensitive-information indicator and fictional/non-sensitive test data. Exact retention period remains open because neither brief states it. | SCP-004/SCP-008/SCP-016/SCP-017 and recovery concerns | Steven/Willem preserve the open retention item |
| Q-007 | No extra budget/device/connectivity/software limitations are reported. Exact user volumes, operating hours and measurable performance targets remain open. | Performance, usability, reliability and operational requirements | Steven proposes measurable targets for team review |

The M1 submission date is 9 September 2026. All three members have full repository access and no extra resource limitations are reported. Team-registration evidence remains unconfirmed; the Master lists 31 August 2026 as the registration deadline [S4, section 7.1]. No missed registration is inferred from the absence of evidence. No separate M1 Excel Rubric/Marking Guide has been received.

## 4.5 Handoff

Steven links constraints, assumptions and policy answers to requirements and the RTM. Willem assesses risks such as review delay, ambiguous overdue policy, inappropriate data visibility and future service costs, using his required probability/impact/mitigation fields. When an assumption is validated or rejected, update this record and affected scope/requirements/risks under review; after baseline apply formal change control [S4, sections 11-14].

**References:** [Source register](README.md#3-source-register), S4 sections 2-4, 6-18, 20, 23 and 25; S1 sections 3-5; S2 and S3.
