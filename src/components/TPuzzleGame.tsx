"use client";

import { useMemo, useRef, useState } from "react";
import { PuzzlePiece } from "@/components/PuzzlePiece";
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

export function TPuzzleGame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pieces, setPieces] = useState<PieceState[]>(createInitialPieces);
  const [selectedId, setSelectedId] = useState<PieceId | null>(null);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

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

  const checkSolution = (nextPieces: PieceState[]) => {
    if (isPuzzleSolved(nextPieces)) {
      setSolved(true);
    }
  };

  const handleDragEnd = () => {
    setMoves((count) => count + 1);
    setPieces((current) => {
      checkSolution(current);
      return current;
    });
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
    setPieces(createInitialPieces());
    setSelectedId(null);
    setSolved(false);
    setMoves(0);
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
          Drag the four pieces onto the faded T outline. Double-click a piece or use
          Rotate / Flip to transform it. Fill the T exactly to win.
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

      <div className="relative mx-auto rounded-3xl border border-amber-300 bg-[#f7df1e] p-4 shadow-lg">
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
              onSelect={setSelectedId}
              onChange={updatePiece}
              onDragEnd={handleDragEnd}
            />
          ))}
        </svg>

        {solved ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/35 p-6">
            <div className="rounded-2xl bg-white px-6 py-4 text-center shadow-xl">
              <p className="text-2xl font-bold text-zinc-900">You solved it!</p>
              <p className="mt-1 text-sm text-zinc-600">
                The four pieces form a perfect T in {moves} moves.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <section className="mx-auto grid max-w-2xl gap-3 text-sm text-zinc-600 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold text-zinc-900">How to play</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Click a piece to select it.</li>
            <li>Drag pieces over the faded T guide.</li>
            <li>Rotate or flip pieces until they fit together.</li>
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
