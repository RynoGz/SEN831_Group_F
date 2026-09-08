2. Requirements Traceability Matrix

Project: CivicConnect -- Community Service Request Management
Platform
Responsible student: Steven Riaan Piek
Version: 0.2 | 7 September 2026
Status: Proposed RTM; team review and formal M1 baseline approval
pending
Reviewers: Ryno Goetz and Willem Booysen

1. Purpose

This Requirements Traceability Matrix (RTM) provides the controlled link
between the Member 1 stakeholder/source analysis, stakeholder needs,
scope capabilities, requirements and acceptance criteria.

Later lifecycle evidence is intentionally marked TBD because M1 does
not yet contain the final architecture, implementation, tests or release
evidence.

The intended lifecycle trace is:

Stakeholder/Source → Need → Scope Capability → Requirement →
Acceptance Criteria → Design → Issue/PR → Implementation → Test →
Acceptance/Release Evidence

2. Traceability Matrix

Source /      Need        Scope               Requirement   Acceptance   Design   Issue / Implementation   Test    Acceptance /
Stakeholder                                                 criteria              PR                               Release

STK-001 / S4  NEED-001    SCP-001             FR-001        FR-001       TBD      TBD     TBD              TBD     TBD
AC1--AC6

STK-001,      NEED-002    SCP-002             FR-002        FR-002       TBD      TBD     TBD              TBD     TBD
STK-004 / S4                                                AC1--AC5

STK-001 / S4  NEED-003    SCP-003             FR-003        FR-003       TBD      TBD     TBD              TBD     TBD
AC1--AC4

STK-001 / S4  NEED-003    SCP-004             FR-004        FR-004       TBD      TBD     TBD              TBD     TBD
AC1--AC4

STK-001 / S4  NEED-003    SCP-005             FR-005        FR-005       TBD      TBD     TBD              TBD     TBD
AC1--AC6

STK-002 / S4  NEED-004,   SCP-006             FR-006        FR-006       TBD      TBD     TBD              TBD     TBD
NEED-009                                      AC1--AC4

STK-002 / S4  NEED-004    SCP-007             FR-007        FR-007       TBD      TBD     TBD              TBD     TBD
AC1--AC5

STK-002 / S4  NEED-004,   SCP-008             FR-008        FR-008       TBD      TBD     TBD              TBD     TBD
NEED-009                                      AC1--AC4

STK-002,      NEED-005    SCP-009             FR-009        FR-009       TBD      TBD     TBD              TBD     TBD
STK-004 / S4                                                AC1--AC5

STK-002,      NEED-006    SCP-010             FR-010        FR-010       TBD      TBD     TBD              TBD     TBD
STK-004 / S4                                                AC1--AC7

STK-002 / S4  NEED-006    SCP-011             FR-011        FR-011       TBD      TBD     TBD              TBD     TBD
AC1--AC5

STK-002,      NEED-006    SCP-012             FR-012        FR-012       TBD      TBD     TBD              TBD     TBD
STK-004 / S4                                                AC1--AC5

STK-003 / S4  NEED-007    SCP-013             FR-013        FR-013       TBD      TBD     TBD              TBD     TBD
AC1--AC4

STK-003 / S4  NEED-007    SCP-014             FR-014        FR-014       TBD      TBD     TBD              TBD     TBD
AC1--AC5

STK-003 / S4  NEED-008    SCP-015             FR-015        FR-015       TBD      TBD     TBD              TBD     TBD
AC1--AC5

STK-003 / S4  NEED-008    SCP-016             FR-016        FR-016       TBD      TBD     TBD              TBD     TBD
AC1--AC5

STK-001,      NEED-009    SCP-017             NFR-001       NFR-001      TBD      TBD     TBD              TBD     TBD
STK-002,                                                    AC1--AC5
STK-003,
STK-005 / S4

STK-001,      NEED-009    SCP-017             NFR-002       NFR-002      TBD      TBD     TBD              TBD     TBD
STK-002,                                                    AC1--AC5
STK-005 / S4

STK-002,      NEED-006,   SCP-010, SCP-011,   NFR-003       NFR-003      TBD      TBD     TBD              TBD     TBD
STK-003,      NEED-008    SCP-016                           AC1--AC4
STK-006 / S4

STK-001,      NEED-001,   SCP-001,            NFR-004       NFR-004      TBD      TBD     TBD              TBD     TBD
STK-002,      NEED-003,   SCP-003--SCP-007,                 AC1--AC5
STK-003 / S4  NEED-004    SCP-013--SCP-016

STK-002,      NEED-001,   SCP-001,            NFR-005       NFR-005      TBD      TBD     TBD              TBD     TBD
STK-003 / S4  NEED-005,   SCP-009--SCP-016                  AC1--AC5
NEED-006,
NEED-008

