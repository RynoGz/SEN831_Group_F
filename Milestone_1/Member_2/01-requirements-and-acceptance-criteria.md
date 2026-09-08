# 1. Requirements and Acceptance Criteria

**Project:** CivicConnect — Community Service Request Management Platform
**Responsible student:** Steven Riaan Piek
**Version:** 0.3 | 8 September 2026
**Status:** Proposed requirements; team review and formal M1 baseline approval pending
**Reviewers:** Ryno Goetz and Willem Booysen

## 1.1 Purpose

This document defines the proposed functional requirements (FR) and non-functional requirements (NFR) for CivicConnect for Milestone 1.

The requirements are derived from:

- the SEN381 CivicConnect Master Project Brief;
- Ryno Goetz's Member 1 stakeholder, scope, constraints and assumptions artefacts, version 0.2;
- the stakeholder needs (`NEED-*`) and scope capabilities (`SCP-*`) established by Member 1;
- requirements-engineering guidance from ISO/IEC/IEEE 29148:2018; and
- product-quality guidance from ISO/IEC 25010:2023.

The Member 1 artefacts are a recommended working baseline, not yet a formally approved team baseline. Therefore, these requirements remain proposed until the team completes review and formal sign-off.

## 1.2 Requirement conventions

| Field | Meaning |
|---|---|
| **ID** | Stable requirement identifier (`FR-*` or `NFR-*`) |
| **Source / stakeholder** | Primary source and stakeholder(s) affected |
| **Need / scope** | Traceability to Member 1 `NEED-*` and `SCP-*` |
| **Priority** | **Must** = required minimum capability; **Should** = important cross-cutting quality obligation |
| **Status** | Proposed until team baseline approval |

The wording uses **shall** for mandatory requirements. Open policy questions are not silently answered where the Member 1 artefacts identify them as unresolved.

# 2. Functional Requirements

## FR-001 — Submit a service request

**Source / stakeholders:** S4 section 3; STK-001 Requesters; STK-002 Authorised service staff
**Need / scope:** NEED-001 / SCP-001
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall permit a requester to submit a new service request with a title, description, category, location, requester identity/contact information, and a sensitive-information indicator. The system shall automatically record the submission date/time and allow an optional attachment.

**Acceptance criteria:**

1. A submission is rejected when any required field is missing.
2. A successfully submitted request contains all required request information.
3. The submission date/time is recorded automatically rather than entered manually by the requester.
4. Omitting an attachment does not prevent a valid request from being submitted.
5. After successful submission, the request is recorded in the `Submitted` state.
6. The M1 capability does not require live ingestion from WhatsApp, email, telephone, or paper workflows.

## FR-002 — Controlled request categorisation

**Source / stakeholders:** S4 section 3; STK-001 Requesters; STK-004 Service coordination
**Need / scope:** NEED-002 / SCP-002
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall provide a controlled category mechanism using the initial categories defined in the Member 1 working scope baseline: Maintenance, IT support, Facility fault, Damaged equipment, Security concern, Lost property, and Other.

**Acceptance criteria:**

1. A requester selects a category from the available controlled category set.
2. A submitted request stores the selected category.
3. The initial category set contains the seven categories defined in the Member 1 working scope baseline.
4. A request cannot use an uncontrolled free-text category value instead of a controlled category.
5. The M1 requirement does not require AI-based automatic classification.

## FR-003 — View current request status

**Source / stakeholders:** S4 section 3; STK-001 Requesters
**Need / scope:** NEED-003 / SCP-003
**Priority:** Must
**Status:** Proposed

**Requirement:**
An authorised requester shall be able to view the status of their submitted service requests through CivicConnect.

**Acceptance criteria:**

1. An authorised requester can view the status of a request they are permitted to access.
2. The displayed status matches the recorded lifecycle state of the request.
3. A requester cannot access another request through the status view without authorisation.
4. Status values shown to the requester use the controlled lifecycle terminology.

## FR-004 — View request history/list

**Source / stakeholders:** S4 section 3; STK-001 Requesters
**Need / scope:** NEED-003 / SCP-004
**Priority:** Must
**Status:** Proposed

**Requirement:**
Upon confirmation of the retention policy, CivicConnect shall permit an authorised requester to view a retrievable list/history of their previously submitted service requests.

**Acceptance criteria:**

