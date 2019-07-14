import { bufferUniformVert } from './shader/buffer_uniform_vert';
import { bufferUniformFrag } from './shader/buffer_uniform_frag';
import { PlumeGL } from '../plumegl/plumegl';

const element = [0, 1, 2, 2, 3, 0];

const pos = [
    -1.0, -1.0, -0.5,
    1.0, -1.0, -0.5,
    1.0, 1.0, -0.5,
    -1.0, 1.0, -0.5
];

const nor = [
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
];

const col = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0
];

const transData = [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,

    0.5, 0.0, 0.0, 0.0,
    0.0, 0.5, 0.0, 0.0,
    0.0, 0.0, 0.5, 0.0,
    0.0, 0.0, 0.0, 1.0,

    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
];

const light = [0.0, 0.0, 0.0, 0.0];

const mtlData = [
    0.1, 0.0, 0.0, 0.0,
    0.5, 0.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 4.0,
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

export const BufferUniform = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const shaderObj = new PlumeGL.Shader(gl, bufferUniformVert, bufferUniformFrag);
    shaderObj.initParameters();

    // -- Init Buffer
    const elementData = new Uint16Array(element);
    const vertices = new Float32Array(pos);
    const normal = new Float32Array(nor);
    const color = new Float32Array(col);
    const mesh = new PlumeGL.Mesh(gl);
    mesh.setIndices(elementData, gl.STATIC_DRAW);
    mesh.setGeometryAttribute(vertices, 'position', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(normal, 'normal', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(color, 'color', gl.STATIC_DRAW, 4, gl.FLOAT, false);
    mesh.initBufferAttributePoint(shaderObj);

    // init uniform buffer
    const transforms = new Float32Array(transData);
    var material = new Float32Array(mtlData);
    var lightPos = new Float32Array(light);
    shaderObj.setUniformBufferData('PerDraw', transforms, undefined, { subData: true });
    shaderObj.setUniformBufferData('PerScene', material, undefined, { subData: true });
    shaderObj.setUniformBufferData('PerPass', lightPos, undefined, { subData: true });

    mesh.prepare();
    shaderObj.bindBase();
    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    shaderObj.use();
    var uTime = 0;
    function render() {
        uTime += 0.01;
        transforms[16] = 0.1 * Math.cos(uTime) + 0.4;
        shaderObj.changeUniformBufferSubData('PerDraw', transforms);
        lightPos[0] = Math.cos(3 * uTime);
        lightPos[1] = Math.sin(6 * uTime);
        shaderObj.changeUniformBufferSubData('PerPass', lightPos);
        sceneState.stateChange();
        mesh.draw(undefined, { cnt: 6, type: gl.UNSIGNED_SHORT });
        requestAnimationFrame(render);
    }
    render();
};