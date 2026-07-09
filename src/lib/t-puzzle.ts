export const UNIT = 80;

export type Point = [number, number];

export type PieceId = "triangle" | "trapezoid-a" | "trapezoid-b" | "pentagon";

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

/** Classic T-puzzle polygons (unit coordinates; 1 unit = 80px). */
export const PIECE_DEFINITIONS: PieceDefinition[] = [
  {
    id: "triangle",
    name: "Triangle",
    points: [
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    color: "#1a1a1a",
  },
  {
    id: "trapezoid-a",
    name: "Trapezoid A",
    points: [
      [0, 0.48],
      [0.13, 0],
      [1.09, 0.26],
      [0.71, 1.71],
    ],
    color: "#2a2a2a",
  },
  {
    id: "trapezoid-b",
    name: "Trapezoid B",
    points: [
      [0, 0.8],
      [0.6, 0],
      [2.2, 1.19],
      [2.41, 2.59],
    ],
    color: "#3a3a3a",
  },
  {
    id: "pentagon",
    name: "Pentagon",
    points: [
      [0, 0.48],
      [1.23, 1.34],
      [2.63, 1.09],
      [2.21, 0.8],
      [2.79, 0],
    ],
    color: "#4a4a4a",
  },
];

/** Target T silhouette in unit coordinates (3 wide × 4 tall). */
export const T_OUTLINE: Point[] = [
  [0, 0],
  [3, 0],
  [3, 1],
  [2, 1],
  [2, 4],
  [1, 4],
  [1, 1],
  [0, 1],
];

export const BOARD_WIDTH = 3 * UNIT;
export const BOARD_HEIGHT = 4 * UNIT;
export const BOARD_PADDING = 48;
export const TRAY_HEIGHT = 180;

const T_MASK: boolean[][] = [
  [true, true, true],
  [false, true, false],
  [false, true, false],
  [false, true, false],
];

const SAMPLE_STEP = UNIT / 8;

export function getPieceDefinition(id: PieceId): PieceDefinition {
  const piece = PIECE_DEFINITIONS.find((entry) => entry.id === id);
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

export function getTransformedPoints(piece: PieceState): Point[] {
  const definition = getPieceDefinition(piece.id);
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

function rasterizeCoverage(pieces: PieceState[]): boolean[][] {
  const rows = T_MASK.length;
  const cols = T_MASK[0].length;
  const coverage = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false),
  );

  const polygons = pieces.map((piece) => getTransformedPoints(piece));

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      let hits = 0;
      let samples = 0;

      for (let sy = 0; sy < 8; sy += 1) {
        for (let sx = 0; sx < 8; sx += 1) {
          const x = col * UNIT + (sx + 0.5) * SAMPLE_STEP;
          const y = row * UNIT + (sy + 0.5) * SAMPLE_STEP;
          samples += 1;
          if (polygons.some((polygon) => pointInPolygon([x, y], polygon))) {
            hits += 1;
          }
        }
      }

      coverage[row][col] = hits / samples > 0.5;
    }
  }

  return coverage;
}

function pieceCoversTarget(boardPiece: PieceState): boolean {
  const polygon = getTransformedPoints(boardPiece);

  for (let row = 0; row < T_MASK.length; row += 1) {
    for (let col = 0; col < T_MASK[row].length; col += 1) {
      if (!T_MASK[row][col]) {
        continue;
      }

      const centerX = col * UNIT + UNIT / 2;
      const centerY = row * UNIT + UNIT / 2;
      if (pointInPolygon([centerX, centerY], polygon)) {
        return true;
      }
    }
  }

  return false;
}

export function isPuzzleSolved(pieces: PieceState[]): boolean {
  const boardPieces = pieces.map((piece) => ({
    ...piece,
    x: piece.x - BOARD_PADDING,
    y: piece.y - BOARD_PADDING,
  }));

  if (!boardPieces.every((piece) => pieceCoversTarget(piece))) {
    return false;
  }

  const coverage = rasterizeCoverage(boardPieces);

  for (let row = 0; row < T_MASK.length; row += 1) {
    for (let col = 0; col < T_MASK[row].length; col += 1) {
      if (coverage[row][col] !== T_MASK[row][col]) {
        return false;
      }
    }
  }

  return true;
}

export function createInitialPieces(): PieceState[] {
  const trayTop = BOARD_PADDING + BOARD_HEIGHT + 56;

  return [
    { id: "triangle", x: BOARD_PADDING + 20, y: trayTop, rotation: 0 },
    { id: "trapezoid-a", x: BOARD_PADDING + 90, y: trayTop, rotation: 0 },
    { id: "trapezoid-b", x: BOARD_PADDING + 20, y: trayTop + 90, rotation: 0 },
    { id: "pentagon", x: BOARD_PADDING + 130, y: trayTop + 70, rotation: 0 },
  ];
}
