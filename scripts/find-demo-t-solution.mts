/**
 * Searcher for a known-good demo T solution.
 * Run: npx tsx scripts/find-demo-t-solution.mts
 */
import { DEMO_T_LEVEL } from "../src/content/levels/easy/demo-t.ts";
import {
  BOARD_PADDING,
  UNIT,
  getMaskPixelSize,
  getTransformedPoints,
  isPuzzleSolved,
  mergeSolveConfig,
  type PieceState,
} from "../src/lib/t-puzzle.ts";

const level = DEMO_T_LEVEL;
const mask = level.targetMask;
const { width, height } = getMaskPixelSize(mask);
const coarse = mergeSolveConfig({ sampleGridSize: 4 });

function pointInPolygon(
  point: [number, number],
  polygon: [number, number][],
): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function score(pieces: PieceState[], config = coarse): number {
  const boardPieces = pieces.map((p) => ({
    ...p,
    x: p.x - BOARD_PADDING,
    y: p.y - BOARD_PADDING,
  }));
  const polygons = boardPieces.map((p) =>
    getTransformedPoints(p, level.pieces),
  );

  let mismatches = 0;
  let coveragePenalty = 0;
  const grid = config.sampleGridSize;
  const step = UNIT / grid;

  for (let row = 0; row < mask.length; row++) {
    for (let col = 0; col < (mask[0]?.length ?? 0); col++) {
      let hits = 0;
      let samples = 0;
      for (let sy = 0; sy < grid; sy++) {
        for (let sx = 0; sx < grid; sx++) {
          const x = col * UNIT + (sx + 0.5) * step;
          const y = row * UNIT + (sy + 0.5) * step;
          samples++;
          if (polygons.some((poly) => pointInPolygon([x, y], poly))) hits++;
        }
      }
      const fraction = hits / samples;
      if (mask[row][col]) {
        if (fraction < config.minTargetCellCoverage) {
          mismatches++;
          coveragePenalty += config.minTargetCellCoverage - fraction;
        }
      } else if (fraction > config.maxEmptyCellCoverage) {
        mismatches++;
        coveragePenalty += fraction - config.maxEmptyCellCoverage;
      }
    }
  }

  for (const piece of boardPieces) {
    const poly = getTransformedPoints(piece, level.pieces);
    let covered = 0;
    for (let row = 0; row < mask.length; row++) {
      for (let col = 0; col < mask[row].length; col++) {
        if (!mask[row][col]) continue;
        const cx = col * UNIT + UNIT / 2;
        const cy = row * UNIT + UNIT / 2;
        if (pointInPolygon([cx, cy], poly)) covered++;
      }
    }
    if (covered < config.minTargetCellsPerPiece) {
      mismatches += 2;
      coveragePenalty += 1;
    }
  }

  return mismatches * 10 + coveragePenalty;
}

function verified(pieces: PieceState[]): boolean {
  return isPuzzleSolved(pieces, {
    pieces: level.pieces,
    targetMask: level.targetMask,
    solveConfig: level.solveConfig,
  });
}

const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];

function clampPose(piece: PieceState): PieceState {
  return {
    ...piece,
    x: Math.min(BOARD_PADDING + width - 5, Math.max(BOARD_PADDING + 5, piece.x)),
    y: Math.min(
      BOARD_PADDING + height - 5,
      Math.max(BOARD_PADDING + 5, piece.y),
    ),
    rotation: ((piece.rotation % 360) + 360) % 360,
  };
}

function randomState(): PieceState[] {
  // Bias pentagon toward classic 45°-family orientations near the T junction.
  return level.pieces.map((def) => {
    const isPent = def.id === "pentagon";
    return clampPose({
      id: def.id,
      x:
        BOARD_PADDING +
        (isPent ? width * 0.35 + Math.random() * width * 0.3 : Math.random() * width),
      y:
        BOARD_PADDING +
        (isPent ? height * 0.15 + Math.random() * height * 0.35 : Math.random() * height),
      rotation: isPent
        ? [45, 135, 225, 315][Math.floor(Math.random() * 4)]!
        : ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)]!,
      flipped: Math.random() < 0.5,
    });
  });
}

function mutate(state: PieceState[], amount: number): PieceState[] {
  return state.map((piece) => {
    if (Math.random() > 0.55) return piece;
    const next = { ...piece };
    next.x += (Math.random() - 0.5) * amount;
    next.y += (Math.random() - 0.5) * amount;
    if (Math.random() < 0.25) {
      next.rotation =
        ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)]!;
    }
    if (Math.random() < 0.12) next.flipped = !next.flipped;
    return clampPose(next);
  });
}

/** Local polish: nudge each piece on a fine grid when already close. */
function polish(state: PieceState[]): PieceState[] | null {
  let current = state.map((p) => ({ ...p }));
  let currentScore = score(current);
  const steps = [-8, -4, -2, -1, 0, 1, 2, 4, 8];

  for (let pass = 0; pass < 3; pass++) {
    let improved = false;
    for (let i = 0; i < current.length; i++) {
      let localBest = current;
      let localScore = currentScore;
      for (const dx of steps) {
        for (const dy of steps) {
          for (const rot of ROTATIONS) {
            for (const flipped of [false, true]) {
              const trial = current.map((p, idx) =>
                idx === i
                  ? clampPose({
                      ...p,
                      x: p.x + dx,
                      y: p.y + dy,
                      rotation: rot,
                      flipped,
                    })
                  : p,
              );
              const s = score(trial);
              if (s < localScore) {
                localScore = s;
                localBest = trial;
                improved = true;
              }
              if (localScore === 0 && verified(trial)) {
                return trial;
              }
            }
          }
        }
      }
      current = localBest;
      currentScore = localScore;
    }
    if (!improved) break;
  }
  return currentScore === 0 && verified(current) ? current : null;
}

let best = randomState();
let bestScore = score(best);
const start = Date.now();
const budgetMs = 180_000;
let iterations = 0;

console.log("searching...");

while (Date.now() - start < budgetMs) {
  iterations++;
  const amount = bestScore > 20 ? 100 : bestScore > 10 ? 40 : 16;
  const trial = Math.random() < 0.04 ? randomState() : mutate(best, amount);
  const s = score(trial);
  if (s < bestScore || (s === bestScore && Math.random() < 0.05)) {
    best = trial;
    bestScore = s;
    if (bestScore < 25) {
      console.log("best", bestScore.toFixed(3), "iter", iterations);
    }
    if (bestScore <= 12) {
      const polished = polish(best);
      if (polished) {
        console.log("SOLVED_FULL");
        console.log(JSON.stringify(polished, null, 2));
        process.exit(0);
      }
    }
    if (verified(best)) {
      console.log("SOLVED_FULL");
      console.log(JSON.stringify(best, null, 2));
      process.exit(0);
    }
  }
}

const polished = polish(best);
if (polished) {
  console.log("SOLVED_FULL");
  console.log(JSON.stringify(polished, null, 2));
  process.exit(0);
}

console.log("FAILED bestScore", bestScore, "iters", iterations);
console.log(JSON.stringify(best, null, 2));
process.exit(1);
