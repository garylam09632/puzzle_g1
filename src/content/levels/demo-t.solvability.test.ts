import { describe, expect, it } from "vitest";
import {
  DEMO_T_LEVEL,
  getLevelById,
  getLevelForDifficulty,
  getLevelsByDifficulty,
  LEVELS,
} from "@/content/levels";
import { isPuzzleSolved } from "@/lib/t-puzzle";

describe("easy-demo-t level pack", () => {
  it("is registered with required schema fields", () => {
    expect(LEVELS.map((level) => level.id)).toContain("easy-demo-t");
    expect(DEMO_T_LEVEL.id).toBe("easy-demo-t");
    expect(DEMO_T_LEVEL.difficulty).toBe("easy");
    expect(DEMO_T_LEVEL.targetMask.length).toBeGreaterThan(0);
    expect(DEMO_T_LEVEL.targetOutline.length).toBeGreaterThan(2);
    expect(DEMO_T_LEVEL.pieces.length).toBeGreaterThan(0);
    expect(DEMO_T_LEVEL.solution.length).toBe(DEMO_T_LEVEL.pieces.length);
  });

  it("resolves from the catalog for Easy (and interim Classic tiers)", () => {
    expect(getLevelById("easy-demo-t")?.id).toBe("easy-demo-t");
    expect(getLevelsByDifficulty("easy")[0]?.id).toBe("easy-demo-t");
    expect(getLevelForDifficulty("easy").id).toBe("easy-demo-t");
    // Stage 02a interim: Medium/Hard/Expert also deal the demo T pack entry.
    expect(getLevelForDifficulty("medium").id).toBe("easy-demo-t");
    expect(getLevelForDifficulty("hard").id).toBe("easy-demo-t");
    expect(getLevelForDifficulty("expert").id).toBe("easy-demo-t");
  });

  it("has a known solution that passes the solvability checker", () => {
    expect(isPuzzleSolved(DEMO_T_LEVEL.solution, DEMO_T_LEVEL)).toBe(true);
  });

  it("does not treat tray spawns as solved", () => {
    const tray = DEMO_T_LEVEL.rules?.traySpawns;
    expect(tray?.length).toBeGreaterThan(0);
    expect(isPuzzleSolved(tray ?? [], DEMO_T_LEVEL)).toBe(false);
  });
});
