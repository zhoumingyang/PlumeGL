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
    
}
`;