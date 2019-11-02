const DefaultDashLineFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    uniform float uOpacity;
    uniform vec3 uColor;
    uniform float uDashSize;
    uniform float uGapSize;

    in float vLineLength;

    out vec4 fragColor;
 
    void main() {
        float wholeSize = uDashSize + uGapSize;
        if (mod(vLineDistance, wholeSize) > dashSize) {
            discard;
        }
        fragColor = vec4(uColor.rgb, uOpacity);
    }`;