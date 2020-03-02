export const sampleObjectFragmentSource =
    `#version 300 es
    #define FRAG_COLOR_LOCATION 0
    precision highp float;
    precision highp int;
    struct Material {
        sampler2D diffuse[2];
    };
    uniform Material uMaterial;

    in vec2 vUv;

    layout(location = FRAG_COLOR_LOCATION) out vec4 fragColor;

    void main() {
        if (vUv.y / vUv.x < 1.0) {
            fragColor = texture(uMaterial.diffuse[0], vUv);
        } else {
            fragColor = texture(uMaterial.diffuse[1], vUv) * 0.77;
        }
    }`;