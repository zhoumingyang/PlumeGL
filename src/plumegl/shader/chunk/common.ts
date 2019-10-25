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
};`;

export const ILA: string = `
struct IncidentLightAttribute {
    vec3 color;
    vec3 direction;
    bool visible;
};`;

export const RLA: string = `
struct ReflectLightAttribute {
    vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};`;

export const BPM: string = `
struct PhongMaterialAttribute {
    vec3 diffuseColor;
    vec3 specularColor;
    float specularShininess;
    float specularStrength;
};`;

export const InverseTransformDirection: string =
    `vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
        return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
    }`;

export const TransformDirection: string =
    `vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
        return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
    }`;

export const Common = {
    UniformMatrix,
    Defines,
    GA,
    ILA,
    RLA,
    BPM,
    InverseTransformDirection,
    TransformDirection
};