
import { Attribute } from "../chunk/attribute";

export const DefaultPhongVert: string =
    `precision highp float;
    precision highp int;
    ${Attribute}

    uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;

    out vec3 vViewPosition;
    out vec3 vNormal;
    out vec2 vUv;
    out vec3 vWorldPosition;

    void main() {
        vUv = uv;

        vec3 objectNormal = vec3(normal);
        vec3 transformedNormal = uNormalMatrix * objectNormal;
        vNormal = normalize( transformedNormal );

        vec3 transformed = vec3( position );
        vec4 mvPosition = uModelViewMatrix * vec4( transformed, 1.0 );
        gl_Position = uProjectionMatrix * mvPosition;

        vViewPosition = -mvPosition.xyz;
        vec4 worldPosition = uModelMatrix * vec4( transformed, 1.0 );
        vWorldPosition = worldPosition.xyz;
    }`;