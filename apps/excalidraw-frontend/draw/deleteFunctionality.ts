import { Shape } from "./Game";
export function isPointInsideDiamond(px: number, py: number, shape: { centerX: number, centerY: number, width: number, height: number }): boolean {
    const { centerX, centerY, width, height } = shape;
    
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const vertices = [
        { x: centerX, y: centerY - halfHeight },  // Top
        { x: centerX + halfWidth, y: centerY },  // Right
        { x: centerX, y: centerY + halfHeight },  // Bottom
        { x: centerX - halfWidth, y: centerY }   // Left
    ];

    return isPointInsidePolygon(px, py, vertices);
}

// Check if point is near a line (used for line and arrow)
export function isPointNearLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number, threshold = 5): boolean {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = len_sq !== 0 ? dot / len_sq : -1;

    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy) <= threshold;
}

// Check if point is near a pencil-drawn path
export function isPointNearPencilPath(px: number, py: number, points: { x: number, y: number }[], threshold = 5): boolean {
    for (let i = 0; i < points.length - 1; i++) {
        if (isPointNearLine(px, py, points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, threshold)) {
            return true;
        }
    }
    return false;
}
export function isPointInsidePolygon(px: number, py: number, vertices: { x: number, y: number }[]): boolean {
    let count = 0;
    const n = vertices.length;

    for (let i = 0; i < n; i++) {
        const v1 = vertices[i];
        const v2 = vertices[(i + 1) % n];

        if ((v1.y > py) !== (v2.y > py) &&
            px < ((v2.x - v1.x) * (py - v1.y)) / (v2.y - v1.y) + v1.x) {
            count++;
        }
    }
    
    return count % 2 === 1; // Odd number of intersections means inside
}