STK-003,      NEED-010    SCP-018             NFR-006       NFR-006      TBD      TBD     TBD              TBD     TBD
STK-005,                                                    AC1--AC4
STK-006 / S4

STK-005,      NEED-010    SCP-018             NFR-007       NFR-007      TBD      TBD     TBD              TBD     TBD
STK-006 / S4                                                AC1--AC4

3. Requirement-to-Source Coverage

Requirement group           Covered source capabilities

FR-001                      SCP-001 / NEED-001
FR-002                      SCP-002 / NEED-002
FR-003                      SCP-003 / NEED-003
FR-004                      SCP-004 / NEED-003
FR-005                      SCP-005 / NEED-003
FR-006                      SCP-006 / NEED-004, NEED-009
FR-007                      SCP-007 / NEED-004
FR-008                      SCP-008 / NEED-004, NEED-009
FR-009                      SCP-009 / NEED-005
FR-010                      SCP-010 / NEED-006
FR-011                      SCP-011 / NEED-006
FR-012                      SCP-012 / NEED-006
FR-013                      SCP-013 / NEED-007
FR-014                      SCP-014 / NEED-007
FR-015                      SCP-015 / NEED-008
FR-016                      SCP-016 / NEED-008
NFR-001, NFR-002            SCP-017 / NEED-009
NFR-003                     SCP-010, SCP-011, SCP-016 / NEED-006, NEED-008
NFR-004                     SCP-001, SCP-003--SCP-007, SCP-013--SCP-016
NFR-005                     SCP-001, SCP-009--SCP-016
NFR-006, NFR-007, NFR-008   SCP-018 / NEED-010, NEED-011

4. Open Question Traceability

Open question              Affected requirements   Current control

Q-001 -- Exact request     FR-001, FR-002, FR-007  Use the Member 1
information, categories                            working policy for M1;
and category-change                                confirm before formal
authority                                          baseline

Q-002 -- Final roles,      FR-006, FR-008, FR-009, Use least-privilege
visibility,                FR-012, NFR-001         working policy; confirm
assignment/reassignment,                           exact permission matrix
resolve/close authority

Q-003 -- Detailed          FR-010, FR-012          Use lifecycle in Member
transitions, rejection,                            1 scope; confirm
resolved/closed and                                detailed transition
reopening                                          rules

Q-004 -- Overdue time      FR-014                  Use the current working
basis and state treatment                          overdue definition;
verify boundary cases

Q-005 -- Feedback          FR-005                  In-application feedback
timing/content/mechanism                           is the working policy;
confirm detailed
content/timing

Q-006 -- Sensitive         FR-004, FR-008, NFR-002 Use least privilege and
information and retention                          non-sensitive test
data; confirm retention

5. Later Lifecycle Evidence

The following columns remain intentionally open in M1:

Design: to be populated when architecture/design decisions are
made.

Issue / PR: link the issue and PR that implement or change the
requirement.

Implementation: link the relevant
code/configuration/documentation evidence.

Test: link test cases/results demonstrating the acceptance
criteria.

Acceptance / Release: link the approved baseline/release
evidence.

No later evidence is claimed before it exists.

6. Traceability Control Rules

Requirement IDs remain stable unless a controlled change explicitly
requires otherwise.

Any approved requirement change updates this RTM and affected
artefacts.

Acceptance criteria remain linked to the requirement they verify.

A requirement must not be marked complete merely because it has been
designed or implemented; verification evidence is required.

Later design, implementation and test evidence must link back to the
applicable requirement ID.

Open questions remain visible until resolved through the team's
change/review process.

The RTM forms part of the evolving PED and must preserve its version
history.

7. Status Summary

Category                                              Count Status

Functional requirements                                  16 Proposed
Non-functional requirements                               8 Proposed
Total requirements                                       24 Proposed
Scope capabilities SCP-001--SCP-016                      16 Covered
Cross-cutting obligations SCP-017--SCP-018                2 Covered
Later design/implementation/test/release evidence       --- TBD

8. Sources

S1 -- SEN381 Teaching Team, SEN381 CivicConnect Project: Milestone
1 (M1) - Engineering Foundation & Requirements Baseline.

S4 -- SEN381 Teaching Team, CivicConnect Master Project Brief:
Community Service Request Management Platform, version 1.1.

R1 -- Ryno Goetz, Member 1 -- Stakeholder Analysis, version 0.2, 7
September 2026.

R2 -- Ryno Goetz, Member 1 -- Scope Baseline, version 0.2, 7
September 2026.

R3 -- Ryno Goetz, Member 1 -- Constraints and Assumptions, version
0.2, 7 September 2026.

R4 -- Ryno Goetz, Member 1 -- Team Working Agreement, version 0.2,
7 September 2026.

ISO/IEC/IEEE 29148:2018 -- Requirements engineering processes and
information items. https://www.iso.org/standard/72089.html

ISO/IEC 25010:2023 -- Product quality model.
https://www.iso.org/standard/78176.html