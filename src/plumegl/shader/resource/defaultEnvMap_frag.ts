export const DefaultEnvMapFrag: string =
    `in vec3 vReflect;
    
    uniform float uflipEnvMap;
    uniform samplerCube uEnvMap;

    void main() {
        vec3 reflectVec = vReflect;

        vec4 envColor = textureCube(uEnvMap, vec3( uflipEnvMap * reflectVec.x, reflectVec.yz ));

        envColor = envMapTexelToLinear( envColor );
    }
`;