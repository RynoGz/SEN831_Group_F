1. Requirements and Acceptance Criteria

Project: CivicConnect -- Community Service Request Management
Platform
Responsible student: Steven Riaan Piek
Version: 0.2 | 7 September 2026
Status: Proposed requirements; team review and formal M1 baseline
approval pending
Reviewers: Ryno Goetz and Willem Booysen

1.1 Purpose

This document defines the proposed functional requirements (FR) and
non-functional requirements (NFR) for CivicConnect for Milestone 1.

The requirements are derived from:

the SEN381 CivicConnect Master Project Brief;

Ryno Goetz's Member 1 stakeholder, scope, constraints and
assumptions artefacts, version 0.2;

the stakeholder needs (NEED-*) and scope capabilities (SCP-*)
established by Member 1;

requirements-engineering guidance from ISO/IEC/IEEE 29148:2018; and

product-quality guidance from ISO/IEC 25010:2023.

The Member 1 artefacts are a recommended working baseline, not yet a
formally approved team baseline. Therefore, these requirements remain
proposed until the team completes review and formal sign-off.

1.2 Requirement conventions

Field                               Meaning

ID                                  Stable requirement identifier
(FR-* or NFR-*)

Source / stakeholder                Primary source and stakeholder(s)
affected

Need / scope                        Traceability to Member 1 NEED-*
and SCP-*

Priority                            Must = required minimum
capability; Should = important
cross-cutting quality obligation

Status                              Proposed until team baseline
approval

The wording uses shall for mandatory requirements. Open policy
questions are not silently answered where the Member 1 artefacts
identify them as unresolved.

2. Functional Requirements

FR-001 --- Submit a service request

Source / stakeholders: S4 section 3; STK-001 Requesters; STK-002
Authorised service staff
Need / scope: NEED-001 / SCP-001
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall permit a requester to submit a new service request with a title, description, category, location, requester identity/contact information, and a sensitive-information indicator. This system shall automatically record the submission date/time and allow an optional attachment.

Acceptance criteria: 1. A request cannot be made when a is asked.
A required field is missing. 2. An successfully submitted request contains.
all required fields. 3. The submission date/time is recorded.
Automatically, instead of having to be entered manually by the requester. 4. An
Omitting attachment does not prevent submission. 5. The request
After a successful submission, it is recorded as submitted. 6. The system
Does not require live ingestion via WhatsApp, email, or telephone, or paper workflows.

FR-002 --- Controlled request categorisation

Source / stakeholders: S4 section 3; STK-001 Requesters; STK-004
Service coordination
Need / scope: NEED-002 / SCP-002
Priority: Must
Status: Proposed

Requirement:
CivicConnect provides a controlled category mechanism for the initial categories maintenance, IT support, facility fault, damaged equipment, security concern, lost property, and other.

Acceptance criteria: 1. A requester selects a category from the available options.
controlled category set. 2. A submitted request stores the chosen category. 3. The initial category set comprises the seven categories defined in the working scope baseline. 4. A request cannot use an uncontrolled free-text category value instead of a controlled category. 5. The system requires no AI-based automatic classification.

FR-003 --- View current request status

Source / stakeholders: S4 section 3; STK-001 Requesters
Need / scope: NEED-003 / SCP-003
Priority: Must
Status: Proposed

Requirement:
An authorised requester may view the status of submitted service requests through CivicConnect.

Acceptance criteria: 1. A requester may view the status of a project.
Ask them to allow access. 2. Its displayed status matches the recorded lifecycle state of the request. 3. A requester cannot access another request via the status view without authorization. 4. Those status values shown to the requester use controlled lifecycle terminology.

FR-004 --- View request history/list

Source / stakeholders: S4 section 3; STK-001 Requesters
Need / scope: NEED-003 / SCP-004
Priority: Must
Status: Proposed

Requirement:
Upon agreement of the retention policy, CivicConnect shall permit an authorized requester to view a retrievable list/history of their previously submitted service requests.

