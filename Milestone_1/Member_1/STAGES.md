# Ryno's four review and commit stages

This pack is supplied in four coherent stages so you can check, revise and commit each unit separately before the 9 September 2026 M1 deadline. All initial files were drafted together with AI assistance. Multiple commits should record actual reviewed increments, not imply that separate meetings, approvals or dates occurred. Peer approvals and baseline sign-off are separate from local commits [S4, sections 9-10 and 23; source register in README.md].

Run the commands from the repository root on a task branch. The commands below are suggestions; they have not been executed. Before staging each group, check `git status --short`. Stage only the listed files and inspect `git diff --cached` before committing. Use `git diff --cached --check` to check basic patch whitespace. If something unrelated was already staged, resolve that staging state before committing this work.

## Stage 1 - Establish the problem and stakeholder needs

Read the Master scenario and minimum capabilities, then check the problem analysis and stakeholder register. Confirm you understand why inferred roles/ratings are labelled as analysis. Correct any wording you cannot explain. This stage gives Steven useful source/need inputs immediately.

```bash
git add -- Milestone_1/Member_1/README.md Milestone_1/Member_1/STAGES.md Milestone_1/Member_1/01-problem-and-business-need.md Milestone_1/Member_1/02-stakeholder-analysis.md
git diff --cached
git diff --cached --check
git commit -m "docs: draft CivicConnect problem and stakeholder analysis"
```

The index references later-stage files; those links become complete when the later stages are committed.

## Stage 2 - Propose scope and analyse constraints

Check all 16 minimum capabilities against the Master brief. Review the selected request fields, categories, roles, lifecycle, overdue rule and in-app feedback policy. Review the recommended exclusions/deferments and their trade-offs. Exact retention and quantitative performance targets remain open. Give Steven scope/constraint inputs and Willem the risk/decision implications.

```bash
git add -- Milestone_1/Member_1/03-scope-baseline.md Milestone_1/Member_1/04-constraints-and-assumptions.md
git diff --cached
git diff --cached --check
git commit -m "docs: propose scope and analyse project constraints"
```

## Stage 3 - Review the Team Working Agreement

Read the agreement with Steven and Willem. It records daily availability, four hours per member, WhatsApp/Discord use and meetings every second day after 11:00. Ryno reported that all three members agreed; preserve a real supporting reference if required and update the agreement if conditions change.

```bash
git add -- Milestone_1/Member_1/05-team-working-agreement.md
git diff --cached
git diff --cached --check
git commit -m "docs: draft team working agreement"
```

## Stage 4 - Prepare governance evidence and your handoff

Read GOV-001 to GOV-008 against the actual repository settings. All three members reportedly have full access, but registration and branch protection are separate checks. Record whether `main` is protected and remember that the Master requires both non-author approvals even if GitHub is configured for only one. Review the AI-register entry and record your actual verification. Use the defence notes to test your understanding and prepare the final handoff.

```bash
git add -- Milestone_1/Member_1/06-github-governance.md Milestone_1/Member_1/07-review-and-defence-notes.md
git diff --cached
git diff --cached --check
git commit -m "docs: define governance evidence and Member 1 handoff"
```

## Review and merge

Push the task branch when you are ready to share it, open a PR linked to the real issue/backlog task, and request both Steven and Willem. You may use one PR containing the four commits, or separate PRs for independently reviewable stages. Each substantive PR requires both non-author approvals before merging into main [S4, section 9].

Resolve comments through further genuine changes and commits. Do not delay committing completed work merely to manufacture a longer history. Completion means verified content, resolved relevant policy questions, real review/control evidence and the required baseline sign-off, not simply reaching four commits.
