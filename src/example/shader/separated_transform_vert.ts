export const separatedTransformVert: string =
    `#version 300 es
    #define POSITION_LOCATION 0
    precision highp float;
    precision highp int;
    uniform mat4 MVP;
    layout(location = POSITION_LOCATION) in vec4 position;
    out vec4 v_color;
    void main() {
        gl_Position = MVP * position;
        v_color = vec4(clamp(vec2(position), 0.0, 1.0), 0.0, 1.0);
    }`;