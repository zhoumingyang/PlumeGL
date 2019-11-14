export const DrawFrameBufferVert: string =
    `#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec4 aPosition;
layout(location = 1) in vec2 aUv;

uniform mat4 uMvp;

out vec2 vUv;

void main() {
    gl_Position = uMvp * aPosition;
    vUv = aUv;
}`;