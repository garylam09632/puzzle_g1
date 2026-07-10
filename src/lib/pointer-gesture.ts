/** Angle of the line between two pointers, in degrees. */
export function pointerPairAngle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): number {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

export function normalizeAngleDelta(degrees: number): number {
  let delta = degrees;
  while (delta > 180) {
    delta -= 360;
  }
  while (delta < -180) {
    delta += 360;
  }
  return delta;
}
