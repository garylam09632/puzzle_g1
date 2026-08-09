# Stage 02c — Daily challenge & archive

**Phase:** 2 · **Substage:** c  
**Status:** `not_started`  
**Goal:** One featured **daily** (date-seeded, offline), with archive calendar, local trophy/streak, and a shareable result card.  
**Depends on:** Stage 02b (pools with enough content to seed dailies)  
**Parent stage:** [`02-difficulty-pools-and-dailies.md`](./02-difficulty-pools-and-dailies.md)  
**Next substage:** [`02d-comfort-tools-stats-and-closeout.md`](./02d-comfort-tools-stats-and-closeout.md)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Why this substage

Stage 00 locked **single featured daily + archive** (not per-difficulty dailies). Stage 01 left Daily as “coming soon.” 02c replaces that placeholder with a real mode that reuses the same play session and level data.

---

## Exit criteria

- [ ] `daily.ts` (or equivalent): calendar date → challenge / puzzle id deterministically
- [ ] Home **Daily** opens today’s challenge (no “coming soon”)
- [ ] Archive calendar can open past days’ challenges
- [ ] Local trophy / streak persistence for dailies
- [ ] Share result card (at least: date, moves, time if tracked, difficulty/label)
- [ ] Daily works offline (seed/embed; no server required)
- [ ] Lint + `build:pages` pass; shipped if landing alone

---

## Checklist

### Seed & content

- [ ] Add `src/lib/daily.ts`: date → puzzle id from catalog (stable across clients)
- [ ] Define how dailies pick from pools (featured tier rotation or fixed mapping — record decision in Progress notes)
- [ ] Prefetch/embed enough catalog that today + archive don’t need network

### UI & routes

- [ ] Replace Daily placeholder in `HomeScreen.tsx`
- [ ] Add static-export-safe daily route(s), e.g. `src/app/daily/page.tsx` and optional date segment
- [ ] Archive calendar UI (month grid or equivalent)
- [ ] Play daily through shared session component (`TPuzzleGame` or successor)

### Persistence & share

- [ ] Extend `src/lib/storage.ts`: daily completion history, current/longest streak, trophies/badges as needed
- [ ] Win path for daily shows streak/trophy callout
- [ ] Share card component (image or share sheet / copy link — pick one v1 approach and note it)

### Explicit non-goals for 02c

- [ ] Daily-per-difficulty variants (deferred; Stage 00 locked single daily)
- [ ] Seasonal medal events (Stage 04)
- [ ] Accounts / global leaderboards (out of v1)

---

## Key files

| Area | Path |
| --- | --- |
| Daily seed | `src/lib/daily.ts` (proposed) |
| Storage | `src/lib/storage.ts` |
| Home CTA | `src/components/HomeScreen.tsx` |
| Daily UI | `src/app/daily/` (proposed) |
| Session | `src/components/TPuzzleGame.tsx` |
| Share card | `src/components/` (proposed) |
| Pools / content | `src/lib/pools.ts`, `src/content/levels/` |

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
