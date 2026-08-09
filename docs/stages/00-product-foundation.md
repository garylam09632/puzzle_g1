# Stage 00 — Product foundation

**Phase:** 0  
**Status:** `in_progress` (kickoff stage)  
**Goal:** Lock product decisions so Stage 01+ can ship without re-litigating v1.  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Why this is the kickoff stage

The MVP core loop already works. Before building the Sudoku.com-like shell and multi-shape content, lock **name**, **audience**, **monetization**, **difficulty tiers**, and **v1 content targets**. This stage is mostly decisions + lightweight docs — little or no game code.

---

## Exit criteria

- [ ] Final or interim **app name** chosen and recorded
- [ ] Audience + monetization direction recorded
- [ ] Difficulty tier labels/count for v1 locked
- [ ] Daily format for v1 locked (single daily vs per-difficulty)
- [ ] Success metrics listed
- [ ] Open decisions in the plan either answered or explicitly deferred with owner/date
- [ ] [`../PROGRESS.md`](../PROGRESS.md) updated to move current stage to **01** when done

---

## Checklist

### Brand & positioning

- [ ] Choose final app name (not “T Puzzle”) **or** confirm interim working title + rename deadline
- [ ] One-sentence product pitch (silhouette packing + difficulties + daily)
- [ ] Visual direction notes (mood, reference apps, avoid-list)

### Audience & business

- [ ] Target audience (kids / casual adults / both)
- [ ] Monetization for v1 (free / paid / free+cosmetics later / undecided-with-date)
- [ ] Primary language(s)

### Challenge model defaults

- [ ] Tier set for launch (proposal: Easy / Medium / Hard / Expert)
- [ ] Whether Master/Extreme is v1 or Stage 04
- [ ] Daily format: one featured daily + archive (recommended) vs daily-per-difficulty
- [ ] Rough pool-size targets per difficulty at end of Stage 02

### Metrics

- [ ] Time-to-first-solve (tutorial / first Easy clear)
- [ ] Solve rate by difficulty
- [ ] Daily completion / streak (local)
- [ ] Return visit proxy (local)
- [ ] Crash-free / gesture reliability notes for QA later

### Docs hygiene

- [ ] Record answers in this file’s **Decisions log** (below)
- [ ] Update open decisions section in [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) §14
- [ ] Optional: stub `docs/PRODUCT.md` if decisions are long enough to split

### Explicit non-goals for this stage

- [x] No requirement to finish multi-shape content
- [x] No Capacitor / store submission work
- [x] No rename refactor of all code identifiers (can wait until name is final)

---

## Decisions log

| Topic | Decision | Date |
| --- | --- | --- |
| App name | _TBD_ | |
| Audience | _TBD_ | |
| Monetization | _TBD_ | |
| Tiers at launch | _TBD_ (default proposal: Easy→Expert) | |
| Daily format | _TBD_ (default proposal: single daily + archive) | |
| Native timeline | _TBD_ (default proposal: web Stage 01–02, Capacitor Stage 03) | |

---

## Notes

_Add meeting notes, links, or blockers here._
