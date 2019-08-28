export const separatedFeedbackVert: string =
    `#version 300 es
    #define POSITION_LOCATION 0
    #define COLOR_POSITION 3
    precision highp float;
    precision highp int;
    layout(location = POSITION_LOCATION) in vec4 position;
    layout(location = COLOR_POSITION) in vec4 color;
    out vec4 v_color;
    void main() {
        gl_Position = position;
        v_color = color;
    }`;