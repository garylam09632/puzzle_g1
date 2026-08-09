# Full Experience Implementation Plan

Initial product and engineering plan for evolving the current playable MVP into a full web + store app experience.

**Status:** Draft (active) — **Stages 00–01 done**; next coding stage **Stage 02**  
**Working title:** Form Fit (final rename before Stage 03 store packaging)  
**Progress tracker:** [`PROGRESS.md`](./PROGRESS.md)  
**Stage docs:** [`stages/`](./stages/)  
**Surfaces:** Website, iOS App Store, Google Play  
**Live web preview (MVP):** https://garylam09632.github.io/puzzle_g1/  
**Reference product pattern:** Sudoku.com (Easybrain) — difficulty ladder, large puzzle pool, daily challenges with archive/rewards, per-difficulty stats

---

## 1. Product north star

A polished, offline-capable **silhouette packing puzzle** app: players assemble pieces to form **different target shapes** across levels and daily challenges. Playable in the browser and as native shells on the **iOS App Store** and **Google Play**, with one shared game codebase.

| Goal | Meaning |
| --- | --- |
| Delight | Clear first-run teaching, satisfying drag/rotate/flip, strong win moment |
| Retention | Difficulty ladder, large puzzle pool, daily challenges + archive/rewards, personal bests |
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
- **Interim working title (Stage 00):** **Form Fit** — use in Stage 01+ UI / home brand until final rename.
- “T Puzzle” / `TPuzzleGame` may remain as temporary MVP code identifiers until rename work lands.
- **Final brand** locked before Stage 03 store packaging; then update UI strings, `README`, store listings, and this plan’s title.

### Content pillars (Sudoku.com-like)

| Pillar | Intent |
| --- | --- |
| Play by difficulty | Player picks a named difficulty, then gets a puzzle from that tier’s pool |
| Puzzle library | Large bank of validated multi-shape puzzles (not only one demo T) |
| Daily challenge | Calendar “puzzle of the day” + archive + trophies / streak feel |
| Comfort tools | Hints, undo, optional snap/assist — available across difficulties; hard mode is in the **puzzle**, not by stripping tools |
| Stats | Track bests and completion **per difficulty** (and for dailies) |

---

## 3. Challenge model (inspired by Sudoku.com)

Same **core rules** at every tier: fit the pieces into the target silhouette. Challenge comes from **content scaling** and **daily cadence**, not from changing the fundamental game.

### 3.1 Difficulty ladder

Ship a clear named ladder (labels can be tuned in Phase 0; structure is fixed):

| Tier (working names) | Player expectation | How we scale challenge for shape puzzles |
| --- | --- | --- |
| Easy | Teach & warm up | Simpler silhouettes, fewer / friendlier pieces, flips allowed, generous tray, optional light snap |
| Medium | Casual workout | More awkward shapes, tighter packing, standard piece count |
| Hard | Real effort | Complex silhouettes, flips restricted or required cleverly, less visual guidance |
| Expert | Dedicated solvers | Harder dissections, stricter placement feel, fewer assists in *content* (e.g. no outline fill hints baked in) |
| Master / Extreme (optional later) | Long-term ceiling | Largest / most deceptive shapes, tight pars, advanced variants |

**Sudoku.com parallel:** Easy→Extreme mainly changes clue count and logic depth; we change **silhouette complexity, piece awkwardness, rule modifiers, and guidance**.

**Product rules for the ladder**

- Home / Play entry: **choose difficulty** (primary path), not only a linear campaign map.
- Each difficulty owns a **pool of puzzles**; starting a run deals (or lets the player pick) one from that pool.
- Every puzzle still has **at least one validated solution** under the solve checker.
- Assists (hint, undo, snap toggle) stay available unless the player opts into a “no assists” personal challenge later.
- **Stats per difficulty:** games started/won, best time, best moves, current/longest streak (where relevant).

### 3.2 Classic / free play pool

- Maintain a growing library tagged by `difficulty` (+ shape family, piece set, estimated solve time).
- v1 target: enough puzzles per tier that replay does not feel tiny (order-of-magnitude goal: **dozens+ per tier** over time; launch can start smaller and expand).
- Demo T ships as an **Easy** (or tutorial) pool entry — not the whole game.
- Optional later: “Continue” unfinished puzzle (Sudoku.com-style auto-save).

### 3.3 Daily challenges

Mirror Sudoku.com’s daily loop:

| Element | Our version |
| --- | --- |
| Puzzle of the day | One primary daily challenge derived from date seed (deterministic, same for all players on that day) |
| Difficulty of the daily | Either a featured tier for the day, or let the player pick daily Easy/Medium/Hard variants if we have capacity |
| Archive | Calendar UI to replay past dailies (catch-up) |
| Rewards | Trophies / badges for completing dailies; streak callouts; optional seasonal medal events (Phase 4) |
| Share | Result card (time, moves, difficulty, date) |
| Offline | Prefetch / embed upcoming or generate-from-seed locally so dailies work without a server |

