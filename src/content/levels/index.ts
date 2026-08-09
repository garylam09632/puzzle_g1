import type { LevelDefinition } from "@/lib/level-schema";
import type { Difficulty } from "@/lib/difficulty";
import { DEMO_T_LEVEL } from "@/content/levels/easy/demo-t";

/** All authored levels. Stage 02a ships the demo T Easy entry only. */
export const LEVELS: LevelDefinition[] = [DEMO_T_LEVEL];

export function getLevelById(id: string): LevelDefinition | undefined {
  return LEVELS.find((level) => level.id === id);
}

export function getLevelsByDifficulty(
  difficulty: Difficulty,
): LevelDefinition[] {
  return LEVELS.filter((level) => level.difficulty === difficulty);
}

/**
 * Classic deal for a difficulty tier.
 * Stage 02a: Easy (and interim Medium/Hard/Expert) deal the demo T from the pack.
 */
export function getLevelForDifficulty(
  difficulty: Difficulty,
): LevelDefinition {
  const pool = getLevelsByDifficulty(difficulty);
  if (pool.length > 0) {
    return pool[0];
  }

  // Interim until 02b multi-shape pools: every Classic tier plays the demo T.
  const demo = getLevelById("easy-demo-t");
  if (!demo) {
    throw new Error("Missing demo level easy-demo-t");
  }
  return demo;
}

export { DEMO_T_LEVEL };
