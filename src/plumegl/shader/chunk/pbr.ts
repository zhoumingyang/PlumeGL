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
    `vec3 blinnPhongBrdf(const in IncidentLightAttribute incidentLight, const in GeometryAttribute geometry, const in vec3 specularColor, const in float shininess) {
        vec3 halfDir = normalize( incidentLight.direction + geometry.viewDir );
        float dotNH = saturate( dot( geometry.normal, halfDir ) );
        float dotLH = saturate( dot( incidentLight.direction, halfDir ) );
        vec3 F = specularF( specularColor, dotLH );
        float G = specularGImplicit();
        float D = specularD( shininess, dotNH );
        return F * ( G * D );
    }`;

export const DiffuseBrdfCalculate: string =
    `vec3 diffuseBrdf(const in vec3 diffuseColor) {
        return RECIPROCAL_PI * diffuseColor;
    }`;

export const BlinnPhongCalculate: string =
    `void blinnPhong( const in IncidentLightAttribute directLight, 
                      const in GeometryAttribute geometry, 
                      const in phongMaterialAttribute material, 
                      inout ReflectLightAttribute reflectedLight ) 
    {
        float diffuseFactor = saturate(dot(geometry.normal, directLight.direction));
        vec3 irradiance = diffuseFactor * directLight.color;

        // do physical correct
        irradiance *= PI;

        reflectedLight.directDiffuse += irradiance * diffuseBrdf(material.diffuseColor);
        reflectedLight.directSpecular += irradiance * blinnPhongBrdf(directLight, geometry, material.specularColor, material.specularShininess) * material.specularStrength;
    }`;

export const DiffuseBlinnPhong: string =
    `void diffuseBlinnPhong( const in vec3 irradiance,
                             const in GeometryAttribute geometry,
                             const in phongMaterialAttribute material,
                             inout ReflectLightAttribute reflectedLight)
    {
        reflectedLight.indirectDiffuse += irradiance * diffuseBrdf( material.diffuseColor );
    }`;

export const ShGetIrradianceAt: string =
    `vec3 shGetIrradianceAt(in vec3 normal, in vec3 shCoefficients[9]) 
    {
        
        float x = normal.x, y = normal.y, z = normal.z;

        // band 0
	    vec3 result = shCoefficients[ 0 ] * 0.886227;

	    // band 1
	    result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	    result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	    result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;

	    // band 2
	    result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	    result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	    result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	    result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
        result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
        
	    return result;

    }`;

export const CalculateLightProbeIrradiance: string =
    `vec3 calcLightProbeIrradiance(const in vec3 lightProbe[ 9 ], const in GeometricContext geometry) {
        vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );
        vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
        return irradiance;
    }`;