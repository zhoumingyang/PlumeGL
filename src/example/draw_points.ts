import { drawPointsVert } from './shader/draw_points_vert';
import { drawPointsFrag } from './shader/draw_points_frag';
import { PlumeGL } from '../plumegl/plumegl';

const vertDatas: number[] = [
    -0.5, 0.5, 0.0,
    0.0, 0.5, 0.0,
    -0.25, 0.25, 0.0,
];

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = window.innerWidth;
    cav.height = window.innerHeight;
    if (!cav) {
        return;
    }
    let gl = cav.getContext('webgl2', { antialias: true, transparent: false });
    if (!gl) {
        console.warn('webgl2 is not avaliable');
        gl = cav.getContext('webgl', { antialias: true, transparent: false });
        if (!gl) {
            return;
        }
    }
    return gl;
};

export const DrawPoints = (): void => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const ShaderObj = new PlumeGL.Shader(gl, drawPointsVert, drawPointsFrag);
    ShaderObj.initParameters();
    const point = new PlumeGL.Point(gl);
    point.setGeometryAttribute(new Float32Array(vertDatas), 'position', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    point.initBufferAttributePoint(ShaderObj);
    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0.5, 0.5, 0.5, 1.0);
    sceneState.setClear(true, false, false);
    sceneState.setViewPort(0, 0, cav.width, cav.height);
    sceneState.stateChange();
    ShaderObj.use();
    point.prepare();
    point.draw({ start: 0, cnt: 3 });
    point.dispose();
    ShaderObj.dispose();
}