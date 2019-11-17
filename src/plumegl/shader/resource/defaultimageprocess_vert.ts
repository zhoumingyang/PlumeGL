export const DefaultImageProcessVert: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    layout(location = 0) in vec2 aPosition;
    layout(location = 1) in vec2 aUv;

    uniform vec2 uResolution;
    uniform float uFlipY;

    out vec2 vUv;

    void main() {
        vec2 texel = aPosition / uResolution;  //[0, 1]
        vec2 clipSpace = texel * 2.0 - 1.0;    //[-1, 1]
        gl_Position = vec4(clipSpace * vec2(1, uFlipY), 0, 1);
        vUv = aUv;
    }`;