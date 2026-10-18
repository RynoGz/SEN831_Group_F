# W1 attachment compatibility

Prepared on 18 October 2026 on Willem_branch, after updating from main at `44242849c009158c8c8b4afc32539986e086c0f2`.

## Decision and baseline impact

The agreed maximum for new files is **4 MiB, exactly 4,194,304 bytes**. On 18 October 2026 Willem confirmed in this work session that the group accepts 4 MiB. This records team agreement to the bounded size decision; it does not establish non-author code reviews, approval to merge, or a final release recommendation. Both non-author PR reviews remain prerequisites to merging and deployment.

PED v3.0 FR-001 requires optional attachments but its six acceptance criteria specify no numeric file maximum. Its implementation narrative and BB04 historical result explicitly record 5 MiB. Moving to 4 MiB changes that documented capability: files from 4,194,305 to 5,242,880 bytes can no longer be newly uploaded. Historical PED content, migration 006 and M3 evidence remain unchanged. Ryno owns the current PED, README, upload UI and new-request guidance updates; this handoff identifies their required change without modifying those files. If 5 MiB must remain an acceptance commitment, this proposal must not be approved without agreeing a different storage/upload contract.

Vercel documents a 4.5 MB request/response payload ceiling for Functions: https://vercel.com/docs/functions/limitations. The file maximum plus the 65,536-byte multipart overhead allowance is 4,259,840 bytes. The route checks both declared length and actual streamed bytes, so omitted or misleading Content-Length cannot bypass the application body limit. Oversized requests rejected by the platform before the handler may still have platform-generated responses; hosted boundary execution remains an R2 check.

## Implementation and handoff

- `MAX_ATTACHMENT_BYTES` stays a browser-safe named export in `src/features/attachments/attachment-store.js`. Ryno can import it and derive MiB wording with `MAX_ATTACHMENT_BYTES / (1024 * 1024)`.
- POST `/api/requests/<UUID>/attachment` retains multipart field `file` and success `{ "ok": true }`. Empty/missing/malformed or invalid-signature files return safe JSON errors with 400; oversized input returns 413; existing attachment conflict remains 409. Authentication, parent-request access and ownership checks still occur before body parsing or storage access.
- PDF, PNG and JPEG matching-signature checks remain. Reported and thrown database-link failures both attempt staged-upload cleanup. A failed or unconfirmed cleanup never claims that removal succeeded.
- GET on the same route retains authorised private binary download and `Cache-Control: private, no-store`. The frontend component and `onSaved` contract are unchanged.
- Apply `010_m4_attachment_limit.sql` after 008. It updates only the existing bucket size and ensures `public=false`. It does not depend on timestamp migration 009, change MIME types or access policies, or delete objects. Ordinary fresh installations still apply available numbered migrations in order.

## Verification and limits

Selected reproducible evidence is under `Milestone_4/Verification/2026-10-18_W1`. Unit tests cover the exact file maximum, one byte over, missing/empty/malformed files, supported signatures and mismatches, dishonest/missing body lengths, link/cleanup failure and a legacy 5 MiB download adapter fixture. Database checks apply 010 directly after 008 and compare existing object rows and policies, bucket privacy/types, and permitted/denied reads. The PGlite storage schema does not emulate Supabase Storage's HTTP size enforcement; those assertions establish configuration and RLS, not hosted enforcement.

Final focused results: 29 unit tests and 23 database integration tests passed. Full lint, affected-file lint, secret-pattern scanning and the simulation production build passed. The two focused Playwright cases, W1API01 and E2E01, each reported passed through the per-case reporter. The Windows runner did not finish server teardown and was interrupted after both results were saved; this is not recorded as a clean full Playwright run. Earlier browser attempts failed setup before executing assertions; they are not counted as application failures or passing evidence. CI and the deployed HTTPS environment remain separate checks.

GitHub M3 quality gate run [39116264099](https://github.com/RynoGz/SEN831_Group_F/actions/runs/39116264099) completed successfully for application commit `ba91e543226bbcd99bf86aae910d9f8cfd44da4e`. This confirms the remote workflow independently of the local Windows teardown limitation. The subsequent team-agreement update changes documentation only; it does not rerun or replace the recorded local results.

The original 5 MiB fixture remains readable through the adapter and migration preserves its modelled object access. No inventory of the shared hosted bucket was performed and no actual historical hosted download is claimed. Existing files above 4 MiB require an authorised inventory and HTTPS download check at R2, especially given the function response payload ceiling. No shared hosted fixtures, migrations or recovery operations were run.

Frontend wording currently still states 5 MiB on this branch because Ryno owns those files. The integrated candidate must adopt the shared constant and correct wording before release. W1 can be reviewed independently of S1/009; W2 and final deployed acceptance are outside this checkpoint.

## AI assistance

OpenAI Codex reviewed the supplied W1 guide and baseline, implemented the attachment changes and focused regressions, and ran the checks recorded in the evidence summary. This records assistance, not human approval. The initial unit fixture exposed a Node multipart-stream cancellation issue; the regression now uses a controlled stream to assert bounded reads and cancellation. Initial build permissions and browser-cache setup were corrected before the final verification attempts. No claim is made that unrelated historical performance or recovery limitations were resolved.
