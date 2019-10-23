export const DefaultColorFrag: string =
    `#version 300 es
precision highp float;

uniform vec3 uColor;
uniform float uOpacity;

out vec4 fragColor;

void main() {
    fragColor = vec4(uColor.rgb, uOpacity);
}`;