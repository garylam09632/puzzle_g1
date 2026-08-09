"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  type Difficulty,
} from "@/lib/difficulty";
import { touchLastOpen } from "@/lib/storage";

export function HomeScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [showDailySoon, setShowDailySoon] = useState(false);

  useEffect(() => {
    touchLastOpen();
  }, []);

  return (
    <div className="app-atmosphere relative min-h-full overflow-hidden">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[72vh] opacity-90"
      >
        <svg
          viewBox="0 0 400 480"
          className="absolute left-1/2 top-[8%] h-[min(68vh,520px)] w-auto -translate-x-1/2 text-[var(--ink)]"
        >
          <defs>
            <linearGradient id="silFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1c1914" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#3a342c" stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <path
            d="M70 70h260v70H250v240H150V140H70z"
            fill="url(#silFill)"
            opacity="0.9"
          />
          <path
            d="M95 300l45-35 50 20 55-45 40 55-70 40-55-10z"
            fill="var(--board)"
            opacity="0.55"
          />
          <path
            d="M210 210l70 10 10 55-55 30-40-25z"
            fill="var(--accent)"
            opacity="0.45"
          />
        </svg>
      </div>

      <main className="safe-pad relative z-10 mx-auto flex min-h-full w-full max-w-lg flex-col justify-between px-5 pb-8 pt-10 sm:pt-14">
        <div className="hero-rise space-y-4 pt-[38vh] sm:pt-[42vh]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-deep)]">
            Silhouette packing
          </p>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-[var(--ink)] sm:text-6xl">
            Form Fit
          </h1>
          <p className="max-w-md text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            Fit every piece into the shape. Pick a difficulty, or come back for
            tomorrow&apos;s daily.
          </p>
        </div>

        <div className="hero-rise-delay mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="rounded-2xl bg-[var(--ink)] px-5 py-3.5 text-center text-base font-semibold text-[#f7f3ea] transition hover:bg-[#2c261e]"
          >
            Play
          </button>
          <button
            type="button"
            onClick={() => setShowDailySoon(true)}
            className="rounded-2xl border border-[var(--ink)]/15 bg-[var(--surface)] px-5 py-3.5 text-center text-base font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]/30"
          >
            Daily
          </button>
        </div>
      </main>

      {showPicker ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-[var(--ink)]/40 p-4 backdrop-blur-[2px] sm:items-center"
          role="presentation"
          onClick={() => setShowPicker(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="difficulty-title"
            className="safe-pad w-full max-w-md rounded-3xl border border-[var(--ink)]/10 bg-[#f7fbfb] p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-deep)]">
              Classic
            </p>
            <h2
              id="difficulty-title"
              className="font-display mt-2 text-2xl font-semibold text-[var(--ink)]"
            >
              Choose difficulty
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              All tiers open the demo silhouette for now.
            </p>
            <ul className="mt-5 grid gap-2">
              {DIFFICULTIES.map((difficulty: Difficulty) => (
                <li key={difficulty}>
                  <Link
                    href={`/play/${difficulty}/`}
                    className="flex items-center justify-between rounded-2xl border border-[var(--ink)]/10 bg-white px-4 py-3 text-[var(--ink)] transition hover:border-[var(--accent)]/50 hover:bg-[#eef7f5]"
                  >
                    <span className="font-semibold">
                      {DIFFICULTY_LABELS[difficulty]}
                    </span>
                    <span className="text-sm text-[var(--ink-muted)]">Play</span>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {showDailySoon ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--ink)]/40 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={() => setShowDailySoon(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-soon-title"
            className="w-full max-w-sm rounded-3xl border border-[var(--ink)]/10 bg-[#f7fbfb] px-6 py-7 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-deep)]">
              Daily challenge
            </p>
            <h2
              id="daily-soon-title"
              className="font-display mt-3 text-2xl font-semibold text-[var(--ink)]"
            >
              Coming soon
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">
              One featured puzzle each day, with archive and streaks — landing
              in a later update.
            </p>
            <button
              type="button"
              onClick={() => setShowDailySoon(false)}
              className="mt-6 rounded-2xl bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[#f7f3ea]"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
