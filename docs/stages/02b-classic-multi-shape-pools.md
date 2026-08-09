# Stage 02b — Classic multi-shape pools

**Phase:** 2 · **Substage:** b  
**Status:** `not_started`  
**Goal:** Classic play deals from **difficulty-tagged pools** with multi-shape content beyond the demo T; player can finish and play another from the same tier.  
**Depends on:** Stage 02a (level schema + demo pack)  
**Parent stage:** [`02-difficulty-pools-and-dailies.md`](./02-difficulty-pools-and-dailies.md)  
**Next substage:** [`02c-daily-challenge-and-archive.md`](./02c-daily-challenge-and-archive.md)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Why this substage

After 02a, Easy can load the demo T as data. 02b grows the library and makes “pick difficulty → get a puzzle from that pool” real for all four launch tiers.

---

## Exit criteria

- [ ] Medium / Hard / Expert pools each have at least one validated multi-shape level (plus Easy has demo T and preferably more)
- [ ] Pool helper deals next/random from the correct difficulty
- [ ] Classic flow: Home difficulty → play dealt level → win → play another (same difficulty) or Home
- [ ] Rough Stage 00 floor remembered: work toward ~8–12/tier over time; **02b launch floor can be smaller** if each tier has ≥1 non-demo shape where required and all entries are validated (record actual counts in Progress notes)
- [ ] Difficulty rubric expanded in `docs/LEVELS.md`
- [ ] Mistag spot-check noted (tier feel)
- [ ] Lint + `build:pages` pass; shipped if landing alone

---

## Checklist

### Content library

- [ ] Author additional silhouettes + piece sets (hand-authored or generate+validate)
- [ ] Tag each level with `difficulty` (+ shape id / par / rules as schema requires)
- [ ] Easy pool includes demo T; expand Easy if time allows
- [ ] Medium / Hard / Expert pools populated with validated entries

### Deal & navigation

- [ ] Pool module (e.g. `src/lib/pools.ts`): listByDifficulty, pickNext / pickRandom
- [ ] Play route supports level id (path or query) while remaining static-export safe
- [ ] Win UI: “Play another” deals a new level from the same tier
- [ ] Avoid immediate exact repeat when pool size > 1

### Authoring quality

- [ ] Every new level passes solvability harness from 02a
- [ ] Document rubric: silhouette complexity, piece awkwardness, flip/guidance modifiers
- [ ] Spot-check that Expert feels harder than Easy even with tools available later

### Explicit non-goals for 02b

- [ ] Daily challenge / archive (→ 02c)
- [ ] Progressive hints + undo implementation (→ 02d)
- [ ] Master / Extreme tier (Stage 04)

---

## Key files

| Area | Path |
| --- | --- |
| Content packs | `src/content/levels/` |
| Schema / solve | `src/lib/level-schema.ts`, `src/lib/t-puzzle.ts` (or generalized) |
| Pools | `src/lib/pools.ts` (proposed) |
| Home picker | `src/components/HomeScreen.tsx` |
| Play route | `src/app/play/[difficulty]/page.tsx` (extend as needed) |
| Session / win | `src/components/TPuzzleGame.tsx` |
| Rubric | `docs/LEVELS.md` |

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
