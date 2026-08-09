# Stage 02 — Difficulty pools, content & dailies

**Phase:** 2  
**Status:** `not_started`  
**Goal:** Sudoku.com-like loop — pick a difficulty or play daily; multi-shape content beyond the demo T.  
**Depends on:** Stage 01 shell  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Exit criteria

- [ ] Puzzles tagged by difficulty; Classic play deals from the correct pool
- [ ] Multi-shape library v1 shipped (demo T in Easy + other shapes); all validated solvable
- [ ] Daily challenge of the day works offline via date seed
- [ ] Daily archive (calendar) + trophy/streak + share card
- [ ] Stats per difficulty (+ daily history)
- [ ] Hints + undo available across tiers
- [ ] Authoring/solvability checks prevent shipping broken or mistagged puzzles

---

## Checklist

### Difficulty & library

- [ ] Level schema includes `difficulty` (and metadata: par, rules, shape id)
- [ ] Content folder structure for pools (`src/content/levels/` or equivalent)
- [ ] Easy pool includes demo T
- [ ] Medium / Hard / Expert pools have validated multi-shape entries
- [ ] Classic flow: pick difficulty → next/random from pool → play another
- [ ] Difficulty rubric documented (link or `docs/LEVELS.md`)

### Daily challenge

- [ ] `daily.ts` (or equivalent): date → challenge id / puzzle
- [ ] Today’s challenge entry from Home
- [ ] Archive calendar for past days
- [ ] Trophy / streak local persistence
- [ ] Share result card (time, moves, date, difficulty)

### Tools & stats

- [ ] Progressive hints (rate-limited)
- [ ] Undo
- [ ] Per-difficulty stats (wins, best time, best moves)
- [ ] Daily completion history

### Quality gates

- [ ] Solvability tests/checklist for each new puzzle
- [ ] Mistagging review (tier feels right in spot checks)
- [ ] Lint + Pages build + deploy confirmed

### Explicit non-goals for this stage

- [ ] Capacitor / store submission (Stage 03)
- [ ] Seasonal events / Master tier (Stage 04)

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
