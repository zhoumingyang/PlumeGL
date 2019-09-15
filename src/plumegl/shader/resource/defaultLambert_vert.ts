import { lightAttenuation } from '../chunk/attenuation';
import { Attribute } from "../chunk/attribute";
import { Common } from "../chunk/common";
import { parallelLightMax, parallelLightDefine, calculateParallelLightIrradiance, calculateParallelLightTotalDiffuseIrradiance } from "../chunk/parallellight";
import { pointLightMax, pointLightDefine, calculatePointLightIrradiance, calculatePointLightTotalDiffuseIrradiance } from "../chunk/pointlight";
import { spotLightMax, spotLightDefine, calculateSpotLightIrradiance, calculateSpotLightTotalDiffuseIrradiance } from "../chunk/spotlight";

export const DefaultLambertVert: string =
    `precision highp float;
    precision highp int;
    ${Attribute}
    ${Common}

    out vec3 vDirectResult;
    out vec3 vIndirectResult;
    out vec2 vUv;

    ${lightAttenuation}
    
    // parallel light
    ${parallelLightMax}
    ${parallelLightDefine}
    ${calculateParallelLightIrradiance}

    //point light
    ${pointLightMax}
    ${pointLightDefine}
    ${calculatePointLightIrradiance}

    //spot light
    ${spotLightMax}
    ${spotLightDefine}
    ${calculateSpotLightIrradiance}

    void main() {

        vec4 mvPosition = uModelViewMatrix * vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix * mvPosition;
        vec3 transNormal = uNormalMatrix * aNormal;
        geometry.position = mvPosition.xyz;
        geometry.normal = normalize(transNormal);
        geometry.viewDir = normalize(-mvPosition.xyz);
        vUv = aUv;

        vDirectResult = vec3(0.0);
        vIndirectResult = vec3(0.0);

        int numParallelLights = uNumParallelLight;
        int numPointLights = uNumPointLight;
        int numSpotLights = uNumSpotLight;
    
        if(numParallelLights > MAX_PARALLEL_LIGHT) {
            numParallelLights = MAX_PARALLEL_LIGHT;
        }
        
        if(numPointLights > MAX_POINT_LIGHT) {
            numPointLights = MAX_POINT_LIGHT;
        }
        
        if(numSpotLights > MAX_SPOT_LIGHT) {
            numSpotLights = MAX_SPOT_LIGHT;
        }

        ${calculateParallelLightTotalDiffuseIrradiance}

        ${calculatePointLightTotalDiffuseIrradiance}

        ${calculateSpotLightTotalDiffuseIrradiance}

    }`;