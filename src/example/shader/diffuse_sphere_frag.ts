export const diffuseSphereFrag: string =
    `#version 300 es
    precision highp float;
    in vec3 lightIntensity;
    out vec4 fragColor;
    
    void main() {
        fragColor = vec4(lightIntensity, 1.0);
    }`;