Acceptance criteria: 1. A requester may retrieve requests they have made.
authorised to view. 2. The history identifies each request sufficiently to differentiate it from other requests. 3. Historic requests preserve the recorded lifecycle information. 4. No such system claims infinite storage. The final retention period is subject to confirmation.

FR-005 --- Provide in-application request feedback

Source / stakeholders: S4 section 3; STK-001 Requesters
Need / scope: NEED-003 / SCP-005
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall provide the requester with meaningful in-application feedback when a request is accepted, rejected, updated, resolved, or closed.

Acceptance criteria: 1. The requester knows when a request was made.
has been accepted. 2. The requester knows when a request was rejected. 3. Relevant updates can be identified by the requester. 4. The requester knows when the request is resolved. 5. Requester knows when the request is closed. 6.The M1 requirement does not require SMS, WhatsApp or email notification delivery.

FR-006 --- View work relevant to authorised staff

Source / stakeholders: S4 section 3; STK-002 Authorised service
staff
Need / scope: NEED-004, NEED-009 / SCP-006
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall allow authorised service staff access to service requests consistent with their duties and permissions.

Acceptance criteria: 1. An authorised staff user may view requests.
Within the scope of their allowed work. 2. A staff member cannot automatically see all requests because they are staff. 3. Access decisions are based on agreed-upon responsibility and permission models. 4. Sensitive requests are still covered by access rules.

FR-007 --- Search, filter and sort requests

Source / stakeholders: S4 section 3; STK-002 Authorised service
staff
Need / scope: NEED-004 / SCP-007
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall permit authorized staff to search, filter, and/or sort service requests according to useful criteria agreed upon for the operational workflow.

Acceptance criteria: 1. An authorized staff member may retrieve items.
Relevant requests can be made using agreed-upon search, filter, and sort capabilities. 2.
Search and filtering apply to requests the user is authorised to access. 3. The results match the chosen criteria. 4. Exact operational criteria are confirmed in requirements reviews, not invented as an M1 fact. 5. A sophisticated search engine is not required unless justified by the team.

FR-008 --- View authorised request details

Source / stakeholders: S4 section 3; STK-002 Authorised service
staff
Need / scope: NEED-004, NEED-009 / SCP-008
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall allow an authorized user to view all request details within the scope of their responsibility and access rights, including sensitive information only where authorized.

Acceptance criteria: 1. A privileged user may see the request.
Information obtained within the scope of their role or responsibility. 2. Semantic information is not shown to a user without authorisation. 3. This detailed view shows the information that FR-001 recorded. 4. Having administrative rights does not give access to request details.

FR-009 --- Assign, accept and reassign responsibility

Source / stakeholders: S4 sections 2-3; STK-002 Authorised service
staff; STK-004 Service coordination
Need / scope: NEED-005 / SCP-009
Priority: Must
Status: Proposed

Requirement:
Authorised staff may accept or be assigned responsibility for a service request by CivicConnect, and authorised coordinators or managers may assign or reassign responsibility.

Acceptance criteria: 1. An authorised staff user may accept.
responsibility where permitted. 2. An authorised coordinator/manager may assign a request. 3. An authorised coordinator/manager can assign a request again. 4. A user without permission cannot assign or reassign responsibility. 5. It is clear what the current responsibility for a request is.

FR-010 --- Enforce controlled request status transitions

Source / stakeholders: S4 section 3; STK-002 Authorised service
staff; STK-004 Service coordination
Need / scope: NEED-006 / SCP-010
Priority: Must
Status: Proposed

Requirement:
CivicConnect controls request status changes based on the.
Working Life Cycle: Submitted, Accepted, In Progress, Resolved, and Closed with a controlled mechanism to request reopening.

Acceptance criteria: 1. A new request is started in this. 2. A
Requests can only transition through permitted transitions in defined lifecycle states. 3. An authorised user may reject a Submitted request only. 4. Only authorised users can assign assignments.
5. A status change also records the user who made the change. 6.
Unauthorised status changes are blocked. 7. The final, The detailed reopening of policy remains subject to the open requirement question that Member 1 identified.

