/**
 * global uniform:
 * eyePos -- function param
 * uSpecPower
 * uSpecStrength
 * 
 * varing:
 * normal
 * fragPos
 *  */

export const parallelLightMax =
    `#define MAX_PARALLEL_LIGHT 10
`;

export const parallelLightDefine =
    `struct ParallelLight {
        vec3 color;
        float ambient;
        float diffuse;
        vec3 direction;
    };
    uniform int uNumParallelLight;
    uniform ParallelLight uParallelLights[MAX_PARALLEL_LIGHT];
    `;

export const parallelDiffuseCalculate: string =
    `bool calcParallelDiffuseColor(ParallelLight light, vec3 normal, out vec3 diffuseColor) {

        vec3 norm = normalize(normal);

        float diffuseFactor = max(dot(norm, -light.direction), 0.0f);
        diffuseColor = diffuseFactor * light.color;

        return true;
    }`;

export const parallelSpecularCalculate: string =
    `bool calcParallelSpecularColor(ParallelLight light, vec3 normal, vec3 fragPos, vec3 eyePos, out vec3 specularColor) {

        vec3 norm = normalize(normal);

        vec3 viewDirection = normalize(eyePos - fragPos);
        vec3 reflectDirection = normalize(reflect(light.direction, norm));
        float specularFactor = pow(max(dot(viewDirection, reflectDirection), 0.0f), uSpecPower);

        specularColor = uSpecStrength * specularFactor * light.color; 

        return true;
    }`;

export const parallelLightCalculate =
    `vec4 calcParallelColor(ParallelLight light, vec3 normal, vec3 fragPos, vec3 eyePos) {

        //diffuse
        vec3 diffuseColor = vec3(0.0f, 0.0f, 0.0f);
        calcParallelDiffuseColor(light, normal, diffuseColor);

        //specular
        vec3 specularColor = vec3(0.0f, 0.0f, 0.0f);
        calcParallelSpecularColor(light, normal, fragPos, eyePos, specularColor);

        return  vec4(diffuseColor + specularColor, 1.0f);
    }`;