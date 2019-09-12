export const Common: string =
    `uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    #define PI 3.14159265359
    #define saturate(a) clamp( a, 0.0, 1.0 )

    struct GeometryAttribute {
        vec3 position;
        vec3 normal;
        vec3 viewDir;
    };
    GeometryAttribute geometry;

    struct ResultLight {
        vec3 color;
        vec3 direction;
        bool visible;
    };
    ResultLight resultLight;

`;