export const BasicLineVert: string =
    `#version 300 es
    precision highp float;
    layout(location = 0) in vec3 aPosition;
    uniform mat4 uMvp;

    void main() {
        gl_Position = uMvp * vec4(aPosition, 1.0);
    }
`