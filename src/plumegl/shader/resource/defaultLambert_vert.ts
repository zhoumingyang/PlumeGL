import { Version } from "../chunk/version";
import { Attribute } from "../chunk/attribute";
import { Common } from "../chunk/common";
import { parallelLightMax, parallelLightDefine, calculateParallelLightIrradiance, calculateParallelLightTotalDiffuseIrradiance } from "../chunk/parallellight";
import { pointLightMax, pointLightDefine, calculatePointLightIrradiance, calculatePointLightTotalDiffuseIrradiance } from "../chunk/pointlight";
import { spotLightMax, spotLightDefine, calculateSpotLightIrradiance, calculateSpotLightTotalDiffuseIrradiance } from "../chunk/spotlight";

export const DefaultLambertVert: string =
    `${Version}
    precision highp float;
    precision highp int;
    ${Attribute}
    ${Common}

    out vec3 diffuseResult;
    out vec3 indirectResult;
    out vec3 vUv;

    // parallel light
    ${parallelLightMax}
    ${parallelLightDefine}
    ${calculateParallelLightIrradiance}
    ${calculateParallelLightTotalDiffuseIrradiance}

    //point light
    ${pointLightMax}
    ${pointLightDefine}
    ${calculatePointLightIrradiance}
    ${calculatePointLightTotalDiffuseIrradiance}

    //spot light
    ${spotLightMax}
    ${spotLightDefine}
    ${calculateSpotLightIrradiance}
    ${calculateSpotLightTotalDiffuseIrradiance}

    void main() {

        vec4 mvPosition = uModelViewMatrix * vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix * mvPosition;
        mvPosition = mvPosition.xyz;
        vUv = aUv;

        vec3 transNormal = (uNormalMatrix * vec4(aNormal, 1.0)).xyz;

        diffuseResult = vec3(0.0);
        indirectResult = vec3(0.0);

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

    }
    `;