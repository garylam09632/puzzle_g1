import type { LevelDefinition } from "@/lib/level-schema";

export const UNIT = 80;

export type Point = [number, number];

export type PieceId = string;

export type PieceDefinition = {
  id: PieceId;
  name: string;
  points: Point[];
  color: string;
};

export type PieceState = {
  id: PieceId;
  x: number;
  y: number;
  rotation: number;
  flipped?: boolean;
};

export type SolveConfig = {
  /** Samples per cell edge (N×N grid inside each board cell). */
  sampleGridSize: number;
  /** Min filled-sample fraction for a target cell to count as covered. */
  minTargetCellCoverage: number;
  /** Max filled-sample fraction allowed in a non-target (empty) cell. */
  maxEmptyCellCoverage: number;
  /** Min target-cell centers a piece must cover to count as placed. */
  minTargetCellsPerPiece: number;
  /** How many mask cells may mismatch and still count as solved (0 = exact). */
  maxMismatchedCells: number;
};

export const BOARD_PADDING = 48;
export const TRAY_HEIGHT = 180;

/**
 * Tunable solve strictness defaults.
 * Per-level overrides merge via `mergeSolveConfig`.
 */
export const SOLVE_CONFIG: SolveConfig = {
  sampleGridSize: 12,
  minTargetCellCoverage: 0.85,
  maxEmptyCellCoverage: 0.15,
  minTargetCellsPerPiece: 1,
  maxMismatchedCells: 0,
};

export function mergeSolveConfig(
  overrides?: Partial<SolveConfig>,
): SolveConfig {
  return { ...SOLVE_CONFIG, ...overrides };
}

export function getMaskPixelSize(mask: boolean[][]): {
  width: number;
  height: number;
} {
  const rows = mask.length;
  const cols = mask[0]?.length ?? 0;
  return { width: cols * UNIT, height: rows * UNIT };
}

/** @deprecated Prefer getMaskPixelSize(level.targetMask); kept for demo T size. */
export const BOARD_WIDTH = 3 * UNIT;
/** @deprecated Prefer getMaskPixelSize(level.targetMask); kept for demo T size. */
export const BOARD_HEIGHT = 4 * UNIT;

export function getPieceDefinition(
  pieces: PieceDefinition[],
  id: PieceId,
): PieceDefinition {
  const piece = pieces.find((entry) => entry.id === id);
  if (!piece) {
    throw new Error(`Unknown piece: ${id}`);
  }
  return piece;
}

export function normalizeRotation(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}

export function rotatePoint([x, y]: Point, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [x * cos - y * sin, x * sin + y * cos];
}

export function getPieceCentroid(points: Point[]): Point {
  const sum = points.reduce(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y] as Point,
    [0, 0] as Point,
  );
  return [sum[0] / points.length, sum[1] / points.length];
}

export function getTransformedPoints(
  piece: PieceState,
  definitions: PieceDefinition[],
): Point[] {
  const definition = getPieceDefinition(definitions, piece.id);
  const centroid = getPieceCentroid(definition.points);
  const rotation = normalizeRotation(piece.rotation);
  const flipped = piece.flipped ?? false;

  return definition.points.map(([x, y]) => {
    let localX = (x - centroid[0]) * UNIT;
    const localY = (y - centroid[1]) * UNIT;

    if (flipped) {
      localX = -localX;
    }

    const [rotatedX, rotatedY] = rotatePoint([localX, localY], rotation);
    return [piece.x + rotatedX, piece.y + rotatedY] as Point;
  });
}

export function pointsToPolygon(points: Point[]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function pointInPolygon(point: Point, polygon: Point[]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function cellCoverageFractions(
  pieces: PieceState[],
  definitions: PieceDefinition[],
  mask: boolean[][],
  config: SolveConfig,
): number[][] {
  const rows = mask.length;
  const cols = mask[0]?.length ?? 0;
  const grid = config.sampleGridSize;
  const sampleStep = UNIT / grid;
  const fractions = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0),
  );

  const polygons = pieces.map((piece) =>
    getTransformedPoints(piece, definitions),
  );

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      let hits = 0;
      let samples = 0;

      for (let sy = 0; sy < grid; sy += 1) {
        for (let sx = 0; sx < grid; sx += 1) {
          const x = col * UNIT + (sx + 0.5) * sampleStep;
          const y = row * UNIT + (sy + 0.5) * sampleStep;
          samples += 1;
          if (polygons.some((polygon) => pointInPolygon([x, y], polygon))) {
            hits += 1;
          }
        }
      }

      fractions[row][col] = hits / samples;
    }
  }

  return fractions;
}

function countTargetCellsCovered(
  boardPiece: PieceState,
  definitions: PieceDefinition[],
  mask: boolean[][],
): number {
  const polygon = getTransformedPoints(boardPiece, definitions);
  let covered = 0;

  for (let row = 0; row < mask.length; row += 1) {
    for (let col = 0; col < mask[row].length; col += 1) {
      if (!mask[row][col]) {
        continue;
      }

      const centerX = col * UNIT + UNIT / 2;
      const centerY = row * UNIT + UNIT / 2;
      if (pointInPolygon([centerX, centerY], polygon)) {
        covered += 1;
      }
    }
  }

  return covered;
}

export type SolveLevelInput = Pick<
  LevelDefinition,
  "pieces" | "targetMask" | "solveConfig"
>;

export function isPuzzleSolved(
  pieces: PieceState[],
  level: SolveLevelInput,
): boolean {
  const config = mergeSolveConfig(level.solveConfig);
  const mask = level.targetMask;
  const definitions = level.pieces;

  const boardPieces = pieces.map((piece) => ({
    ...piece,
    x: piece.x - BOARD_PADDING,
    y: piece.y - BOARD_PADDING,
  }));

  if (
    !boardPieces.every(
      (piece) =>
        countTargetCellsCovered(piece, definitions, mask) >=
        config.minTargetCellsPerPiece,
    )
  ) {
    return false;
  }

  const fractions = cellCoverageFractions(
    boardPieces,
    definitions,
    mask,
    config,
  );
  let mismatches = 0;

  for (let row = 0; row < mask.length; row += 1) {
    for (let col = 0; col < mask[row].length; col += 1) {
      const fraction = fractions[row][col];
      const cellOk = mask[row][col]
        ? fraction >= config.minTargetCellCoverage
        : fraction <= config.maxEmptyCellCoverage;

      if (!cellOk) {
        mismatches += 1;
      }
    }
  }

  return mismatches <= config.maxMismatchedCells;
}

function defaultTraySpawns(
  level: LevelDefinition,
  boardHeight: number,
): PieceState[] {
  const trayTop = BOARD_PADDING + boardHeight + 56;
  const cols = 2;
  return level.pieces.map((piece, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      id: piece.id,
      x: BOARD_PADDING + 20 + col * 110,
      y: trayTop + row * 90,
      rotation: 0,
    };
  });
}

export function createInitialPieces(level: LevelDefinition): PieceState[] {
  const { height: boardHeight } = getMaskPixelSize(level.targetMask);
  const spawns = level.rules?.traySpawns;
  if (spawns && spawns.length > 0) {
    return spawns.map((spawn) => ({ ...spawn }));
  }
  return defaultTraySpawns(level, boardHeight);
}
