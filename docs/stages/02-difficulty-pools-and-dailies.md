# Stage 02 — Difficulty pools, content & dailies

**Phase:** 2  
**Status:** `in_progress`  
**Goal:** Sudoku.com-like loop — pick a difficulty or play daily; multi-shape content beyond the demo T.  
**Depends on:** Stage 01 shell  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Substages (implement in order)

Stage 02 is large; ship it as four sequential substages. Each has its own checklist and can merge to `main` independently when its exit criteria are met.

| Substage | Doc | Focus |
| --- | --- | --- |
| **02a** | [`02a-level-schema-and-demo-pack.md`](./02a-level-schema-and-demo-pack.md) | Level schema, extract demo T into content, session loads levels, solvability harness |
| **02b** | [`02b-classic-multi-shape-pools.md`](./02b-classic-multi-shape-pools.md) | Multi-shape pools per difficulty, classic deal + play another |
| **02c** | [`02c-daily-challenge-and-archive.md`](./02c-daily-challenge-and-archive.md) | Date-seeded daily, archive calendar, streak/trophy, share card |
| **02d** | [`02d-comfort-tools-stats-and-closeout.md`](./02d-comfort-tools-stats-and-closeout.md) | Real hints + undo, richer stats, QA closeout, mark Stage 02 done |

```text
02a schema/demo pack
  → 02b classic multi-shape pools
    → 02c daily + archive + share
      → 02d hints/undo/stats + Stage 02 closeout
        → Stage 03 store packaging
```

**Kickoff:** Start at **02a**. Do not begin 02b until 02a exit criteria are met (or a conscious scope cut is recorded in Progress notes).

---

## Parent exit criteria

Roll up from substages. Mark the parent `done` only when all below are true:

- [ ] Puzzles tagged by difficulty; Classic play deals from the correct pool *(02a–02b)*
- [ ] Multi-shape library v1 shipped (demo T in Easy + other shapes); all validated solvable *(02a–02b)*
- [ ] Daily challenge of the day works offline via date seed *(02c)*
- [ ] Daily archive (calendar) + trophy/streak + share card *(02c)*
- [ ] Stats per difficulty (+ daily history) *(02d; storage seeds earlier OK)*
- [ ] Hints + undo available across tiers *(02d)*
- [ ] Authoring/solvability checks prevent shipping broken or mistagged puzzles *(02a harness; 02b–02d coverage)*

---

## Parent checklist (rollup)

Prefer checking detailed boxes in the **substage** files. Use this list as a Phase 2 overview.

### Difficulty & library — 02a / 02b

- [x] Level schema includes `difficulty` (and metadata: par, rules, shape id) *(02a)*
- [x] Content folder structure for pools (`src/content/levels/` or equivalent) *(02a)*
- [x] Easy pool includes demo T *(02a)*
- [ ] Medium / Hard / Expert pools have validated multi-shape entries
- [ ] Classic flow: pick difficulty → next/random from pool → play another
- [x] Difficulty rubric documented (link or `docs/LEVELS.md`) *(02a stub; rubric grows in 02b)*

### Daily challenge — 02c

- [ ] `daily.ts` (or equivalent): date → challenge id / puzzle
- [ ] Today’s challenge entry from Home
- [ ] Archive calendar for past days
- [ ] Trophy / streak local persistence
- [ ] Share result card (time, moves, date, difficulty)

### Tools & stats — 02d

- [ ] Progressive hints (rate-limited)
- [ ] Undo
- [ ] Per-difficulty stats (wins, best time, best moves)
- [ ] Daily completion history

### Quality gates — 02a–02d

- [x] Solvability tests/checklist for each new puzzle *(02a harness for demo T; expand per pack in 02b+)*
- [ ] Mistagging review (tier feels right in spot checks)
- [ ] Lint + Pages build + deploy confirmed

### Explicit non-goals for Stage 02

- [ ] Capacitor / store submission (Stage 03)
- [ ] Seasonal events / Master tier (Stage 04)

---

## Progress notes

| Date | Note |
| --- | --- |
| 2026-08-09 | Split Stage 02 into substages 02a–02d for incremental delivery. |
| 2026-08-09 | Stage 02a done: level schema + `easy-demo-t` content pack + solvability harness. Parent status → `in_progress`. Next: 02b. |