FR-011 --- Record actions, comments and resolution information

Source / stakeholders: S4 section 3; STK-002 Authorised service
staff
Need / scope: NEED-006 / SCP-011
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall permit authorized staff to record relevant actions, comments, and resolution information against a service request, with recorded information controlled for its intended visibility.

Acceptance criteria: 1. An authorized user can record a relevant entry.
action or comment. 2. An authorised user can record resolution information while resolving work. 3. Recorded entries remain associated with the correct request. 4. When the final policy requires it, the system distinguishes between requester-visible information and information restricted to authorised users. 5. All accountable actions have a responsible user attached to them.

FR-012 --- Resolve or close requests when authorised

Source / stakeholders: S4 section 3; STK-002 Authorised service
staff; STK-004 Service coordination
Need / scope: NEED-006 / SCP-012
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall permit only authorized users to resolve/close service requests in accordance with the controlled request lifecycle and agreed responsibilities.

Acceptance criteria: 1. A request can be moved to an authorized user. So it is resolved once the conditions are met. 2. An authorised A user can move a request to "Closed" when allowed conditions are met. 3. No unauthorized user can fix or close a request. 4. The request records the user who performed the resolution/closure action. 5. This distinction, along with detailed reopening rules, is confirmed before formal baseline approval.

FR-013 --- View service activity

Source / stakeholders: S4 section 3; STK-003 Management/oversight
Need / scope: NEED-007 / SCP-013
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall provide authorised management/oversight users with sufficient service activity information to monitor the request workflow.

Acceptance criteria: 1. A management user can see.
Organizational service activity is the focus of this branch of study. 2. The activity information includes recorded requests and lifecycle information. 3. Access to the activity view is restricted by permission. 4. The final Management's view is validated against representative request scenarios before baseline approval.

FR-014 --- Identify open, overdue, resolved and closed work

Source / stakeholders: S4 section 3; STK-003 Management/oversight
Need / scope: NEED-007 / SCP-014
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall permit authorized users to identify open, overdue, resolved, and closed service requests using agreed lifecycle and overdue definitions.

Acceptance criteria: 1. Requests in open states.
Separate species can be identified. 2. Open work can be identified from the controlled lifecycle state. 3. Submitted requests are considered overdue when their target date/time is past and their status is not resolved, closed, or rejected. 4. To be exact, the target date/time is set by authorized.
Staff or a manager are assigned to accept or assess something. 5. The result of an overdue test case can be confirmed by a controlled test case around the target date/time boundary.

FR-015 --- Analyse requests by category, status and justified dimensions

Source / stakeholders: S4 section 3; STK-003 Management/oversight
Need / scope: NEED-008 / SCP-015
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall permit authorized users to analyze requests by category and status, and where justified by other agreed dimensions.

Acceptance criteria: 1. Management may see request information.
Grouped, filtered, or otherwise presented by category. 2. Request information is visible to management by lifecycle status. 3. Any other dimension of analysis is included only if its operational value is justified and agreed upon. 4. The analysis respects the visibility of the authorized user. 5. No predictive analytics are required for M1.

FR-016 --- Support accountability and service-performance analysis

Source / stakeholders: S4 section 3; STK-003 Management/oversight
Need / scope: NEED-008 / SCP-016
Priority: Must
Status: Proposed

Requirement:
CivicConnect shall retain sufficient information about attributable requests, responsibilities, and progress to support accountability and service-performance analysis.

Acceptance criteria: 1. The system retains the lifecycle history.
Determining how a request progressed. 2. Responsibilities for relevant work are identified from recorded request information. 3. Users cause status changes. 4. Management can explain request progress and responsibility using recorded information. 5. This requires neither predictive analytics nor a data warehouse.

3. Non-Functional Requirements

NFR-001 --- Authorisation and least-privilege access

