import { drawLineVert } from './shader/draw_line_vert';
import { drawLineFrag } from './shader/draw_line_frag';
import { PlumeGL } from '../plumegl/engine/plumegl';

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = window.innerWidth;
    cav.height = window.innerHeight;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

const createPolygon = (count: number = 72, radius: number = 0.75, phase: number = 0.0): Float32Array => {
    const vertices = new Float32Array(count * 2);
    for (let index = 0; index < count; index++) {
        const a = ((index / count) * Math.PI * 2);
        vertices[(index * 2) + 0] = (Math.cos(a + phase) * radius) * 5;
        vertices[(index * 2) + 1] = (Math.sin(a + phase) * radius) * 5;
    }
    return vertices;
}

export const DrawLine = (): void => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const ShaderObj = new PlumeGL.Shader(drawLineVert, drawLineFrag);
    ShaderObj.initParameters();
    const COUNT = 6;
    const line = new PlumeGL.Line();
    line.setDrawType(gl.LINE_LOOP);
    line.setGeometryAttribute(createPolygon(COUNT, 0.15), 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    line.initBufferAttributePoint(ShaderObj);
    const sceneState = new PlumeGL.State();
    sceneState.setViewPort(0, 0, 480, 480);
    sceneState.setClearColor(0.0, 0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    sceneState.stateChange();
    ShaderObj.use();
    line.prepare();
    line.setLineWidth(1.5);
    line.draw({ start: 0, cnt: COUNT });
    line.dispose();
}