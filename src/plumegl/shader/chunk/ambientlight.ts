export const ambientLightMax =
    `#define MAX_AMBIENT_LIGHT 10`;

export const ambientLightDefine =
    `struct AmbientLight {
        vec3 color;
        float ambient;
    };
    uniform int uNumAmbientLight;
    uniform AmbientLight uAmbientLights[MAX_AMBIENT_LIGHT];
`;

export const ambientLightCalculate =
    `vec4 calcAmbientColor(AmbientLight light) {
        return vec4(light.color * light.ambient, 1.0f);
    }`;

export const calculateAmbientLightTotalDiffuseIrradiance =
    `vec4 ambientDiffuse = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    for(int i = 0; i < numAmbientLight; i++) {
        ambientDiffuse += calcAmbientColor(uAmbientLights[i]);
    }`;