Source / stakeholders: S4 sections 2, 4 and 16; STK-001, STK-002,
STK-003, STK-005
Need / scope: NEED-009 / SCP-017
Priority: Should
Status: Proposed

Requirement:
Using the least privilege approach, CivicConnect shall limit request access and permit actions according to authorized responsibilities.

Acceptance criteria: 1. A requester may view their requests. Conform to the agreed-upon visibility policy. 2. Only staff may see work relating to their authorised role. 3. Only authorised users may assign, reassign, change status and close the window. 4. Access to management reporting is permission-controlled. 5. Administration does not automatically grant business-data access.

NFR-002 --- Sensitive-information protection

Source / stakeholders: S4 sections 2, 4 and 16; STK-001, STK-002,
STK-005
Need / scope: NEED-009 / SCP-017
Priority: Should
Status: Proposed

Requirement:
CivicConnect shall prevent unauthorized disclosure of sensitive request information during the entire request lifecycle.

Acceptance criteria: 1. The sensitive information is identified using encryption. The sensitive-information indicator is present in the request. 2. Only authorised users can see sensitive information. 3. Unauthorized user attempts to access protected information are denied. 4. Testing scenarios use fictional and unsecure data. 5. The final retention period is not invented in M1 and is subject to confirmation.

NFR-003 --- Auditability and accountability

Source / stakeholders: S4 sections 3, 8 and 11; STK-002, STK-003,
STK-006
Need / scope: NEED-006, NEED-008 / SCP-010, SCP-011, SCP-016
Priority: Should
Status: Proposed

Requirement:
Attributable records of relevant lifecycle changes, responsibility changes, and actions shall be maintained by CivicConnect for review of request history for accountability purposes.

Acceptance criteria: 1. Each status change identifies a new status.
responsible user. 2. Attributable assignments and reassignments occur. 3. Relevant actions, comments, and resolution information remain associated with the request. 4. The resulting history is enough to reconstruct how the request progressed during verification.

NFR-004 --- Usability and understandable feedback

Source / stakeholders: S4 sections 3 and 15; STK-001, STK-002,
STK-003
Need / scope: NEED-001, NEED-003, NEED-004 / SCP-001, SCP-003 to
SCP-007, SCP-013 to SCP-016
Priority: Should
Status: Proposed

Requirement:
CivicConnect shall present request information, status, and feedback in a form that the intended user can understand and use for the supported task.

Acceptance criteria: 1. Requesters identify the current status.
Of their own choosing during representative task-based verification. 2.
The feedback identifies the relevant request event or outcome. 3.
Relevant work can be identified by staff following an agreed search / filter / sort workflow. 4. Activation/status information is interpretable by management.
used for oversight. 5. Usability evidence is based on defined criteria.
Verification tasks are rather than an unsupported subjective claim of being "user-friendly."

NFR-005 --- Data integrity and consistency

Source / stakeholders: S4 sections 3, 11 and 15; STK-002, STK-003
Need / scope: NEED-001, NEED-005, NEED-006, NEED-008 / SCP-001,
SCP-009 to SCP-016
Priority: Should
Status: Proposed

Requirement:
In keeping with the recorded details, responsibility, lifecycle state, and attributable history, CivicConnect shall maintain consistency.

Acceptance criteria: 1. Each request has a unique current. lifecycle state. 2. Changes in responsibility are recorded consistently. 3. The status history shows the status changes that occurred. 4. Any unauthorized or invalid transition does not cause an inconsistent lifecycle state. 5. Repetitive boundary cases are included in later verification.

NFR-006 --- Performance under agreed operating conditions

Source / stakeholders: S4 sections 15 and 18; STK-003, STK-005,
STK-006
Need / scope: NEED-010 / SCP-018
Priority: Should
Status: Proposed

Requirement:
CivicConnect provides responsive request submission, retrieval, search, filter, and oversight operations under the agreed-upon operating conditions and workload.

