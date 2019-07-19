export const fboMultiSampleVsRender: string =
    ` #version 300 es
#define POSITION_LOCATION 0
precision highp float;
precision highp int;
uniform mat4 MVP;
layout(location = POSITION_LOCATION) in vec2 position;
void main() {
    gl_Position = MVP * vec4(position, 0.0, 1.0);
}`;