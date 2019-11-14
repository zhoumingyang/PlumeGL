export const CONSTANT = {
    BASEBUFFER: Symbol('BaseBuffer'),
    ARRAYBUFFER: Symbol('ArrayBuffer'),
    FRAMEBUFFER: Symbol('FrameBuffer'),
    INDEXBUFFER: Symbol('IndexBuffer'),
    RENDERBUFFER: Symbol('RenderBuffer'),
    UNIFORMBUFFER: Symbol('UniformBuffer'),
    TEXTURE: Symbol('Texture'),
    TEXTURE2D: Symbol('Texture2D'),
    TEXTURECUBE: Symbol('TextureCube'),
    TEXTURE3D: Symbol('Texture3D'),
    TEXTURE2DARRAY: Symbol('Texture2DArray'),
    SAMPLER: Symbol('Sampler'),
    PRIMITIVE: Symbol('Primitive'),
    MESH: Symbol('Mesh'),
    LINE: Symbol('Line'),
    POINT: Symbol('Point'),
    SCENE: Symbol('Scene'),
    P3D: Symbol('P3D'),
    SHADER: Symbol('Shader'),
    STATE: Symbol('State'),
    VAO: Symbol('Vao'),
    QUERY: Symbol('Query'),
    FEEDBACK: Symbol('FeedBack'),
    BASELIGHT: Symbol('BaseLight'),
    AMBIENTLIGHT: Symbol('AmbientLight'),
    PARALLELLIGHT: Symbol('ParallelLight'),
    POINTLIGHT: Symbol('PointLight'),
    SPOTLIGHT: Symbol('SpotLight'),
    DEFAULTLIGHTSHADER: Symbol('DefaultLightShader'),
    BASICLINESHADER: Symbol('BasicLineShader'),
    DEFAULTLAMBERTSHADER: Symbol('DefaultLambertShader'),
    DEFAULTPHONGSHADER: Symbol('DefaultPhongShader'),
    DEFAULTCOLORSHADER: Symbol('DefaultColorShader'),
    DEFAULTCUBEMAPSHADER: Symbol('DefaultCubeMapShader'),
    DEFAULTENVMAPSHADER: Symbol('DefaultEnvMapShader'),
    DEFAULTDASHLINESHADER: Symbol('DefaultDashLineShader'),
    DEFAULTSOBELSHADER: Symbol('DefaultSobelShader'),
    DEFAULTCOPYSHADER: Symbol('DefaultCopyShader'),
    CAMERA: Symbol('Camera'),
    PERSPECTIVECAMERA: Symbol('PerspectiveCamera'),
    ORTHOCAMERA: Symbol('OrthoCamera'),
    MAT4: Symbol('Mat4'),
    VEC3: Symbol('Vec3'),
    QUAT: Symbol('Quat'),
    MAT3: Symbol('Mat3'),
    BASEGEOMETRY: Symbol('BaseGeometry'),
    SPHEREGEOMETRY: Symbol('SphereGeometry'),
    CUBEGEOMETRY: Symbol('CubeGeometry'),
    PLANEGEOMETRY: Symbol('PlaneGeometry'),
    TORUSGEOMETRY: Symbol('TORUSEGEOMETRY'),
    SCREENPLANEGEOMETRY: Symbol('ScreenPlaneGeometry')
};
Object.freeze(CONSTANT);

export const STATE = {
    SCENECLEAR: 'sceneclear',
    VIEWPORT: 'viewport',
    BUFFERCLEAR: 'bufferclear',
    COLORCLERA: 'colorclear',
    COLORMASK: 'colormask',
    DEPTHTEST: 'depthtest',
    DEPTHMASK: 'depthmask',
    DEPTHFUNC: 'depthfunc',
    DEPTHCLEAR: 'depthclear',
    STENCILMASK: 'stencilmask',
    STENCILFUNC: 'stencilfunc',
    STENCILOP: 'stencilop',
    STENCILCLEAR: 'stencilclear',
    CULLFACE: 'cullface',
    POLYGONOFFSET: 'polygonoffset',
    BLENDTEST: 'blendtest',
    RASTERDISCARD: 'rasterDiscard',
    BLENDFUNC: 'blendfunc',
    FUNC_NEVER: 'never',
    FUNC_ALWAYS: 'alway',
    FUNC_LESS: 'less',
    FUNC_LESSEQUAL: 'lessequal',
    FUNC_EQUAL: 'equal',
    FUNC_GREATEREQUAL: 'greaterequal',
    FUNC_GREATER: 'greater',
    FUNC_NOTEQUAL: 'notequal',
    FUNC_ADD: 'add',
    FUNC_SUBSTRACT: 'substract',
    FUNC_REVERSESUBSTRACT: 'reversesubstract',
    FUNC_MIN: 'min',
    FUNC_MAX: 'max',
    CULLFACE_FRONT: 'front',
    CULLFACE_BACK: 'back',
    CULLFACE_FRONT_AND_BACK: 'front_and_back',
    COLOR_BUFFER: 'color',
    DEPTH_BUFFER: 'depth',
    STENCIL_BUFFER: 'stencil',
    DEPTH_STENCIL_BUFFER: 'depth_stencil',
};
Object.freeze(STATE);

export const TEXTURE = {
    WRAP_S: 'WRAP_S',
    WRAP_T: 'WRAP_T',
    WRAP_R: 'WRAP_R',
    MAG_FILTER: 'MAG_FILTER',
    MIN_FILTER: 'MIN_FILTER',
    MAX_LOD: 'MAX_LOD',
    MIN_LOD: 'MIN_LOD',
    COMPARE_MODE: 'COMPARE_MODE',
    COMPARE_FUNC: 'COMPARE_FUNC'
};
Object.freeze(TEXTURE);

export const ENVMAP = {
    REFLECT: 'reflect',
    REFRACT: 'refract',
};
Object.freeze(ENVMAP);