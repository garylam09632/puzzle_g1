export const DIFFICULTIES = ["easy", "medium", "hard", "expert"] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  expert: "Expert",
};

export function isDifficulty(value: string): value is Difficulty {
  return (DIFFICULTIES as readonly string[]).includes(value);
}

export function parseDifficulty(
  value: string | undefined | null,
): Difficulty | null {
  if (!value) {
    return null;
  }
  const normalized = value.toLowerCase();
  return isDifficulty(normalized) ? normalized : null;
}
