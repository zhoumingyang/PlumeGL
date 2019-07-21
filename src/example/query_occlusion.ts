import { PlumeGL } from '../plumegl/plumegl';
import { queryOcclusionVert } from './shader/query_occlusion_vert';
import { queryOcclusionFrag } from './shader/query_occlusion_frag';

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

const ver1Data: number[] = [
    -0.3, -0.5, 0.0,
    0.3, -0.5, 0.0,
    0.0, 0.5, 0.0,
];

const ver2Data: number[] = [
    -0.3, -0.5, 0.5,
    0.3, -0.5, 0.5,
    0.0, 0.5, 0.5
];

export const QueryOcclusion = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const scene = new PlumeGL.Scene();
    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    sceneState.setDepthTest(true);
    scene.setSceneState(sceneState);

    const shaderObj = new PlumeGL.Shader(gl, queryOcclusionVert, queryOcclusionFrag);
    shaderObj.use();
    scene.add(shaderObj);

    const ver1 = new Float32Array(ver1Data);
    const ver2 = new Float32Array(ver2Data);
    const triMesh1 = new PlumeGL.Mesh(gl);
    triMesh1.setGeometryAttribute(ver1, 'pos', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    triMesh1.initBufferAttributePoint(shaderObj);
    shaderObj.addDrawObject(triMesh1);
    const triMesh2 = new PlumeGL.Mesh(gl);
    triMesh2.setGeometryAttribute(ver2, 'pos', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    triMesh2.initBufferAttributePoint(shaderObj);
    shaderObj.addDrawObject(triMesh2);

    const tmpQuery = new PlumeGL.Query(gl);
    tmpQuery.setTarget(gl.ANY_SAMPLES_PASSED);

    // -- Render
    scene.stateChange();
    scene.forEachRender((shader: any, i: number) => {
        shader.use();
        shader.forEachDraw((obj: any, j: number) => {
            obj.prepare();
            if (j === 0) {
                obj.draw({ start: 0, cnt: 3 });
            } else {
                tmpQuery.begin();
                obj.draw({ start: 0, cnt: 3 });
                tmpQuery.end();
            }
            obj.unPrepare();
        });
        shader.unUse();
    });

    (function tick() {
        const passed = tmpQuery.getParam(gl.QUERY_RESULT);
        if (passed !== undefined) {
            console.log(passed);
        } else {
            requestAnimationFrame(tick);
        }
    })();

    shaderObj.dispose();
    scene.dispose();
}