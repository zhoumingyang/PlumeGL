// export const Common: string =
//     `uniform mat4 uModelMatrix;
//     uniform mat4 uModelViewMatrix;
//     uniform mat4 uProjectionMatrix;
//     uniform mat3 uNormalMatrix;

//     #define PI 3.14159265359
//     #define saturate(a) clamp( a, 0.0, 1.0 )

//     struct GeometryAttribute {
//         vec3 position;
//         vec3 normal;
//         vec3 viewDir;
//     };
//     GeometryAttribute geometry;

//     struct ResultLight {
//         vec3 color;
//         vec3 direction;
//         bool visible;
//     };
//     ResultLight resultLight;
// `;

export const UniformMatrix: string = `
    uniform mat4 uModelMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat3 uNormalMatrix;
`;

export const Defines: string = `
#define PI 3.14159265359
#define saturate(a) clamp( a, 0.0, 1.0 )
`;

export const GA: string = ` 
struct GeometryAttribute {
    vec3 position;
    vec3 normal;
    vec3 viewDir;
};
GeometryAttribute geometry;`;

export const ILA: string = `
struct IncidentLightAttribute {
    vec3 color;
    vec3 direction;
    bool visible;
};
IncidentLightAttribute idtLight;`;

export const RLA: string = `
struct ReflectLightAttribute {
    vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
ReflectLightAttribute rftLight;`;

export const Common = {
    UniformMatrix,
    Defines,
    GA,
    ILA,
    RLA
};