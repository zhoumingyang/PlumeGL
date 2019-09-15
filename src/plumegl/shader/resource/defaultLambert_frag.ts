import { ambientLightMax, ambientLightDefine, ambientLightCalculate } from "../chunk/ambientlight";

export const DefaultLambertFrag: string =
    `uniform vec3 uDiffuse;
    uniform vec3 uEmissive;
    uniform float uOpacity;

    #ifdef USE_TEXTURE
        uniform sampler2D uTexture;
    #endif

    ${ambientLightMax}
    ${ambientLightDefine}
    ${ambientLightCalculate}

    in vec3 vDirectResult;     //直接光照计算（点光源、聚光等、平行光）
    in vec3 vIndirectResult;   //间接光照计算（TODO：在vertex shader中计算半球光）
    in vec2 vUv;

    #define RECIPROCAL_PI 0.31830988618

    vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
        return RECIPROCAL_PI * diffuseColor;
    }
    
    out vec3 fragColor; 

    void main() {

        vec3 directDiffuse = vec3(0.0f);    // from point light, spot light, parallel light
        vec3 indirectDiffuse = vec3(0.0f);  // from ambient light, diffuse

        //计算自身的diffuse color以及纹理采样，作为间接光照的一部分
        vec3 diffuseColor = vec4(uDiffuse, uOpacity);
        #ifdef USE_TEXTURE
            vec4 textureColor = texture2D(uTexture, vUv);
            diffuseColor *= textureColor;
        #endif

        //计算环境光作为间接光照的一部分
        int numAmbientLight = uNumAmbientLight;
        if(numAmbientLight > MAX_AMBIENT_LIGHT) {
            numAmbientLight = MAX_AMBIENT_LIGHT;
        }
        vec4 ambientDiffuse = vec4(0.0f, 0.0f, 0.0f, 1.0f);
        #pragma unroll_loop
        for(int i = 0; i < numAmbientLight; i++) {
            ambientDiffuse += calcAmbientColor(uAmbientLights[i]);
        }

        //设置间接光照
        indirectDiffuse = ambientDiffuse.rgb;
        indirectDiffuse += indirectResult;
        indirectDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb);

        //设置直接光照
        directDiffuse = vDirectResult;
        directDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb) * 1.0;

        vec3 outgoingLight = directDiffuse + indirectDiffuse + uEmissive;
        fragColor = vec4(outgoingLight, diffuseColor.a);
    }
    `;