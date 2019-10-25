import { TransformDirection } from '../chunk/common';

export const DefaultCubeMapVert: string =
    `#version 300 es
    precision highp float;
    precision highp int;

    layout(location = 0) in vec3 aPosition;
    
    out vec3 vWorldDirection;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    ${TransformDirection}

    void main() {
        vWorldDirection = transformDirection(aPosition, modelMatrix);

        vec4 mvPosition = vec4(aPosition, 1.0);

        mvPosition = uModelViewMatrix * mvPosition;
        gl_Position = uProjectionMatrix * mvPosition;

        gl_Position.z = gl_Position.w;
    }`;