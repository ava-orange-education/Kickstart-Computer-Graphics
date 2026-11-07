export const pervertexShaderSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uColor;
uniform vec4 AmbientProduct, DiffuseProduct, SpecularProduct;
uniform float Shininess;
varying vec3 vColor;

void main() {
    vec4 transformedPosition = uModelViewMatrix * vec4(aPosition, 1.0);
    vec3 normal = normalize(vec3(uNormalMatrix * vec4(aNormal, 0.0)));
    vec3 lightDirection = normalize(uLightPosition - transformedPosition.xyz);

    gl_Position = uProjectionMatrix * transformedPosition;

    vec4 ambient, diffuse, specular;

    // View direction (E)
    vec3 E = -normalize(transformedPosition.xyz);

    // Halfway vector (H)
    vec3 H = normalize(lightDirection + E);

    // Diffuse term
    float Kd = max(dot(normal, lightDirection), 0.0);

    // Specular term
    float Ks = pow(max(dot(normal, H), 0.0), Shininess);

    // Lighting contributions
    ambient = AmbientProduct;
    diffuse = Kd * DiffuseProduct;
    specular = Ks * SpecularProduct;

    // Final color output
    vColor = vec3(ambient + diffuse + specular);

}`;

export const perVertexfragmentShaderSource = `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}`;

export const flatVertexShaderSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;


varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

    vec4 viewPosition = uModelViewMatrix * vec4(aPosition, 1.0);
    vPosition = viewPosition.xyz;

    vNormal = mat3(uNormalMatrix) * aNormal;
}`;

export const flatFragmentShaderSource = `
precision mediump float;


uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Transform normal to view space
     vec3 normal = normalize(vNormal);
     vec3 lightDirection = normalize(uLightPosition - vPosition);

    // Compute diffuse lighting
    float diffuse = max(dot(normal, lightDirection), 0.0);
    vec3 shadedColor = uLightColor * uColor * diffuse;

    // Output final fragment color
    gl_FragColor = vec4(shadedColor, 1.0);
}`;

export const perFragmentVertexShaderSource=`
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec3 uLightPosition;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 lightDirection;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);

    vec4 viewPosition = uModelViewMatrix * vec4(aPosition, 1.0);
    vPosition = viewPosition.xyz;
    lightDirection = normalize(uLightPosition - vPosition);

    vNormal = mat3(uNormalMatrix) * aNormal;
}`;

export const perFragmentShaderSource = `
precision mediump float;

uniform vec4 AmbientProduct, DiffuseProduct, SpecularProduct;
uniform float Shininess;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 lightDirection;

void main()
{
    vec3 NN = normalize(vNormal);
    vec4 ambient, diffuse, specular;

    // View direction (E)
    vec3 E = -normalize(vPosition.xyz);

    // Halfway vector (H)
    vec3 H = normalize(lightDirection + E);

    // Diffuse term
    float Kd = max(dot(NN, lightDirection), 0.0);

    // Specular term
    float Ks = pow(max(dot(NN, H), 0.0), Shininess);

    // Lighting contributions
    ambient = AmbientProduct;
    diffuse = Kd * DiffuseProduct;
    specular = Ks * SpecularProduct;

    // Final color output
    //vColor = vec3(ambient + diffuse + specular);
    gl_FragColor = vec4(vec3(ambient + diffuse + specular), 1.0);

}`;
