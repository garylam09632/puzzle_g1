# Stage 00 — Product foundation

**Phase:** 0  
**Status:** `done`  
**Goal:** Lock product decisions so Stage 01+ can ship without re-litigating v1.  
**Parent plan:** [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) · [`../PROGRESS.md`](../PROGRESS.md)

---

## Why this is the kickoff stage

The MVP core loop already works. Before building the Sudoku.com-like shell and multi-shape content, lock **name**, **audience**, **monetization**, **difficulty tiers**, and **v1 content targets**. This stage is mostly decisions + lightweight docs — little or no game code.

---

## Exit criteria

- [x] Final or interim **app name** chosen and recorded
- [x] Audience + monetization direction recorded
- [x] Difficulty tier labels/count for v1 locked
- [x] Daily format for v1 locked (single daily vs per-difficulty)
- [x] Success metrics listed
- [x] Open decisions in the plan either answered or explicitly deferred with owner/date
- [x] [`../PROGRESS.md`](../PROGRESS.md) updated to move current stage to **01** when done

---

## Checklist

### Brand & positioning

- [x] Choose final app name (not “T Puzzle”) **or** confirm interim working title + rename deadline
- [x] One-sentence product pitch (silhouette packing + difficulties + daily)
- [x] Visual direction notes (mood, reference apps, avoid-list)

### Audience & business

- [x] Target audience (kids / casual adults / both)
- [x] Monetization for v1 (free / paid / free+cosmetics later / undecided-with-date)
- [x] Primary language(s)

### Challenge model defaults

- [x] Tier set for launch (proposal: Easy / Medium / Hard / Expert)
- [x] Whether Master/Extreme is v1 or Stage 04
- [x] Daily format: one featured daily + archive (recommended) vs daily-per-difficulty
- [x] Rough pool-size targets per difficulty at end of Stage 02

### Metrics

- [x] Time-to-first-solve (tutorial / first Easy clear)
- [x] Solve rate by difficulty
- [x] Daily completion / streak (local)
- [x] Return visit proxy (local)
- [x] Crash-free / gesture reliability notes for QA later

### Docs hygiene

- [x] Record answers in this file’s **Decisions log** (below)
- [x] Update open decisions section in [`../IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md) §14
- [x] Optional: stub `docs/PRODUCT.md` if decisions are long enough to split

### Explicit non-goals for this stage

- [x] No requirement to finish multi-shape content
- [x] No Capacitor / store submission work
- [x] No rename refactor of all code identifiers (can wait until name is final)

---

## Decisions log

| Topic | Decision | Date |
| --- | --- | --- |
| App name | **Interim: Form Fit.** Final brand locked before Stage 03 store packaging (not “T Puzzle”). Code identifiers may stay `TPuzzle*` until rename. | 2026-08-09 |
| Audience | Casual adults primary; kids-friendly OK (no mature themes, clear large targets). Not positioned as a kids-only app. | 2026-08-09 |
| Monetization | Free for v1. No ads / IAP in v1. Cosmetics / optional paid cosmetics deferred to Stage 04+. | 2026-08-09 |
| Primary language(s) | English only for v1. Add i18n keys early in Stage 01 if cheap; no second locale until Stage 04. | 2026-08-09 |
| Tiers at launch | **Easy / Medium / Hard / Expert.** Master / Extreme deferred to Stage 04. | 2026-08-09 |
| Daily format | **One featured daily** (date-seeded, same for all) + archive + trophies/streak. Not daily-per-difficulty in v1. | 2026-08-09 |
| Pool-size targets | End of Stage 02: **~8–12 validated puzzles per tier** (launch floor). Grow toward dozens+ over time. Demo T ships in Easy (tutorial / warm-up). | 2026-08-09 |
| Native timeline | Web-first Stages 01–02; Capacitor packaging in Stage 03. | 2026-08-09 |
| Difficulty rubric | Deferred to Stage 02 / `docs/LEVELS.md`. Working guide until then: scale via silhouette complexity, piece awkwardness, flip/guidance modifiers (see plan §3.1). Owner: Stage 02 authoring work. | 2026-08-09 |

### Product pitch (one sentence)

**Form Fit** is a free silhouette-packing puzzle game: fit pieces into different target shapes across Easy→Expert pools and a daily challenge with archive and streaks.

### Visual direction (notes)

| Axis | Direction |
| --- | --- |
| Mood | Calm focus, tactile packing — satisfying “click” of a fit, not arcade chaos |
| References | Sudoku.com (difficulty + daily shell); clean board-first puzzle apps |
| Brand signal | Home hero leads with **Form Fit**; board/silhouette is the play-surface visual anchor |
| Avoid | Purple-gradient AI cliché; cream+terracotta serif cliché; broadsheet density; emoji spam; card-heavy dashboards in the hero; “T Puzzle” as product identity |
| Motion | Intentional: piece lift, snap/settle, win moment (2–3 motions; respect reduced motion) |

### Success metrics (v1)

| Metric | How we measure (local / QA) |
| --- | --- |
| Time-to-first-solve | Time from first open → tutorial / first Easy clear |
| Solve rate by difficulty | Wins / starts per Easy·Medium·Hard·Expert |
| Daily completion / streak | Local daily clear flag + current/longest streak |
| Return visit proxy | Local last-open timestamps / sessions across days |
| Crash-free / gestures | QA notes: no stuck drag, rotate/flip reliable on touch + pointer |

---

## Notes

- Confirmed 2026-08-09: interim name path (1A) + audience/monetization package (2A).
- `docs/PRODUCT.md` not stubbed — decisions fit in this log; split later if Stage 01+ needs a longer product brief.
- Stage 01 may use **Form Fit** in UI strings and Easy→Expert picker immediately.
