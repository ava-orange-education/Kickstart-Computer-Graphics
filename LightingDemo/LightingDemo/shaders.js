export const vertexShaderFlat = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;
    varying vec3 vColor;

    void main() {
        vec3 transformedNormal = normalize(uNormalMatrix * aNormal);
        vec3 lightDirection = normalize(vec3(0.0, 1.0, 1.0));
        float intensity = max(dot(transformedNormal, lightDirection), 0.0);
        vColor = vec3(intensity);
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }
`;

export const fragmentShaderFlat = `
    precision mediump float;
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

export const vertexShaderPhong = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
        vNormal = normalize(uNormalMatrix * aNormal);
        vPosition = vec3(uModelViewMatrix * vec4(aPosition, 1.0));
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }
`;

export const fragmentShaderPhong = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uLightPosition;
    uniform vec3 uViewPosition;

    void main() {
        vec3 lightDirection = normalize(uLightPosition - vPosition);
        vec3 viewDirection = normalize(uViewPosition - vPosition);
        vec3 reflectDirection = reflect(-lightDirection, normalize(vNormal));

        float ambient = 0.1;
        float diffuseIntensity = max(dot(normalize(vNormal), lightDirection), 0.0);
        vec3 diffuse = diffuseIntensity * vec3(1.0, 1.0, 1.0); // Light color
        float specular = pow(max(dot(viewDirection, reflectDirection), 0.0), 16.0);

        vec3 color = ambient + diffuse + specular;
        gl_FragColor = vec4(color, 1.0);
    }
`;
