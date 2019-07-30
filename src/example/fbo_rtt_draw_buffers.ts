import { FboRttFsDrawBuffer } from './shader/fbo_rtt_fs_draw_buffer';
import { FboRttVsDrawBuffer } from './shader/fbo_rtt_vs_draw_buffer';
import { FboRttFsDraw } from './shader/fbo_rtt_fs_draw';
import { FboRttVsDraw } from './shader/fbo_rtt_vs_draw';
import { PlumeGL } from '../plumegl/engine/plumegl';

const triData: number[] = [
    -0.5, -0.5, -1.0,
    0.5, -0.5, -1.0,
    0.0, 0.5, 1.0
];

const quadData: number[] = [
    -1.0, -1.0,
    1.0, -1.0,
    1.0, 1.0,
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0
];

const quadTexData: number[] = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0
];

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

export const FboRttDrawBuffers = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const windowSize = {
        x: gl.drawingBufferWidth,
        y: gl.drawingBufferHeight
    };

    const drawBufferShader = new PlumeGL.Shader(FboRttVsDrawBuffer, FboRttFsDrawBuffer);
    const drawShader = new PlumeGL.Shader(FboRttVsDraw, FboRttFsDraw);
    drawBufferShader.initParameters();
    drawShader.initParameters();

    const scene1 = new PlumeGL.Scene();
    const scene2 = new PlumeGL.Scene();
    scene1.add(drawBufferShader);
    scene2.add(drawShader);

    // -- Initialize buffer
    const triPositions = new Float32Array(triData);
    const triMesh = new PlumeGL.Mesh();
    triMesh.setGeometryAttribute(triPositions, 'position', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    triMesh.initBufferAttributePoint(drawBufferShader);
    drawBufferShader.addDrawObject(triMesh);

    const quadPositions = new Float32Array(quadData);
    const quadTexcoords = new Float32Array(quadTexData);
    const quadMesh = new PlumeGL.Mesh();
    quadMesh.setGeometryAttribute(quadPositions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.setGeometryAttribute(quadTexcoords, 'textureCoordinates', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.initBufferAttributePoint(drawShader);
    drawShader.addDrawObject(quadMesh);

    //init texture    
    const texture0 = new PlumeGL.Texture2D();
    texture0.active(0);
    texture0.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
    texture0.setTextureFromData(null, [windowSize.x, windowSize.y]);
    texture0.wrapMode(true);
    texture0.filterMode(false);
    PlumeGL.Texture2D.unBind();
    texture0.attachTo(gl.DRAW_FRAMEBUFFER);

    const texture1 = new PlumeGL.Texture2D();
    texture1.active(1);
    texture1.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
    texture1.setTextureFromData(null, [windowSize.x, windowSize.y]);
    texture1.wrapMode(true);
    texture1.filterMode(false);
    PlumeGL.Texture2D.unBind();
    texture1.attachTo(gl.DRAW_FRAMEBUFFER);

    // -- Initialize frame buffer
    const tmpFrameBuffer = new PlumeGL.FrameBuffer();
    tmpFrameBuffer.attachTexture(texture0, gl.COLOR_ATTACHMENT0);
    tmpFrameBuffer.attachTexture(texture1, gl.COLOR_ATTACHMENT1);
    tmpFrameBuffer.setDrawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    tmpFrameBuffer.statusCheck();
    tmpFrameBuffer.rmDrawBuffer();

    const sceneState = new PlumeGL.State();
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    scene2.setSceneState(sceneState);

    // Pass 1: Draw to multiple textures
    tmpFrameBuffer.setDrawBuffer();
    scene1.forEachRender((shaderObj: any) => {
        shaderObj.use();
        shaderObj.forEachDraw((drawObj: any) => {
            drawObj.prepare();
            drawObj.draw({ start: 0, cnt: 3 });
            drawObj.unPrepare();
        });
    });

    // Pass 2: Draw to screen
    tmpFrameBuffer.rmDrawBuffer();
    scene2.state.stateChange();
    scene2.forEachRender((shaderObj: any) => {
        shaderObj.use();
        shaderObj.setUniformData('color1Map', [0]);
        shaderObj.setUniformData('color2Map', [1]);
        shaderObj.forEachDraw((drawObj: any) => {
            texture0.bind(0);
            texture1.bind(1);
            drawObj.prepare();
            drawObj.draw({ start: 0, cnt: 6 });
            drawObj.unPrepare();
        });
    });

    tmpFrameBuffer.dispose();
    scene1.dispose();
    scene2.dispose();
};