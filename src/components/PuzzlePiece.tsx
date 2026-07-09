"use client";

import { useRef } from "react";
import {
  getPieceDefinition,
  getTransformedPoints,
  normalizeRotation,
  pointsToPolygon,
  UNIT,
  type PieceState,
} from "@/lib/t-puzzle";
import { useFinePointer } from "@/lib/useMediaQuery";

type PuzzlePieceProps = {
  piece: PieceState;
  selected: boolean;
  disabled: boolean;
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

type RotateGestureState = {
  startAngle: number;
  startRotation: number;
  finished: boolean;
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

/** Angle of the line between two pointers, in degrees. */
function pointerPairAngle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): number {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

function normalizeAngleDelta(degrees: number): number {
  let delta = degrees;
  while (delta > 180) {
    delta -= 360;
  }
  while (delta < -180) {
    delta += 360;
  }
  return delta;
}

export function PuzzlePiece({
  piece,
  selected,
  disabled,
  svgRef,
  onSelect,
  onChange,
  onDragEnd,
}: PuzzlePieceProps) {
  const isFinePointer = useFinePointer();
  const dragRef = useRef<DragState | null>(null);
  const movedDuringGestureRef = useRef(false);
  const wasSelectedOnPointerDownRef = useRef(false);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const rotateGestureRef = useRef<RotateGestureState | null>(null);
  const rotatedThisGestureRef = useRef(false);
  const lastTapRef = useRef<TapState | null>(null);

  const definition = getPieceDefinition(piece.id);
  const transformedPoints = getTransformedPoints(piece);
  const polygon = pointsToPolygon(transformedPoints);

  const beginRotateGesture = () => {
    const pointers = Array.from(activePointersRef.current.values());
    if (pointers.length < 2) {
      return;
    }

    dragRef.current = null;
    rotateGestureRef.current = {
      startAngle: pointerPairAngle(pointers[0], pointers[1]),
      startRotation: piece.rotation,
      finished: false,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<SVGPolygonElement>) => {
    if (disabled) {
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

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    // Instagram Stories-style: two fingers on a piece starts free twist rotate.
    if (activePointersRef.current.size === 2) {
      beginRotateGesture();
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
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    if (activePointersRef.current.has(event.pointerId)) {
      activePointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    }

    const rotateGesture = rotateGestureRef.current;
    if (rotateGesture && activePointersRef.current.size >= 2) {
      event.preventDefault();
      const pointers = Array.from(activePointersRef.current.values());
      const currentAngle = pointerPairAngle(pointers[0], pointers[1]);
      const delta = normalizeAngleDelta(currentAngle - rotateGesture.startAngle);
      onChange(piece.id, {
        rotation: normalizeRotation(rotateGesture.startRotation + delta),
      });
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
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

  const finishRotateGesture = () => {
    const rotateGesture = rotateGestureRef.current;
    if (!rotateGesture || rotateGesture.finished) {
      return;
    }

    // Keep the free angle at release — no snap to 90°.
    rotateGesture.finished = true;
    rotatedThisGestureRef.current = true;
    onDragEnd();
  };

  const handleMobileDoubleTapFlip = (clientX: number, clientY: number) => {
    if (
      isFinePointer ||
      !wasSelectedOnPointerDownRef.current ||
      movedDuringGestureRef.current ||
      rotatedThisGestureRef.current
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
    const hadRotateGesture = rotateGestureRef.current !== null;
    activePointersRef.current.delete(event.pointerId);

    if (hadRotateGesture && activePointersRef.current.size < 2) {
      finishRotateGesture();
      rotateGestureRef.current = null;
    }

    if (activePointersRef.current.size === 0) {
      rotatedThisGestureRef.current = false;
    }

    const drag = dragRef.current;
    if (drag && drag.pointerId === event.pointerId) {
      dragRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);

      if (!hadRotateGesture) {
        handleMobileDoubleTapFlip(event.clientX, event.clientY);
      }

      if (movedDuringGestureRef.current) {
        onDragEnd();
      }
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
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
