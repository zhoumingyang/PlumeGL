export const texture3DVert: string =
    `#version 300 es
#define POSITION_LOCATION 0
#define TEXCOORD_LOCATION 1
precision highp float;
precision highp int;
layout(location = POSITION_LOCATION) in vec2 position;
layout(location = TEXCOORD_LOCATION) in vec2 in_texcoord;
out vec3 v_texcoord;
uniform mat4 orientation;
void main() {
    v_texcoord = (orientation * vec4(in_texcoord - vec2(0.5, 0.5), 0.5, 1.0)).stp;
    gl_Position = vec4(position, 0.0, 1.0);
}`;