**Daily is a mode**, not a different ruleset: same piece interactions and win condition as classic play.

### 3.4 Comfort tools (cross-cutting)

Available in classic and daily (player choice):

- Hints (progressive, rate-limited)
- Undo / reset
- Optional snap-to-angle on release
- Pause
- Notes-equivalent for us is light: e.g. “mark piece” or ghost outline toggle — keep minimal for v1

Harder tiers should still feel harder **even with tools**, because the packing itself is harder.

### 3.5 Mapping reference → our game

| Sudoku.com | Our puzzle game |
| --- | --- |
| 9×9 grid, digits 1–9 | Silhouette board + polygon pieces |
| Fewer givens / deeper logic | Harder shapes / piece sets / rule modifiers |
| Pick Easy…Extreme then play | Pick Easy…Expert then play from that pool |
| Daily Sudoku + archive + trophies | Daily shape challenge + archive + trophies |
| Per-difficulty statistics | Same |
| Hints, notes, undo, auto-check | Hints, undo, optional snap; solve check already validates completion |

---

## 4. Platform strategy

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

## 5. Current baseline (preserve)

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

## 6. Multi-shape puzzle design (feasible)

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

- Level schema: `{ id, difficulty, targetMask, targetOutline, pieces, rules, par, … }`
- Content under e.g. `src/content/levels/` pooled by difficulty
- Keep solve/geometry pure and unit-tested per level pack

---

## 7. Player journey

```text
Launch → Home
  → First-run tutorial (skippable; Easy demo shape)
  → Choose mode:
       Classic: pick difficulty → deal/select puzzle from that pool
       Daily: today (or archive date) → optional daily difficulty → play
    → Play session (board for that shape)
      → Hints / Undo → Pause / Settings
      → Solved celebration → Stats (per difficulty) / Share / Trophy
      → Play another (same difficulty) or Home
  → Statistics / Settings (sound, haptics, a11y)
```

**First viewport job:** brand + clear CTAs for **Play** (difficulty) and **Daily** — not a control dashboard.

---

## 8. Phased roadmap

**Kickoff:** Phases 0–1 / Stages 00–01 are **done**. Next: **Phase 2 / Stage 02** ([`stages/02-difficulty-pools-and-dailies.md`](./stages/02-difficulty-pools-and-dailies.md)). Track boxes in §17 and in each stage file; roll up status in [`PROGRESS.md`](./PROGRESS.md).

### Phase 0 — Product foundation

Stage file: [`stages/00-product-foundation.md`](./stages/00-product-foundation.md) — **done 2026-08-09**

- Interim app name **Form Fit** (final rename before Stage 03); visual direction notes recorded
- Audience: casual adults (kids-friendly OK); monetization: free v1, no ads/IAP; language: EN
- Tiers: Easy → Medium → Hard → Expert; Master later (Stage 04)
- Daily: one featured daily + archive; pool floor ~8–12/tier by end of Stage 02
- Success metrics recorded in Stage 00 Decisions log

**Exit criteria:** scope and non-goals agreed; implementation can start without re-litigating v1. ✅

### Phase 1 — App shell & session polish (web-first)

Stage file: [`stages/01-app-shell-and-session.md`](./stages/01-app-shell-and-session.md)

**Goal:** feels like a game, not a demo page. Demo T remains an Easy-pool entry.

| Workstream | Deliverables |
| --- | --- |
| Navigation | Home with **Play** + **Daily**; difficulty picker; Result; static-export-safe routes |
| Play HUD | Minimal controls: reset, hint, undo, pause — long help copy off the play surface |
| Onboarding | 3-step coach marks: select → drag → rotate/flip |
| Feedback | Optional snap assist; piece lift; solve motion; SFX/haptics hooks |
| Persistence | `localStorage`: settings, continue puzzle, bests **per difficulty**, tutorial completed |
| Responsive | Phone-first board scaling; safe-area insets; landscape rules |

**Exit criteria:** new player understands controls without the README; win feels rewarding; progress survives refresh.

### Phase 2 — Difficulty pools, multi-shape content & dailies

Stage file: [`stages/02-difficulty-pools-and-dailies.md`](./stages/02-difficulty-pools-and-dailies.md)

**Goal:** Sudoku.com-like loop — pick a difficulty or play daily; content beyond the demo T.

