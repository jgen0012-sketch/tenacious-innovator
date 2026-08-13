# Git Collaboration Guidelines v1.0

**Owner:** Ziyue Wang
**Status:** v1.0 — created after the Week 2 merge issue

## Why this exists
During Week 2 we hit a merge problem: `main` was almost empty, work was
scattered across separate branches, and some database code stayed on a
local machine and was never pushed. When we tried to merge, the branches
had unrelated histories and would not combine. The root cause was not
effort — it was that we had no shared Git rules.

## Rules

### 1. Branch naming
- `feat/<name>` — new features
- `fix/<name>` — bug fixes
- `db/<name>` — database work
- One personal branch per member, based off `main`.

### 2. Merging
- Merge to `main` via a Pull Request, not direct pushes.
- Merge your work into `main` regularly — do not keep it only on your
  local machine or personal branch.

### 3. Communication before pushing
- If a change may affect other members work, post a quick heads-up in
  the group chat before pushing.
- Raise blockers early instead of holding onto them.

## Review
This document will be reviewed at the end of the current iteration and
updated if the team workflow changes.
