import type { Difficulty } from "@/lib/difficulty";
import type { Point, PieceDefinition, PieceState, SolveConfig } from "@/lib/t-puzzle";

export type LevelRules = {
  /** When false, flip controls should be disabled (default true). */
  allowFlip?: boolean;
  /**
   * Optional tray spawn poses in screen coordinates (include board padding).
   * When omitted, a simple default tray layout is used.
   */
  traySpawns?: PieceState[];
};

export type LevelPar = {
  moves?: number;
  timeSeconds?: number;
};

/**
 * Authorable level definition.
 * Geometry uses unit coordinates for outline/mask/piece polygons (1 unit = UNIT px).
 * Runtime piece poses (`traySpawns`, `solution`) use screen coordinates.
 */
export type LevelDefinition = {
  id: string;
  difficulty: Difficulty;
  title?: string;
  targetOutline: Point[];
  targetMask: boolean[][];
  pieces: PieceDefinition[];
  rules?: LevelRules;
  par?: LevelPar;
  /** Partial overrides merged over the default SOLVE_CONFIG. */
  solveConfig?: Partial<SolveConfig>;
  /**
   * Known-good screen-space poses that pass the solvability checker.
   * Used by the authoring harness (and later progressive hints).
   */
  solution: PieceState[];
};

export type { Point, PieceDefinition, PieceState, SolveConfig };
