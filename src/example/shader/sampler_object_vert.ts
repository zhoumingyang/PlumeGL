export const sampleObjectVertexSource =
    `#version 300 es
#define POSITION_LOCATION 0
#define TEXCOORD_LOCATION 4
precision highp float;
precision highp int;

uniform mat4 mvp;
uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

layout(location = POSITION_LOCATION) in vec2 aPosition;
layout(location = TEXCOORD_LOCATION) in vec2 aUv;

out vec2 vUv;

void main() {
    vUv = aUv;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 0.0, 1.0) ;
}`;

