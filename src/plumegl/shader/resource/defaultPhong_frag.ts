import { Common } from "../chunk/common";
import { SpecularfCalculate, SpecularGImplicitCalculate, SpeuclarDCalculate, diffuseBrdfCalculate, BlinnPhongCalculate } from "../chunk/pbr";
import { calculateParallelLightTotalSpecularIrradiance } from "../chunk/parallellight";
import { calculatePointLightTotalSpecularIrradiance } from "../chunk/pointlight";
import { calculateSpotLightTotalSpecularIrradiance } from "../chunk/spotlight";

export const DefaultPhongFrag =
    `precision highp float;
    precision highp int;

    uniform vec3 uDiffuse;
    uniform vec3 uEmissive;
    uniform float uOpacity;

    uniform vec3 uSpecular;
    uniform float uSpecPower;
    uniform float uSpecStrength;

    ${Common.Defines}
    #define RECIPROCAL_PI 0.31830988618

    ${Common.GA}

    ${Common.ILA}

    ${Common.RLA}

    ${Common.BPM}

    in vec3 vViewPosition;
    in vec3 vNormal;
    in vec2 vUv;
    in vec3 vWorldPosition;

    #ifdef USE_TEXTURE
        uniform sampler2D uTexture;
    #endif

    ${SpecularfCalculate}

    ${SpecularGImplicitCalculate}

    ${SpeuclarDCalculate}

    ${diffuseBrdfCalculate}

    ${BlinnPhongCalculate}

    out fragColor;

    void main() {

        vec4 diffuseColor = vec4(diffuse, opacity);

        ReflectLightAttribute rftLight = ReflectLightAttribute(vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ));

        #ifdef USE_TEXTURE
            vec4 texelColor = texture2D( map, vUv );
            diffuseColor *= texelColor;
        #endif

        vec3 normal = normalize(vNormal);
        vec3 geometryNormal = normal;

        BlinnPhongMaterial bpMtl;
        bpMtl.diffuseColor = diffuseColor.rgb;
        bpMtl.specularColor = uSpecular;
        bpMtl.specularShininess = uSpecPower;
        bpMtl.specularStrength = uSpecStrength;

        GeometryAttribute geometry;
        geometry.position = -vViewPosition;
        geometry.normal = normal;
        geometry.viewDir = normalize(vWorldPosition);

        IncidentLightAttribute directLight;

    }
    
`;