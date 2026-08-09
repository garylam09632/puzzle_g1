# T Puzzle — Full Experience Implementation Plan

Initial product and engineering plan for evolving the current playable MVP into a full web + store app experience.

**Status:** Draft (planning only; not yet implemented)  
**Surfaces:** Website, iOS App Store, Google Play  
**Live web preview (MVP):** https://garylam09632.github.io/puzzle_g1/

---

## 1. Product north star

**T Puzzle** becomes a polished, offline-capable puzzle app: playable in the browser and as native shells on the **iOS App Store** and **Google Play**, with one shared game codebase.

| Goal | Meaning |
| --- | --- |
| Delight | Clear first-run teaching, satisfying drag/rotate/flip, strong win moment |
| Retention | Levels / challenges, personal bests, gentle daily hooks |
| Reach | Web (shareable links) + store apps (home screen, offline, store discovery) |
| Accessibility | Keyboard/pointer/touch, reduced motion, readable UI, store a11y baselines |

---

## 2. Platform strategy

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

## 3. Current baseline (preserve)

The repo already has a solid **core loop**. Treat it as the Play Session module and wrap product experience around it.

Already working:

- Four classic T Puzzle pieces + T outline + tray
- Drag, select, rotate/flip (buttons + platform gestures)
- Board-level two-finger free twist for the selected piece
- Geometric solve check via `SOLVE_CONFIG` in `src/lib/t-puzzle.ts`
- Moves counter + dismissible win popup
- Static export + GitHub Pages deploy from `main`

Relevant paths today:

- `src/components/TPuzzleGame.tsx` — session UI + gestures
- `src/components/PuzzlePiece.tsx` — piece interaction
- `src/lib/t-puzzle.ts` — geometry, masks, solve config
- `src/lib/pointer-gesture.ts` — pointer math helpers
- `.cursor/rules/commit-merge-deploy.mdc` — ship loop to Pages

---

## 4. Player journey

```text
Launch → Home
  → First-run tutorial (skippable)
  → Level select / Daily / Free play
    → Play session (board)
      → Hints (limited) → Pause / Settings
      → Solved celebration → Stats / Share → Next level or Home
  → Profile / Bests / Settings (sound, haptics, a11y)
```

**First viewport job:** brand + one clear CTA (“Play”) + atmosphere — not a control dashboard.

---

## 5. Phased roadmap

### Phase 0 — Product foundation

- Lock name, visual direction, target age, monetization (free / ads / IAP)
- Expand this plan into focused docs as needed (`PRODUCT`, `UX`, `ARCHITECTURE`, `LEVELS`, `STORE_CHECKLIST`)
- Define success metrics: time-to-first-solve, solve rate, return visits (local proxy), crash-free sessions

**Exit criteria:** scope and non-goals agreed; implementation can start without re-litigating v1.

### Phase 1 — App shell & session polish (web-first)

**Goal:** feels like a game, not a demo page.

| Workstream | Deliverables |
| --- | --- |
| Navigation | Home, Play, Result; static-export-safe routes |
| Play HUD | Minimal controls: select affordances, reset, hint, pause — long help copy off the play surface |
| Onboarding | 3-step coach marks: select → drag → rotate/flip |
| Feedback | Optional snap assist; piece lift; solve motion; SFX/haptics hooks |
| Persistence | `localStorage`: settings, best moves/time, tutorial completed |
| Responsive | Phone-first board scaling; safe-area insets; landscape rules |

**Exit criteria:** new player understands controls without the README; win feels rewarding; progress survives refresh.

### Phase 2 — Content & progression

**Goal:** reason to return beyond one classic T.

| Workstream | Deliverables |
| --- | --- |
| Level system | Data-driven levels: pieces, target mask/outline, tray layout, flip rules, par moves/time |
| Content pack v1 | Classic T + N variants (rotated T, harder silhouettes, no-flip, timed, etc.) |
| Progression | Unlock order; stars; level select |
| Daily challenge | Deterministic seeded layout of the day; shareable result card |
| Hints | Progressive: highlight → rotation band → ghost pose (rate-limited) |

**Tech note:** keep geometry in `src/lib/`; level definitions under something like `src/content/levels/`; pure functions for seed → layout.

### Phase 3 — Store-ready packaging

**Goal:** same build runs in Capacitor; store checklist green.

| Workstream | Deliverables |
| --- | --- |
| Capacitor bootstrap | `ios/` + `android/`, sync from `out/`, native build without GitHub Pages `basePath` |
| Native UX | Splash, icons, haptics, status bar; prevent overscroll fighting gestures |
| Offline | Bundle all assets; core play needs no network |
| Privacy | No tracking in v1, or clear consent if analytics added |
| QA matrix | Small/large phones; Safari/Chrome; touch + mouse |
| Store assets | Screenshots, subtitle, keywords, age rating, support URL |

**Exit criteria:** TestFlight + internal Play track installable; gestures work under WebView; offline cold start plays.

### Phase 4 — Growth & depth

