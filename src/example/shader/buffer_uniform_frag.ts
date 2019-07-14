export const bufferUniformFrag =
    `#version 300 es
precision highp float;
precision highp int;
layout(std140, column_major) uniform;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light {
    vec3 position;
};

uniform PerScene {
    Material material;
}u_perScene;

uniform PerPass {
    Light light;
}u_perPass;

in vec3 v_normal;
in vec3 v_view;
in vec4 v_color;

out vec4 color;

void main() {
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_perPass.light.position + v_view);
    vec3 v = normalize(v_view);

    vec3 diffuse = max(dot(n, l), 0.0) * u_perScene.material.diffuse;
    vec3 r = -reflect(l, n);
    vec3 specular = pow(max(dot(r, v), 0.0), u_perScene.material.shininess) * u_perScene.material.specular;
    color = vec4(u_perScene.material.ambient + diffuse + specular, 1.0);
}`;