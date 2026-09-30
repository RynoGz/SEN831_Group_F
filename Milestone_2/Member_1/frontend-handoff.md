# Frontend implementation and integration handoff

Ryno Goetz · 30 September 2026 · M2 contribution on `Ryno_branch`

The architecture contribution was completed before application coding. This record describes the resulting frontend and the boundary Steven can connect. It supports Master Brief sections 11, 13, 15 and 20.2, and M2 sections 7–9. PED v1.0 remains the requirements baseline. This is not a declaration that the integrated M2 request path is complete.

## Current application

| Route | Current behaviour |
| --- | --- |
| `/` | CivicConnect introduction and navigation. |
| `/requests/new` | Request form with browser validation and fictional requester details. **Check request** never persists or sends data. |
| `/requests` | Explicit unavailable state; does not pretend a database query returned an empty list. |
| `/requests/example` | Fixed fictional example demonstrating the details component. |
| `/requests/[requestId]` | Explicit unavailable state until an authorised retrieval operation exists. |

`src/app` owns page composition and styling. `src/features/requests/request-form.js` owns form interaction and feedback. `validate-request.js` supplies browser validation. `request-details.js` renders supplied request data. `preview-data.js` contains fictional data and the seven PED category labels. The preview has no Auth, Supabase client, external API, database, localStorage or upload operation.

The setup uses the JavaScript App Router, simple CSS, npm and the Node test runner. Exact installed versions and commands are in the root README. No TypeScript, separate Express server or UI-library dependency has been added.

## Connecting the submission form

`RequestForm` accepts `categories`, `requester` and an optional `submitRequest` function. Without `submitRequest`, it stays in preview mode and cannot claim a saved request. The current page intentionally supplies no submission function.

The following is an implemented component interface and a **proposed server contract**. Steven must confirm it before integration. It is not a public endpoint.

```javascript
// Server-loaded presentation data; never authority supplied by the browser.
categories = [{ id: "database-category-id", name: "Maintenance" }];
requester = { displayName: "Verified profile name", contact: "Verified contact" };

// Form values passed to a future protected Server Action.
submitRequest({
  title,
  description,
  categoryId,
  location,
  sensitiveInformation, // boolean; explicit false is valid
});

// Expected success shape, only after persistence succeeds.
{ ok: true, request: { id, status: "Submitted", createdAt } }

// Expected failure shape. Field keys match the submitted fields above.
{ ok: false, fieldErrors: { title: "Enter a title." } }
```

The form displays safe generic submission failures and recognised field errors. It preserves values when validation or submission fails, prevents repeated clicks while a supplied operation is pending, and renders confirmation only after a successful result containing an ID, status and timestamp. The pending, server-failure and saved-result branches exist for integration; they are not proof that a server operation has been exercised.

Before enabling submission, Steven must independently validate input and category membership, derive the requester from the session, enforce access, generate the timestamp and initial state, and persist related records consistently. Browser validation and click prevention are convenience controls, not security or durable duplicate prevention. The UI does not accept a requester ID, initial status or timestamp from the form.

Replace preview category IDs with the actual IDs. Load requester identity/contact from the approved Auth-to-Requester mapping and confirm all FR-001 contact requirements. Replace the global preview banner and fictional details only when the corresponding real capability exists. Do not enable a submit button merely because environment values have been entered.

Attachments are visibly unavailable and omitted from the payload. Ryno and Steven must extend the form together once Willem's storage design and the real upload operation establish limits, authorisation and failure behaviour. Optional attachments are still part of FR-001; the current limitation is not a requirements change.

## Connecting request details

`RequestDetails` accepts `{ id, reference?, title, description, category, location, status, createdAt, sensitiveInformation }`. `createdAt` is a valid timestamp string. The view displays time in Africa/Johannesburg and labels it SAST. It renders text through React, not raw HTML.

