import { RgbToLuminance } from '../chunk/colorencode';
import { SobelFilter } from '../chunk/imageprocess';

export const DefaultSobelFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform float uThreshold;

    in vec2 vUv;

    out vec4 fragColor;

    ${RgbToLuminance}

    ${SobelFilter}

    void main() {
        vec3 color = sobleFilter();
        fragColor = vec4(color.rgb, 1.0);
    }`;