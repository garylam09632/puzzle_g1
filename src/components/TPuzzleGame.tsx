"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { PuzzlePiece } from "@/components/PuzzlePiece";
import { TutorialCoachMarks } from "@/components/TutorialCoachMarks";
import {
  DIFFICULTY_LABELS,
  type Difficulty,
} from "@/lib/difficulty";
import {
  normalizeAngleDelta,
  pointerPairAngle,
} from "@/lib/pointer-gesture";
import {
  getBests,
  getSettings,
  isTutorialCompleted,
  markTutorialDone,
  recordStart,
  recordWin,
  setSettings,
  type DifficultyBests,
} from "@/lib/storage";
import type { LevelDefinition } from "@/lib/level-schema";
import {
  BOARD_PADDING,
  createInitialPieces,
  getMaskPixelSize,
  isPuzzleSolved,
  normalizeRotation,
  pointsToPolygon,
  TRAY_HEIGHT,
  UNIT,
  type PieceId,
  type PieceState,
} from "@/lib/t-puzzle";

type RotateGestureState = {
  startAngle: number;
  startRotation: number;
  pieceId: PieceId;
  finished: boolean;
};

type TPuzzleGameProps = {
  difficulty: Difficulty;
  level: LevelDefinition;
};

let storageEpoch = 0;
const storageListeners = new Set<() => void>();

function emitStorageChange() {
  storageEpoch += 1;
  for (const listener of storageListeners) {
    listener();
  }
}

function subscribeStorage(onStoreChange: () => void) {
  storageListeners.add(onStoreChange);
  return () => {
    storageListeners.delete(onStoreChange);
  };
}

function getStorageEpoch() {
  return storageEpoch;
}

