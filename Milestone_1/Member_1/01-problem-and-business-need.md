# 1. Problem and business need

Version 0.2 | 7 September 2026 | Responsible student: Ryno Goetz | Updated working baseline; team review pending

## 1.1 Problem statement

CivicConnect addresses a loss of control over the lifecycle of service requests. The organisation receives operational requests through several informal and disconnected channels, but those channels do not provide one dependable record connecting a request to its owner, current state and actions taken. A request can therefore reach someone without becoming visible work that can be assigned, followed up and verified as completed [S4, section 2].

This fragmentation affects three groups differently. Requesters cannot reliably determine what happened after submission. Staff must reconcile information and ownership across channels while organising work. Management cannot confidently distinguish outstanding work from completed work or reconstruct why a request changed state. Inconsistent handling of sensitive request information compounds the visibility and accountability problem [S4, sections 2-2.1].

The underlying engineering problem is consequently more than collecting request descriptions: the platform must preserve useful information and controlled responsibility from submission through feedback and authorised closure. Improving the interface alone would not establish that control if assignment, permitted status changes, access boundaries and reporting definitions remained ambiguous. This is analysis derived from the scenario, not an observation from a conducted stakeholder interview.

## 1.2 Causes, effects and intended response

| Scenario problem | Operational consequence | Proposed engineering response | Stakeholder/need link |
| --- | --- | --- | --- |
| Request information is spread across messages, calls, spreadsheets and paper | Work may be missed or duplicated; reconciliation consumes staff effort | Maintain a retrievable digital request record with controlled classification and clear submission outcome | STK-001, STK-002; NEED-001, NEED-002 |
| Ownership and progress are difficult to see | Requesters repeatedly seek updates; staff may work on the same request or leave it unowned | Expose authorised status/history, explicit responsibility and lifecycle feedback | STK-001, STK-002, STK-004; NEED-003 to NEED-005 |
| Status changes and actions lack dependable accountability | A completion claim is difficult to explain or check | Control state changes and retain attributable action/resolution information | STK-002, STK-003; NEED-006, NEED-008 |
| Management reporting is manual and inconsistent | Workload and overdue work cannot be assessed consistently | Derive oversight views from request records using agreed definitions and useful category/status dimensions | STK-003; NEED-007, NEED-008 |
| Sensitive information is exchanged inconsistently | Visibility can expose details to people who do not need them | Define role-related access and sensitive-data handling early; later verify access with positive and negative tests | STK-001, STK-002, STK-005; NEED-009 |

The first column is grounded in the scenario [S4, section 2]. Consequences and responses are the team's proposed analysis. They do not imply that message import, automatic duplicate detection or a particular authentication technology is required.

## 1.3 Business need

The organisation needs an affordable, supportable platform that lets requesters submit and follow requests, lets authorised staff take responsibility and manage them, and gives management a dependable view of service activity. Its value depends on the same request information supporting operational work and oversight, with access and actions controlled throughout the lifecycle [S4, sections 2.1 and 3].

The proposed product scope therefore prioritises the required request-management workflow and sufficient accountability. Automatic imports from existing channels, payments and predictive routing are excluded or deferred as proposals because they would create additional integration, security, testing and cost obligations without being necessary to demonstrate the required minimum capabilities [S4, section 3.1; scope file, sections 3.4-3.5].

## 1.4 Intended value and how to assess it

The following are proposed evaluation methods to turn business value into checkable outcomes. They are not measured results or final agreed acceptance thresholds. Steven should translate them into requirements and acceptance criteria using the selected working policies; the team must still agree quantitative workload, timing and usability targets [S4, sections 5, 11 and 15].

| Value ID | Intended stakeholder value | Proposed validation evidence | Scope/need link |
| --- | --- | --- | --- |
| VAL-001 | A successfully submitted request remains findable | Submit an agreed set of valid requests and check that each acknowledged request can subsequently be retrieved by its authorised requester | SCP-001, SCP-004; NEED-001, NEED-003 |
| VAL-002 | Requesters can see meaningful progress | Walk through accepted, rejected, updated and completed outcomes; verify that feedback and the visible state agree with the recorded outcome | SCP-003, SCP-005; NEED-003 |
| VAL-003 | Staff can identify responsibility and permitted next actions | Exercise assignment/acceptance and authorised state changes; verify ownership, retained action information and rejection of unauthorised changes | SCP-009 to SCP-012, SCP-017; NEED-005, NEED-006, NEED-009 |
| VAL-004 | Management can rely on its work overview | Use a known set of requests with agreed overdue rules and compare open/overdue/resolved/closed views and category/status breakdowns with expected records | SCP-013 to SCP-016; NEED-007, NEED-008 |
| VAL-005 | Better visibility does not expose restricted information | Verify requester and staff visibility against the agreed permission matrix, including attempts to access another user's restricted request | SCP-006, SCP-017; NEED-009 |
| VAL-006 | The solution remains workable within team and operating constraints | Review actual scope delivery, schedule variance, quality/security evidence, service limits and likely running cost at later milestones | CON-001 to CON-010; NEED-010, NEED-011 |

No percentage reduction in lost requests, turnaround time or operating cost is claimed. The brief provides no measured current-process baseline. Such claims would require a defined before/after comparison and trustworthy measurements.

## 1.5 Boundaries and handoff

The initial category set is Maintenance, IT support, Facility fault, Damaged equipment, Security concern, Lost property and Other. A request records a title, description, category, location, requester identity/contact details, automatic submission date/time, a sensitive-information indicator and an optional attachment. The software does not itself repair equipment or provide physical emergency response. The team should validate this working taxonomy during requirements review and control later changes.

Steven receives the stakeholder needs and proposed success evidence as inputs to requirements and acceptance criteria. Willem receives the risks implied by lost ownership, inconsistent reporting and sensitive-data access as inputs to his risk and forward-consideration analysis. The team should judge success using stakeholder value, controlled scope, time, resources, quality, security and operational evidence, rather than a successful demonstration alone [S4, sections 5 and 21].

**References:** [Source register](README.md#3-source-register), especially S4 sections 2-5, 11, 15 and 21; S1 section 3.
