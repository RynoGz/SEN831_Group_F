# 3. Scope baseline

Version 0.2 | 7 September 2026 | Responsible student: Ryno Goetz | Status: recommended working baseline; formal team sign-off pending

## 3.1 Scope objective and system boundary

CivicConnect will support the digital management of service requests from submission and classification through authorised staff handling, feedback and management oversight. The boundary includes request records, responsibility, state changes, relevant action/resolution information, role-appropriate views and meaningful service reporting. Physical fulfilment of the requested work remains an organisational activity outside the software [S4, sections 2-3].

The initial product serves one organisation. The scope below carries every minimum capability in the Master brief into M1 planning and records detailed working policies so requirements can be completed promptly. It is not a claim of completed implementation or formal baseline approval. The team must review the exclusions, requirements and acceptance criteria before formal sign-off [S4, sections 3 and 11; S1, section 3].

### 3.1.1 Selected request and workflow policy

- Required request information: title, description, category, location, requester identity/contact, automatically recorded submission date/time and a sensitive-information indicator; an attachment is optional.
- Initial categories: Maintenance, IT support, Facility fault, Damaged equipment, Security concern, Lost property and Other.
- Lifecycle: Submitted -> Accepted -> Assigned -> In Progress -> Resolved -> Closed. Submitted requests may be Rejected; authorised users may reassign; a requester or manager may request reopening; every status change must be attributable.
- Overdue rule: the agreed target date/time has passed and the request is not Resolved, Closed or Rejected. Authorised staff or a manager sets the target on acceptance or assignment.
- Feedback: show in-application feedback for accepted, rejected, updated, resolved and closed requests. External delivery channels are deferred.

## 3.2 In-scope minimum business capabilities

All rows SCP-001 to SCP-016 represent required minimum capabilities from S4 section 3. Their detailed behaviour, fields, policies and verification conditions must be defined with Steven. "Required" is the priority basis from the brief; the baseline status remains draft.

| Scope ID | Included capability | Stakeholder/need | Boundary and clarification |
| --- | --- | --- | --- |
| SCP-001 | Submit a new service request with appropriate information | STK-001; NEED-001 | Use the selected fields in section 3.1.1; no automatic import from existing channels is assumed |
| SCP-002 | Categorise a request through a controlled mechanism | STK-001, STK-004; NEED-002 | Use the initial category set in section 3.1.1; controlled changes remain possible; automated AI classification is not required |
| SCP-003 | View the current status of submitted requests | STK-001; NEED-003 | Apply the agreed visibility policy; make the status meaningful to requesters |
| SCP-004 | View a history/list of previously submitted requests | STK-001; NEED-003 | Preserve retrievability under the agreed retention policy; not a promise of indefinite storage |
| SCP-005 | Receive meaningful feedback on accepted, rejected, updated and completed requests | STK-001; NEED-003 | Provide in-application feedback for accepted, rejected, updated, resolved and closed events; external channels are deferred |
| SCP-006 | View work relevant to authorised staff | STK-002; NEED-004, NEED-009 | Define relevant/authorised visibility; staff access must not be assumed universal |
| SCP-007 | Search, filter or sort requests using useful criteria | STK-002; NEED-004 | Agree useful criteria with staff; the brief does not prescribe an advanced search engine |
| SCP-008 | View full request details when authorised | STK-002; NEED-004 | Full details are permission-dependent, including sensitive information |
| SCP-009 | Assign or accept responsibility for a request | STK-002, STK-004; NEED-005 | Authorised staff may accept/assign work; a coordinator or manager may assign and reassign it |
| SCP-010 | Update status through controlled transitions | STK-002, STK-004; NEED-006 | Apply the lifecycle and attributable-change rule in section 3.1.1 |
| SCP-011 | Record relevant actions, comments or resolution information | STK-002; NEED-006 | Define required accountability and requester-visible versus restricted information |
| SCP-012 | Resolve or close requests where authorised | STK-002, STK-004; NEED-006 | Clarify resolved versus closed, rejection and any reopening policy |
| SCP-013 | View useful service activity information | STK-003; NEED-007 | Agree an oversight view suited to the organisation's decisions |
| SCP-014 | Identify open, overdue, resolved and closed work | STK-003; NEED-007 | Apply the overdue definition in section 3.1.1 and verify its time boundary |
| SCP-015 | View requests by category/status or other justified dimensions | STK-003; NEED-008 | Core category/status visibility is included; additional dimensions require value justification |
| SCP-016 | Access enough information for accountability and service-performance analysis | STK-003; NEED-008 | Retain sufficient attributable request history; this does not require predictive analytics or a data warehouse |

## 3.3 Cross-cutting obligations

| Scope ID | Included obligation | Source and implication |
| --- | --- | --- |
| SCP-017 | Appropriate access and sensitive-data protection throughout the request lifecycle | S4 sections 2, 4 and 16; supports NEED-009. Define role/access and disclosure rules now; defer the authentication technology choice, not the security requirements |
| SCP-018 | Measurable quality, verification and controlled delivery/operation across later milestones | S4 sections 15-18; supports NEED-010. M1 identifies concerns/requirements; design, tests, staging, release, recovery and operational evidence develop through later milestones |