1. An authorised requester can retrieve requests they are permitted to view.
2. The history identifies each request sufficiently to distinguish it from other requests.
3. Historic requests preserve their recorded lifecycle information.
4. The system does not claim infinite storage; the final retention period remains subject to confirmation.

## FR-005 — Provide in-application request feedback

**Source / stakeholders:** S4 section 3; STK-001 Requesters
**Need / scope:** NEED-003 / SCP-005
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall provide the requester with meaningful in-application feedback when a request is accepted, rejected, updated, resolved, or closed.

**Acceptance criteria:**

1. The requester can identify when their request has been accepted.
2. The requester can identify when their request has been rejected.
3. The requester can identify relevant updates to their request.
4. The requester can identify when their request is resolved.
5. The requester can identify when their request is closed.
6. The M1 requirement does not require SMS, WhatsApp, or email notification delivery.

## FR-006 — View work relevant to authorised staff

**Source / stakeholders:** S4 section 3; STK-002 Authorised service staff
**Need / scope:** NEED-004, NEED-009 / SCP-006
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall allow authorised service staff to access service requests consistent with their duties and permissions.

**Acceptance criteria:**

1. An authorised staff user can view requests within the scope of their permitted work.
2. A staff member cannot automatically view all requests merely because they are staff.
3. Access decisions are based on the agreed responsibility and permission model.
4. Sensitive requests remain subject to the applicable access rules.

## FR-007 — Search, filter and sort requests

**Source / stakeholders:** S4 section 3; STK-002 Authorised service staff
**Need / scope:** NEED-004 / SCP-007
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall permit authorised staff to search, filter, and/or sort service requests according to useful criteria agreed for the operational workflow.

**Acceptance criteria:**

1. An authorised staff member can retrieve relevant requests using the agreed search, filter, and/or sort capabilities.
2. Search and filtering apply only to requests the user is authorised to access.
3. The returned results match the selected search, filter, or sort criteria.
4. Exact operational criteria are confirmed during requirements review rather than invented as an M1 fact.
5. A sophisticated search engine is not required unless the team justifies it.

## FR-008 — View authorised request details

**Source / stakeholders:** S4 section 3; STK-002 Authorised service staff
**Need / scope:** NEED-004, NEED-009 / SCP-008
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall allow an authorised user to view request details within the scope of their responsibility and access rights, including sensitive information only where authorised.

**Acceptance criteria:**

1. An authorised user can view request information permitted by their role or responsibility.
2. Sensitive information is not displayed to a user without the required authorisation.
3. The detailed view includes the request information captured by FR-001, subject to the user's permissions.
4. Administrative rights do not automatically grant access to business request details.

## FR-009 — Assign, accept and reassign responsibility

**Source / stakeholders:** S4 sections 2–3; STK-002 Authorised service staff; STK-004 Service coordination
**Need / scope:** NEED-005 / SCP-009
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall allow authorised staff to accept or be assigned responsibility for a service request, and shall allow authorised coordinators or managers to assign or reassign responsibility.

**Acceptance criteria:**

1. An authorised staff user can accept responsibility where permitted.
2. An authorised coordinator or manager can assign responsibility to an appropriate staff user.
3. An authorised coordinator or manager can reassign responsibility where permitted.
4. A user without the required permission cannot assign or reassign responsibility.
5. The current responsible user or responsibility state is identifiable for the request.

## FR-010 — Enforce controlled request status transitions

**Source / stakeholders:** S4 section 3; STK-002 Authorised service staff; STK-004 Service coordination
**Need / scope:** NEED-006 / SCP-010
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall enforce the working request lifecycle **Submitted → Accepted → Assigned → In Progress → Resolved → Closed**, with controlled rejection from `Submitted`, authorised reassignment, and a controlled mechanism for requesting reopening.

**Acceptance criteria:**

1. A newly submitted request starts in the `Submitted` state.
2. A request can transition only through transitions permitted by the agreed lifecycle rules.
3. An authorised user can reject a request only when it is in the `Submitted` state and the user's permissions allow rejection.
4. Assignment and reassignment are permitted only for authorised users.
5. A status change records the user responsible for the change.
6. An unauthorised or invalid status transition is blocked.
7. Reopening follows the detailed policy confirmed through Q-003 before formal baseline approval.

