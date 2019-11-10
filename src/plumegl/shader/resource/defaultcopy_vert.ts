export const DefaultCopyVert: string =
    `#version 300 es
    precision highp float;
    precision highp int;
    layout(location = 0) in vec3 aPosition;
    layout(location = 1) in vec2 aUv;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    out vec2 vUv;

    void main() {
        vUv = aUv;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }`;