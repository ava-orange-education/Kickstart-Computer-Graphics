import { getWebGLContext, createShader, createProgram } from "./shaderUtils.js";
import {
  pervertexShaderSource,
  perVertexfragmentShaderSource,
  flatVertexShaderSource,
  flatFragmentShaderSource,
  perFragmentVertexShaderSource,
  perFragmentShaderSource
} from "./shaders.js";
//import { flatVertexShaderSource, flatFragmentShaderSource } from "./shaders.js";
import { createSphere } from "./geometry.js";

var shadingType = "flat";
var aPosition, aNormal;
var uModelViewMatrix, uProjectionMatrix, uNormalMatrix, uLightPosition, uLightColor, uColor;

var flat_vertexShader, flat_fragmentShader, flat_shading_program;
var per_vertexShader, per_fragmentShader, per_vertex_shading_program;
var ambientProduct = []
var uAmbientProduct, uDiffuseProduct, uSpecularProduct, uShininess;

var light_ambient = [0.30, 0.30, 0.30, 1.0];
var material_ambient = [1.0, 0.0, 1.0, 1.0];
var light_diffuse = [1.0, 0.7, 0.0, 1.0];
var light_specular = [1.0, 1.0, 1.0, 1.0];
var Shininess = 128;


function setShaderVariables(shadingType){
  if(document.getElementById("flat_radio").checked == true){
    shadingType = "flat";

  }else if(document.getElementById("goraud_radio").checked == true){
    shadingType = "Per-Vertex";
  }
  else{
    shadingType = "Per-Fragment";
  }
  console.log(shadingType);
  if(shadingType== "flat"){
    flat_vertexShader = createShader(gl, gl.VERTEX_SHADER, flatVertexShaderSource);
    flat_fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, flatFragmentShaderSource);
    flat_shading_program = createProgram(gl, flat_vertexShader, flat_fragmentShader);
    gl.useProgram(flat_shading_program);

    aPosition = gl.getAttribLocation(flat_shading_program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    aNormal = gl.getAttribLocation(flat_shading_program, "aNormal");
    gl.enableVertexAttribArray(aNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    uModelViewMatrix = gl.getUniformLocation(flat_shading_program, "uModelViewMatrix");
    uProjectionMatrix = gl.getUniformLocation(flat_shading_program, "uProjectionMatrix");
    uNormalMatrix = gl.getUniformLocation(flat_shading_program, "uNormalMatrix");
    uLightPosition = gl.getUniformLocation(flat_shading_program, "uLightPosition");
    uLightColor = gl.getUniformLocation(flat_shading_program, "uLightColor");
    uColor = gl.getUniformLocation(flat_shading_program, "uColor");
    gl.uniform3fv(uColor, objectColor);

  }else if(shadingType == "Per-Vertex"){
    per_vertexShader = createShader(gl, gl.VERTEX_SHADER, pervertexShaderSource);
    per_fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, perVertexfragmentShaderSource);
    per_vertex_shading_program = createProgram(gl, per_vertexShader, per_fragmentShader);
    gl.useProgram(per_vertex_shading_program);

    aPosition = gl.getAttribLocation(per_vertex_shading_program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    aNormal = gl.getAttribLocation(per_vertex_shading_program, "aNormal");
    gl.enableVertexAttribArray(aNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    uModelViewMatrix = gl.getUniformLocation(per_vertex_shading_program, "uModelViewMatrix");
    uProjectionMatrix = gl.getUniformLocation(per_vertex_shading_program, "uProjectionMatrix");
    uNormalMatrix = gl.getUniformLocation(per_vertex_shading_program, "uNormalMatrix");
    uLightPosition = gl.getUniformLocation(per_vertex_shading_program, "uLightPosition");
    uLightColor = gl.getUniformLocation(per_vertex_shading_program, "uLightColor");
    uColor = gl.getUniformLocation(per_vertex_shading_program, "uColor");

    uAmbientProduct = gl.getUniformLocation(per_vertex_shading_program, "AmbientProduct");
    uDiffuseProduct = gl.getUniformLocation(per_vertex_shading_program, "DiffuseProduct");
    uSpecularProduct = gl.getUniformLocation(per_vertex_shading_program, "SpecularProduct");
    uShininess = gl.getUniformLocation(per_vertex_shading_program, "Shininess");

    ambientProduct = [];

    for(let i = 0; i < light_ambient.length; i++){
      ambientProduct.push(light_ambient[i] * material_ambient[i]);
    }

    gl.uniform4fv(uAmbientProduct, ambientProduct);
    gl.uniform4fv(uDiffuseProduct, light_diffuse);
    gl.uniform4fv(uSpecularProduct, light_specular);
    gl.uniform1f(uShininess, Shininess);
    gl.uniform3fv(uColor, objectColor);
  }else{
    per_vertexShader = createShader(gl, gl.VERTEX_SHADER, perFragmentVertexShaderSource);
    per_fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, perFragmentShaderSource);
    per_vertex_shading_program = createProgram(gl, per_vertexShader, per_fragmentShader);
    gl.useProgram(per_vertex_shading_program);

    aPosition = gl.getAttribLocation(per_vertex_shading_program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    aNormal = gl.getAttribLocation(per_vertex_shading_program, "aNormal");
    gl.enableVertexAttribArray(aNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

    uModelViewMatrix = gl.getUniformLocation(per_vertex_shading_program, "uModelViewMatrix");
    uProjectionMatrix = gl.getUniformLocation(per_vertex_shading_program, "uProjectionMatrix");
    uNormalMatrix = gl.getUniformLocation(per_vertex_shading_program, "uNormalMatrix");
    uLightPosition = gl.getUniformLocation(per_vertex_shading_program, "uLightPosition");
    uLightColor = gl.getUniformLocation(per_vertex_shading_program, "uLightColor");
    uColor = gl.getUniformLocation(per_vertex_shading_program, "uColor");

    uAmbientProduct = gl.getUniformLocation(per_vertex_shading_program, "AmbientProduct");
    uDiffuseProduct = gl.getUniformLocation(per_vertex_shading_program, "DiffuseProduct");
    uSpecularProduct = gl.getUniformLocation(per_vertex_shading_program, "SpecularProduct");
    uShininess = gl.getUniformLocation(per_vertex_shading_program, "Shininess");

    ambientProduct = [];

    for(let i = 0; i < light_ambient.length; i++){
      ambientProduct.push(light_ambient[i] * material_ambient[i]);
    }

    gl.uniform4fv(uAmbientProduct, ambientProduct);
    gl.uniform4fv(uDiffuseProduct, light_diffuse);
    gl.uniform4fv(uSpecularProduct, light_specular);
    gl.uniform1f(uShininess, Shininess);
    gl.uniform3fv(uColor, objectColor);
  }
}



const canvas = document.getElementById("glCanvas");
const gl = getWebGLContext(canvas);

const lightPosition = [2.0, 2.0, 2.0];
const lightColor = [1.0, 1.0, 1.0];
const objectColor = [1.0, 0.5, 0.2]; // Example: orange sphere

// Sphere geometry
const { positions, normals, indices } = createSphere(1.0, 30, 30);
const positionBuffer = gl.createBuffer();
const normalBuffer = gl.createBuffer();
const indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

setShaderVariables(shadingType);

const modelViewMatrix = mat4.create();
const projectionMatrix = mat4.create();
const normalMatrix = mat4.create();

mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -4]);

function render(time) {

  //mat4.rotateY(modelViewMatrix, modelViewMatrix, time * 0.001);
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  setShaderVariables(shadingType);

  gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
  gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);
  gl.uniform3fv(uLightPosition, lightPosition);
  gl.uniform3fv(uLightColor, lightColor);


  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
}

// Initialize WebGL settings
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
requestAnimationFrame(render);
