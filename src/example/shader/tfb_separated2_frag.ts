export const TfbSeparated2Frag: string =
    `#version 300 es
    precision highp float;
    precision highp int;
    uniform vec4 u_color;
    out vec4 color;
    void main() {
        color = u_color;
    }`;