- Themes / piece skins
- Achievements
- Optional cloud sync (only if accounts are justified)
- Localization (EN first; add i18n keys early if more languages are planned)
- Production web host + CI/CD (noted as future in the deploy rule)
- Event / collection packs

---

## 6. Architecture guide

Proposed shape (evolve toward; do not big-bang rewrite):

```text
src/
  app/                 # routes: home, play/[levelId], settings (static-export safe)
  components/
    shell/             # AppChrome, header/nav
    play/              # Board, Piece, HUD, TutorialOverlay, WinModal
    home/              # LevelSelect, DailyCard
  content/levels/      # level definitions
  lib/
    t-puzzle.ts        # geometry + solve (keep pure)
    progress.ts        # local persistence
    audio.ts           # optional facade
    platform.ts        # web vs Capacitor capabilities
  styles/              # design tokens (CSS variables)
```

### Rules of thumb

- **Pure game logic** stays framework-free and unit-testable (`isPuzzleSolved`, level validation).
- **Platform adapters** isolate haptics, share sheet, status bar.
- **No server requirement for v1** — static assets + local storage enable offline stores.
- **Two build flavors:** `build:pages` (GitHub `basePath`) vs native/root-path build for Capacitor.
- Before changing Next.js APIs, read `node_modules/next/dist/docs/` (see `AGENTS.md`).

---

## 7. Experience pillars

### Controls

- Preserve the current gesture model; document desktop vs touch in UX notes.
- Desktop: scroll to rotate selected piece; double-click to flip; optional two-finger twist on the board.
- Touch: select, then two-finger twist anywhere on the board; double-tap selected piece to flip.
- Consider optional **snap-to-45°/90° on release** as a setting (free twist during the gesture).
- Under Capacitor WebView: mind `touch-action`, double-tap zoom, and two-finger gesture ownership.

### Teaching

- First launch only by default; persistent “?” reopens coach marks.
- Prefer show-don’t-tell over long copy on the play screen.

### Difficulty & fairness

- Keep `SOLVE_CONFIG` as the central strictness dial; allow per-level overrides later.
- Any “almost solved” feedback must not spoil the solution.

### Audio / haptics

- Facade with mute; respect OS silent switch on iOS.
- Soft pick-up / place / solve cues; native haptics on select/solve only.

### Visual identity

- Commit design tokens early (background, piece palette, board, type).
- Home: brand-first hero composition; play: the board is the visual anchor.
- Pieces should feel physical (material, edge, shadow).

---

## 8. Accessibility & quality bar

- Focus order for controls; dialog focus trap on win/pause modals
- Honor `prefers-reduced-motion`
- Contrast for pieces vs board; selection not color-only
- Hit targets ≥ 44px; comfortable phone layout
- Screen reader labels for piece state (selected, rotation, flipped)
- Automated: lint, unit tests for solve/level load
- Manual: gesture checklist before each store build

---

## 9. Delivery & ops

| Channel | Pipeline |
| --- | --- |
| Web preview | Merge `main` → Deploy to GitHub Pages → preview URL above |
| Staging web | Optional later (second env or other host) |
| iOS | Archive → TestFlight → App Review |
| Android | AAB → internal/closed testing → production |

Ship in **small slices**. Web preview on `main` remains the default review channel even while native wrappers catch up. See `.cursor/rules/commit-merge-deploy.mdc`.

---

## 10. Suggested v1 “full experience” scope

### In

- Home + Play + Win flow
- Tutorial
- Classic level + 8–12 variants
- Local bests and settings (sound / haptics / snap)
- Capacitor shells + store listing drafts
- Offline play

### Out of v1

- Accounts, leaderboards, multiplayer
- Ads / IAP (unless decided before Phase 1)
- User-generated levels

---

## 11. Open decisions

Resolve before or during Phase 0:

1. **Brand name** — keep “T Puzzle” or productize further?
2. **Audience** — kids, casual adults, or both?
3. **Monetization** — free, paid upfront, or free + cosmetics later?
4. **Content ambition for v1** — polish classic only, or require a level pack?
5. **Primary language(s)**
6. **Native timeline** — finish web experience first, then Capacitor; or bootstrap Capacitor in parallel from Phase 1?

---

## 12. Follow-on docs (optional next)

| File | Purpose |
| --- | --- |
| `docs/PRODUCT.md` | Vision, scope, non-goals, metrics |
| `docs/UX.md` | Journeys, gestures, screen inventory |
| `docs/ARCHITECTURE.md` | Web + Capacitor, folders, build flavors |
| `docs/LEVELS.md` | Level schema + authoring rules |
| `docs/STORE_CHECKLIST.md` | Apple / Google submission checklist |
| `docs/ROADMAP.md` | Execution tracker for Phases 0–4 |

---

## 13. Related project docs

| Doc | Role |
| --- | --- |
| `README.md` | How to run the current MVP |
| `AGENTS.md` | Next.js version caveat for agents |
| `.cursor/rules/commit-merge-deploy.mdc` | Branch, merge, and Pages deploy loop |
