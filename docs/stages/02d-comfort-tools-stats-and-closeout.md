# Stage 02d — Comfort tools, stats & Stage 02 closeout

**Phase:** 2 · **Substage:** d  
**Status:** `not_started`  
**Goal:** Ship real **hints + undo**, richer per-difficulty / daily stats, finish Stage 02 quality gates, and mark Phase 2 done.  
**Depends on:** Stage 02c (daily mode in place; classic pools already shipping from 02b)  
**Parent stage:** [`02-difficulty-pools-and-dailies.md`](./02-difficulty-pools-and-dailies.md)  
**Next stage:** Stage 03 — [`03-store-ready-packaging.md`](./03-store-ready-packaging.md)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Why this substage

Hints/Undo are still stubs from Stage 01. Stats exist as bests starts/wins/moves but not full Stage 02 surface (best time, daily history UI). This substage finishes the Sudoku.com-like comfort loop and closes the parent Stage 02 checklist.

---

## Exit criteria

- [ ] Progressive hints available across classic + daily (rate-limited)
- [ ] Undo available across classic + daily
- [ ] Per-difficulty stats include wins, best moves, best time (time tracking added if missing)
- [ ] Daily completion history viewable (beyond raw storage)
- [ ] Authoring/solvability gates reviewed; no known unsolvable or clearly mistagged ship blockers
- [ ] Parent Stage 02 exit criteria all met; `PROGRESS.md` moves current stage to **03**
- [ ] `npm run lint` + `npm run build:pages` pass; merged to `main` / Pages confirmed

---

## Checklist

### Comfort tools

- [ ] Replace Hint stub toast with progressive hint system (e.g. `src/lib/hints.ts`)
- [ ] Rate-limit hints; keep available on all tiers (hard mode stays in the puzzle)
- [ ] Replace Undo stub with move/state stack in session UI
- [ ] Ensure undo/hints interact safely with solve check and win recording

### Stats & history

- [ ] Extend `src/lib/storage.ts` for best time (+ any missing fields)
- [ ] Track elapsed time in play session
- [ ] Surface per-difficulty stats (home, pause, or lightweight stats screen)
- [ ] Surface daily completion history (list or calendar badges — can reuse 02c archive)

### Quality gates & docs

- [ ] Solvability tests cover all shipped levels
- [ ] Mistagging review pass recorded in Progress notes
- [ ] Update [`02-difficulty-pools-and-dailies.md`](./02-difficulty-pools-and-dailies.md) checklists → done
- [ ] Update [`../PROGRESS.md`](../PROGRESS.md) and plan §17 Phase 2 boxes
- [ ] Confirm Pages deploy

### Explicit non-goals for 02d

- [ ] Capacitor / store binaries (Stage 03)
- [ ] Master / Extreme tier, seasonal events, cosmetics (Stage 04)

---

## Key files

| Area | Path |
| --- | --- |
| Session HUD | `src/components/TPuzzleGame.tsx` |
| Hints | `src/lib/hints.ts` (proposed) |
| Storage / stats | `src/lib/storage.ts` |
| Home / stats UI | `src/components/HomeScreen.tsx` (+ optional stats component) |
| Daily history | `src/app/daily/`, storage helpers |
| Parent rollup | `docs/stages/02-difficulty-pools-and-dailies.md` |

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