Steven's query must authorise the session before returning any protected fields. Connect it in `src/app/requests/[requestId]/page.js`; handle missing/denied results without revealing another user's request. Do not replace a failed fetch with the example fixture. Add a real authorised list operation before treating `/requests` as a working request history.

## Traceability supplied to Steven

| Baseline | Architecture driver | Current code evidence | Verification scope |
| --- | --- | --- | --- |
| NEED-001 → SCP-001 → FR-001 | RG-ASR-07 | `request-form.js`, `validate-request.js` | Browser required-field handling and explicit sensitivity; no persistence acceptance claim. |
| FR-002 | RG-ASR-07 | `preview-data.js`, category select | Seven approved labels; real IDs/server validation pending. |
| NFR-004 | RG-ASR-07 | Form labels, linked error summary, focus, live status and responsive CSS | Initial usability/accessibility checks; not full user acceptance. |
| NFR-008 | RG-ASR-06 | App/feature separation, pinned dependencies, README | Reproducible build and initial automated validation checks. |
| FR-003, FR-008; NFR-001/002 | RG-ASR-01/02 | Proposed retrieval boundary only | Protected retrieval and negative access tests pending Steven's implementation. |

All rows link to RG-ADR-01 in the architecture contribution and accepted technology ADR-001. Steven should add the actual issue/commit/PR references to the shared RTM once available. Do not mark FR-001, authentication, performance, recovery or secure retrieval complete from this frontend contribution.

## Verification record

Checked on 30 September 2026 on Ryno's Windows device with Node.js 24.16.0 and npm 11.13.0. A clean build does not establish production or baseline readiness.

| Check | Observed result |
| --- | --- |
| Word documentation | Rendered and inspected all eight pages of revision 0.2 before application coding. |
| `npm ci --no-fund` | Passed using the generated lockfile; installed 349 packages. The accompanying npm audit reported zero known vulnerabilities at this check. |
| `npm run lint` | Passed with the pinned ESLint 9.39.5 configuration. |
| `npm test` | Six tests passed: valid input without attachment, required/whitespace fields, invalid category, explicit sensitivity, input normalisation and malformed input. |
| `npm run build` | Passed after the clean install; generated the home, requests, new-request and example pages, with the dynamic details placeholder. |
| `npm start -- --hostname 127.0.0.1` | Started successfully; production pages loaded in the browser and the form route returned HTTP 200. |
| `npm run dev -- --hostname 127.0.0.1` | Started successfully; homepage loaded with no browser console errors observed. |
| Browser form checks | Empty form produced five linked field errors and focused the summary. Valid fictional input retained its values and showed the explicit no-save result. |
| Browser navigation | Keyboard activation reached requests and the fictional details view. The example showed the expected category, status and SAST timestamp. |
| Responsive checks | At 375px, the form and error summary were readable without horizontal overflow. At 1280px, the home steps used three columns without horizontal overflow. |

The browser checks were interactive checks, not an automated end-to-end test suite. Real submission, server errors, persistence, authentication, authorisation and attachments remain unverified until the backend is integrated. Full accessibility acceptance, performance and recovery testing remain outstanding.

**Tooling follow-up:** npm marks ESLint 9.39.5 unsupported. ESLint 10.11.0 was evaluated but failed with the selected Next.js parser (`scopeManager.addGlobals is not a function`), so the passing configuration is pinned at 9.39.5. Revisit that compatibility when upgrading dependencies. `next.config.mjs` disables automatic generation of framework AI instruction files; it does not alter application behaviour.

## AI usage register input

30 September 2026; Ryno Goetz; OpenAI Codex. Assisted with Next.js bootstrap, frontend components, styling, validation checks and setup/handoff documentation. Verification uses the approved requirements and category set, lint, Node tests, production build and browser checks recorded here. The code deliberately leaves persistence and authentication unimplemented rather than simulating successful saves. Ryno and both reviewers remain responsible for reviewing, explaining and accepting the contribution; Willem should incorporate this entry into the shared register.
