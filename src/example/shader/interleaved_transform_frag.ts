export const interleavedTransformFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;
    out vec4 color;
    void main() {
        color = vec4(1.0);
    }`;