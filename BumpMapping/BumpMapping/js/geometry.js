import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/esm/index.js';
export function createSphere(gl, radius = 1, latBands = 30, longBands = 30, program) {
  const positions = [];
  const normals = [];
  const texCoords = [];
  const tangents = [];
  const indices = [];

  for (let lat = 0; lat <= latBands; ++lat) {
    const theta = lat * Math.PI / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= longBands; ++lon) {
      const phi = lon * 2 * Math.PI / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      const u = lon / longBands;
      const v = lat / latBands;

      positions.push(radius * x, radius * y, radius * z);
      normals.push(x, y, z);
      texCoords.push(u, v);

      // Tangent (partial derivative w.r.t u): [-sinPhi, 0, cosPhi]
      const tx = -sinPhi;
      const ty = 0;
      const tz = cosPhi;
      tangents.push(tx, ty, tz);
    }
  }

  for (let lat = 0; lat < latBands; ++lat) {
    for (let lon = 0; lon < longBands; ++lon) {
      const first = (lat * (longBands + 1)) + lon;
      const second = first + longBands + 1;
      indices.push(first, second, first + 1);
      indices.push(second, second + 1, first + 1);
    }
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  function createBuffer(data, size, attrLoc) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.vertexAttribPointer(attrLoc, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attrLoc);
  }

  const posLoc = gl.getAttribLocation(program, 'aPosition');
  const normalLoc = gl.getAttribLocation(program, 'aNormal');
  const texLoc = gl.getAttribLocation(program, 'aTexCoord');
  const tangentLoc = gl.getAttribLocation(program, 'aTangent');

  createBuffer(positions, 3, posLoc);
  createBuffer(normals, 3, normalLoc);
  createBuffer(texCoords, 2, texLoc);
  createBuffer(tangents, 3, tangentLoc);

  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return { vao, vertexCount: indices.length };
}
