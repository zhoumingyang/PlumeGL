export const drawLineFrag: string =
    `#version 300 es
    precision highp float;
    out vec4 color;
    void main(void) {
        color = vec4(0.0, 0.75, 1.0, 1.0);
    }`;