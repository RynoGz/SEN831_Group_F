# ADR-001: Technology Stack

**Project:** CivicConnect — Community Service Request Management Platform  
**Decision ID:** ADR-001  
**Status:** Accepted  
**Date:** 30 September 2026  
**Decision owners:** Ryno Goetz, Steven Riaan Piek, Willem Booysen  
**Milestone:** M2 — Architecture, Technology & Initial Design Baseline

## 1. Context

CivicConnect requires a technology direction for the M2 architecture and initial implementation. M1 deliberately deferred final technology selection under Engineering Decision D4 because the project had not yet completed the required requirements, capability, environment, security and cost research.

The selected stack must support the M1 baseline, the initial functional path, relational persistence, authentication, private attachments, automated verification and deployment while remaining proportionate to a three-person student team.

The first implementation path is:

> Submit request → validate → save → return confirmation → retrieve request

The M1 baseline remains the source of truth. In particular, FR-001 requires a service request to contain a title, description, category, location, requester identity/contact information and a sensitive-information indicator. The system must automatically record the submission date/time, allow an optional attachment, and place a successfully submitted request in the `Submitted` state.

## 2. Decision

The team agreed to use the following technology stack:

| Area | Agreed technology | Version / assumption | Purpose |
|---|---|---|---|
| Application language | JavaScript | ECMAScript supported by the selected Node.js/Next.js release | Application code throughout the project |
| Runtime / package tooling | Node.js + npm | Node.js 24 LTS; npm 11.x | Local development, scripts and dependency management |
| Frontend | Next.js + React | Next.js 16; React 19.3 | React interface and web application framework |
| Server-side application logic | Next.js | Next.js 16 | Server-side application logic within the same application |
| Database | Supabase PostgreSQL | Managed PostgreSQL project | Relational persistence |
| Authentication | Supabase Auth | Supabase managed service | User authentication |
| Attachment storage | Supabase Storage | Private bucket(s) | Private request attachments |
| Hosting / deployment | Vercel | Next.js deployment | Hosted previews and application deployment |
| Initial testing direction | Node.js test runner + browser-level verification | Confirm during bootstrap | Automated application verification |

### Compatibility assumptions

- Next.js 16 requires Node.js 20.9 or later. The project will use Node.js 24 LTS rather than the minimum supported version.
- Next.js 16 uses Turbopack by default for `next dev` and `next build`.
- React 19.3 is the current React release at the time this ADR is being baselined.
- The application will use JavaScript rather than TypeScript because the team explicitly agreed to use JavaScript throughout the project.
- Vercel provides first-class Next.js deployment and can generate preview deployments for Git pull requests.
- Supabase provides PostgreSQL, Auth and Storage as services within the same project.

Official compatibility/deployment references:

- Next.js 16 version requirements: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js installation/system requirements: https://nextjs.org/docs/app/getting-started/installation
- React releases: https://react.dev/blog
- Node.js release/LTS policy: https://nodejs.org/en/about/previous-releases
- Vercel Next.js deployment: https://vercel.com/docs/frameworks/full-stack/nextjs
- Supabase database overview: https://supabase.com/docs/guides/database/overview

## 3. Alternatives Considered

### 3.1 Node.js / TypeScript / Express

Assignment 1 explicitly evaluated a TypeScript + Node.js + Express approach against a C# + ASP.NET Core approach. The comparison used React with TypeScript and PostgreSQL for both approaches, with the server-side platform as the main variable.

The TypeScript/Node.js approach was considered because it allows the browser and server/API layers to use the same general JavaScript ecosystem and reduces language switching. The assignment also identified that TypeScript adds static checking while retaining JavaScript runtime behaviour.

The team did not select a separate Node.js/Express backend for CivicConnect because the agreed project direction is JavaScript throughout with Next.js providing both the React interface and server-side application logic. A separate Express application would introduce another backend boundary that is not required for the initial CivicConnect scope.

**Source:** SEN381 Assignment 1, Question 3, technology-stack comparison.

### 3.2 ASP.NET Core / C#

Assignment 1 also explicitly evaluated a .NET approach using C# and ASP.NET Core with PostgreSQL. The evaluation identified strengths in ASP.NET Core's integrated security and testing facilities, maintainability and platform-wide support model.

ASP.NET Core therefore remains a genuine alternative considered by the team rather than being omitted from the comparison.

The team did not select it because the final CivicConnect direction prioritises a single JavaScript application ecosystem. Using Next.js for both the React interface and server-side application logic avoids introducing a separate C# backend while still providing the server-side capabilities required by the initial scope.

**Source:** SEN381 Assignment 1, Question 3, technology-stack comparison.

### 3.3 Java / Spring Boot

A Java/Spring Boot backend was considered during the broader technology discussion as a possible Java ecosystem alternative. It would provide a mature server-side framework and relational-database integration.

However, it was not one of the two primary stacks evaluated in Assignment 1's detailed evidence-based comparison. Therefore, it is not presented as an Assignment 1 evaluated alternative. Its consideration is recorded only as a broader option discussed during M2 technology selection.

