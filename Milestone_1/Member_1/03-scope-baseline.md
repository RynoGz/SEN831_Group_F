# 3. Proposed scope baseline

Version 0.1 | 7 September 2026 | Responsible student: Ryno Goetz | Status: proposed; team sign-off pending

## 3.1 Scope objective and system boundary

CivicConnect will support the digital management of service requests from submission and classification through authorised staff handling, feedback and management oversight. The boundary includes request records, responsibility, state changes, relevant action/resolution information, role-appropriate views and meaningful service reporting. Physical fulfilment of the requested work remains an organisational activity outside the software [S4, sections 2-3].

The product scope below carries every minimum capability in the Master brief into M1 planning. It is a proposed baseline, not a claim of completed implementation or already agreed exclusions. The team must approve detailed requirements and acceptance criteria before formal baseline sign-off [S4, sections 3 and 11; S1, section 3].

## 3.2 In-scope minimum business capabilities

All rows SCP-001 to SCP-016 represent required minimum capabilities from S4 section 3. Their detailed behaviour, fields, policies and verification conditions must be defined with Steven. "Required" is the priority basis from the brief; the baseline status remains draft.

| Scope ID | Included capability | Stakeholder/need | Boundary and clarification |
| --- | --- | --- | --- |
| SCP-001 | Submit a new service request with appropriate information | STK-001; NEED-001 | Agree required fields and validation; no automatic import from existing channels is assumed |
| SCP-002 | Categorise a request through a controlled mechanism | STK-001, STK-004; NEED-002 | Agree initial categories and who controls changes; automated AI classification is not required |
| SCP-003 | View the current status of submitted requests | STK-001; NEED-003 | Apply the agreed visibility policy; make the status meaningful to requesters |
| SCP-004 | View a history/list of previously submitted requests | STK-001; NEED-003 | Preserve retrievability under the agreed retention policy; not a promise of indefinite storage |
| SCP-005 | Receive meaningful feedback on accepted, rejected, updated and completed requests | STK-001; NEED-003 | Feedback is mandatory; its delivery channel and timing are Q-005, not yet fixed |
| SCP-006 | View work relevant to authorised staff | STK-002; NEED-004, NEED-009 | Define relevant/authorised visibility; staff access must not be assumed universal |
| SCP-007 | Search, filter or sort requests using useful criteria | STK-002; NEED-004 | Agree useful criteria with staff; the brief does not prescribe an advanced search engine |
| SCP-008 | View full request details when authorised | STK-002; NEED-004 | Full details are permission-dependent, including sensitive information |
| SCP-009 | Assign or accept responsibility for a request | STK-002, STK-004; NEED-005 | Agree assignment/reassignment authority and unassigned-work handling |
| SCP-010 | Update status through controlled transitions | STK-002, STK-004; NEED-006 | Agree a lifecycle model and permissions; do not invent a final state machine in this scope statement |
| SCP-011 | Record relevant actions, comments or resolution information | STK-002; NEED-006 | Define required accountability and requester-visible versus restricted information |
| SCP-012 | Resolve or close requests where authorised | STK-002, STK-004; NEED-006 | Clarify resolved versus closed, rejection and any reopening policy |
| SCP-013 | View useful service activity information | STK-003; NEED-007 | Agree an oversight view suited to the organisation's decisions |
| SCP-014 | Identify open, overdue, resolved and closed work | STK-003; NEED-007 | Define overdue and the reporting treatment of each lifecycle state before baselining |
| SCP-015 | View requests by category/status or other justified dimensions | STK-003; NEED-008 | Core category/status visibility is included; additional dimensions require value justification |
| SCP-016 | Access enough information for accountability and service-performance analysis | STK-003; NEED-008 | Retain sufficient attributable request history; this does not require predictive analytics or a data warehouse |

## 3.3 Cross-cutting obligations

| Scope ID | Included obligation | Source and implication |
| --- | --- | --- |
| SCP-017 | Appropriate access and sensitive-data protection throughout the request lifecycle | S4 sections 2, 4 and 16; supports NEED-009. Define role/access and disclosure rules now; defer the authentication technology choice, not the security requirements |
| SCP-018 | Measurable quality, verification and controlled delivery/operation across later milestones | S4 sections 15-18; supports NEED-010. M1 identifies concerns/requirements; design, tests, staging, release, recovery and operational evidence develop through later milestones |

These obligations remain part of the overall project even though their full implementation is not an M1 deliverable.

## 3.4 Proposed out-of-scope items for the initial product baseline

The following are team-review proposals. They are not exclusions stated by the lecturer and must not remove a capability required above.

