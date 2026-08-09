import {
  DIFFICULTIES,
  type Difficulty,
} from "@/lib/difficulty";

const KEYS = {
  settings: "formfit.settings",
  tutorialCompleted: "formfit.tutorialCompleted",
  bests: "formfit.bests",
  lastOpenAt: "formfit.lastOpenAt",
} as const;

export type AppSettings = {
  soundEnabled: boolean;
};

export type DifficultyBests = {
  bestMoves?: number;
  wins: number;
  starts: number;
};

export type BestsMap = Record<Difficulty, DifficultyBests>;

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
};

function emptyBests(): BestsMap {
  return {
    easy: { wins: 0, starts: 0 },
    medium: { wins: 0, starts: 0 },
    hard: { wins: 0, starts: 0 },
    expert: { wins: 0, starts: 0 },
  };
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson(key: string): unknown {
  if (!canUseStorage()) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) {
      return null;
    }
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / private mode — ignore
  }
}

export function getSettings(): AppSettings {
  const parsed = readJson(KEYS.settings);
  if (!parsed || typeof parsed !== "object") {
    return { ...DEFAULT_SETTINGS };
  }
  const soundEnabled =
    "soundEnabled" in parsed && typeof parsed.soundEnabled === "boolean"
      ? parsed.soundEnabled
      : DEFAULT_SETTINGS.soundEnabled;
  return { soundEnabled };
}

export function setSettings(next: Partial<AppSettings>): AppSettings {
  const merged = { ...getSettings(), ...next };
  writeJson(KEYS.settings, merged);
  return merged;
}

export function isTutorialCompleted(): boolean {
  if (!canUseStorage()) {
    return false;
  }
  return window.localStorage.getItem(KEYS.tutorialCompleted) === "1";
}

export function markTutorialDone(): void {
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(KEYS.tutorialCompleted, "1");
  } catch {
    // ignore
  }
}

export function getBests(): BestsMap {
  const parsed = readJson(KEYS.bests);
  const base = emptyBests();
  if (!parsed || typeof parsed !== "object") {
    return base;
  }

  for (const difficulty of DIFFICULTIES) {
    const entry = (parsed as Record<string, unknown>)[difficulty];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const record = entry as Record<string, unknown>;
    base[difficulty] = {
      wins: typeof record.wins === "number" ? record.wins : 0,
      starts: typeof record.starts === "number" ? record.starts : 0,
      bestMoves:
        typeof record.bestMoves === "number" ? record.bestMoves : undefined,
    };
  }
  return base;
}

export function recordStart(difficulty: Difficulty): BestsMap {
  const bests = getBests();
  bests[difficulty] = {
    ...bests[difficulty],
    starts: bests[difficulty].starts + 1,
  };
  writeJson(KEYS.bests, bests);
  return bests;
}

export function recordWin(
  difficulty: Difficulty,
  moves: number,
): { bests: BestsMap; isNewBest: boolean } {
  const bests = getBests();
  const current = bests[difficulty];
  const isNewBest =
    typeof current.bestMoves !== "number" || moves < current.bestMoves;
  bests[difficulty] = {
    ...current,
    wins: current.wins + 1,
    bestMoves: isNewBest ? moves : current.bestMoves,
  };
  writeJson(KEYS.bests, bests);
  return { bests, isNewBest };
}

export function touchLastOpen(): void {
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(KEYS.lastOpenAt, new Date().toISOString());
  } catch {
    // ignore
  }
}

export function getLastOpenAt(): string | null {
  if (!canUseStorage()) {
    return null;
  }
  return window.localStorage.getItem(KEYS.lastOpenAt);
}
