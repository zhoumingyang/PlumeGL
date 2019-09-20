//from： https://github.com/mrdoob/three.js/

// export const lightAttenuationFactor(const in float lightDistance, const in float cutoffDistance, const in float decayExponent)
export const Pbr: string =
    `float punctualLightIntensityToIrradianceFactor( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

        #if defined ( PHYSICALLY_CORRECT_LIGHTS )
            float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
            if( cutoffDistance > 0.0 ) {
                distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
            }
            return distanceFalloff;
        #else
            if( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
                return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );
            }
            return 1.0;
        #endif   
    }`;

export const SpecularfCalculate: string =
    `vec3 specularF(const in vec3 specularColor, const in float dotLH ) {
        float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
        return ( 1.0 - specularColor ) * fresnel + specularColor;
    }`;

export const SpecularGImplicitCalculate: string =
    `float specularGImplicit() {
        return 0.25;
    }`;

export const SpeuclarDCalculate: string =
    `float specularD( const in float shininess, const in float dotNH ) {
        return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
    }`;

export const BlinnPhongBrdfCalculate: string =
    `vec3 blinnPhongBrdf(const in ResultLight incidentLight, const in GeometryAttribute geometry, const in vec3 specularColor, const in float shininess) {
        vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
        float dotNH = saturate( dot( geometry.normal, halfDir ) );
        float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
        vec3 F = specularF( specularColor, dotLH );
        float G = specularGImplicit();
        float D = specularD( shininess, dotNH );
        return F * ( G * D );
    }`;

export const diffuseBrdfCalculate: string =
    `vec3 diffuseBrdf(const in vec3 diffuseColor) {
        return RECIPROCAL_PI * diffuseColor;
    }
`;

export const BlinnPhongCalculate: string =
    `void blinnPhong( const in ResultLight directLight, const in GeometryAttribute geometry, const in phongMaterialAttribute material, inout ReflectedLight reflectedLight ) {
        
    }`;