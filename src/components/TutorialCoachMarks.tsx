"use client";

import { useState } from "react";

const STEPS = [
  {
    title: "Select a piece",
    body: "Tap or click a piece in the tray to select it.",
  },
  {
    title: "Drag into the shape",
    body: "Drag the selected piece onto the faded silhouette outline.",
  },
  {
    title: "Rotate or flip",
    body: "Use Rotate / Flip, or twist with two fingers / double-tap to flip.",
  },
] as const;

type TutorialCoachMarksProps = {
  onComplete: () => void;
};

export function TutorialCoachMarks({ onComplete }: TutorialCoachMarksProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  const finish = () => {
    onComplete();
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    setStep((value) => value + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--ink)]/45 p-4 backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="w-full max-w-sm rounded-3xl border border-[var(--ink)]/10 bg-[#f7fbfb] px-5 py-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-deep)]">
          Tutorial · {step + 1} / {STEPS.length}
        </p>
        <h2
          id="tutorial-title"
          className="font-display mt-2 text-2xl font-semibold text-[var(--ink)]"
        >
          {current.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
          {current.body}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={finish}
            className="flex-1 rounded-2xl border border-[var(--ink)]/15 px-4 py-2.5 text-sm font-medium text-[var(--ink-muted)]"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={next}
            className="flex-1 rounded-2xl bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-[#f7f3ea]"
          >
            {isLast ? "Start playing" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
