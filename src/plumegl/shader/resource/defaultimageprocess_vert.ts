export const DefaultImageProcessVert: string =
    `#verison 300 es
    precision highp float;
    precision highp int;

    location(layout = 0) in aPosition;
    location(layout = 1) in aUv;

    uniform vec2 uResolution;
    uniform float uFlipY;

    out vec2 vUv;

    void main() {
        vec2 texel = aPosition / uResolution;  //[0, 1]
        vec2 clipSpace = texel * 2.0 - 1.0;    //[-1, 1]
        gl_Position = vec4(clipSpace * vec2(1, uFlipY), 0, 1);
        vUv = aUv;
    }`;