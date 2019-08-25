import { lightAttenuation } from '../chunk/attenuation';
import { ambientLightMax, ambientLightDefine, ambientLightCalculate } from '../chunk/ambientlight';
import { parallelLightMax, parallelLightDefine, parallelDiffuseCalculate, parallelSpecularCalculate, parallelLightCalculate } from '../chunk/parallellight';
import { pointLightMax, pointLightDefine, pointDiffuseCalculate, pointSpecularCalculate, pointLightCalculate } from '../chunk/pointlight';
import { spotLightMax, spotLightDefine, spotDiffuseCalculate, spotSpecularCalculate, spotLightCalculate } from '../chunk/spotlight';

export const DefaultLightFrag: string =
    `#version 300 es
precision highp float;
precision highp int;

// max value define
${ambientLightMax}
${parallelLightMax}
${pointLightMax}
${spotLightMax}

// varying
in vec3 vPosition;
in vec3 vNormal;
in vec2 vUv;

// common uniform
uniform float uSpecStrength;
uniform float uSpecPower;
uniform vec3 uEyePosition;
// uniform sampler2D uTexture;
uniform int ubMap;

// attenuation struct define
${lightAttenuation}

// light define
${ambientLightDefine}
${parallelLightDefine}
${pointLightDefine}
${spotLightDefine}

// light function define
${ambientLightCalculate}
// parallel light
${parallelDiffuseCalculate}

${parallelSpecularCalculate}

${parallelLightCalculate}
// point light
${pointDiffuseCalculate} 

${pointSpecularCalculate}

${pointLightCalculate}
// spot light
${spotDiffuseCalculate}

${spotSpecularCalculate}

${spotLightCalculate}

//out 
out vec4 fragColor;

void main() {

    vec3 normal = normalize(vNormal);

    // deal number of lights
    int numAmbient = uNumAmbientLight;
    int numParallel = uNumParallelLight;
	int numPoint = uNumPointLight;
    int numSpot = uNumSpotLight;

    if(numAmbient > MAX_AMBIENT_LIGHT) {
        numAmbient = MAX_AMBIENT_LIGHT;
    }

    if(numParallel > MAX_PARALLEL_LIGHT) {
		numParallel = MAX_PARALLEL_LIGHT;
    }
    
	if(numPoint > MAX_POINT_LIGHT) {
		numPoint = MAX_POINT_LIGHT;
    }
    
	if(numSpot > MAX_SPOT_LIGHT) {
		numSpot = MAX_SPOT_LIGHT;
    }
    
    vec4 ambientIrradiance = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    for(int i = 0; i < numAmbient; i++) {
        ambientIrradiance += calcAmbientColor(uAmbientLights[i]);
    }
    ambientIrradiance = ambientIrradiance / ambientIrradiance.w;
    
    vec4 parallelIrradiance = vec4(0.0f, 0.0f, 0.0f, 1.0f); 
    numParallel = 1;
    for(int i = 0; i < numParallel; i++) {
        parallelIrradiance += calcParallelColor(uParallelLights[i], normal, vPosition, uEyePosition);
    }
    parallelIrradiance = parallelIrradiance / parallelIrradiance.w;

    vec4 pointIrradiance = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    numPoint = 0;
    for(int i = 0; i < numPoint; i++) {
        pointIrradiance += calcPointColor(uPointLights[i], normal, vPosition, uEyePosition);
    }
    pointIrradiance = pointIrradiance / pointIrradiance.w;

    vec4 spotIrradiance = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    numSpot = 0;
    for(int i = 0; i < numSpot; i++) {
        spotIrradiance += calcSpotColor(uSpotLights[i], normal, vPosition, uEyePosition);
    }
    spotIrradiance = spotIrradiance / spotIrradiance.w;

    vec4 finalColor = ambientIrradiance + parallelIrradiance + pointIrradiance + spotIrradiance;
    finalColor = finalColor / finalColor.w;

    if(ubMap == 1) {
        // fragColor = texture(uTexture, vUv.xy) * finalColor;
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
	} else {
        fragColor = finalColor;
    }
    
}`;