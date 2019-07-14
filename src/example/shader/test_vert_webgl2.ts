export const testVertexSource = 
`#version 300 es
precision highp float;
precision highp int;
layout (location = 0) in vec3 pos;
layout (location = 1) in vec2 uv; 
layout (location = 2) in vec3 normal;

out vec2 vUv;
out vec3 vPos;
out vec3 vNormal;

uniform mat4 mvp;
layout(std140) uniform matWN {
    mat4 worldMatrix;
    mat4 normalMatrix;
};

void main() {
    gl_Position = mvp * vec4(pos, 1.0);
    vUv = uv;
	vPos = (worldMatrix * vec4(pos, 1.0)).xyz;
	vNormal = (normalMatrix * vec4(normal, 0.0)).xyz;
}`;