Acceptance criteria: 1. The team defines the operating conditions.
And a representative workload is necessary for the quantitative verification of performance. 2. Performance verification comprises submission and retrieval, search / filter / sort, and management-view operations. 3.
Performance results against agreed test conditions are recorded. 4. No unsupported response time or user volume target is claimed until required workload information is available.

NFR-007 --- Reliability and recoverability

Source / stakeholders: S4 sections 15, 17 and 18; STK-005, STK-006
Need / scope: NEED-010 / SCP-018
Priority: Should
Status: Proposed

Requirement:
CivicConnect supports the controlled recovery of service-request information and configuration appropriate to the agreed operating environment.

Acceptance criteria: 1. What information is identified by the team?
must be recoverable. 2. An earlier recoverable test shows that the agreed-upon recoverable information is restored. 3. Recovery evidence documents where and how the procedure was performed. 4. Recovery objectives in M1 do not have assigned numerical targets.

NFR-008 --- Maintainability and controlled change

Source / stakeholders: S4 sections 6, 8, 11 and 18; STK-006 Project
team
Need / scope: NEED-010, NEED-011 / SCP-018
Priority: Should
Status: Proposed

Requirement:
Using requirement identifiers, traceability, version history, and verification evidence, CivicConnect and its engineering artefacts shall support controlled change.

Acceptance criteria: 1. Requirements retain stable identifiers
Unless a new identifier is required for an approved change. 2. Changes in requirements are reflected in the RTM and are also evident in the affected artefacts. 3. Designs, implementation, and test evidence can later be associated with the required requirement. 4. Materials go through a team-controlled change process. 5. Repository history records substantial changes without silent overwriting of approved evidence.

4. Open Questions and Controlled Deferrals

The following items remain open because the Member 1 artefacts
explicitly identify them as requiring confirmation:

Question                                                Requirement impact

Q-001: Exact required request information, categories   FR-001, FR-002, FR-007
and who may change them

Q-002: Final                                            FR-006, FR-008, FR-009, FR-012,
role/visibility/assignment/reassignment/resolve/close   NFR-001
permissions

Q-003: Detailed state-transition, rejection,            FR-010, FR-012
resolved/closed and reopening policy

Q-004: Final overdue definition/time basis and state    FR-014
treatment

Q-005: Final feedback timing/content/mechanism          FR-005

Q-006: Sensitive-information handling and retention     FR-004, FR-008, NFR-002
policy

No numerical performance, workload, retention or recovery target has
been invented where the available project evidence does not establish
one.

5. Requirements Quality Basis

The requirements are intended to be clear, uniquely identifiable,
traceable to sources/stakeholders and verifiable. ISO/IEC/IEEE
29148:2018 provides the requirements-engineering basis for requirements
processes and information items. ISO/IEC 25010:2023 provides the
product-quality model used to structure the cross-cutting quality
requirements.

The project Master Brief remains the authoritative source for
project-specific requirements and controls. The ISO standards are
supporting engineering references and do not override the assignment
brief.

6. Sources

S1: SEN381 Teaching Team, SEN381 CivicConnect Project:
Milestone 1 (M1) - Engineering Foundation & Requirements Baseline.

S4: SEN381 Teaching Team, CivicConnect Master Project Brief:
Community Service Request Management Platform, version 1.1.

R1: Ryno Goetz, Member 1 -- Stakeholder Analysis, version 0.2,
7 September 2026.

R2: Ryno Goetz, Member 1 -- Scope Baseline, version 0.2, 7
September 2026.

R3: Ryno Goetz, Member 1 -- Constraints and Assumptions,
version 0.2, 7 September 2026.

R4: Ryno Goetz, Member 1 -- Team Working Agreement, version
0.2, 7 September 2026.

ISO/IEC/IEEE 29148:2018: Requirements engineering processes and
information items. https://www.iso.org/standard/72089.html

ISO/IEC 25010:2023: Product quality model.
https://www.iso.org/standard/78176.html
