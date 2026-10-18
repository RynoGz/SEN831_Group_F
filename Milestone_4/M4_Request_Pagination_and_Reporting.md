# Complete request lists and reporting

## Decision and implementation

On 18 October 2026 Ryno authorised correcting the 1,000-record limitation before final acceptance. This finalises existing FR-004, FR-007, FR-013 and FR-015 behaviour; it does not add new product scope or decide retention. Historical M3 evidence and the existing PED are unchanged.

Migration `011_m4_request_pagination.sql` adds `m4_request_page`. It executes with invoker rights and retains the caller's table RLS. Owned lists explicitly select the caller's requester profile. Work lists additionally require a staff/manager role and `m3_can_work` per request, including category and sensitive-information clearance. Aggregates and category choices derive from the same authorised population. No service-role client or public bucket is introduced.

Search, category/status filters and ordering execute before pagination. Search is a case-insensitive literal substring of title, location or reference, including literal percent/underscore characters. Ordering uses creation time and request UUID to make timestamp ties deterministic. Default page size is 25; the API accepts 1 to 100 rows. Out-of-range positive pages clamp to the final available page. Empty results use page 1 of 1 with total 0.

Summary totals and distributions cover all matching authorised records. They do not depend on page size or page number. Management requests summary-only results without downloading request rows. This removes the reporting cutoff rather than increasing its threshold. Offset pages describe the current dataset, not a frozen snapshot across simultaneous inserts.

The shared request-list component provides Previous and Next controls, loading/retry/empty states and filter recovery. Query, category, status, sort and page are URL parameters. Search is debounced by 300 ms with immediate Enter/clear behaviour and IME support. Changed filters reset page 1. A reload preserves committed list state. Existing rows remain visibly refreshing during a list request; page controls are disabled until it completes. The approved colours and shared controls are preserved.

## API handoff

`GET /api/my-requests` and `GET /api/work` accept `query`, `status`, `category` (category UUID), `sort` (`newest` or `oldest`), `page` and `pageSize`. Ownership/work mode is enforced by the route, not accepted from user input. `/api/work?summaryOnly=true` omits the list rows while returning complete scoped totals.

Both endpoints return:

```json
{
  "requests": [],
  "pagination": { "page": 1, "pageSize": 25, "total": 0, "pages": 1 },
  "summary": {
    "total": 0, "open": 0, "overdue": 0, "resolved": 0,
    "closed": 0, "rejected": 0, "byCategory": {}, "byStatus": {}
  },
  "categories": [],
  "actor": { "id": "authenticated-user-id", "role": "requester" }
}
```

The example shows the actor fields relevant to consumers; the existing session name and clearance fields are also retained. Category entries contain `id` and `name` for the complete authorised population, so filtering does not remove available choices. `requests` retains the existing request row shape, with nested `categories.name` and `statuses.name`. The old unused work-response staff array is replaced by the already established `/api/staff-directory` interface. Assignment and request-detail contracts remain unchanged.

Missing authentication returns 401 at the application boundary; disallowed work access returns 403. Invalid list options return 400. A failed database list query returns a safe 503 and does not masquerade as an empty result.

## Verification on 18 October 2026

The tested source is the local working tree based on `79f503a270599a1c4ecbd4b9a4fa28cdc0e46fc8`; the selected evidence includes SHA-256 hashes to identify the uncommitted changes. No commit, peer approval or hosted deployment of this correction is claimed.

- All 32 unit and 39 database integration tests passed.
- Eight new database regressions cover 1,258 owned requests, every page without duplicates, old-record searches, literal wildcard handling, combined filters, complete totals, category/clearance restrictions, denied direct RPC callers, page bounds, API validation and preservation of rows/policies/history.
- All 25 browser cases passed with 3,300 seeded fictional requests. New browser cases cover paging beyond 1,000, old reference search, reload persistence, empty-result recovery, mobile overflow and management totals across the entire queue. Existing lifecycle, attachment, reassignment, permission and failure-state cases also passed. Isolated frontend failure-state cases retain their explicitly mocked responses.
- The simulation production build, full ESLint, bounded source/migration secret scan and strict frontend static audit passed. The final hosted-configuration build result is recorded in the verification summary.
- A local production paginated-read check with 3 identities and 60 requests over the 3,300-record seed had no errors and p95 235.52 ms against the existing 2,000 ms threshold. This is a local regression, not hosted workload acceptance or a direct comparison with older unpaginated measurements.

Selected results are in `Milestone_4/Verification/2026-10-18_Pagination`. The browser runner used separately started local servers and an ignored configuration with the normal test suite to avoid the previously observed Windows server-teardown delay.

## Release and acceptance handoff

Apply migration 011 to the intended hosted Supabase project before deploying the dependent application. The earlier R2 confirmation covered migrations 009 and 010; it does not cover 011. Verify the affected list/search/reporting journeys over HTTPS on the new reviewed candidate and record its actual deployment SHA. The old R2 candidate is superseded for this correction.

Steven should replace the 1,000-record limitation in the final assessment after linking this implementation and the verification appropriate to the final environment. Do not automatically mark every affected criterion Met: retention, management semantics and other independent criteria still require their own conclusions. Willem should use these focused regressions and the deployed candidate when concluding W2.

This change does not establish an agreed retention policy, scheduled hosted recovery, representative-user usability acceptance or the complete NFR-006 workload. Existing limitations remain accountable. Peer review by both non-author members and the final team release decision remain required.

## AI assistance

OpenAI Codex implemented the database function, application/API integration, pagination controls and focused verification under Ryno's instruction. The recorded results are executed local checks; no human review or hosted migration application is inferred from AI assistance.
