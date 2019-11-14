export const DefaultImageProcessFrag: string =
    `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uTexture;
uniform vec2 uTextureSize;
uniform float uKernel[9];
uniform float uKernelWeight;

in vec2 vUv;
out vec4 fragColor;

void main() {
    vec2 texel = vec2(1.0, 1.0) / uTextureSize;
    vec4 colorSum =
    texture(uTexture, vUv + texel * vec2(-1, -1)) * uKernel[0] +
    texture(uTexture, vUv + texel * vec2( 0, -1)) * uKernel[1] +
    texture(uTexture, vUv + texel * vec2( 1, -1)) * uKernel[2] +
    texture(uTexture, vUv + texel * vec2(-1,  0)) * uKernel[3] +
    texture(uTexture, vUv + texel * vec2( 0,  0)) * uKernel[4] +
    texture(uTexture, vUv + texel * vec2( 1,  0)) * uKernel[5] +
    texture(uTexture, vUv + texel * vec2(-1,  1)) * uKernel[6] +
    texture(uTexture, vUv + texel * vec2( 0,  1)) * uKernel[7] +
    texture(uTexture, vUv + texel * vec2( 1,  1)) * uKernel[8] ;
    fragColor = vec4((colorSum / uKernelWeight).rgb, 1);
}`;