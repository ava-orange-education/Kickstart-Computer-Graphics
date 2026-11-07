// geometry.js
export const positions = new Float32Array([
    -1, -1,  1,
    1, -1,  1,
    1,  1,  1,
    -1,  1,  1,
    -1, -1, -1,
    -1,  1, -1,
    1,  1, -1,
    1, -1, -1,
]);

export const colors = new Float32Array([
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1,
    1, 1, 0, 1,
    1, 0, 1, 1,
    0, 1, 1, 1,
    0.5, 0.5, 0.5, 1,
    1, 1, 1, 1,
]);

export const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
    0, 3, 5,  0, 5, 4,
    1, 7, 6,  1, 6, 2,
    3, 2, 6,  3, 6, 5,
    0, 4, 7,  0, 7, 1,
]);