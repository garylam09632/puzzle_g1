import type { LevelDefinition } from "@/lib/level-schema";
import { BOARD_PADDING, type PieceDefinition, type Point } from "@/lib/t-puzzle";

/** Classic T-puzzle polygons (unit coordinates; 1 unit = 80px). */
const PIECES: PieceDefinition[] = [
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
const TARGET_OUTLINE: Point[] = [
  [0, 0],
  [3, 0],
  [3, 1],
  [2, 1],
  [2, 4],
  [1, 4],
  [1, 1],
  [0, 1],
];

const TARGET_MASK: boolean[][] = [
  [true, true, true],
  [false, true, false],
  [false, true, false],
  [false, true, false],
];

const BOARD_HEIGHT_PX = 4 * 80;
const TRAY_TOP = BOARD_PADDING + BOARD_HEIGHT_PX + 56;

/**
 * Demo T — first Easy pack entry (tutorial / warm-up silhouette).
 * Solution poses are screen-space (include BOARD_PADDING).
 */
export const DEMO_T_LEVEL: LevelDefinition = {
  id: "easy-demo-t",
  difficulty: "easy",
  title: "Demo T",
  targetOutline: TARGET_OUTLINE,
  targetMask: TARGET_MASK,
  pieces: PIECES,
  rules: {
    allowFlip: true,
    traySpawns: [
      { id: "triangle", x: BOARD_PADDING + 20, y: TRAY_TOP, rotation: 0 },
      { id: "trapezoid-a", x: BOARD_PADDING + 90, y: TRAY_TOP, rotation: 0 },
      {
        id: "trapezoid-b",
        x: BOARD_PADDING + 20,
        y: TRAY_TOP + 90,
        rotation: 0,
      },
      {
        id: "pentagon",
        x: BOARD_PADDING + 130,
        y: TRAY_TOP + 70,
        rotation: 0,
      },
    ],
  },
  par: {
    moves: 24,
  },
  /** Known-good screen-space poses validated by `isPuzzleSolved`. */
  solution: [
    {
      id: "triangle",
      x: 71.68910152655211,
      y: 77.80555029722365,
      rotation: 180,
      flipped: true,
    },
    {
      id: "trapezoid-a",
      x: 254.25544988370038,
      y: 104.85007721300298,
      rotation: 43,
      flipped: true,
    },
    {
      id: "trapezoid-b",
      x: 175.9766938318855,
      y: 256.6942749530968,
      rotation: 133,
      flipped: true,
    },
    {
      id: "pentagon",
      x: 151.60520244926607,
      y: 114.71004781510615,
      rotation: 317.25,
      flipped: true,
    },
  ],
};
