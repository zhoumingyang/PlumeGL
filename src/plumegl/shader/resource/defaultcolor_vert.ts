export const DefaultColorVert: string =
    `#version 300 es
    precision highp float;
    layout(location = 0) in vec3 aPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }`;