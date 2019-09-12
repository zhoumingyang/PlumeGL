import { ambientLightMax, ambientLightDefine, ambientLightCalculate } from "../chunk/ambientlight";

export const DefaultLambertFrag: string =
    `uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform float opacity;

    #ifdef USE_TEXTURE
        uniform sampler2D uTexture;
    #endif

    ${ambientLightMax}
    ${ambientLightDefine}
    ${ambientLightCalculate}

    in vec3 diffuseResult;  //direct diffuse
    in vec3 indirectResult;
    in vec2 vUv;

    #define RECIPROCAL_PI 0.31830988618

    vec3 BRDF_Diffuse_Lambert( const in vec3 diffuseColor ) {
        return RECIPROCAL_PI * diffuseColor;
    }
    
    out vec3 fragColor; 

    void main() {

        vec3 directDiffuse = vec3(0.0f);    // from point light, spot light, parallel light
        vec3 indirectDiffuse = vec3(0.0f);  // from ambient light, diffuse

        //self diffuse color
        vec3 diffuseColor = vec4(diffuse, opacity);
        #ifdef USE_TEXTURE
            vec4 textureColor = texture2D( map, vUv );
            diffuseColor *= textureColor;
        #endif

        //calculate ambient diffuse
        int numAmbientLight = uNumAmbientLight;
        if(numAmbientLight > MAX_AMBIENT_LIGHT)
        {
            numAmbientLight = MAX_AMBIENT_LIGHT;
        }
        vec4 ambientDiffuse = vec4(0.0f, 0.0f, 0.0f, 1.0f);
        #pragma unroll_loop
        for(int i = 0; i < numAmbientLight; i++)
        {
            ambientDiffuse += calcAmbientColor(uAmbientLights[i]);
        }

        //设置间接光照
        indirectDiffuse = ambientDiffuse.rgb;
        indirectDiffuse += indirectResult;
        indirectDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb);

        //设置直接光照
        directDiffuse = diffuseResult;
        directDiffuse *= BRDF_Diffuse_Lambert(diffuseColor.rgb) * 1.0;

        vec3 outgoingLight = directDiffuse + indirectDiffuse + emissive;
        fragColor = vec4(outgoingLight, diffuseColor.a);
    }
    `;