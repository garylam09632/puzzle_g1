# Stage 01 — App shell & session polish

**Phase:** 1  
**Status:** `not_started`  
**Goal:** Product feels like a game app (home + play + result), not a single demo page. Demo T remains the first playable Easy entry.  
**Depends on:** Stage 00 decisions (or interim name/tiers recorded)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Exit criteria

- [ ] Home screen with clear **Play** and **Daily** entry points (Daily can be placeholder CTA → “coming soon” only if explicitly scoped)
- [ ] Difficulty picker wired for Classic play (even if every tier still opens the demo puzzle)
- [ ] Play HUD tightened (reset / hint stub / undo stub / pause as applicable)
- [ ] First-run tutorial (coach marks) completable and dismissible
- [ ] Win flow polished; progress/settings persist across refresh
- [ ] Phone-first layout + safe areas verified on web preview
- [ ] `npm run lint` and `npm run build:pages` pass; shipped to `main` / Pages

---

## Checklist

### Navigation & shell

- [ ] Static-export-safe routes (home, play, result/settings as needed)
- [ ] App chrome / header consistent across screens
- [ ] Home: brand-first hero + Play + Daily CTAs
- [ ] Difficulty picker UI (Easy → Expert per Stage 00)
- [ ] Result / win screen path from play session

### Play session

- [ ] Extract/generalize session UI enough to leave demo board working
- [ ] Minimal HUD: reset, hint (stub OK), undo (stub OK), pause
- [ ] Move long “how to play” copy off the primary play surface
- [ ] Preserve existing gestures (drag, rotate, flip, two-finger twist)
- [ ] Optional snap-to-angle setting (or defer with note)

### Onboarding & feedback

- [ ] 3-step coach marks: select → drag → rotate/flip
- [ ] Tutorial completion persisted
- [ ] Stronger win feedback (motion respectful of `prefers-reduced-motion`)
- [ ] SFX/haptics hooks stubbed or minimal mute setting

### Persistence

- [ ] Settings in `localStorage`
- [ ] Continue unfinished puzzle (nice-to-have; mark if deferred)
- [ ] Bests structure ready **per difficulty** (can store demo clears under Easy)
- [ ] Tutorial completed flag

### Responsive & QA

- [ ] Phone-first board scaling
- [ ] Safe-area insets
- [ ] Landscape sanity check
- [ ] Manual gesture smoke test (touch + mouse)
- [ ] Lint + Pages build + deploy confirmed

### Explicit non-goals for this stage

- [ ] Full multi-shape library (Stage 02)
- [ ] Real daily archive/trophies (Stage 02; placeholder OK)
- [ ] Capacitor / store binaries (Stage 03)

---

## Progress notes

| Date | Note |
| --- | --- |
| | |