| Workstream | Deliverables |
| --- | --- |
| Difficulty system | Named tiers; puzzle records tagged with `difficulty` |
| Puzzle library v1 | Multi-shape pools per tier (demo T in Easy); each validated solvable |
| Classic play | Pick difficulty → random/next puzzle from pool → complete → play another |
| Stats | Per-difficulty best time/moves, wins; daily completion history |
| Daily challenge | Date-seeded puzzle of the day; **archive calendar**; trophy/streak; share card |
| Comfort tools | Progressive hints + undo (available across tiers) |
| Authoring pipeline | Checklist/tests so new shapes cannot ship unsolvable or mistagged by difficulty |

**Tech note:** keep geometry in `src/lib/`; level definitions under `src/content/levels/` (or `…/by-difficulty/`); pure functions for date seed → daily puzzle id.

### Phase 3 — Store-ready packaging

Stage file: [`stages/03-store-ready-packaging.md`](./stages/03-store-ready-packaging.md)

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

Stage file: [`stages/04-growth-and-depth.md`](./stages/04-growth-and-depth.md)

- Master / Extreme tier; larger pools per difficulty
- Seasonal events / medals (Sudoku.com-style limited events)
- Themes / piece skins
- Achievements beyond daily trophies
- Optional cloud sync (only if accounts are justified)
- Localization (EN first; add i18n keys early if more languages are planned)
- Production web host + CI/CD (noted as future in the deploy rule)
- Event / collection packs (more shapes over time)

---

## 9. Architecture guide

Proposed shape (evolve toward; do not big-bang rewrite):

