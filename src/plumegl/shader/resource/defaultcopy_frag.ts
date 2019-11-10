export const DefaultCopyFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    uniform sampler2D uTexture;

    in vec2 vUv;

    out vec4 fragColor;

    void main() {
        fragColor = texture(uTexture, vUv);
    }`;