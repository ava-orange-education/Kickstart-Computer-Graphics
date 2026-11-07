import { vertexShaderSource, fragmentShaderSource } from './shaders.js';
import { compileShader, createProgram } from './shaderUtils.js';
import { positions, colors, indices } from './geometry.js';

window.onload = () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error('WebGL 2 not supported');
        return;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    function enableAttribute(buffer, location, size) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    }

    let rotation = [0, 0, 0];
    let lastTime = 0;

    function drawScene(time) {
        time *= 0.001;
        const deltaTime = time - lastTime;
        lastTime = time;

        rotation[0] += deltaTime;
        rotation[1] += deltaTime;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(program);

        enableAttribute(positionBuffer, positionLocation, 3);
        enableAttribute(colorBuffer, colorLocation, 4);

        const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
        const projectionMatrix = mat4.perspective(mat4.create(), Math.PI / 4, aspect, 0.1, 100);
        const viewMatrix = mat4.lookAt(mat4.create(), [0, 0, -6], [0, 0, 0], [0, 1, 0]);
        const modelMatrix = mat4.create();
        mat4.rotateX(modelMatrix, modelMatrix, rotation[0]);
        mat4.rotateY(modelMatrix, modelMatrix, rotation[1]);

        const matrix = mat4.multiply(mat4.create(), projectionMatrix, mat4.multiply(mat4.create(), viewMatrix, modelMatrix));
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(drawScene);
    }

    requestAnimationFrame(drawScene);
};