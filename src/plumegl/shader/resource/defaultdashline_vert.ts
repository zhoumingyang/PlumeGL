export const DefaultDashLineVert: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    layout(location = 0) in vec3 aPosition;
    layout(location = 1) in float aLineLength;

    uniform float uLineScale;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    out float vLineLength;

    void main() {
        vLineLength = uLineScale * aLineLength;
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }`;