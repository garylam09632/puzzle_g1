# Stage 01 — App shell & session polish

**Phase:** 1  
**Status:** `done`  
**Goal:** Product feels like a game app (home + play + result), not a single demo page. Demo T remains the first playable Easy entry.  
**Depends on:** Stage 00 decisions (or interim name/tiers recorded)  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Exit criteria

- [x] Home screen with clear **Play** and **Daily** entry points (Daily can be placeholder CTA → “coming soon” only if explicitly scoped)
- [x] Difficulty picker wired for Classic play (even if every tier still opens the demo puzzle)
- [x] Play HUD tightened (reset / hint stub / undo stub / pause as applicable)
- [x] First-run tutorial (coach marks) completable and dismissible
- [x] Win flow polished; progress/settings persist across refresh
- [x] Phone-first layout + safe areas verified on web preview
- [x] `npm run lint` and `npm run build:pages` pass; shipped to `main` / Pages

---

## Checklist

### Navigation & shell

- [x] Static-export-safe routes (home, play, result/settings as needed)
- [x] App chrome / header consistent across screens
- [x] Home: brand-first hero + Play + Daily CTAs
- [x] Difficulty picker UI (Easy → Expert per Stage 00)
- [x] Result / win screen path from play session

### Play session

- [x] Extract/generalize session UI enough to leave demo board working
- [x] Minimal HUD: reset, hint (stub OK), undo (stub OK), pause
- [x] Move long “how to play” copy off the primary play surface
- [x] Preserve existing gestures (drag, rotate, flip, two-finger twist)
- [x] Optional snap-to-angle setting (or defer with note)

### Onboarding & feedback

- [x] 3-step coach marks: select → drag → rotate/flip
- [x] Tutorial completion persisted
- [x] Stronger win feedback (motion respectful of `prefers-reduced-motion`)
- [x] SFX/haptics hooks stubbed or minimal mute setting

### Persistence

- [x] Settings in `localStorage`
- [x] Continue unfinished puzzle (nice-to-have; mark if deferred)
- [x] Bests structure ready **per difficulty** (can store demo clears under Easy)
- [x] Tutorial completed flag

### Responsive & QA

- [x] Phone-first board scaling
- [x] Safe-area insets
- [x] Landscape sanity check
- [x] Manual gesture smoke test (touch + mouse)
- [x] Lint + Pages build + deploy confirmed

### Explicit non-goals for this stage

- [x] Full multi-shape library (Stage 02)
- [x] Real daily archive/trophies (Stage 02; placeholder OK)
- [x] Capacitor / store binaries (Stage 03)

---

## Progress notes

| Date | Note |
| --- | --- |
| 2026-08-09 | Stage 01 shipped: Form Fit home, Easy→Expert → demo T play routes, tutorial, pause/mute, bests in `localStorage`. Daily CTA is “coming soon”. |
| 2026-08-09 | Deferred: continue unfinished puzzle; snap-to-angle setting. Hint/Undo are stubs (toast). |
