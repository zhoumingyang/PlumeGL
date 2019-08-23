/**
 * global uniform:
 * eyePos -- function param
 * uSpecPower
 * uSpecStrength
 * 
 * varying:
 * normal
 * fragPos
 *  */

export const pointLightMax: string =
    `#define MAX_POINT_LIGHT 10`;

export const pointLightDefine: string =
    `struct PointLight {
        vec3 color;
        float ambient;
        float diffuse;
        vec3 position;
        LightAttenuation attenuation;
    };
    uniform int uNumPointLight;
    uniform PointLight uPointLights[MAX_POINT_LIGHT];`;

export const pointDiffuseCalculate: string = `
    bool calcPointDiffuseColor(PointLight light, vec3 lightDirection, vec3 normal, out vec3 diffuseColor) {

        lightDirection = normalize(lightDirection);
        vec3 norm = normalize(normal);

        float diffuseFactor = max(dot(norm, -lightDirection), 0.0f);
        diffuseColor = vec3(light.color * light.diffuse * diffuseFactor); 

        return diffuseFactor > 0.0f;
    }
`;

export const pointSpecularCalculate: string = `
    bool calcPointSpecularColor(PointLight light, vec3 lightDirection, vec3 normal, vec3 fragPos, vec3 eyePos, out vec3 specularColor) {

        lightDirection = normalize(lightDirection);
        vec3 pointToEye = normalize(eyePos - fragPos);
        vec3 norm = normalize(normal);

        vec3 reflectDirection = normalize(reflect(lightDirection, norm));
        float specularFactor = pow(max(dot(pointToEye, reflectDirection), 0.0f), uSpecPower);

        specularColor = vec3(uSpecStrength * specularFactor * light.color);

        return true;
    }`;

export const pointLightCalculate: string =
    `vec4 calcPointColor(PointLight light, vec3 normal, vec3 fragPos, vec3 eyePos) {

        vec3 lightDirection = fragPos - light.position;
        float distance = length(lightDirection);

        //diffuse
        vec3 diffuseColor = vec3(0.0f, 0.0f, 0.0f);
        bool valid = calcPointDiffuseColor(light, lightDirection, normal, diffuseColor);

        //specular
        vec3 specularColor = vec3(0.0f, 0.0f, 0.0f);
        if(valid) {
            calcPointSpecularColor(light, lightDirection, normal, fragPos, eyePos, specularColor);
        }

        vec4 pointColor = vec4(diffuseColor + specularColor, 1.0f);
        float attenuation = light.attenuation.constant + light.attenuation.linear * distance + light.attenuation.exponent * distance * distance;

        return pointColor / attenuation;
    }`;

