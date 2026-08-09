# Stage 02a — Level schema & demo pack

**Phase:** 2 · **Substage:** a  
**Status:** `not_started`  
**Goal:** Make play session load a **level definition** (not hardcoded T-only data), with the demo T as the first Easy pack entry and a solvability harness in place.  
**Depends on:** Stage 01 shell  
**Parent stage:** [`02-difficulty-pools-and-dailies.md`](./02-difficulty-pools-and-dailies.md)  
**Next substage:** [`02b-classic-multi-shape-pools.md`](./02b-classic-multi-shape-pools.md)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Why this comes first

Stage 01 still mounts the demo geometry from [`src/lib/t-puzzle.ts`](../../src/lib/t-puzzle.ts) inside [`TPuzzleGame`](../../src/components/TPuzzleGame.tsx). Multi-shape pools and dailies need a shared level model before new content can ship safely.

---

## Exit criteria

- [ ] Level schema documented and typed (`id`, `difficulty`, target outline/mask, pieces, rules, par, solution/metadata as needed)
- [ ] Demo T extracted into Easy content (e.g. under `src/content/levels/`)
- [ ] Play session accepts a `level` (or level id) and still solves correctly with existing gestures
- [ ] Classic Easy path deals the demo T from the content pack (not a special-case-only board)
- [ ] Solvability check/harness can validate at least the demo T level
- [ ] `docs/LEVELS.md` stub started (schema + authoring notes; rubric can grow in 02b)
- [ ] Lint + `build:pages` pass; shipped if this substage lands alone

---

## Checklist

### Schema & geometry

- [ ] Add level types/schema module (e.g. `src/lib/level-schema.ts`)
- [ ] Keep pure geometry / solve helpers in `src/lib/` (generalize from `t-puzzle.ts` as needed)
- [ ] Per-level or shared `SOLVE_CONFIG` overrides supported where useful

### Content

- [ ] Create `src/content/levels/` (or equivalent) structure
- [ ] Add demo T as Easy entry with stable `id`
- [ ] Catalog/index helper to resolve level by id

### Session wiring

- [ ] Refactor `TPuzzleGame` to render from level data
- [ ] Update `src/app/play/[difficulty]/page.tsx` to load a level for that tier (demo T for Easy is enough in 02a)
- [ ] Preserve drag / rotate / flip / two-finger twist

### Quality

- [ ] Solvability test or script for demo T pack entry
- [ ] Stub `docs/LEVELS.md`

### Explicit non-goals for 02a

- [ ] Multiple shapes per Medium/Hard/Expert (→ 02b)
- [ ] Daily seed / archive / share (→ 02c)
- [ ] Real progressive hints / undo stack (→ 02d; stubs may remain)

---

## Key files

| Area | Path |
| --- | --- |
| Geometry (today) | `src/lib/t-puzzle.ts` |
| Session UI | `src/components/TPuzzleGame.tsx` |
| Play route | `src/app/play/[difficulty]/page.tsx` |
| Difficulty helpers | `src/lib/difficulty.ts` |
| New schema | `src/lib/level-schema.ts` (proposed) |
| New content | `src/content/levels/` (proposed) |
| Authoring doc | `docs/LEVELS.md` (proposed) |

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
