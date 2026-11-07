import { vertexShaderFlat, fragmentShaderFlat, vertexShaderPhong, fragmentShaderPhong } from './shaders.js';
import { createShader, createProgram } from './shaderUtils.js';
import { initSphere } from './geometryUtils.js';

const canvas = document.querySelector('#glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL not supported!');
}
gl.viewport(0, 0, canvas.width, canvas.height);

const shaderPrograms = {
  flat: { vertex: vertexShaderFlat, fragment: fragmentShaderFlat },
  phong: { vertex: vertexShaderPhong, fragment: fragmentShaderPhong },
};

let currentShader = 'phong';
let program;

function setupShaders() {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, shaderPrograms[currentShader].vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderPrograms[currentShader].fragment);
  program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
}

function renderSphere(sphere) {

  gl.clearColor(1.0, 1.0, 1.0, 1.0); // Black background

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  const positionLocation = gl.getAttribLocation(program, 'aPosition');
  gl.bindBuffer(gl.ARRAY_BUFFER, sphere.position);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLocation);

  const normalLocation = gl.getAttribLocation(program, 'aNormal');
  gl.bindBuffer(gl.ARRAY_BUFFER, sphere.normal);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLocation);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.indices);

  const modelViewMatrix = mat4.create();
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);
  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]);

  const modelViewMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');
  const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');

  gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

  const lightPositionLocation = gl.getUniformLocation(program, 'uLightPosition');
  const viewPositionLocation = gl.getUniformLocation(program, 'uViewPosition');
  gl.uniform3fv(lightPositionLocation, [5.0, 5.0, 5.0]); // Example light position
  gl.uniform3fv(viewPositionLocation, [0.0, 0.0, 5.0]); // Example camera position


  gl.drawElements(gl.TRIANGLES, sphere.vertexCount, gl.UNSIGNED_SHORT, 0);
}

const sphere = initSphere(gl);
setupShaders();
renderSphere(sphere);

const dropdown = document.querySelector('#shadingDropdown');
dropdown.addEventListener('change', (event) => {
  currentShader = event.target.value;
  setupShaders();
  renderSphere(sphere);
});