These obligations remain part of the overall project even though their full implementation is not an M1 deliverable.

The access baseline applies least privilege: requesters submit and view their own requests; authorised staff view relevant work and perform permitted updates; coordinators/managers assign, reassign and view reporting; management sees authorised summaries/details without blanket access to sensitive information; and administration rights do not automatically grant business-data access. Use fictional, non-sensitive test data. The exact retention period will be confirmed later because neither supplied brief fixes one.

## 3.4 Recommended out-of-scope items for the initial product baseline

The following are recommended for team sign-off. They are not exclusions stated by the lecturer and must not remove a capability required above.

| ID | Proposed exclusion | Justification | Effect and revisit condition |
| --- | --- | --- | --- |
| OUT-001 | Live two-way ingestion/synchronisation with WhatsApp, email, telephone systems or paper workflows | The existing channels explain fragmentation; S4 section 3 does not require integrations. Supporting several channels adds reconciliation, privacy, credentials, dependency and testing obligations | Requests are entered through CivicConnect under SCP-001. Revisit if validated stakeholder evidence makes integration necessary and the team approves its impact |
| OUT-002 | Billing, payments and procurement/inventory management | They are separate business processes beyond the stated request lifecycle and add security and reconciliation work | Record/request operational work without implementing financial or stock-management systems. Revisit only through justified scope change |
| OUT-003 | Performing repairs, emergency dispatch or guaranteeing real-world service completion times | The software records and coordinates work; physical fulfilment and emergency response require organisational resources beyond the software boundary | Security-related concerns may still be recorded. Validate user-facing escalation expectations; do not market the platform as an emergency-response service |

**Defence of OUT-001:** a messaging integration could reduce repeated entry, but it must also resolve identity, duplicate submissions, update conflicts, access and delivery failures. The required business value can first be demonstrated through controlled submission and tracking inside CivicConnect. Proposing this exclusion preserves all minimum capabilities while keeping work compatible with three members' capacity. Its trade-off is an adoption/manual-entry burden, which should be recorded as a risk for Willem to assess rather than ignored [S4, sections 3.1, 4, 12 and 18].

## 3.5 Recommended future or deliberately deferred work

| ID | Deferred item | Why it is not a current commitment | Information required before deciding |
| --- | --- | --- | --- |
| FUT-001 | Native mobile applications and offline synchronisation | These create additional platforms, synchronisation states and verification effort beyond the minimum capabilities | User/device/connectivity needs, accessibility evidence, schedule and maintenance impact |
| FUT-002 | AI routing, duplicate detection and predictive service analytics | Basic controlled categories and oversight can satisfy the minimum capabilities; automated inference adds accuracy and accountability questions | Evidence of value, suitable data, failure handling, privacy and operational-cost analysis |
| FUT-003 | Bulk migration of historic email, spreadsheets and paper records | Legacy sources are fragmented and their formats, quality and access permissions are not supplied | Sample formats, volume, reconciliation/retention policy and a justified migration requirement |
| FUT-004 | External message delivery such as SMS, WhatsApp or email notifications | Required feedback under SCP-005 remains included; external channels are not yet justified | Agreed feedback timing/channel needs, delivery failure handling, service limits, cost and sensitive-content policy |
| FUT-005 | Final technology stack, architecture and detailed persistence/UI/API design | These are later lifecycle decisions, explicitly outside required M1 decisions/implementation | Baselined FRs/NFRs, constraints, team capability, environment compatibility and comparison evidence |

In-application feedback is the selected M1 working policy for SCP-005. Deferring an external channel must never silently remove meaningful feedback. Likewise, FUT-003 does not remove required history for requests submitted to the new platform.

Willem should record only genuine team decisions or justified deferments in the Decision Log after review; these rows are decision inputs, not approved entries [S4, section 13].

## 3.6 M1 milestone boundary

M1 is due on 9 September 2026 and produces the controlled problem, stakeholder, scope, requirements, constraints, traceability, risk, forward-thinking, decision and governance foundation in PED v1.0. Final stack/architecture selection, detailed database/UI/API or design-pattern implementation, CI pipeline implementation, extensive application code and production deployment are not required M1 deliverables unless approved as exploration [S1, sections 3-5; S3].

This separates when the team performs work from what the final product must support. Security, testability, deployment and recovery must be considered now even though implementation occurs later.

## 3.7 Approval and controlled change

Steven checks every SCP item and selected policy against the requirements and acceptance criteria and links source and stakeholder needs through the RTM. Willem reviews risks, forward concerns and decisions. The team confirms the recommended exclusions/deferments and records a formal baseline review. Until then this version 0.2 remains a working baseline, not an approved PED baseline [S4, section 11 and Appendix D].

After approval, changes require a recorded request and impact analysis, a decision and authorisation, controlled implementation and verification, then updates to the affected baseline artefacts. Analyse scope, schedule/resources, cost, quality/security, requirements, design/data/interfaces, tests, deployment and risks as applicable; use S4 Appendix E rather than silently absorbing additions [S4, section 14].

**References:** [Source register](README.md#3-source-register), S4 sections 2-4, 11-18 and Appendices D-E; S1 sections 3-5.
