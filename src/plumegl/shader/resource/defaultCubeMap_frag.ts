import { SrgbToLinear, MapTexelToLinear, LinearToneMapping, LinearToGamma, LinearToOutputTexel } from '../chunk/colorencode';

export const DefaultCubeMapFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    #define GAMMA_FACTOR 2
    in vec3 vWorldDirection;

    uniform samplerCube uCube;
    uniform float uFlip;
    uniform float uOpacity;
    uniform float uToneMappingExposure;

    ${SrgbToLinear}

    ${MapTexelToLinear}

    ${LinearToneMapping}

    ${LinearToGamma}

    ${LinearToOutputTexel}

    out vec4 fragColor;

    void main() {
        
        vec4 texColor = texture(uCube, vec3(uFlip * vWorldDirection.x, vWorldDirection.yz));
        fragColor = mapTexelToLinear( texColor );
        fragColor.a *= uOpacity;

        fragColor.rgb = linearToneMapping(fragColor.rgb);

        fragColor = linearToOutputTexel(fragColor);
    }
`;