import { drawInstancedUboVert } from './shader/draw_instanced_ubo_vert';
import { drawInstancedUboFrag } from './shader/draw_instanced_ubo_frag';
import { PlumeGL } from '../plumegl/plumegl';

const posData = [
    -0.3, -0.5,
    0.3, -0.5,
    0.0, 0.5
];

const transformData = [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    -0.5, 0.0, 0.0, 1.0,

    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.5, 0.0, 0.0, 1.0
];

const materialData = [
    1.0, 0.5, 0.0, 1.0,
    0.0, 0.5, 1.0, 1.0
];

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = window.innerWidth;
    cav.height = window.innerHeight;
    if (!cav) {
        return;
    }
    let gl = cav.getContext('webgl2', { antialias: true });
    if (!gl) {
        console.warn('webgl2 is not avaliable');
        gl = cav.getContext('webgl', { antialias: true });
        if (!gl) {
            return;
        }
    }
    return gl;
};

export const DrawInstancedUbo = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    // init shader object
    const shaderObj = new PlumeGL.Shader(gl, drawInstancedUboVert, drawInstancedUboFrag);
    shaderObj.initParameters();
    shaderObj.use();

    // init mesh object
    const vertices = new Float32Array(posData);
    const mesh = new PlumeGL.Mesh(gl);
    mesh.setGeometryAttribute(vertices, 'pos', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(shaderObj);

    // init uniform buffer
    const transforms = new Float32Array(transformData);
    const materials = new Float32Array(materialData);
    shaderObj.setUniformBufferData('Transform', transforms, gl.DYNAMIC_DRAW);
    shaderObj.setUniformBufferData('Material', materials, gl.STATIC_DRAW);

    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0, 0, 0, 1);
    sceneState.setClear(true, false, false);
    sceneState.stateChange();
    shaderObj.bindBase();
    mesh.prepare();
    mesh.draw({ start: 0, cnt: 3 }, undefined, { instance: true, cnt: 2 });
    mesh.unPrepare();
    mesh.dispose();
    shaderObj.dispose();
};