// Initialize WebGL context
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  alert("WebGL not supported, falling back on experimental-webgl");
  gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
  alert("Your browser does not support WebGL");
}

// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    varying lowp vec4 vColor;
    void main(void) {
        gl_Position = aVertexPosition;
        vColor = aVertexColor;
    }
`;

// Fragment shader program
const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
        gl_FragColor = vColor;
    }
`;

// Compile shaders
const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

// Link shaders to create our program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
}


// Define the positions and colors for a triangle
const positions = new Float32Array([
  0.0,  1.0, 0,
  -1.0, -1.0, 0,
  1.0, -1.0, 0
]);

const colors = new Float32Array([
  1.0,  0.0,  0.0,  1.0,    // Red
  0.0,  1.0,  0.0,  1.0,    // Green
  0.0,  0.0,  1.0,  1.0,    // Blue
]);
const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
const vertexColor = gl.getAttribLocation(shaderProgram, 'aVertexColor');

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Use the shader program
gl.useProgram(shaderProgram);
// Create and bind buffers
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

// Clear the canvas


// Bind the position buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexPosition);

// Bind the color buffer
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vertexColor);

// Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);

// Helper function to compile shaders
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