export function TPuzzleGame({ difficulty, level }: TPuzzleGameProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const playAgainRef = useRef<HTMLButtonElement>(null);
  const winRecordedRef = useRef(false);
  const startRecordedFor = useRef<Difficulty | null>(null);
  const [pieces, setPieces] = useState<PieceState[]>(() =>
    createInitialPieces(level),
  );
  const [selectedId, setSelectedId] = useState<PieceId | null>(null);
  const [solved, setSolved] = useState(false);
  const [showSolvedPopup, setShowSolvedPopup] = useState(false);
  const [moves, setMoves] = useState(0);
  const [boardRotating, setBoardRotating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [winBests, setWinBests] = useState<DifficultyBests | null>(null);

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  useSyncExternalStore(subscribeStorage, getStorageEpoch, () => 0);
  const soundEnabled = isClient ? getSettings().soundEnabled : true;
  const tutorialDone = isClient ? isTutorialCompleted() : true;
  const showTutorial = isClient && !tutorialDone && !tutorialDismissed;
  const tierBests = winBests ?? (isClient ? getBests()[difficulty] : { wins: 0, starts: 0 });

  const piecesRef = useRef(pieces);
  const selectedIdRef = useRef(selectedId);
  const solvedRef = useRef(solved);
  const gestureLockRef = useRef({ rotating: false });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(
    new Map(),
  );
  const rotateGestureRef = useRef<RotateGestureState | null>(null);

  useEffect(() => {
    piecesRef.current = pieces;
  }, [pieces]);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    solvedRef.current = solved;
  }, [solved]);

  useEffect(() => {
    if (startRecordedFor.current === difficulty) {
      return;
    }
    startRecordedFor.current = difficulty;
    recordStart(difficulty);
    emitStorageChange();
  }, [difficulty]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const { width: maskWidth, height: maskHeight } = getMaskPixelSize(
    level.targetMask,
  );
  const boardWidth = maskWidth + BOARD_PADDING * 2;
  const boardHeight = maskHeight + BOARD_PADDING * 2 + TRAY_HEIGHT;
  const boardOffsetX = BOARD_PADDING;
  const boardOffsetY = BOARD_PADDING;

  const targetOutline = useMemo(
    () =>
      pointsToPolygon(
        level.targetOutline.map(([x, y]) => [
          x * UNIT + boardOffsetX,
          y * UNIT + boardOffsetY,
        ]),
      ),
    [level.targetOutline, boardOffsetX, boardOffsetY],
  );

  const updatePiece = (id: PieceId, next: Partial<PieceState>) => {
    setPieces((current) =>
      current.map((piece) => (piece.id === id ? { ...piece, ...next } : piece)),
    );
  };

  const handleSelect = (id: PieceId) => {
    if (paused || showTutorial) {
      return;
    }
    selectedIdRef.current = id;
    setSelectedId(id);
  };

  const checkSolution = (nextPieces: PieceState[]) => {
    if (isPuzzleSolved(nextPieces, level)) {
      setSolved(true);
      setShowSolvedPopup(true);
    }
  };

  useEffect(() => {
    if (!solved || !showSolvedPopup || winRecordedRef.current) {
      return;
    }
    winRecordedRef.current = true;
    const result = recordWin(difficulty, moves);
    setWinBests(result.bests[difficulty]);
    setIsNewBest(result.isNewBest);
    emitStorageChange();
  }, [solved, showSolvedPopup, moves, difficulty]);

  useEffect(() => {
    if (!showSolvedPopup) {
      return;
    }

    playAgainRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSolvedPopup(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSolvedPopup]);

  const handleDragEnd = () => {
    if (paused) {
      return;
    }
    setMoves((count) => count + 1);
    setPieces((current) => {
      checkSolution(current);
      return current;
    });
  };

  const beginBoardRotate = () => {
    const pieceId = selectedIdRef.current;
    if (!pieceId || solvedRef.current || paused || showTutorial) {
      return;
    }

    const pointers = Array.from(activePointersRef.current.values());
    if (pointers.length < 2) {
      return;
    }

    const piece = piecesRef.current.find((entry) => entry.id === pieceId);
    if (!piece) {
      return;
    }

    gestureLockRef.current.rotating = true;
    setBoardRotating(true);
    rotateGestureRef.current = {
      startAngle: pointerPairAngle(pointers[0], pointers[1]),
      startRotation: piece.rotation,
      pieceId,
      finished: false,
    };
  };

  const finishBoardRotate = () => {
    const rotateGesture = rotateGestureRef.current;
    if (!rotateGesture || rotateGesture.finished) {
      return;
    }

    rotateGesture.finished = true;
    rotateGestureRef.current = null;
    gestureLockRef.current.rotating = false;
    setBoardRotating(false);
    handleDragEnd();
  };

  const handleBoardPointerDownCapture = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (solvedRef.current || showSolvedPopup || paused || showTutorial) {
      return;
    }

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (
      selectedIdRef.current &&
      activePointersRef.current.size === 2 &&
      !rotateGestureRef.current
    ) {
      event.preventDefault();
      beginBoardRotate();
    }
  };

  const handleBoardPointerMoveCapture = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!activePointersRef.current.has(event.pointerId)) {
      return;
    }

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const rotateGesture = rotateGestureRef.current;
    if (!rotateGesture || activePointersRef.current.size < 2) {
      return;
    }

    event.preventDefault();
    const pointers = Array.from(activePointersRef.current.values());
    const currentAngle = pointerPairAngle(pointers[0], pointers[1]);
    const delta = normalizeAngleDelta(currentAngle - rotateGesture.startAngle);
    updatePiece(rotateGesture.pieceId, {
      rotation: normalizeRotation(rotateGesture.startRotation + delta),
    });
  };

  const handleBoardPointerUpCapture = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const hadRotate = rotateGestureRef.current !== null;
    activePointersRef.current.delete(event.pointerId);

    if (hadRotate && activePointersRef.current.size < 2) {
      finishBoardRotate();
    }
  };

  const handleRotateSelected = () => {
    if (!selectedId || solved || paused) {
      return;
    }

    setMoves((count) => count + 1);
    setPieces((current) => {
      const next = current.map((piece) =>
        piece.id === selectedId
          ? { ...piece, rotation: normalizeRotation(piece.rotation + 90) }
          : piece,
      );
      checkSolution(next);
      return next;
    });
  };

  const allowFlip = level.rules?.allowFlip !== false;

  const handleFlipSelected = () => {
    if (!selectedId || solved || paused || !allowFlip) {
      return;
    }

    setMoves((count) => count + 1);
    setPieces((current) => {
      const next = current.map((piece) =>
        piece.id === selectedId ? { ...piece, flipped: !piece.flipped } : piece,
      );
      checkSolution(next);
      return next;
    });
  };

  const handleReset = () => {
    activePointersRef.current.clear();
    rotateGestureRef.current = null;
    gestureLockRef.current.rotating = false;
    setBoardRotating(false);
    setPieces(createInitialPieces(level));
    setSelectedId(null);
    setSolved(false);
    setShowSolvedPopup(false);
    setMoves(0);
    setPaused(false);
    setIsNewBest(false);
    winRecordedRef.current = false;
    setWinBests(null);
    recordStart(difficulty);
    emitStorageChange();
  };

  const handleDismissSolvedPopup = () => {
    setShowSolvedPopup(false);
  };

  const toggleSound = () => {
    setSettings({ soundEnabled: !soundEnabled });
    emitStorageChange();
  };

  const completeTutorial = () => {
    markTutorialDone();
    setTutorialDismissed(true);
    emitStorageChange();
  };

  const controlsLocked = solved || paused || showTutorial;

  return (
    <div className="safe-pad mx-auto flex w-full max-w-4xl flex-col gap-4 px-3 pb-6 pt-3 sm:gap-5 sm:px-4 sm:pt-5">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl">
            Form Fit
          </p>
          <p className="truncate text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-deep)]">
            {DIFFICULTY_LABELS[difficulty]}
            {level.title ? ` · ${level.title}` : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[var(--board)]/35 px-3 py-1.5 text-sm font-semibold text-[var(--ink)]">
            Moves {moves}
          </span>
          <button
            type="button"
            onClick={() => setPaused(true)}
            className="rounded-full border border-[var(--ink)]/15 bg-[var(--surface)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)]"
          >
            Pause
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleRotateSelected}
          disabled={!selectedId || controlsLocked}
          className="rounded-full bg-[var(--ink)] px-3.5 py-2 text-sm font-medium text-[#f7f3ea] transition hover:bg-[#2c261e] disabled:cursor-not-allowed disabled:bg-[var(--ink)]/25"
        >
          Rotate
        </button>
        <button
          type="button"
          onClick={handleFlipSelected}
          disabled={!selectedId || controlsLocked || !allowFlip}
          className="rounded-full border border-[var(--ink)]/20 bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Flip
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={paused || showTutorial}
          className="rounded-full border border-[var(--ink)]/20 bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/40 disabled:opacity-40"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setToast("Hints arrive in a later update.")}
          disabled={controlsLocked}
          className="rounded-full border border-[var(--ink)]/20 bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/40 disabled:opacity-40"
        >
          Hint
        </button>
        <button
          type="button"
          onClick={() => setToast("Undo arrives in a later update.")}
          disabled={controlsLocked}
          className="rounded-full border border-[var(--ink)]/20 bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/40 disabled:opacity-40"
        >
          Undo
        </button>
      </div>

      <div
        className="relative mx-auto w-full max-w-[min(100%,36rem)] rounded-3xl border border-[var(--board-edge)] bg-[var(--board)] p-3 shadow-[0_18px_40px_rgba(28,25,20,0.12)] sm:p-4"
        style={{ touchAction: "none" }}
        onPointerDownCapture={handleBoardPointerDownCapture}
        onPointerMoveCapture={handleBoardPointerMoveCapture}
        onPointerUpCapture={handleBoardPointerUpCapture}
        onPointerCancelCapture={handleBoardPointerUpCapture}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${boardWidth} ${boardHeight}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Form Fit puzzle board"
        >
          <rect
            x={0}
            y={0}
            width={boardWidth}
            height={boardHeight}
            rx={24}
            fill="#f0c419"
          />
          <polygon
            points={targetOutline}
            fill="rgba(255,255,255,0.35)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            strokeDasharray="8 6"
          />
          <text
            x={boardOffsetX}
            y={boardOffsetY + maskHeight + 36}
            className="fill-[var(--ink)] text-[12px] font-medium opacity-70"
          >
            Tray — drag pieces into the silhouette
          </text>
          {pieces.map((piece) => (
            <PuzzlePiece
              key={piece.id}
              svgRef={svgRef}
              piece={piece}
              definitions={level.pieces}
              selected={selectedId === piece.id}
              disabled={solved || paused || showTutorial}
              boardRotating={boardRotating}
              gestureLockRef={gestureLockRef}
              onSelect={handleSelect}
              onChange={updatePiece}
              onDragEnd={handleDragEnd}
            />
          ))}
        </svg>
      </div>

      {toast ? (
        <div
          className="toast-in fixed bottom-[max(1.25rem,var(--safe-bottom))] left-1/2 z-40 w-[min(90vw,20rem)] -translate-x-1/2 rounded-2xl bg-[var(--ink)] px-4 py-3 text-center text-sm font-medium text-[#f7f3ea] shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}

      {showTutorial ? (
        <TutorialCoachMarks onComplete={completeTutorial} />
      ) : null}

      {paused ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/45 p-4 backdrop-blur-[2px]"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-title"
            className="w-full max-w-sm rounded-3xl border border-[var(--ink)]/10 bg-[#f7fbfb] px-6 py-7 text-center shadow-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-deep)]">
              Paused
            </p>
            <h2
              id="pause-title"
              className="font-display mt-3 text-3xl font-semibold text-[var(--ink)]"
            >
              Take a breath
            </h2>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setPaused(false)}
                className="rounded-2xl bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[#f7f3ea]"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="rounded-2xl border border-[var(--ink)]/15 px-5 py-2.5 text-sm font-medium text-[var(--ink)]"
              >
                Sound: {soundEnabled ? "On" : "Off"}
              </button>
              <Link
                href="/"
                className="rounded-2xl px-5 py-2.5 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {showSolvedPopup ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/45 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={handleDismissSolvedPopup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="solved-title"
            aria-describedby="solved-description"
            className="solved-popup w-full max-w-sm rounded-3xl border border-[var(--board-edge)]/40 bg-[#f7fbfb] px-6 py-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-deep)]">
              {DIFFICULTY_LABELS[difficulty]} clear
            </p>
            <h2
              id="solved-title"
              className="font-display mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]"
            >
              Nice fit!
            </h2>
            <p id="solved-description" className="mt-2 text-sm text-[var(--ink-muted)]">
              Solved in{" "}
              <span className="font-semibold text-[var(--ink)]">{moves}</span>{" "}
              moves
              {isNewBest ? " · New best!" : null}
              {!isNewBest && typeof tierBests.bestMoves === "number"
                ? ` · Best ${tierBests.bestMoves}`
                : null}
              .
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                ref={playAgainRef}
                type="button"
                onClick={handleReset}
                className="rounded-2xl bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[#f7f3ea] transition hover:bg-[#2c261e]"
              >
                Play again
              </button>
              <Link
                href="/"
                className="rounded-2xl border border-[var(--ink)]/15 px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/35"
              >
                Home
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDismissSolvedPopup}
              className="mt-3 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              Keep viewing
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
