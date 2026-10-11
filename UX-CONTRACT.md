# CivicConnect UI ownership

Business authority: Master Brief, current server workflow service, request-transition-policy and Supabase policies. Visual changes must preserve access controls, status transitions and persisted data contracts.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Select/Listbox | Native HTML select in existing feature forms | This contract and real API category data | Native platform popup | Browser filter and lifecycle tests |
| Date | Native datetime-local in request-workspace.js; displayTime in use-api.js | Existing UTC API and SAST display contract | Native local entry | Lifecycle tests and timezone display inspection |
| Form | request-form.js; existing workflow, login and attachment handlers | Existing validation and API contracts | Create and workflow mutation | Browser validation, attachment and lifecycle tests |
| Scrollbar | src/app/globals.css | DESIGN.md | Native with stable gutter | Responsive overflow checks |
| CRUD | Existing service.js and owning feature handlers | Domain policy and Supabase permissions | Confirmation on create; refresh after update | tests/e2e/workflow.spec.js |

| Capability | Owner | Contract |
| --- | --- | --- |
| Layout and navigation | src/components/app-shell.js | Route-aware shared shell; session role controls team navigation; server enforces access. |
| Account actions | src/features/workflow/account-nav.js | Session supplied by shell; existing sign-out discards session UI through full navigation. |
| Select/listbox | Native select in existing forms | Platform popup and keyboard behavior accepted; labelled controls and real category options. |
| Date input | Native datetime-local in request-workspace.js | Platform input geometry accepted; local entry converted through existing UTC API contract. |
| Date display | displayTime in use-api.js | en-ZA display in Africa/Johannesburg, SAST label. |
| Request form | request-form.js and validate-request.js | noValidate with existing error summary, field-linked errors and focus; prevent repeat submission; confirmation remains on create page. |
| Other forms | Existing workflow, login and attachment handlers | noValidate with explicit reportValidity before mutation; server remains authoritative; pending disables actions; inline status/error messages. |
| Textarea | src/components/textarea.js | Auto-expands as text is entered; shared resize:none styling. |
| Buttons | .button / .secondary / .nav-button in globals.css | Text-only CTA, same action name through operation, disabled pending state and stable minimum width. |
| Status labels | src/components/status-badge.js | Exact existing lifecycle labels; text conveys meaning independently of colour. |
| Data and failure states | useApi and ApiState | Protected APIs, abort on unmount, loading status and inline accessible error; no prototype data fallback. |
| CRUD | Existing service.js and page handlers | Create confirms then links to detail; mutations refresh detail; errors stay inline; existing version and permission checks retained. |
| Feedback | ApiState and existing form live regions | Inline feedback remains canonical. No new toast provider or native alert/confirm/prompt. |
| Scrollbar | src/app/globals.css | Native scrolling, stable gutter, no hidden scrollbars. |
| Table selection | Not applicable | No multi-select or bulk operations introduced. |

Verification: existing workflow browser suite covers submission, validation, attachment and retrieval, denied access, staff assignment, progress, resolution and manager closure. Visual browser checks cover mobile overflow, reduced motion, keyboard access and empty-filter recovery. Native control validation is a deliberate preserved interaction choice, not an authored popup system.
