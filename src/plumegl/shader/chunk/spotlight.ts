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

export const spotLightMax: string =
    `#define MAX_SPOT_LIGHT 10`;

export const spotLightDefine: string =
    `struct SpotLight {
        vec3 color;
        float ambient;
        float diffuse;
        float cutoff;
        vec3 position;
        vec3 direction;
        LightAttenuation attenuation;
    };
    uniform int uNumSpotLight;
    uniform SpotLight uSpotLights[MAX_POINT_LIGHT];`;

export const spotDiffuseCalculate: string = 
`bool calcSpotDiffuseColor(SpotLight light, vec3 lightDirection, vec3 normal, out vec3 diffuseColor) {
    
    vec3 norm = normalize(normal);

    float diffuseFactor = max(dot(norm, -lightDirection), 0.0);
    diffuseColor = vec3(light.color * light.diffuse * diffuseFactor);

    return diffuseFactor > 0.0; 
}`;

export const spotSpecularCalculate: string = 
`bool calcSpotSpecularColor(SpotLight light, vec3 lightDirection, vec3 normal, vec3 fragPos, vec3 eyePos, out vec3 specularColor) {
    
    vec3 norm = normalize(normal);

    vec3 pointToEye = normalize(eyePos - fragPos);

    vec3 reflectDirection = normalize(reflect(lightDirection, norm));
    float specularFactor = pow(max(dot(pointToEye, reflectDirection), 0.0), uSpecPower);

    specularColor = vec3(uSpecStrength * specularFactor * light.color);

    return true;
}`;

export const spotLightCalculate: string =
    `vec4 calcSpotColor(SpotLight light, vec3 normal, vec3 fragPos, vec3 eyePos) {

        vec3 lightDirection = fragPos - light.position;
        float distance = length(lightDirection);
        lightDirection = normalize(lightDirection);
        float spotFactor = dot(lightDirection, light.direction);

        vec3 diffuseColor  = vec3(0.0f, 0.0f, 0.0f);
        vec3 specularColor = vec3(0.0f, 0.0f, 0.0f);
        
        if(spotFactor > light.cutoff) {

            //diffuse
            bool valid = calcSpotDiffuseColor(light, lightDirection, normal, diffuseColor);

            if(valid) {
                //specular
                calcSpotSpecularColor(light, lightDirection, normal, fragPos, eyePos, specularColor);
            }

            vec4 tmpColor = vec4((diffuseColor + specularColor), 1.0f);
            float attenuation = light.attenuation.constant + light.attenuation.linear * distance + light.attenuation.exponent * distance * distance;
            vec4 color = tmpColor / attenuation;
            
            return color * (1.0f - (1.0f - spotFactor) * 1.0f/(1.0f - light.cutoff));
        } 

        return vec4(0.0f, 0.0f, 0.0f, 1.0f);
    }`;