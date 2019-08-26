export const BasicLineFrag: string =
    `#version 300 es
    precision highp float;
    uniform vec3 uColor;
    out vec4 fragColor;
    void main() {
        fragColor = vec4(uColor.r, uColor.g, uColor.b, 1.0);
    }
`