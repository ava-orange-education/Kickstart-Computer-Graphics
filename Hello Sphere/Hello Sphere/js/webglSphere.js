function createSphere(radius, segments) {
  const vertices = [];

  for (let latNumber = 0; latNumber <= segments; latNumber++) {
    var theta = latNumber * Math.PI / segments;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    var thetaNext = (latNumber + 1) * Math.PI / segments;
    var sinThetaNext = Math.sin(thetaNext);
    var cosThetaNext = Math.cos(thetaNext);

    for (let longNumber = 0; longNumber <= segments; longNumber++) {
      var phi = longNumber * 2 * Math.PI / segments;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var phiNext = (longNumber + 1) * 2 * Math.PI / segments;
      var sinPhiNext = Math.sin(phiNext);
      var cosPhiNext = Math.cos(phiNext);

      var x = cosPhi * sinTheta;
      var y = cosTheta * cosPhi;
      var z = sinPhi;

      var xNext = cosPhiNext * sinTheta;
      var yNext = cosTheta * cosPhiNext;
      var zNext = sinPhiNext;

      var xNextNext = cosPhiNext * sinThetaNext;
      var yNextNext = cosThetaNext * cosPhiNext;
      var zNextNext = sinPhiNext;

      var xNextDown = cosPhi * sinThetaNext;
      var yNextDown = cosThetaNext * cosPhi;
      var zNextDown = sinPhi;

      // First triangle
      vertices.push(radius * x); vertices.push(radius * y); vertices.push(radius * z);
      vertices.push(radius * xNext); vertices.push(radius * yNext); vertices.push(radius * zNext);
      vertices.push(radius * xNextNext); vertices.push(radius * yNextNext); vertices.push(radius * zNextNext);

      // Second triangle
      vertices.push(radius * x); vertices.push(radius * y); vertices.push(radius * z);
      vertices.push(radius * xNextNext); vertices.push(radius * yNextNext); vertices.push(radius * zNextNext);
      vertices.push(radius * xNextDown); vertices.push(radius * yNextDown); vertices.push(radius * zNextDown);
    }
  }

  return vertices;
}


function main() {
  const canvas = document.getElementById('webglCanvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  // Sphere data
  const radius = 1;
  const segments = 20;
  const sphereVertices = createSphere(radius, segments);

  // Create and bind the vertex buffer
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);

  // Write the vertex shader
  var vertCode = `
        attribute vec3 coordinates;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
        }
    `;
  var vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertCode);
  gl.compileShader(vertShader);

  // Write the fragment shader
  var fragCode = `
        void main(void) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.50);
        }
    `;
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragCode);
  gl.compileShader(fragShader);

  // Create and use the shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertShader);
  gl.attachShader(shaderProgram, fragShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  // Associate shaders to buffer objects
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coord);

  // Draw the sphere
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, sphereVertices.length / 3);
}

window.onload = main;
