# Full Experience Implementation Plan

Initial product and engineering plan for evolving the current playable MVP into a full web + store app experience.

**Status:** Draft (updated with product naming & multi-shape content decisions)  
**Surfaces:** Website, iOS App Store, Google Play  
**Live web preview (MVP):** https://garylam09632.github.io/puzzle_g1/

---

## 1. Product north star

A polished, offline-capable **silhouette packing puzzle** app: players assemble pieces to form **different target shapes** across levels and daily challenges. Playable in the browser and as native shells on the **iOS App Store** and **Google Play**, with one shared game codebase.

| Goal | Meaning |
| --- | --- |
| Delight | Clear first-run teaching, satisfying drag/rotate/flip, strong win moment |
| Retention | Multi-shape levels, daily challenges, personal bests |
| Reach | Web (shareable links) + store apps (home screen, offline, store discovery) |
| Accessibility | Keyboard/pointer/touch, reduced motion, readable UI, store a11y baselines |

---

## 2. Product model & naming (decided direction)

### Core game (not “one T forever”)

The durable product fantasy is:

> **Resolve a puzzle by fitting pieces into a target shape.**

- **Different levels** use **different shapes** (and may vary piece sets / rules).
- **Daily challenges** are a first-class mode (seeded layout of the day, shareable result).
- The current capital-**T** puzzle is only a **demonstration** of the core loop and geometry/solve pipeline — not the product identity and not the only content.

### App name

- The shipped app **will not be named “T Puzzle.”**
- “T Puzzle” / `TPuzzleGame` may remain as temporary MVP labels in code/docs until rename work lands.
- Final brand TBD in Phase 0; lean toward names about **shape / fit / silhouette / form** (examples of direction only: Silhouette, Form Fit, Shapecraft, Dissect, Outline).
- Once a name is locked: update UI strings, `README`, store listings, and this plan’s title.

### Content pillars

| Pillar | Intent |
| --- | --- |
| Campaign / level select | Curated multi-shape levels with progression |
| Daily challenge | One deterministic challenge per day; reason to return |
| Free play (optional) | Replay favorites / practice without campaign gates |

---

## 3. Platform strategy

Keep **one UI + game engine** (React / Next.js static export). Ship three surfaces from it:

| Surface | Approach | Why it fits this repo |
| --- | --- | --- |
| Website | Current `output: "export"` → GitHub Pages (later custom domain / prod host) | Already works |
| iOS / Android | **Capacitor** wrapping the static `out/` build | Matches static export; avoids native rewrites |
| Installable web (optional) | PWA manifest + service worker | Bridge before / beside stores |

**Avoid for v1**

- Separate native game rewrites (Swift/Kotlin gameplay)
- Next.js server features that break static export
- Heavy multiplayer or account backends

### Store packaging (later phase)

- Capacitor app id, icons, splash, safe areas, status bar
- iOS: `WKWebView`, ATS, privacy nutrition labels, App Review notes (gestures, offline)
- Android: back button, edge-to-edge, Play Data safety form
- Deep links: web URLs and app links for `level/:id` or share results
- CI: web Pages on `main`; separate workflows for Android AAB / iOS archive when accounts exist

---

## 4. Current baseline (preserve)

The repo already has a solid **core loop**. Treat the T demo as the first level/content pack and generalize the session around arbitrary shape levels.

Already working:

- Four classic pieces + T outline + tray (**demo level**)
- Drag, select, rotate/flip (buttons + platform gestures)
- Board-level two-finger free twist for the selected piece
- Geometric solve check via `SOLVE_CONFIG` in `src/lib/t-puzzle.ts`
- Moves counter + dismissible win popup
- Static export + GitHub Pages deploy from `main`

Relevant paths today:

- `src/components/TPuzzleGame.tsx` — session UI + gestures (to be generalized / renamed later)
- `src/components/PuzzlePiece.tsx` — piece interaction
- `src/lib/t-puzzle.ts` — geometry, masks, solve config (shape-agnostic enough to extend)
- `src/lib/pointer-gesture.ts` — pointer math helpers
- `.cursor/rules/commit-merge-deploy.mdc` — ship loop to Pages

---

## 5. Multi-shape puzzle design (feasible)

**Yes — different target shapes can be designed and shipped as levels.**

The engine is already close to shape-agnostic: a level is essentially a **target mask/outline + piece set + rules**. Today’s `T_MASK` / `T_OUTLINE` / `PIECE_DEFINITIONS` / `SOLVE_CONFIG` are the demo instance of that model.

### What “designing a puzzle” means here

| Input | Output |
| --- | --- |
| Target silhouette (mask + outline) | What the player must fill |
| Piece polygons (and flip/rotation rules) | What the player manipulates |
| Optional modifiers | No-flip, timed, par moves, tray layout, difficulty tags |
| Validated solution | Proof the level is solvable under the solve checker |

### Quality constraint (important)

