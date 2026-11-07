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

export function createSphere(radius, latitudeBands, longitudeBands) {
  const positions = [];
  const normals = [];
  const indices = [];

  for (let lat = 0; lat <= latitudeBands; ++lat) {
    const theta = (lat * Math.PI) / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longitudeBands; ++lon) {
      const phi = (lon * 2 * Math.PI) / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      normals.push(x, y, z);
      positions.push(radius * x, radius * y, radius * z);
    }
  }

  for (let lat = 0; lat < latitudeBands; ++lat) {
    for (let lon = 0; lon < longitudeBands; ++lon) {
      const first = lat * (longitudeBands + 1) + lon;
      const second = first + longitudeBands + 1;

      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  return { positions, normals, indices };
}
