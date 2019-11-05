import { PlumeGL } from '../plumegl/engine/plumegl';

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 512;
    cav.height = 512;
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
};

export const DrawDashLine = (): void => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const scene = new PlumeGL.Scene();
    scene.state = new PlumeGL.State();
    scene.state.setViewPort(0, 0, 480, 480);
    scene.state.setClearColor(0.0, 0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);

    const defaultDashLineShader = new PlumeGL.DefaultDashLineShader();
    defaultDashLineShader.initParameters();
    scene.add(defaultDashLineShader);

    const COUNT: number = 6;
    const line = new PlumeGL.Line();
    line.setDrawType(gl.LINE_LOOP);
    const position2D = createPolygon(COUNT, 0.15);
    let position3D: number[] = [];
    for (let i = 0; i < position2D.length; i += 2) {
        position3D.push(position2D[i], position2D[i + 1], 0);
    }
    line.setGeometryAttribute(new Float32Array(position3D), defaultDashLineShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    line.initLineLengthAttribute(defaultDashLineShader.lengthAttribute);
    line.initBufferAttributePoint(defaultDashLineShader);
    const p3d = new PlumeGL.P3D(line);
    defaultDashLineShader.addDrawObject(p3d);
    p3d.setSelfUniform("uColor", [1.0, 0.0, 0.0]);
    p3d.setSelfUniform("uDashSize",[0.5]);
    p3d.setSelfUniform("uGapSize",[0.5]);

    scene.state.stateChange();
    const proMat = new PlumeGL.Mat4();
    const mv = new PlumeGL.Mat4();
    scene.forEachRender((shaderObj: any) => {
        shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [proMat.value, false]);
        shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [mv.value, false]);
        shaderObj.forEachDraw((obj: any) => {
            obj.prepare();
            obj.draw({ start: 0, cnt: COUNT });
            obj.unPrepare();
        });
    });

}