import { Common } from "../chunk/common";
import { lightAttenuation } from "../chunk/attenuation";
import { SpecularfCalculate, SpecularGImplicitCalculate, SpeuclarDCalculate, BlinnPhongBrdfCalculate, DiffuseBrdfCalculate, BlinnPhongCalculate, DiffuseBlinnPhong } from "../chunk/pbr";
import { parallelLightMax, parallelLightDefine, calculateParallelLightIrradiance, calculateParallelLightTotalSpecularIrradiance } from "../chunk/parallellight";
import { pointLightMax, pointLightDefine, calculatePointLightIrradiance, calculatePointLightTotalSpecularIrradiance } from "../chunk/pointlight";
import { spotLightMax, spotLightDefine, calculateSpotLightIrradiance, calculateSpotLightTotalSpecularIrradiance } from "../chunk/spotlight";
import { ambientLightMax, ambientLightDefine, ambientLightCalculate, calculateAmbientLightTotalDiffuseIrradiance } from "../chunk/ambientlight";

export const DefaultPhongFrag =
    `precision highp float;
    precision highp int;

    uniform vec3 uDiffuse;
    uniform vec3 uEmissive;
    uniform float uOpacity;

    #ifdef USE_TEXTURE
        uniform sampler2D uTexture;
    #endif

    uniform vec3 uSpecular;
    uniform float uSpecPower;
    uniform float uSpecStrength;

    ${Common.Defines}
    #define RECIPROCAL_PI 0.31830988618
    ${parallelLightMax}

    ${pointLightMax}

    ${spotLightMax}

    ${ambientLightMax}

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

    ${lightAttenuation}

    ${ambientLightDefine}

    ${parallelLightDefine}

    ${pointLightDefine}

    ${spotLightDefine}

    ${ambientLightCalculate}

    ${SpecularfCalculate}

    ${SpecularGImplicitCalculate}

    ${SpeuclarDCalculate}

    ${BlinnPhongBrdfCalculate}

    ${DiffuseBrdfCalculate}

    ${BlinnPhongCalculate}

    ${calculateParallelLightIrradiance}

    ${calculatePointLightIrradiance}

    ${calculateSpotLightIrradiance}

    ${DiffuseBlinnPhong}

    out vec4 fragColor;

    void main() {

        vec4 diffuseColor = vec4(uDiffuse, uOpacity);

        ReflectLightAttribute rftLight = ReflectLightAttribute(vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ));

        #ifdef USE_TEXTURE
            vec4 texelColor = texture2D( uTexture, vUv );
            diffuseColor *= texelColor;
        #endif

        vec3 normal = normalize(vNormal);
        vec3 geometryNormal = normal;

        PhongMaterialAttribute bpMtl;
        bpMtl.diffuseColor = diffuseColor.rgb;
        bpMtl.specularColor = uSpecular;
        bpMtl.specularShininess = uSpecPower;
        bpMtl.specularStrength = uSpecStrength;

        GeometryAttribute geometry;
        geometry.position = -vViewPosition;
        geometry.normal = normal;
        geometry.viewDir = normalize(vViewPosition);

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

        IncidentLightAttribute idtLight;
        
        ${calculateParallelLightTotalSpecularIrradiance}
        
        ${calculatePointLightTotalSpecularIrradiance}
        
        ${calculateSpotLightTotalSpecularIrradiance}

        //间接光照计算
        int numAmbientLight = uNumAmbientLight;
        if(numAmbientLight > MAX_AMBIENT_LIGHT) {
            numAmbientLight = MAX_AMBIENT_LIGHT;
        }
        ${calculateAmbientLightTotalDiffuseIrradiance}

        diffuseBlinnPhong(ambientDiffuse.xyz, geometry, bpMtl, rftLight);

        vec3 outgoingLight = rftLight.directDiffuse + rftLight.indirectDiffuse + rftLight.directSpecular + rftLight.indirectSpecular + uEmissive;

        fragColor = vec4( outgoingLight, diffuseColor.a );

    }
    
`;