## FR-011 — Record actions, comments and resolution information

**Source / stakeholders:** S4 section 3; STK-002 Authorised service staff
**Need / scope:** NEED-006 / SCP-011
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall permit authorised staff to record relevant actions, comments, and resolution information against a service request, with recorded information controlled for its intended visibility.

**Acceptance criteria:**

1. An authorised user can record a relevant action or comment against a request.
2. An authorised user can record resolution information when resolving work.
3. Recorded entries remain associated with the correct request.
4. Where the final policy requires it, the system distinguishes requester-visible information from information restricted to authorised users.
5. Accountable actions have a responsible user attached to them.

## FR-012 — Resolve or close requests when authorised

**Source / stakeholders:** S4 section 3; STK-002 Authorised service staff; STK-004 Service coordination
**Need / scope:** NEED-006 / SCP-012
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall permit only authorised users to resolve or close service requests in accordance with the controlled request lifecycle and agreed responsibilities.

**Acceptance criteria:**

1. An authorised user can move a request to `Resolved` when the agreed resolution conditions are met.
2. An authorised user can move a request to `Closed` when the agreed closure conditions are met.
3. An unauthorised user cannot resolve or close a request.
4. The system records the user responsible for the resolution or closure action.
5. The distinction between `Resolved` and `Closed`, together with detailed reopening rules, is confirmed before formal baseline approval.

## FR-013 — View service activity

**Source / stakeholders:** S4 section 3; STK-003 Management/oversight
**Need / scope:** NEED-007 / SCP-013
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall provide authorised management/oversight users with sufficient service activity information to monitor the request workflow.

**Acceptance criteria:**

1. An authorised management/oversight user can view organisational service activity within their permitted scope.
2. The activity information includes recorded requests and relevant lifecycle information.
3. Access to the activity view is restricted according to the agreed permission model.
4. The management view is validated against representative request scenarios before baseline approval.

## FR-014 — Identify open, overdue, resolved and closed work

**Source / stakeholders:** S4 section 3; STK-003 Management/oversight
**Need / scope:** NEED-007 / SCP-014
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall permit authorised users to identify open, overdue, resolved, and closed service requests using the agreed lifecycle and overdue definitions.

**Acceptance criteria:**

1. Requests in the relevant open states can be identified separately from resolved, closed, and rejected requests.
2. Open work can be identified from the controlled lifecycle state.
3. A request is considered overdue when its agreed target date/time has passed and its status is not `Resolved`, `Closed`, or `Rejected`.
4. The target date/time is set by an authorised staff member or manager according to the working policy.
5. Overdue classification is verified using a controlled test case at or around the target date/time boundary.

## FR-015 — Analyse requests by category, status and justified dimensions

**Source / stakeholders:** S4 section 3; STK-003 Management/oversight
**Need / scope:** NEED-008 / SCP-015
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall permit authorised users to analyse requests by category and status, and, where justified, by other agreed dimensions.

**Acceptance criteria:**

1. Authorised management users can group, filter, or otherwise present request information by category.
2. Authorised management users can analyse request information by lifecycle status.
3. Any additional analysis dimension is included only when its operational value is justified and agreed.
4. The analysis respects the visibility permissions of the authorised user.
5. Predictive analytics are not required for M1.

## FR-016 — Support accountability and service-performance analysis

**Source / stakeholders:** S4 section 3; STK-003 Management/oversight
**Need / scope:** NEED-008 / SCP-016
**Priority:** Must
**Status:** Proposed

**Requirement:**
CivicConnect shall retain sufficient information about attributable requests, responsibilities, and progress to support accountability and service-performance analysis.

**Acceptance criteria:**

1. The system retains sufficient lifecycle history to determine how a request progressed.
2. Responsibility for relevant work can be identified from recorded request information.
3. Status changes can be attributed to the user who made them.
4. Management can explain request progress and responsibility using recorded information.
5. Predictive analytics and a data warehouse are not required for M1.

# 3. Non-Functional Requirements

## NFR-001 — Authorisation and least-privilege access

**Source / stakeholders:** S4 sections 2, 4 and 16; STK-001, STK-002, STK-003, STK-005
**Need / scope:** NEED-009 / SCP-017
**Priority:** Should
**Status:** Proposed