The team did not select it because it would introduce a separate Java server-side technology when the agreed CivicConnect direction can provide the interface and server-side application logic within Next.js.

### 3.4 Selected direction

The team selected JavaScript + Next.js because it provides a unified application structure with React for the interface and Next.js for server-side application logic. Supabase provides PostgreSQL persistence, authentication and private attachment storage, while Vercel provides hosted previews and application deployment.

This decision is project-specific and does not claim that the selected stack is universally superior to the alternatives.

## 4. Requirements and Architecture Considerations

The technology direction supports the M1 baseline in the following ways:

- **FR-001:** Next.js provides the interface and server-side application logic required for request submission and retrieval.
- **FR-002:** PostgreSQL supports controlled category data and relational constraints.
- **NFR-001:** Supabase Auth plus application authorization can support least-privilege access controls.
- **NFR-002:** Supabase Auth and private Storage provide mechanisms for protecting sensitive information and attachments.
- **NFR-003:** the application/data model can support attributable actions and audit-related records.
- **NFR-005:** PostgreSQL provides relational constraints and transactional persistence mechanisms for data integrity.
- **NFR-006:** Vercel/Next.js provides a deployable environment in which the M1 response-time targets can be measured.
- **NFR-007:** database and attachment recovery must be designed and tested against the approved recovery/data-loss targets.
- **NFR-008:** a consistent JavaScript/Next.js application structure reduces unnecessary technology boundaries.

These are architectural/technology considerations only. They do not claim that the requirements, security controls or performance/recovery targets have already been implemented or verified.

## 5. Build, Dependency and Testing Direction

### 5.1 Build and dependency tooling

The project will use:

- Node.js 24 LTS.
- npm 11.x.
- Next.js 16.
- React 19.3.
- JavaScript application source.
- A committed `package-lock.json` to provide reproducible npm dependency installation.
- Dependency versions recorded in `package.json` and reviewed through normal pull-request changes.

The exact dependency versions selected during bootstrap must be confirmed against the actual installed package versions.

### 5.2 Testing direction

M1 deferred the test-framework decision under D5. M2 now establishes an initial testing direction without claiming that the tooling is already implemented.

The initial direction is:

- **Node.js built-in test runner (`node:test`)** for appropriate application/server-side unit tests.
- **Browser-level verification** for the end-to-end submission/retrieval path, with the specific browser automation tool confirmed during bootstrap.

**Bootstrap confirmation:** Steven will confirm the installed runtime, framework and testing versions by creating the project bootstrap, running the local build and test commands, and recording the resulting versions. Ryno and Willem will review the bootstrap evidence through the normal PR process. If the selected test tooling proves unsuitable for the Next.js application, the replacement will be recorded through the controlled decision process.

## 6. Security and Data Considerations

The application may handle potentially sensitive request information. The implementation must therefore apply the M1 security requirements.

- Authentication must be required where the relevant CivicConnect function requires an authenticated user.
- Authorization must be enforced for protected operations.
- Supabase Storage buckets containing request attachments will be private.
- Sensitive request information must only be accessible to authorized users.
- Supabase Row Level Security (RLS) will be evaluated and configured for application data where appropriate.
- Secrets, service-role keys and credentials must not be committed to Git.
- Test data must use fictional, non-sensitive information.
- Database and storage access must follow least-privilege principles.

Supabase documents RLS as the mechanism for securing database access when exposing data through the client.

Reference: https://supabase.com/docs/guides/database/overview

## 7. Cost, Licensing and Collaboration Assumptions

### 7.1 Supabase

The initial project plan is to use the Supabase Free plan during development if its quotas are sufficient.

Current documented Free-plan allowances include:

- 2 active free projects across the organisation.
- 500 MB database size per project.
- 1 GB file storage.
- 5 GB egress.
- 50,000 monthly active users.

Supabase Free projects can be paused after one week of inactivity.

If the project requires features or capacity beyond the Free plan, the documented Pro plan currently starts at **US$25/month**, with 100,000 monthly active users, 8 GB disk per project, 250 GB egress and 100 GB file storage. Pro includes daily database backups retained for 7 days.

Sources:
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://supabase.com/pricing

### 7.2 Vercel

Vercel will be used for hosted previews and application deployment.

The Hobby plan is free but is intended for personal, non-commercial use and has usage limits. Pro is currently listed at **US$20/month per developer seat**, with included usage credit and additional usage-based charges.

Vercel supports preview deployments connected to Git pull requests. The team will use GitHub PRs for the project's formal review process; Vercel previews are an application/deployment aid rather than a replacement for the GitHub governance process.

Sources:
- https://vercel.com/pricing
- https://vercel.com/docs/frameworks/full-stack/nextjs

### 7.3 Cost assumption

The project is currently treated as an academic/non-commercial system. The team will aim to remain within the available free allowances during development. Any move to paid plans must be discussed and recorded because cost is an explicit M2 technology-selection consideration.

The actual monthly cost cannot be guaranteed until the project's usage, storage, deployment and recovery requirements are known.

## 8. Environment Separation and Preview Data

