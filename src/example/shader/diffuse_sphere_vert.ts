export const diffuseSphereVert: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    layout(location = 0) in vec3 position;
    layout(location = 1) in vec3 normal;

    uniform vec4 lightPosition;
    uniform vec3 kd;
    uniform vec3 ld;

    uniform mat4 modelViewMatrix;
    uniform mat4 MVP;

    out vec3 lightIntensity;

    void main() {
       vec3 tnorm = normalize(normal);
       vec4 eyeCoords = modelViewMatrix * vec4(position, 1.0);
       vec3 s = normalize(vec3(lightPosition - eyeCoords));

       lightIntensity = ld * kd * max(dot(s, tnorm), 0.0);

       gl_Position = MVP * vec4(position, 1.0);
    }`;