**Requirement:**
Using the least-privilege approach, CivicConnect shall limit request access and permitted actions according to authorised responsibilities.

**Acceptance criteria:**

1. A requester can view their own requests in accordance with the agreed visibility policy.
2. Staff can view work relating to their authorised role or responsibility.
3. Only authorised users can assign, reassign, change status, resolve, or close requests.
4. Access to management reporting is permission-controlled.
5. Administrative privileges do not automatically grant business-data access.

## NFR-002 — Sensitive-information protection

**Source / stakeholders:** S4 sections 2, 4 and 16; STK-001, STK-002, STK-005
**Need / scope:** NEED-009 / SCP-017
**Priority:** Should
**Status:** Proposed

**Requirement:**
CivicConnect shall prevent unauthorised disclosure of sensitive request information throughout the request lifecycle.

**Acceptance criteria:**

1. Sensitive information is identified using the agreed sensitive-information indicator and protected according to the applicable access rules.
2. Only authorised users can view sensitive request information.
3. Unauthorised attempts to access protected information are denied.
4. Verification uses fictional, non-sensitive test data.
5. The final retention period is not invented in M1 and remains subject to confirmation.

## NFR-003 — Auditability and accountability

**Source / stakeholders:** S4 sections 3, 8 and 11; STK-002, STK-003, STK-006
**Need / scope:** NEED-006, NEED-008 / SCP-010, SCP-011, SCP-016
**Priority:** Should
**Status:** Proposed

**Requirement:**
CivicConnect shall maintain attributable records of relevant lifecycle changes, responsibility changes, and actions so that request history can be reviewed for accountability purposes.

**Acceptance criteria:**

1. Each status change identifies the resulting status and responsible user.
2. Assignments and reassignments are attributable to the user who performed them.
3. Relevant actions, comments, and resolution information remain associated with the request.
4. The resulting history is sufficient to reconstruct how the request progressed during verification.

## NFR-004 — Usability and understandable feedback

**Source / stakeholders:** S4 sections 3 and 15; STK-001, STK-002, STK-003
**Need / scope:** NEED-001, NEED-003, NEED-004 / SCP-001, SCP-003 to SCP-007, SCP-013 to SCP-016
**Priority:** Should
**Status:** Proposed

**Requirement:**
CivicConnect shall present request information, status, and feedback in a form that the intended user can understand and use for the supported task.

**Acceptance criteria:**

1. Requesters can identify the current status of their own requests during representative task-based verification.
2. Feedback identifies the relevant request event or outcome.
3. Staff can identify relevant work by following an agreed search, filter, and/or sort workflow.
4. Management can interpret the status and activity information used for oversight.
5. Usability is supported by defined verification tasks and criteria rather than an unsupported claim that the system is "user-friendly."

## NFR-005 — Data integrity and consistency

**Source / stakeholders:** S4 sections 3, 11 and 15; STK-002, STK-003
**Need / scope:** NEED-001, NEED-005, NEED-006, NEED-008 / SCP-001, SCP-009 to SCP-016
**Priority:** Should
**Status:** Proposed

**Requirement:**
CivicConnect shall maintain consistency between recorded request details, responsibility, lifecycle state, and attributable history.

**Acceptance criteria:**

1. Each request has one current lifecycle state at a time.
2. Changes in responsibility are recorded consistently.
3. The status history reflects the status changes that occurred.
4. An unauthorised or invalid transition does not leave the request in an inconsistent lifecycle state.
5. Repeated and boundary cases are included in later verification.

## NFR-006 — Performance under agreed operating conditions

**Source / stakeholders:** S4 sections 15 and 18; STK-003, STK-005, STK-006
**Need / scope:** NEED-010 / SCP-018
**Priority:** Should
**Status:** Proposed

**Requirement:**
CivicConnect shall support responsive request submission, retrieval, search, filtering, sorting, and oversight operations under the agreed operating conditions and workload.

**Acceptance criteria:**

1. The team defines the operating conditions and representative workload required for quantitative performance verification.
2. Performance verification includes request submission and retrieval, search/filter/sort, and management-view operations.
3. Performance results are recorded against the agreed test conditions.
4. No unsupported response-time or user-volume target is claimed until the required workload information is available.

## NFR-007 — Reliability and recoverability

