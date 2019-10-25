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

    void main() {
        
        vec4 texColor = textureCube(uCube, vec3(uFlip * vWorldDirection.x, vWorldDirection.yz));
        gl_FragColor = mapTexelToLinear( texColor );
        gl_FragColor.a *= uOpacity;

        gl_FragColor.rgb = linearToneMapping(gl_FragColor.rgb);

        gl_FragColor = linearToOutputTexel( gl_FragColor );
    }
`;