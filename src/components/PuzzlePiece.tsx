"use client";

import { useEffect, useRef } from "react";
import {
  getPieceDefinition,
  getTransformedPoints,
  normalizeRotation,
  pointsToPolygon,
  UNIT,
  type PieceDefinition,
  type PieceState,
} from "@/lib/t-puzzle";
import { useFinePointer } from "@/lib/useMediaQuery";

type PuzzlePieceProps = {
  piece: PieceState;
  definitions: PieceDefinition[];
  selected: boolean;
  disabled: boolean;
  boardRotating: boolean;
  gestureLockRef: React.RefObject<{ rotating: boolean }>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onSelect: (id: PieceState["id"]) => void;
  onChange: (id: PieceState["id"], next: Partial<PieceState>) => void;
  onDragEnd: () => void;
};

type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
};

type TapState = {
  time: number;
  x: number;
  y: number;
};

const MOVE_THRESHOLD_PX = 10;
const DOUBLE_TAP_MS = 300;

function clientToSvg(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): [number, number] {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();

  if (!matrix) {
    return [0, 0];
  }

  const transformed = point.matrixTransform(matrix.inverse());
  return [transformed.x, transformed.y];
}

export function PuzzlePiece({
  piece,
  definitions,
  selected,
  disabled,
  boardRotating,
  gestureLockRef,
  svgRef,
  onSelect,
  onChange,
  onDragEnd,
}: PuzzlePieceProps) {
  const isFinePointer = useFinePointer();
  const dragRef = useRef<DragState | null>(null);
  const movedDuringGestureRef = useRef(false);
  const wasSelectedOnPointerDownRef = useRef(false);
  const lastTapRef = useRef<TapState | null>(null);

  const definition = getPieceDefinition(definitions, piece.id);
  const transformedPoints = getTransformedPoints(piece, definitions);
  const polygon = pointsToPolygon(transformedPoints);

  useEffect(() => {
    if (boardRotating) {
      dragRef.current = null;
    }
  }, [boardRotating]);

  const handlePointerDown = (event: React.PointerEvent<SVGPolygonElement>) => {
    if (disabled || gestureLockRef.current?.rotating) {
      return;
    }

    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    wasSelectedOnPointerDownRef.current = selected;
    onSelect(piece.id);

    // Second finger may have just started a board-level twist in capture phase.
    if (gestureLockRef.current?.rotating) {
      return;
    }

    const [pointerX, pointerY] = clientToSvg(svg, event.clientX, event.clientY);
    movedDuringGestureRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: pointerX - piece.x,
      offsetY: pointerY - piece.y,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<SVGPolygonElement>) => {
    if (gestureLockRef.current?.rotating) {
      dragRef.current = null;
      return;
    }

    const drag = dragRef.current;
    const svg = svgRef.current;

    if (!drag || !svg || drag.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.hypot(dx, dy) > MOVE_THRESHOLD_PX) {
      movedDuringGestureRef.current = true;
    }

    const [pointerX, pointerY] = clientToSvg(svg, event.clientX, event.clientY);
    onChange(piece.id, {
      x: pointerX - drag.offsetX,
      y: pointerY - drag.offsetY,
    });
  };

  const handleMobileDoubleTapFlip = (clientX: number, clientY: number) => {
    if (
      isFinePointer ||
      !wasSelectedOnPointerDownRef.current ||
      movedDuringGestureRef.current ||
      gestureLockRef.current?.rotating
    ) {
      return;
    }

    const now = Date.now();
    const lastTap = lastTapRef.current;
    if (
      lastTap &&
      now - lastTap.time <= DOUBLE_TAP_MS &&
      Math.hypot(clientX - lastTap.x, clientY - lastTap.y) <= MOVE_THRESHOLD_PX
    ) {
      onChange(piece.id, { flipped: !piece.flipped });
      onDragEnd();
      lastTapRef.current = null;
      return;
    }

    lastTapRef.current = { time: now, x: clientX, y: clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<SVGPolygonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!gestureLockRef.current?.rotating) {
      handleMobileDoubleTapFlip(event.clientX, event.clientY);
    }

    if (movedDuringGestureRef.current && !gestureLockRef.current?.rotating) {
      onDragEnd();
    }
  };

  const handleWheel = (event: React.WheelEvent<SVGPolygonElement>) => {
    if (disabled || !isFinePointer || !selected) {
      return;
    }

    event.preventDefault();
    const delta = event.deltaY < 0 ? 90 : -90;
    onChange(piece.id, {
      rotation: normalizeRotation(piece.rotation + delta),
    });
    onDragEnd();
  };

  const handleDoubleClick = () => {
    if (disabled || !isFinePointer || movedDuringGestureRef.current) {
      return;
    }

    onSelect(piece.id);
    onChange(piece.id, {
      flipped: !piece.flipped,
    });
    onDragEnd();
  };

  const labelX = piece.x;
  const labelY = piece.y - UNIT * 0.15;

  return (
    <g>
      <polygon
        points={polygon}
        fill={definition.color}
        stroke={selected ? "#f5c400" : "#111111"}
        strokeWidth={selected ? 3 : 1.5}
        className={disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      />
      {selected ? (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          className="pointer-events-none select-none fill-zinc-700 text-[10px] font-medium"
        >
          {definition.name}
        </text>
      ) : null}
    </g>
  );
}
