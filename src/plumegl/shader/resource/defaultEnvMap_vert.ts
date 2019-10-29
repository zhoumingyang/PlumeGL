export const DefaultEnvMapVert: string =
    `#version 300 es
    layout(location = 0) in vec3 aPosition;
    layout(location = 1) in vec3 aNormal;

    out vec3 vReflect;
    
    uniform mat4 uViewMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uProjectionMatrix;

    uniform float uRefractionRatio;
    uniform vec3 uCameraPosition;

    void main() {

        vec4 mvPosition = uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix * mvPosition;

        vec4 worldPosition = uModelMatrix * vec4(aPosition, 1.0);

        vec3 cameraToVertex = normalize(worldPosition.xyz - uCameraPosition);

        vec3 worldNormal = inverseTransformDirection(uNormalMatrix * vec3(aNormal), viewMatrix);

        vReflect = reflect(cameraToVertex, worldNormal);

    }`;