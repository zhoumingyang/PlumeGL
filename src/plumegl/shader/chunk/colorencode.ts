export const SrgbToLinear: string =
    `vec4 sRGBToLinear( in vec4 value ) {
        return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
    }`;

export const MapTexelToLinear: string =
    `vec4 mapTexelToLinear(vec4 value) {
        return sRGBToLinear( value );
    }`;

export const LinearToneMapping: string =
    `vec 3 linearToneMapping(vec3 color) {
        return uToneMappingExposure * color;
    }`;

export const LinearToGamma: string =
    `vec4 linearToGamma( in vec4 value, in float gammaFactor ) {
	    return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
    }`;

export const LinearToOutputTexel: string =
    `vec4 linearToOutputTexel( vec4 value ) { 
        return linearToGamma( value, float( GAMMA_FACTOR ) ); 
    }`;

