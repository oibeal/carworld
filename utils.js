/**
 * Performs linear interpolation (lerp) between two values A and B.
 * @param {number} A - The starting value.
 * @param {number} B - The ending value.
 * @param {number} t - The interpolation parameter, typically between 0 and 1.
 * @returns {number} The interpolated value between A and B.
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}

/**
 * Finds the intersection point of two line segments AB and CD, if it exists.
 * @param {Object} A - The first endpoint of the first line segment, represented as an object with 'x' and 'y' properties.
 * @param {Object} B - The second endpoint of the first line segment, represented as an object with 'x' and 'y' properties.
 * @param {Object} C - The first endpoint of the second line segment, represented as an object with 'x' and 'y' properties.
 * @param {Object} D - The second endpoint of the second line segment, represented as an object with 'x' and 'y' properties.
 * @returns {Object|null} The intersection point as an object with 'x' and 'y' properties, or null if no intersection exists.
 */
function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom !== 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );

            if (touch) {
                return true;
            }
        }
    }

    return false;
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return `rgba(${R},${G},${B},${alpha})`;
}

function getRandomColor() {
    const hue = 15 + Math.random() * 325;
    const saturation = 40 + Math.random() * 60;
    const lightness = 30 + Math.random() * 60;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}