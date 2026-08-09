# Level authoring (Form Fit)

Stub for Stage 02a. Difficulty rubric and multi-shape notes expand in Stage 02b.

## Schema

Levels are typed as `LevelDefinition` in [`src/lib/level-schema.ts`](../src/lib/level-schema.ts) and live under [`src/content/levels/`](../src/content/levels/).

| Field | Notes |
| --- | --- |
| `id` | Stable string, e.g. `easy-demo-t` |
| `difficulty` | `easy` \| `medium` \| `hard` \| `expert` |
| `title` | Optional display name |
| `targetOutline` | Silhouette polygon in **unit** coordinates |
| `targetMask` | Row-major boolean grid (`true` = must fill); cell size = `UNIT` px |
| `pieces` | Polygon defs (`id`, `name`, `points`, `color`) in unit coords |
| `rules` | Optional: `allowFlip`, `traySpawns` (screen-space poses) |
| `par` | Optional soft targets (`moves`, `timeSeconds`) |
| `solveConfig` | Optional partial overrides of default `SOLVE_CONFIG` |
| `solution` | Known-good **screen-space** poses for the solvability harness |

**Units:** piece / outline / mask geometry use unit coordinates where `1` unit = `UNIT` (80px). Runtime poses (`traySpawns`, `solution`, play state) use SVG screen coordinates and include `BOARD_PADDING`.

## Catalog

[`src/content/levels/index.ts`](../src/content/levels/index.ts) exports:

- `LEVELS` — all authored levels
- `getLevelById`
- `getLevelsByDifficulty`
- `getLevelForDifficulty` — Classic deal helper

Stage 02a ships **`easy-demo-t`** only. Medium / Hard / Expert Classic routes also deal that pack entry until Stage 02b pools exist.

## Solvability checklist

Before shipping a level:

1. Store a `solution` pose set on the level.
2. Assert `isPuzzleSolved(solution, level)` (see `src/content/levels/demo-t.solvability.test.ts`).
3. Spot-check play-feel and tier tag (Easy → Expert). Rubric detail lands in 02b.
4. Prefer pure geometry helpers in `src/lib/t-puzzle.ts`; keep content data in `src/content/levels/`.

Run:

```bash
npm run test
```

Optional authoring helper: `npx tsx scripts/find-demo-t-solution.mts` (search aid; not required in CI).

## Difficulty rubric (working)

Deferred detail — until then use plan §3.1: scale via silhouette complexity, piece awkwardness, and flip/guidance modifiers (not a different rules engine).