**Source / stakeholders:** S4 sections 15, 17 and 18; STK-005, STK-006
**Need / scope:** NEED-010 / SCP-018
**Priority:** Should
**Status:** Proposed

**Requirement:**
CivicConnect shall support controlled recovery of service-request information and configuration appropriate to the agreed operating environment.

**Acceptance criteria:**

1. The team identifies the information and configuration that must be recoverable.
2. A recovery test demonstrates restoration of the agreed recoverable information.
3. Recovery evidence records where and how the recovery procedure was performed.
4. Numerical recovery objectives are not assigned in M1 unless supported by agreed project evidence.

## NFR-008 — Maintainability and controlled change

**Source / stakeholders:** S4 sections 6, 8, 11 and 18; STK-006 Project team
**Need / scope:** NEED-010, NEED-011 / SCP-018
**Priority:** Should
**Status:** Proposed

**Requirement:**
Using requirement identifiers, traceability, version history, and verification evidence, CivicConnect and its engineering artefacts shall support controlled change.

**Acceptance criteria:**

1. Requirements retain stable identifiers unless a controlled change explicitly requires a new identifier.
2. Approved requirement changes are reflected in the RTM and affected artefacts.
3. Design, implementation, and test evidence can later be associated with the applicable requirement.
4. Material changes follow the team-controlled change process.
5. Repository history records substantial changes without silently overwriting approved evidence.

# 4. Open Questions and Controlled Deferrals

The following items remain open because the Member 1 artefacts explicitly identify them as requiring confirmation.

| Open question | Affected requirements | Current control |
|---|---|---|
| **Q-001:** Exact required request information, categories, and who may change them | FR-001, FR-002, FR-007 | Use the Member 1 working policy for M1; confirm before formal baseline |
| **Q-002:** Final roles, visibility, assignment/reassignment, resolve/close authority | FR-006, FR-008, FR-009, FR-012, NFR-001 | Use least-privilege working policy; confirm the exact permission matrix |
| **Q-003:** Detailed state-transition, rejection, resolved/closed, and reopening policy | FR-010, FR-012 | Use the lifecycle in the Member 1 scope; confirm detailed transition rules |
| **Q-004:** Final overdue definition, time basis, and state treatment | FR-014 | Use the current working overdue definition; verify boundary cases |
| **Q-005:** Final feedback timing, content, and mechanism | FR-005 | In-application feedback is the working policy; confirm detailed content/timing |
| **Q-006:** Sensitive-information handling and retention policy | FR-004, FR-008, NFR-002 | Use least privilege and non-sensitive test data; confirm retention |
| **Q-007:** User volumes, operating hours, devices/connectivity, and other conditions needed to define measurable quality criteria | NFR-004, NFR-006, NFR-007 | Do not invent numerical quality targets; confirm operating conditions before quantitative verification |

No numerical performance, workload, retention, or recovery target has been invented where the available project evidence does not establish one.

# 5. Requirements Quality Basis

The requirements are intended to be clear, uniquely identifiable, traceable to sources/stakeholders, and verifiable. ISO/IEC/IEEE 29148:2018 provides the requirements-engineering basis for requirements processes and information items. ISO/IEC 25010:2023 provides the product-quality model used to structure the cross-cutting quality requirements.

The project Master Brief remains the authoritative source for project-specific requirements and controls. The ISO standards are supporting engineering references and do not override the assignment brief.

# 6. Sources

- **S1:** SEN381 Teaching Team, SEN381 CivicConnect Project: Milestone 1 (M1) — Engineering Foundation & Requirements Baseline.
- **S4:** SEN381 Teaching Team, CivicConnect Master Project Brief: Community Service Request Management Platform, version 1.1.
- **R1:** Ryno Goetz, Member 1 — Stakeholder Analysis, version 0.2, 7 September 2026.
- **R2:** Ryno Goetz, Member 1 — Scope Baseline, version 0.2, 7 September 2026.
- **R3:** Ryno Goetz, Member 1 — Constraints and Assumptions, version 0.2, 7 September 2026.
- **R4:** Ryno Goetz, Member 1 — Team Working Agreement, version 0.2, 7 September 2026.
- **ISO/IEC/IEEE 29148:2018:** Requirements engineering processes and information items. https://www.iso.org/standard/72089.html
- **ISO/IEC 25010:2023:** Product quality model. https://www.iso.org/standard/78176.html