| ID | Proposed exclusion | Justification | Effect and revisit condition |
| --- | --- | --- | --- |
| OUT-001 | Live two-way ingestion/synchronisation with WhatsApp, email, telephone systems or paper workflows | The existing channels explain fragmentation; S4 section 3 does not require integrations. Supporting several channels adds reconciliation, privacy, credentials, dependency and testing obligations | Requests are entered through CivicConnect under SCP-001. Revisit if validated stakeholder evidence makes integration necessary and the team approves its impact |
| OUT-002 | Billing, payments and procurement/inventory management | They are separate business processes beyond the stated request lifecycle and add security and reconciliation work | Record/request operational work without implementing financial or stock-management systems. Revisit only through justified scope change |
| OUT-003 | Performing repairs, emergency dispatch or guaranteeing real-world service completion times | The software records and coordinates work; physical fulfilment and emergency response require organisational resources beyond the software boundary | Security-related concerns may still be recorded. Validate user-facing escalation expectations; do not market the platform as an emergency-response service |

**Defence of OUT-001:** a messaging integration could reduce repeated entry, but it must also resolve identity, duplicate submissions, update conflicts, access and delivery failures. The required business value can first be demonstrated through controlled submission and tracking inside CivicConnect. Proposing this exclusion preserves all minimum capabilities while keeping work compatible with three members' capacity. Its trade-off is an adoption/manual-entry burden, which should be recorded as a risk for Willem to assess rather than ignored [S4, sections 3.1, 4, 12 and 18].

## 3.5 Proposed future or deliberately deferred work

| ID | Deferred item | Why it is not a current commitment | Information required before deciding |
| --- | --- | --- | --- |
| FUT-001 | Native mobile applications and offline synchronisation | These create additional platforms, synchronisation states and verification effort beyond the minimum capabilities | User/device/connectivity needs, accessibility evidence, schedule and maintenance impact |
| FUT-002 | AI routing, duplicate detection and predictive service analytics | Basic controlled categories and oversight can satisfy the minimum capabilities; automated inference adds accuracy and accountability questions | Evidence of value, suitable data, failure handling, privacy and operational-cost analysis |
| FUT-003 | Bulk migration of historic email, spreadsheets and paper records | Legacy sources are fragmented and their formats, quality and access permissions are not supplied | Sample formats, volume, reconciliation/retention policy and a justified migration requirement |
| FUT-004 | External message delivery such as SMS, WhatsApp or email notifications | Required feedback under SCP-005 remains included; external channels are not yet justified | Agreed feedback timing/channel needs, delivery failure handling, service limits, cost and sensitive-content policy |
| FUT-005 | Final technology stack, architecture and detailed persistence/UI/API design | These are later lifecycle decisions, explicitly outside required M1 decisions/implementation | Baselined FRs/NFRs, constraints, team capability, environment compatibility and comparison evidence |

A proposed in-platform feedback mechanism may satisfy SCP-005, but must be validated with stakeholder expectations before adoption. Deferring an external channel must never silently remove meaningful feedback. Likewise, FUT-003 does not remove required history for requests submitted to the new platform.

Willem should record only genuine team decisions or justified deferments in the Decision Log after review; these rows are decision inputs, not approved entries [S4, section 13].

## 3.6 M1 milestone boundary

M1 produces the controlled problem, stakeholder, scope, requirements, constraints, traceability, risk, forward-thinking, decision and governance foundation in PED v1.0. Final stack/architecture selection, detailed database/UI/API or design-pattern implementation, CI pipeline implementation, extensive application code and production deployment are not required M1 deliverables unless approved as exploration [S1, sections 3-5].

This separates when the team performs work from what the final product must support. Security, testability, deployment and recovery must be considered now even though implementation occurs later.

## 3.7 Approval and controlled change

Steven checks every SCP item against the requirements and acceptance criteria and links the source and stakeholder needs through the RTM. Willem reviews risks, forward concerns and decisions. The team resolves policy questions, confirms exclusions and records a formal baseline review. Until then this file remains version 0.1, draft [S4, section 11 and Appendix D].

After approval, changes require a recorded request and impact analysis, a decision and authorisation, controlled implementation and verification, then updates to the affected baseline artefacts. Analyse scope, schedule/resources, cost, quality/security, requirements, design/data/interfaces, tests, deployment and risks as applicable; use S4 Appendix E rather than silently absorbing additions [S4, section 14].

**References:** [Source register](README.md#3-source-register), S4 sections 2-4, 11-18 and Appendices D-E; S1 sections 3-5.
