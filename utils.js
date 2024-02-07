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