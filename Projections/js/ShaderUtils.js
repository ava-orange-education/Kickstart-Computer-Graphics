class ShaderProgram {
  constructor(gl, vsSource, fsSource) {
    this.gl = gl;
    this.program = this.initShaderProgram(vsSource, fsSource);
    this.attribLocations = {
      vertexPosition: gl.getAttribLocation(this.program, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(this.program, 'aVertexColor'),
    };
    this.uniformLocations = {
      projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(this.program, 'uModelViewMatrix'),
    };
  }

  initShaderProgram(vsSource, fsSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  use() {
    this.gl.useProgram(this.program);
  }
}
