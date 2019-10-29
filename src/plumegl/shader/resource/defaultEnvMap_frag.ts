export const DefaultEnvMapFrag: string =
    `#version 300 es
    precision highp float;
    precision highp int;
    
    in vec3 vReflect;

    uniform float uflipEnvMap;
    uniform samplerCube uEnvMap;

    out vec4 fragColor;

    void main() {
        vec3 reflectVec = vReflect;
        vec4 envColor = textureCube(uEnvMap, vec3( uflipEnvMap * reflectVec.x, reflectVec.yz ));
        envColor = envMapTexelToLinear( envColor );
        fragColor = envColor;
    }
`;