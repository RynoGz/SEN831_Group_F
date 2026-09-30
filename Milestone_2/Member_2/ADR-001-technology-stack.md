# ADR-001: Technology Stack

**Project:** CivicConnect — Community Service Request Management Platform  
**Decision ID:** ADR-001  
**Status:** Accepted  
**Date:** 30 September 2026  
**Decision owners:** Ryno Goetz, Steven Riaan Piek, Willem Booysen  
**Milestone:** M2 — Architecture, Technology & Initial Design Baseline

## 1. Context

CivicConnect requires a technology direction for the M2 architecture and initial implementation. The technology decision must support the M1 requirements while remaining practical for the team's development capability, project scope, maintainability, security, testing and deployment needs.

The first implementation path will focus on the submission and retrieval of a service request. The technology stack must support a web interface, server-side application logic, relational persistence, authentication, private attachment storage and application deployment.

The M1 baseline remains the source of truth for the requirements. In particular, FR-001 requires a service request to contain a title, description, category, location, requester identity/contact information and a sensitive-information indicator. The system must automatically record the submission date/time, allow an optional attachment, and place a successfully submitted request in the `Submitted` state.

## 2. Decision

The team agreed to use the following technology stack for CivicConnect:

| Area | Technology | Purpose |
|---|---|---|
| Application language | JavaScript | Application code throughout the project |
| Frontend | Next.js with React | Web user interface |
| Server-side application logic | Next.js | Server-side application logic |
| Database | Supabase PostgreSQL | Relational application data persistence |
| Authentication | Supabase Auth | User authentication |
| Private attachment storage | Supabase Storage | Storage of private request attachments |
| Hosting and deployment | Vercel | Hosted previews and application deployment |

This technology direction will be used as the basis for the M2 architecture, data model and initial implementation.

## 3. Alternatives Considered

### Alternative A — Java / Spring Boot

A Java/Spring Boot backend with PostgreSQL was considered.

**Advantages:** mature backend ecosystem, strong REST and relational persistence support.

**Trade-offs:** introduces a separate backend technology and additional application/runtime structure for the project.

### Alternative B — Node.js / TypeScript backend

A Node.js/TypeScript backend was considered.

**Advantages:** suitable for web and server-side development and uses the same general ecosystem as the frontend.

**Trade-offs:** a separate backend framework/application structure would be required if implemented independently from Next.js.

### Selected Direction

The team selected JavaScript with Next.js because it provides a unified application approach with React for the interface and Next.js for server-side application logic. Supabase provides PostgreSQL persistence, authentication and private attachment storage, while Vercel provides hosted previews and application deployment.

## 4. Requirements and Architecture Considerations

The selected technology direction supports the initial requirements in the following ways:

- **FR-001:** supports the interface and server-side logic required to submit and process a request.
- **FR-002:** PostgreSQL supports controlled category data and relationships.
- **NFR-001:** authentication and authorization can support least-privilege access controls.
- **NFR-002:** Supabase authentication and private storage provide mechanisms for protecting sensitive information and attachments.
- **NFR-003:** the architecture can support attributable actions and audit-related data.
- **NFR-005:** PostgreSQL supports relational constraints and transactional persistence for data integrity.
- **NFR-006:** the hosted architecture provides a basis for measuring application response times.
- **NFR-007:** persistence, backup and recovery will be addressed during M2 design and verification.
- **NFR-008:** a consistent JavaScript/Next.js structure reduces unnecessary technology boundaries.

These considerations do not claim that the requirements have already been implemented or verified.

## 5. Security and Data Considerations

The application may handle potentially sensitive request information. The implementation must therefore apply the M1 security requirements.

- Authentication must be required where appropriate.
- Authorization must be enforced for protected operations.
- Private attachments must not be publicly accessible.
- Sensitive information must only be accessible to authorized users.
- Secrets and credentials must not be committed to the repository.
- Test data must use fictional, non-sensitive information.
- Database and storage access must follow least-privilege principles.

Detailed security controls will be refined during M2 architecture and implementation.

## 6. Deployment

Vercel will be used for hosted previews and application deployment.

Deployment configuration must remain compatible with the Next.js application and Supabase services. Environment-specific configuration and credentials must remain outside source control.

## 7. Consequences

### Positive consequences

- One primary application language is used throughout the project.
- React and Next.js provide the interface and server-side application logic within one application ecosystem.
- Supabase provides PostgreSQL persistence, authentication and private file storage.
- Vercel provides a deployment path aligned with Next.js and hosted previews.
- The initial scope avoids unnecessary separate frontend/backend technology boundaries.

### Trade-offs and risks

- The team must become familiar with the specific Next.js and Supabase integration patterns used.
- Supabase creates some platform dependency.
- Vercel and Supabase configuration must be managed carefully across environments.
- Performance, recovery and security claims must still be verified through implementation and testing.

## 8. Impact on M2 Work

This decision establishes the technology direction for:

1. Designing the CivicConnect data model.
2. Documenting the PostgreSQL/Supabase persistence decision.
3. Implementing the initial database schema and relationships.
4. Building the first functional path:
   `Submit request → validate → save → return confirmation → retrieve request`.
5. Adding automated verification.
6. Updating the RTM with implementation and verification evidence.

## 9. Status and Review

**Status: Accepted**

This ADR records the team's agreed technology direction for M2. If the technology decision changes later, the change should be recorded through the project's controlled change process and this ADR should be superseded or updated according to the team's ADR practice.
