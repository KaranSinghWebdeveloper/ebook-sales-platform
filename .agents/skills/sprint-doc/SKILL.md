---
name: sprint-doc
description: >-
  Auto-generates a comprehensive sprint documentation file (docs/SPRINT_N.md)
  after completing any sprint in the digital product sales platform project.
  Use this skill at the END of every sprint to document what was built,
  key decisions, file map, API routes, and what's coming next.
trigger: model_decision
---

# Sprint Documentation Skill

## When to Activate
Activate this skill at the END of every sprint, or when the user says:
- 'document this sprint'
- 'create sprint docs'
- 'write progress notes'
- 'log what we built'

## Documentation Template

For each sprint, create/update `docs/SPRINT_{N}.md` in the project root.

### File: `docs/SPRINT_{N}.md`

`markdown
# Sprint {N} — {Sprint Name}
**Date Completed**: {YYYY-MM-DD}
**Status**: Complete

---

## Files Created / Modified

| File | Type | Description |
|---|---|---|
| path/to/file.ts | NEW / MODIFIED / DELETED | What it does |

---

## Architecture Decisions

### Decision 1: {Title}
**What**: What was decided
**Why**: Rationale
**Alternatives considered**: Other options evaluated

---

## API Routes Built

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/example | SELLER | What it does |

---

## Components Built

| Component | Location | Props | Usage |
|---|---|---|---|
| ComponentName | components/x/y.tsx | {prop: type} | Where its used |

---

## Configuration Added

Any new environment variables, Prisma schema changes, or config files added.

---

## Known Issues / Edge Cases

- Issue 1: description and workaround

---

## How to Test This Sprint

Step-by-step manual testing checklist for what was built.

---

## Next Sprint Preview

What Sprint N+1 will build on top of this.
`

## Steps to Follow

1. Scan the project - use list_dir on the workspace to find all newly created/modified files
2. Read key files - view the most important new files to understand their architecture
3. Fill the template - populate every section with real, accurate information
4. Save to docs/SPRINT_{N}.md
5. Update PROGRESS.md in the project root - a running log of all sprints completed

## PROGRESS.md Format

Maintain a running PROGRESS.md at the project root:

# Platform Build Progress

| Sprint | Name | Status | Date | Docs |
|---|---|---|---|---|
| S0 | Foundation | Done | 2026-09-15 | docs/SPRINT_0.md |
| S1 | Design System | In Progress | - | - |
