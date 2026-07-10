"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PuzzlePiece } from "@/components/PuzzlePiece";
import {
  normalizeAngleDelta,
  pointerPairAngle,
} from "@/lib/pointer-gesture";
import {
  BOARD_HEIGHT,
  BOARD_PADDING,
  BOARD_WIDTH,
  createInitialPieces,
  isPuzzleSolved,
  normalizeRotation,
  pointsToPolygon,
  T_OUTLINE,
  TRAY_HEIGHT,
  UNIT,
  type PieceId,
  type PieceState,
} from "@/lib/t-puzzle";
import { useFinePointer } from "@/lib/useMediaQuery";

type RotateGestureState = {
  startAngle: number;
  startRotation: number;
  pieceId: PieceId;
  finished: boolean;
};

export function TPuzzleGame() {
  const isFinePointer = useFinePointer();
  const svgRef = useRef<SVGSVGElement>(null);
  const playAgainRef = useRef<HTMLButtonElement>(null);
  const [pieces, setPieces] = useState<PieceState[]>(createInitialPieces);
  const [selectedId, setSelectedId] = useState<PieceId | null>(null);
  const [solved, setSolved] = useState(false);
  const [showSolvedPopup, setShowSolvedPopup] = useState(false);
  const [moves, setMoves] = useState(0);
  const [boardRotating, setBoardRotating] = useState(false);

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

  const boardWidth = BOARD_WIDTH + BOARD_PADDING * 2;
  const boardHeight = BOARD_HEIGHT + BOARD_PADDING * 2 + TRAY_HEIGHT;
  const boardOffsetX = BOARD_PADDING;
  const boardOffsetY = BOARD_PADDING;

  const tOutline = useMemo(
    () =>
      pointsToPolygon(
        T_OUTLINE.map(([x, y]) => [
          x * UNIT + boardOffsetX,
          y * UNIT + boardOffsetY,
        ]),
      ),
    [boardOffsetX, boardOffsetY],
  );

  const updatePiece = (id: PieceId, next: Partial<PieceState>) => {
    setPieces((current) =>
      current.map((piece) => (piece.id === id ? { ...piece, ...next } : piece)),
    );
  };

  const handleSelect = (id: PieceId) => {
    selectedIdRef.current = id;
    setSelectedId(id);
  };

  const checkSolution = (nextPieces: PieceState[]) => {
    if (isPuzzleSolved(nextPieces)) {
      setSolved(true);
      setShowSolvedPopup(true);
    }
  };

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
    setMoves((count) => count + 1);
    setPieces((current) => {
      checkSolution(current);
      return current;
    });
  };

  const beginBoardRotate = () => {
    const pieceId = selectedIdRef.current;
    if (!pieceId || solvedRef.current) {
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
    if (solvedRef.current || showSolvedPopup) {
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
    if (!selectedId || solved) {
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

  const handleFlipSelected = () => {
    if (!selectedId || solved) {
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
    setPieces(createInitialPieces());
    setSelectedId(null);
    setSolved(false);
    setShowSolvedPopup(false);
    setMoves(0);
  };

  const handleDismissSolvedPopup = () => {
    setShowSolvedPopup(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
          T Puzzle
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl">
          Form the letter T
        </h1>
        <p className="mx-auto max-w-2xl text-base text-zinc-600">
          Drag the four pieces onto the faded T outline.{" "}
          {isFinePointer
            ? "Scroll over a selected piece to rotate; double-click to flip. Or select a piece and twist with two fingers anywhere on the board."
            : "Select a piece, then twist with two fingers anywhere on the board to rotate freely; double-tap a selected piece to flip."}{" "}
          Fill the T exactly to win.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRotateSelected}
          disabled={!selectedId || solved}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Rotate selected
        </button>
        <button
          type="button"
          onClick={handleFlipSelected}
          disabled={!selectedId || solved}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-300"
        >
          Flip selected
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
        >
          Reset puzzle
        </button>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
          Moves: {moves}
        </span>
      </div>

      <div
        className="relative mx-auto rounded-3xl border border-amber-300 bg-[#f7df1e] p-4 shadow-lg"
        style={{ touchAction: "none" }}
        onPointerDownCapture={handleBoardPointerDownCapture}
        onPointerMoveCapture={handleBoardPointerMoveCapture}
        onPointerUpCapture={handleBoardPointerUpCapture}
        onPointerCancelCapture={handleBoardPointerUpCapture}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${boardWidth} ${boardHeight}`}
          className="h-auto w-full max-w-2xl overflow-visible"
          role="img"
          aria-label="T puzzle board"
        >
          <rect
            x={0}
            y={0}
            width={boardWidth}
            height={boardHeight}
            rx={24}
            fill="#f7df1e"
          />
          <polygon
            points={tOutline}
            fill="rgba(255,255,255,0.35)"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={2}
            strokeDasharray="8 6"
          />
          <text
            x={boardOffsetX}
            y={boardOffsetY + BOARD_HEIGHT + 36}
            className="fill-zinc-700 text-[12px] font-medium"
          >
            Drag pieces from the tray below into the T.
          </text>
          {pieces.map((piece) => (
            <PuzzlePiece
              key={piece.id}
              svgRef={svgRef}
              piece={piece}
              selected={selectedId === piece.id}
              disabled={solved}
              boardRotating={boardRotating}
              gestureLockRef={gestureLockRef}
              onSelect={handleSelect}
              onChange={updatePiece}
              onDragEnd={handleDragEnd}
            />
          ))}
        </svg>
      </div>

      {showSolvedPopup ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/45 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={handleDismissSolvedPopup}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="solved-title"
            aria-describedby="solved-description"
            className="solved-popup w-full max-w-sm rounded-3xl border border-amber-200 bg-white px-6 py-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
              Puzzle complete
            </p>
            <h2
              id="solved-title"
              className="mt-3 text-3xl font-bold tracking-tight text-zinc-900"
            >
              You solved it!
            </h2>
            <p id="solved-description" className="mt-2 text-sm text-zinc-600">
              The four pieces form a perfect T in{" "}
              <span className="font-semibold text-zinc-800">{moves}</span> moves.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                ref={playAgainRef}
                type="button"
                onClick={handleReset}
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Play again
              </button>
              <button
                type="button"
                onClick={handleDismissSolvedPopup}
                className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
              >
                Keep viewing
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-2xl gap-3 text-sm text-zinc-600 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">How to play</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Click a piece to select it.</li>
            <li>Drag pieces over the faded T guide.</li>
            {isFinePointer ? (
              <>
                <li>Scroll over a selected piece to rotate in 90° steps.</li>
                <li>
                  Select a piece, then twist with two fingers anywhere on the
                  board to rotate freely.
                </li>
                <li>Double-click a selected piece to flip it.</li>
              </>
            ) : (
              <>
                <li>
                  Select a piece, then twist with two fingers anywhere on the
                  board; release to keep the angle.
                </li>
                <li>Double-tap a selected piece to flip it.</li>
              </>
            )}
            <li>Or use the Rotate / Flip buttons as shortcuts.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">About the puzzle</h2>
          <p className="mt-2">
            The T Puzzle uses four polygons — one triangle, two trapezoids, and a
            notched pentagon — to build a symmetric capital T. It looks easy, but the
            unusual pentagon piece makes it surprisingly tricky.
          </p>
        </div>
      </section>
    </div>
  );
}
