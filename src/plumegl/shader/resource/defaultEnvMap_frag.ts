import { LinearToLinear, EnvMapTexelToLinear } from '../chunk/colorencode';

export const DefaultEnvMapFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;
    
    in vec3 vReflect;

    uniform float uEnvMapFlip;
    uniform samplerCube uEnvMap;

    out vec4 fragColor;

    ${LinearToLinear}

    ${EnvMapTexelToLinear}

    void main() {
        vec3 reflectVec = vReflect;
        vec4 envColor = texture(uEnvMap, vec3( uEnvMapFlip * reflectVec.x, reflectVec.yz ));
        envColor = envMapTexelToLinear( envColor );
        fragColor = envColor;
    }
`;