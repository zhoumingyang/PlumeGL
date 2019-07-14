export const testFragmentSource =
    `#version 300 es
precision highp float;
precision highp int;
#define LIGHT_NUMBER 5

in vec2 vUv;
in vec3 vPos;
in vec3 vNormal;

uniform vec3 diffuse;
struct Light {
    vec3 color;
    float intensity;
};
uniform Light lights[LIGHT_NUMBER];

out vec4 glColor;

void main() {
    vec3 uvColor = vec3(vUv.x / 10.0, vUv.y / 10.0, 0.5);
    vec3 posColor = vPos.xyz / 10.0;
    vec3 normalColor = vNormal / 10.0;
    vec3 tmpColor = vec3(1.0, 1.0, 1.0);
    for(int i = 0; i < LIGHT_NUMBER; i++) {
        tmpColor *= (lights[i].color.rgb * lights[i].intensity);
    }
    tmpColor *= diffuse;
    vec3 totalColor = uvColor * posColor * normalColor * tmpColor;
    glColor = vec4(totalColor.x, totalColor.y, totalColor.z, 1.0);
}`; 