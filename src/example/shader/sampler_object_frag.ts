export const sampleObjectFragmentSource =
    `#version 300 es
    #define FRAG_COLOR_LOCATION 0
    precision highp float;
    precision highp int;
    struct Material {
        sampler2D diffuse[2];
    };
    uniform Material material;
    in vec2 v_st;
    layout(location = FRAG_COLOR_LOCATION) out vec4 color;
    void main() {
        if (v_st.y / v_st.x < 1.0) {
            color = texture(material.diffuse[0], v_st);
        } else {
            color = texture(material.diffuse[1], v_st) * 0.77;
        }
    }`;