Every level must be a **known-solvable packing**: pieces fill the shape without unacceptable gaps/overlaps under `SOLVE_CONFIG` (or per-level overrides). Drawing a new outline alone is not enough.

### Authoring approaches

1. **Hand-author** shapes/pieces from proven dissections (highest craft control for campaign levels).
2. **Generate candidates** (or variants) and **validate** with the existing solve check and/or search.
3. **Daily challenges:** deterministic seed → layout/rules → pre-validated or validated-at-build content.

Agents/humans can both author level data; shipping bar is **solvability + play-feel**, not silhouette novelty alone.

### Engineering implication

Generalize demo-specific names over time:

- Level schema: `{ id, targetMask, targetOutline, pieces, rules, par, … }`
- Content under e.g. `src/content/levels/`
- Keep solve/geometry pure and unit-tested per level pack

---

## 6. Player journey

```text
Launch → Home
  → First-run tutorial (skippable; uses simple demo shape)
  → Level select / Daily / Free play
    → Play session (board for that shape)
      → Hints (limited) → Pause / Settings
      → Solved celebration → Stats / Share → Next level or Home
  → Profile / Bests / Settings (sound, haptics, a11y)
```

**First viewport job:** brand + one clear CTA (“Play”) + atmosphere — not a control dashboard.

---

## 7. Phased roadmap

### Phase 0 — Product foundation

- Lock **final app name**, visual direction, target age, monetization (free / ads / IAP)
- Expand this plan into focused docs as needed (`PRODUCT`, `UX`, `ARCHITECTURE`, `LEVELS`, `STORE_CHECKLIST`)
- Define success metrics: time-to-first-solve, solve rate, daily completion, return visits (local proxy), crash-free sessions

**Exit criteria:** scope and non-goals agreed; implementation can start without re-litigating v1.

### Phase 1 — App shell & session polish (web-first)

**Goal:** feels like a game, not a demo page. Demo T remains the first playable level.

| Workstream | Deliverables |
| --- | --- |
| Navigation | Home, Play, Result; static-export-safe routes |
| Play HUD | Minimal controls: select affordances, reset, hint, pause — long help copy off the play surface |
| Onboarding | 3-step coach marks: select → drag → rotate/flip |
| Feedback | Optional snap assist; piece lift; solve motion; SFX/haptics hooks |
| Persistence | `localStorage`: settings, best moves/time, tutorial completed |
| Responsive | Phone-first board scaling; safe-area insets; landscape rules |

**Exit criteria:** new player understands controls without the README; win feels rewarding; progress survives refresh.

### Phase 2 — Multi-shape content, progression & dailies

**Goal:** reason to return beyond the demo T; product reads as a shape-puzzle game.

| Workstream | Deliverables |
| --- | --- |
| Level system | Data-driven levels: pieces, target mask/outline, tray layout, flip rules, par moves/time |
| Content pack v1 | Demo T **plus** multiple **different shapes** (not only T rotations); validated solvable |
| Progression | Unlock order; stars; level select |
| Daily challenge | Deterministic seeded challenge of the day; shareable result card |
| Hints | Progressive: highlight → rotation band → ghost pose (rate-limited) |
| Authoring pipeline | Checklist/tests so new shapes cannot ship unsolvable |

**Tech note:** keep geometry in `src/lib/`; level definitions under something like `src/content/levels/`; pure functions for seed → daily layout.

### Phase 3 — Store-ready packaging

**Goal:** same build runs in Capacitor; store checklist green.

| Workstream | Deliverables |
| --- | --- |
| Capacitor bootstrap | `ios/` + `android/`, sync from `out/`, native build without GitHub Pages `basePath` |
| Native UX | Splash, icons, haptics, status bar; prevent overscroll fighting gestures |
| Offline | Bundle all assets; core play needs no network |
| Privacy | No tracking in v1, or clear consent if analytics added |
| QA matrix | Small/large phones; Safari/Chrome; touch + mouse |
| Store assets | Screenshots, subtitle, keywords, age rating, support URL (under final app name) |

**Exit criteria:** TestFlight + internal Play track installable; gestures work under WebView; offline cold start plays.

### Phase 4 — Growth & depth

- Themes / piece skins
- Achievements
- Optional cloud sync (only if accounts are justified)
- Localization (EN first; add i18n keys early if more languages are planned)
- Production web host + CI/CD (noted as future in the deploy rule)
- Event / collection packs (more shapes over time)

---

## 8. Architecture guide

Proposed shape (evolve toward; do not big-bang rewrite):

```text
src/
  app/                 # routes: home, play/[levelId], daily, settings (static-export safe)
  components/
    shell/             # AppChrome, header/nav
    play/              # Board, Piece, HUD, TutorialOverlay, WinModal
    home/              # LevelSelect, DailyCard
  content/levels/      # multi-shape level definitions
  lib/
    puzzle/            # geometry + solve (generalized from t-puzzle.ts)
    progress.ts        # local persistence
    daily.ts           # date seed → challenge id
    audio.ts           # optional facade
    platform.ts        # web vs Capacitor capabilities
  styles/              # design tokens (CSS variables)
```

