export const SobelFilter: string =
    `vec3 sobleFilter() {
        vec2 texel = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);

        float c00 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(-1.0, 1.0)).rgb);
        float c10 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(-1.0, 0.0)).rgb);
        float c20 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(-1.0, -1.0)).rgb);

        float c01 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(0.0, 1.0)).rgb);
        float c21 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(0.0, -1.0)).rgb);

        float c02 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(1.0, 1.0)).rgb);
        float c12 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(1.0, 0.0)).rgb);
        float c22 = rgbToLuminance(texture(uTexture, vUv + texel * vec2(1.0, -1.0)).rgb);

        float sx = c00 + 2.0 * c10 + c20 - (c02 + 2.0 * c12 + c22);
        float sy = c00 + 2.0 * c01 + c02 - (c20 + 2.0 * c21 + c22);

        float dist = sx * sx + sy * sy;

        float c = step(uThreshold, dist);

        return vec3(c,c,c);

    }`;