```text
src/
  app/                 # home, play, daily, daily/archive, stats, settings
  components/
    shell/             # AppChrome, header/nav
    play/              # Board, Piece, HUD, TutorialOverlay, WinModal
    home/              # DifficultyPicker, DailyCard, ContinueCard
    daily/             # ArchiveCalendar, TrophyToast
  content/levels/      # multi-shape puzzles tagged by difficulty
  lib/
    puzzle/            # geometry + solve (generalized from t-puzzle.ts)
    progress.ts        # local persistence, per-difficulty stats
    daily.ts           # date seed → challenge id / puzzle
    pool.ts            # pick next puzzle from difficulty pool
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

## 10. Experience pillars

### Controls

- Preserve the current gesture model; document desktop vs touch in UX notes.
- Desktop: scroll to rotate selected piece; double-click to flip; optional two-finger twist on the board.
- Touch: select, then two-finger twist anywhere on the board; double-tap selected piece to flip.
- Consider optional **snap-to-45°/90° on release** as a setting (free twist during the gesture).
- Under Capacitor WebView: mind `touch-action`, double-tap zoom, and two-finger gesture ownership.

### Teaching

- First launch only by default; persistent “?” reopens coach marks.
- Prefer show-don’t-tell over long copy on the play screen.
- Tutorial uses an Easy demo shape; home then surfaces **difficulty choice** and **Daily**.

### Difficulty & fairness

- Difficulty is a **content tag + authoring budget**, not a different rules engine.
- Keep `SOLVE_CONFIG` as the central placement strictness dial; allow per-puzzle overrides later.
- Any “almost solved” feedback must not spoil the solution.
- New shapes ship only after solvability validation **and** a difficulty review (playtest or rubric).

### Audio / haptics

- Facade with mute; respect OS silent switch on iOS.
- Soft pick-up / place / solve cues; native haptics on select/solve only.

### Visual identity

- Commit design tokens early (background, piece palette, board, type).
- Home: brand-first hero composition (final name); play: the board/silhouette is the visual anchor.
- Pieces should feel physical (material, edge, shadow).

---

## 11. Accessibility & quality bar

- Focus order for controls; dialog focus trap on win/pause modals
- Honor `prefers-reduced-motion`
- Contrast for pieces vs board; selection not color-only
- Hit targets ≥ 44px; comfortable phone layout
- Screen reader labels for piece state (selected, rotation, flipped)
- Automated: lint, unit tests for solve/level load, **solvability**, and difficulty pool integrity
- Manual: gesture checklist before each store build; spot-check each tier’s “feels harder”

---

## 12. Delivery & ops

| Channel | Pipeline |
| --- | --- |
| Web preview | Merge `main` → Deploy to GitHub Pages → preview URL above |
| Staging web | Optional later (second env or other host) |
| iOS | Archive → TestFlight → App Review |
| Android | AAB → internal/closed testing → production |

Ship in **small slices**. Web preview on `main` remains the default review channel even while native wrappers catch up. See `.cursor/rules/commit-merge-deploy.mdc`.

---

## 13. Suggested v1 “full experience” scope

### In

- Home with **Classic (difficulty picker)** + **Daily** (Sudoku.com-like dual entry)
- Tutorial on Easy demo content
- Difficulty tiers at launch: at least **Easy / Medium / Hard / Expert**
- Multi-shape puzzle **pools** per tier (demo T in Easy); each validated solvable
- **Daily challenge** + simple **archive** + trophy/streak + share card
- Comfort tools: hint, undo, optional snap
- Stats **per difficulty** (+ daily history)
- Local persistence / continue; settings (sound / haptics / snap)
- Capacitor shells + store listing drafts
- Offline play

### Out of v1

- Accounts, global leaderboards, multiplayer
- Ads / IAP (decided: free v1; cosmetics later in Stage 04+)
- User-generated levels
- Full seasonal events (Phase 4 OK)
- Master/Extreme tier (optional stretch)

---

## 14. Open decisions

Phase 0 resolved 2026-08-09 (see [`stages/00-product-foundation.md`](./stages/00-product-foundation.md) Decisions log):

| # | Topic | Resolution |
| --- | --- | --- |
| 1 | Brand name | Interim **Form Fit**; final name before Stage 03 (not “T Puzzle”) |
| 2 | Audience | Casual adults primary; kids-friendly OK |
| 3 | Monetization | Free v1; no ads/IAP; cosmetics later (Stage 04+) |
| 4 | Tier count & labels | Easy / Medium / Hard / Expert; Master/Extreme → Stage 04 |
| 5 | Pool size targets | ~8–12 validated puzzles per tier by end of Stage 02 |
| 6 | Daily format | One featured daily + archive (+ trophies/streak) |
| 7 | Difficulty rubric | Deferred to Stage 02 / `docs/LEVELS.md` (working guide: plan §3.1) |
| 8 | Primary language(s) | English for v1 |
| 9 | Native timeline | Web-first Stages 01–02; Capacitor in Stage 03 |

Remaining product locks before store ship: **final app name** (and any store subtitle/keywords) in Stage 03.

---

## 15. Follow-on docs (optional next)

| File | Purpose |
| --- | --- |
| `docs/PRODUCT.md` | Vision, scope, non-goals, metrics, final name |
| `docs/UX.md` | Journeys, gestures, difficulty picker + daily archive UI |
| `docs/ARCHITECTURE.md` | Web + Capacitor, folders, build flavors |
| `docs/LEVELS.md` | Level schema, difficulty rubric, solvability checklist |
| `docs/STORE_CHECKLIST.md` | Apple / Google submission checklist |

---

## 16. Related project docs

| Doc | Role |
| --- | --- |
| [`PROGRESS.md`](./PROGRESS.md) | Roll-up status; which stage is current |
| [`stages/`](./stages/) | Per-stage goals, exit criteria, detailed checklists |
| `README.md` | How to run the current MVP (still demo-T oriented until rename) |
| `AGENTS.md` | Next.js version caveat for agents |
| `.cursor/rules/commit-merge-deploy.mdc` | Branch, merge, and Pages deploy loop |

---

## 17. Implementation plan checklists

Use these as phase-level roll-ups. Prefer checking detailed items in the stage files; mark a phase done here when its stage exit criteria are met.

### Phase 0 — Product foundation

- [x] App name (final or interim + rename deadline)
- [x] Audience + monetization + language(s)
- [x] Difficulty tiers for v1 locked
- [x] Daily format locked
- [x] Success metrics recorded
- [x] Stage 00 exit criteria met → [`stages/00-product-foundation.md`](./stages/00-product-foundation.md)

### Phase 1 — App shell & session polish

- [x] Home with Play + Daily entry
- [x] Difficulty picker
- [x] Play HUD + tutorial + polished win
- [x] Persistence (settings / tutorial / bests structure)
- [x] Responsive + lint/build/Pages deploy
- [x] Stage 01 exit criteria met → [`stages/01-app-shell-and-session.md`](./stages/01-app-shell-and-session.md)

### Phase 2 — Difficulty pools, content & dailies

- [ ] Difficulty-tagged puzzle pools (multi-shape, validated)
- [ ] Classic play-by-difficulty loop
- [ ] Daily + archive + trophy/streak + share
- [ ] Per-difficulty stats; hints + undo
- [ ] Authoring/solvability pipeline
- [ ] Stage 02 exit criteria met → [`stages/02-difficulty-pools-and-dailies.md`](./stages/02-difficulty-pools-and-dailies.md)

### Phase 3 — Store-ready packaging

- [ ] Capacitor iOS + Android from static export
- [ ] Native UX (icons, splash, safe areas, gestures)
- [ ] Offline core play + privacy draft
- [ ] Internal TestFlight + Play tracks
- [ ] Stage 03 exit criteria met → [`stages/03-store-ready-packaging.md`](./stages/03-store-ready-packaging.md)

### Phase 4 — Growth & depth

- [ ] Growth bet shipped (Master tier / events / themes / etc.)
- [ ] Expanded pools; localization/hosting as scoped
- [ ] Stage 04 exit criteria met → [`stages/04-growth-and-depth.md`](./stages/04-growth-and-depth.md)
