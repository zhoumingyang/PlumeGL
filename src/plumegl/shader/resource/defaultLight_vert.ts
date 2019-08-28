/**
 * attribute: aPosition, aNormal, aUv
 * uniform: uMvp, uWorldMatrix, uNormalMatrix
 * varying: vPosition, vNormal, vUv
 *  */

export const DefaultLightVert: string =
    `precision highp float;
precision highp int;

layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aUv;

uniform mat4 uMvp;
uniform mat4 uWorldMatrix;
uniform mat4 uNormalMatrix;

out vec3 vPosition;
out vec3 vNormal;
out vec2 vUv;

void main() {

    gl_Position = uMvp * vec4(aPosition, 1.0);
    
    vPosition = (uWorldMatrix * vec4(aPosition, 1.0)).xyz;
    vNormal = (uNormalMatrix * vec4(aNormal, 0.0)).xyz;
    vUv = aUv;

}`;