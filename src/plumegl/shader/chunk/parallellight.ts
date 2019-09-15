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
        vec3 direction;
    };
    uniform int uNumParallelLight;
    uniform ParallelLight uParallelLights[MAX_PARALLEL_LIGHT];
    `;

export const parallelDiffuseCalculate: string =
    `bool calcParallelDiffuseColor(ParallelLight light, vec3 normal, out vec3 diffuseColor) {

        vec3 norm = normalize(normal);

        vec3 lightDir = normalize(light.direction);
        float diffuseFactor = max(dot(norm, -lightDir), 0.0f);
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

        return vec4(diffuseColor + specularColor, 1.0f);
    }`;

/**
 * 
 * light: ParallelLight
 * 
 *  geometry: GeometryAttribute {  (local)
 *      vec3 position;   //model view space
 *      vec3 normal;
 *      vec3 viewDir;
 *  }
 * 
 *  resultLight: ResultLight {     (local)
 *      vec3 color;
 *      vec3 direction;
 *      bool visible
 *  }
 * 
 *  numParallelLights: int (uniform or local)
 *  
 *  vDirectResult: varying vec3
 * 
 * */

//calculate light in model view space,reference Threejs
export const calculateParallelLightIrradiance: string =
    `void calcParallelLightIrradiance(const in ParallelLight light, const in GeometryAttribute geo, out ResultLight resultLight) {
        resultLight.color = light.color;
		resultLight.direction = light.direction;
		resultLight.visible = true;
    }`;

export const calculateParallelLightTotalDiffuseIrradiance: string =
    `#pragma unroll_loop
    for(int i = 0; i < numParallelLights; i++) {
        calcParallelLightIrradiance(uParallelLights[i], geometry, resultLight);
        float diffuseFactor = dot(geometry.normal, resultLight.direction);
        vec3 diffuseColor = PI * resultLight.color;
        vDirectResult += saturate(diffuseFactor) * diffuseColor;
    }`;