Development, preview and production environments must not share unrestricted production credentials or sensitive production data.

The intended approach is:

- **Development:** local Next.js application using development Supabase configuration/data.
- **Preview:** Vercel preview deployments connected to a non-production Supabase environment/project where practical.
- **Production:** separate production configuration and data.

Preview/test data will be fictional and non-sensitive, consistent with the M1 baseline.

Environment variables and secrets will be configured through the appropriate environment/deployment settings and excluded from source control.

If Supabase project branching or separate projects are not available within the selected plan, the team will maintain clearly separated development/preview and production projects where feasible. The exact environment setup will be confirmed during bootstrap.

## 9. Backup, Recovery and Data-Loss Assumptions

M1 established working recovery targets of:

- **Recovery Time Objective (RTO): 30 minutes**
- **Recovery Point Objective (RPO): 24 hours**

These targets remain applicable unless changed through controlled change.

### Database

Supabase Pro, Team and Enterprise projects receive daily database backups. Pro retains seven days of daily backups. Supabase also provides Point-in-Time Recovery (PITR) as a paid add-on for finer-grained recovery.

For the CivicConnect project, the intended database approach is:

1. During development, use Supabase Free if practical, supplemented by regular `supabase db dump` exports because Free does not provide the same automatic daily backup service as paid plans.
2. Before a production-like baseline is claimed, confirm that the selected Supabase plan and backup process can satisfy the 30-minute RTO and 24-hour RPO.
3. If daily backups are used, the backup process provides a maximum planned backup interval of 24 hours, subject to actual backup timing and successful restoration.
4. If the project requires a tighter RPO, PITR or another backup mechanism will be evaluated.

### Attachments

Supabase database backups **do not include the actual Storage API objects**; they contain storage metadata but not the stored files.

Therefore, attachments require a separate backup/recovery procedure. The intended approach is to periodically export/copy the private attachment objects to a controlled secondary location and verify that the objects can be restored.

The backup procedure must cover:

- Request database records.
- Attachment metadata.
- Actual attachment files.
- Relevant storage bucket configuration.
- Required authentication/storage policies and configuration.

### Recovery verification

The team will perform a restore test before claiming the recovery requirement as verified. The test will record:

- Backup source and timestamp.
- Database restoration time.
- Attachment restoration time.
- Total recovery time.
- Data restored successfully.
- Attachments restored successfully.
- Approximate data-loss window.
- Pass/fail against the 30-minute RTO and 24-hour RPO.

This ADR therefore records the **planned recovery approach**, not a claim that the targets have already been demonstrated.

Sources:
- https://supabase.com/docs/guides/platform/backups
- https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore
- https://supabase.com/docs/guides/storage/management/download-objects

## 10. Consequences

### Positive consequences

- One primary application language is used throughout the project.
- React and Next.js provide the interface and server-side application logic within one application ecosystem.
- Supabase provides PostgreSQL persistence, authentication and private file storage.
- Vercel provides a deployment path with first-class Next.js support and Git-based preview deployments.
- The initial scope avoids an unnecessary separate frontend/backend technology boundary.
- The technology direction is consistent with the team's final project-specific decision while preserving traceability to the alternatives evaluated in Assignment 1.

### Trade-offs and risks

- The team must become familiar with Next.js and Supabase integration patterns.
- Supabase and Vercel create platform dependencies.
- Free-tier limits may become constraints if database size, attachment storage, bandwidth or usage grows.
- Supabase database backups do not automatically protect Storage objects, so attachments require a separate recovery procedure.
- The 30-minute recovery target cannot be assumed from the platform choice and must be tested.
- Vercel Hobby's usage and commercial-use restrictions must be respected.
- Dependency versions must be maintained and security updates reviewed.
- The exact testing tool and environment separation remain bootstrap-confirmation items.

## 11. Evidence and M2 Traceability

This ADR is intended to provide evidence for the M2 technology-stack decision and should be referenced from the M2 RTM and PED.

Relevant M1 decision:

- **D4:** Final technology selection was deliberately deferred from M1 until M2 evidence was available.

Relevant M2 decision requirements:

- Technology selection must consider requirements/ASRs, team capability, schedule, cost/licensing, security, maintainability, ecosystem/dependency risk and deployment compatibility.
- Important versions, compatibility assumptions and dependencies must be recorded.
- Authoritative evidence must support version, licensing, security and deployment claims.
- Risks and assumptions must be updated alongside the technology decision.

The actual bootstrap, implementation and verification evidence will be added as those artefacts become available.

## 12. Status and Review

**Status: Accepted**

The team has agreed on this technology direction for M2.

The following items remain **pending bootstrap confirmation**, rather than unresolved technology choices:

- Exact installed package versions.
- Exact Node.js/npm versions recorded in the repository.
- Final testing package/tool configuration.
- Development/preview/production Supabase environment arrangement.
- Demonstrated backup and restore timings.
- Attachment backup and restore test.
- Measured performance against the M1 targets.

If the technology decision materially changes later, the change must follow the project's controlled change process and this ADR must be superseded or updated according to the team's ADR practice.
