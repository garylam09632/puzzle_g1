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
};

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
  selected,
  disabled,
  svgRef,
  onSelect,
  onChange,
  onDragEnd,
}: PuzzlePieceProps) {
  const dragRef = useRef<DragState | null>(null);
  const definition = getPieceDefinition(piece.id);
  const transformedPoints = getTransformedPoints(piece);
  const polygon = pointsToPolygon(transformedPoints);

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
    onSelect(piece.id);

    const [pointerX, pointerY] = clientToSvg(svg, event.clientX, event.clientY);
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: pointerX - piece.x,
      offsetY: pointerY - piece.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<SVGPolygonElement>) => {
    const drag = dragRef.current;
    const svg = svgRef.current;

    if (!drag || !svg || drag.pointerId !== event.pointerId) {
      return;
    }

    const [pointerX, pointerY] = clientToSvg(svg, event.clientX, event.clientY);
    onChange(piece.id, {
      x: pointerX - drag.offsetX,
      y: pointerY - drag.offsetY,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<SVGPolygonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onDragEnd();
  };

  const handleDoubleClick = () => {
    if (disabled) {
      return;
    }

    onSelect(piece.id);
    onChange(piece.id, {
      rotation: normalizeRotation(piece.rotation + 90),
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