### Rules of thumb

- **Pure game logic** stays framework-free and unit-testable (`isPuzzleSolved`, per-level validation).
- **Platform adapters** isolate haptics, share sheet, status bar.
- **No server requirement for v1** — static assets + local storage enable offline stores.
- **Two build flavors:** `build:pages` (GitHub `basePath`) vs native/root-path build for Capacitor.
- Before changing Next.js APIs, read `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## 9. Experience pillars

### Controls

- Preserve the current gesture model; document desktop vs touch in UX notes.
- Desktop: scroll to rotate selected piece; double-click to flip; optional two-finger twist on the board.
- Touch: select, then two-finger twist anywhere on the board; double-tap selected piece to flip.
- Consider optional **snap-to-45°/90° on release** as a setting (free twist during the gesture).
- Under Capacitor WebView: mind `touch-action`, double-tap zoom, and two-finger gesture ownership.

### Teaching

- First launch only by default; persistent “?” reopens coach marks.
- Prefer show-don’t-tell over long copy on the play screen.
- Tutorial may use the simple demo shape; campaign immediately shows that **shapes vary by level**.

### Difficulty & fairness

- Keep `SOLVE_CONFIG` as the central strictness dial; allow per-level overrides later.
- Any “almost solved” feedback must not spoil the solution.
- New shapes ship only after solvability validation.

### Audio / haptics

- Facade with mute; respect OS silent switch on iOS.
- Soft pick-up / place / solve cues; native haptics on select/solve only.

### Visual identity

- Commit design tokens early (background, piece palette, board, type).
- Home: brand-first hero composition (final name); play: the board/silhouette is the visual anchor.
- Pieces should feel physical (material, edge, shadow).

---

## 10. Accessibility & quality bar

- Focus order for controls; dialog focus trap on win/pause modals
- Honor `prefers-reduced-motion`
- Contrast for pieces vs board; selection not color-only
- Hit targets ≥ 44px; comfortable phone layout
- Screen reader labels for piece state (selected, rotation, flipped)
- Automated: lint, unit tests for solve/level load **and level solvability**
- Manual: gesture checklist before each store build

---

## 11. Delivery & ops

| Channel | Pipeline |
| --- | --- |
| Web preview | Merge `main` → Deploy to GitHub Pages → preview URL above |
| Staging web | Optional later (second env or other host) |
| iOS | Archive → TestFlight → App Review |
| Android | AAB → internal/closed testing → production |

Ship in **small slices**. Web preview on `main` remains the default review channel even while native wrappers catch up. See `.cursor/rules/commit-merge-deploy.mdc`.

---

## 12. Suggested v1 “full experience” scope

### In

- Home + Play + Win flow (under final or interim product name — **not** positioned as “T Puzzle” the product)
- Tutorial
- Demo T **plus** a pack of **different-shape** levels (8–12+), each validated solvable
- **Daily challenge** mode
- Local bests and settings (sound / haptics / snap)
- Capacitor shells + store listing drafts
- Offline play

### Out of v1

- Accounts, leaderboards, multiplayer
- Ads / IAP (unless decided before Phase 1)
- User-generated levels

---

## 13. Open decisions

Resolve before or during Phase 0:

1. **Brand name** — final product name (explicitly **not** “T Puzzle”; pick from shape/fit direction or another brand)
2. **Audience** — kids, casual adults, or both?
3. **Monetization** — free, paid upfront, or free + cosmetics later?
4. **Content mix for v1** — how many distinct shapes vs rule variants on similar silhouettes?
5. **Daily challenge rules** — same piece set rotated/scattered vs new silhouette cadence?
6. **Primary language(s)**
7. **Native timeline** — finish web experience first, then Capacitor; or bootstrap Capacitor in parallel from Phase 1?

---

## 14. Follow-on docs (optional next)

| File | Purpose |
| --- | --- |
| `docs/PRODUCT.md` | Vision, scope, non-goals, metrics, final name |
| `docs/UX.md` | Journeys, gestures, screen inventory |
| `docs/ARCHITECTURE.md` | Web + Capacitor, folders, build flavors |
| `docs/LEVELS.md` | Level schema, authoring rules, solvability checklist |
| `docs/STORE_CHECKLIST.md` | Apple / Google submission checklist |
| `docs/ROADMAP.md` | Execution tracker for Phases 0–4 |

---

## 15. Related project docs

| Doc | Role |
| --- | --- |
| `README.md` | How to run the current MVP (still demo-T oriented until rename) |
| `AGENTS.md` | Next.js version caveat for agents |
| `.cursor/rules/commit-merge-deploy.mdc` | Branch, merge, and Pages deploy loop |
