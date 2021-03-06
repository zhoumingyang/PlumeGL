import { PlumeGL } from '../plumegl/engine/plumegl';
import { DrawFrameBufferVert } from './shader/draw_framebuffer_vert';
import { DrawFrameBufferFrag } from './shader/draw_framebuffer_frag';

const cubePositions: number[] = [
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,

    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,

    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,

    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,

    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
];

const cubeTexcoords: number[] = [
    0, 0,
    0, 1,
    1, 0,
    0, 1,
    1, 1,
    1, 0,

    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,

    0, 0,
    0, 1,
    1, 0,
    0, 1,
    1, 1,
    1, 0,

    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,

    0, 0,
    0, 1,
    1, 0,
    0, 1,
    1, 1,
    1, 0,

    0, 0,
    0, 1,
    1, 0,
    1, 0,
    0, 1,
    1, 1,
]

let cav: any;
let gl: any;
let last: number = 0;
let xRad: number = 0;
let yRad: number = 0;
let fbo: any;
let scene: any;
let srcTexture: any;
let tagTexture: any;

const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 398;
    cav.height = 298;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

const createSourceTexture = (): any => {
    const sourceTexture = new PlumeGL.Texture2D();
    sourceTexture.setFormat(PlumeGL.TYPE.LUMINANCE, PlumeGL.TYPE.LUMINANCE, PlumeGL.TYPE.UNSIGNED_BYTE);
    const data = new Uint8Array([
        128, 64, 128,
        0, 192, 0
    ]);
    PlumeGL.Texture2D.setPixelStorei(PlumeGL.TYPE.UNPACK_ALIGNMENT, 1);
    sourceTexture.setTextureFromData(data, new PlumeGL.Vec2(3, 2));
    sourceTexture.setFilterMode(PlumeGL.TYPE.NEAREST, PlumeGL.TYPE.NEAREST);
    sourceTexture.setWrapMode(PlumeGL.TYPE.CLAMP_TO_EDGE);
    return sourceTexture;
};

const createTargetTexture = (): any => {
    const targetTexture = new PlumeGL.Texture2D();
    targetTexture.setFormat(PlumeGL.TYPE.RGBA, PlumeGL.TYPE.RGBA, PlumeGL.TYPE.UNSIGNED_BYTE);
    const data: any = null;
    targetTexture.setTextureFromData(data, new PlumeGL.Vec2(256, 256));
    targetTexture.setFilterMode(PlumeGL.TYPE.LINEAR, PlumeGL.TYPE.LINEAR);
    targetTexture.setWrapMode(PlumeGL.TYPE.CLAMP_TO_EDGE);
    return targetTexture;
};

const initScene = (): any => {
    const scene = new PlumeGL.Scene();
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClear(true, true, false);
    scene.state.setDepthTest(true);
    scene.state.setCullFace(true, PlumeGL.STATE.CULLFACE_BACK);
    return scene;
};

const createFbo = (attachTexture: any) => {
    const fb = new PlumeGL.FrameBuffer();
    fb.attachTexture(attachTexture, PlumeGL.TYPE.COLOR_ATTACHMENT0);
    return fb;
}

const getCameraProjectViewMat = (aspect: number): any => {

    function degToRad(d: number) {
        return d * Math.PI / 180;
    }
    let fieldOfViewRadians = degToRad(60);

    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fieldOfViewRadians, aspect, 1, 2000);
    camera.setView(new PlumeGL.Vec3(0, 0, 2), new PlumeGL.Vec3(0, 0, 0), new PlumeGL.Vec3(0, 1, 0));
    camera.updateMat();

    const vm = camera.getViewMat();
    vm.value[12] = Math.abs(vm.value[12]);
    vm.value[13] = Math.abs(vm.value[13]);
    vm.value[14] = Math.abs(vm.value[14]);
    const ivm = vm.clone().invert();

    const pm = camera.getProjectMat();
    const pvm = pm.clone().multiply(ivm);

    return pvm;
}

const draw = (aspect: number, blue: boolean) => {

    const pvm = getCameraProjectViewMat(aspect);
    let yrm = new PlumeGL.Mat4();
    yrm = yrm.rotate(yRad, new PlumeGL.Vec3(0, 1, 0));
    const fm = pvm.clone().multiply(yrm);

    blue ? gl.clearColor(0.2, 0.2, 0.65, 1) : gl.clearColor(0, 0, 0, 1);
    scene.state.stateChange();
    scene.forEachRender((shaderObj: any) => {
        shaderObj.setUniformData('uMvp', [fm.value, false]);
        shaderObj.setUniformData('uTexture', [0]);
        shaderObj.forEachDraw((obj: any) => {
            obj.prepare();
            obj.draw({ start: 0, cnt: 36 });
            obj.unPrepare();
        });
    });
};

const renderScene = (time: number) => {

    time *= 0.001;
    let deltaTime = time - last;
    last = time;

    xRad += -0.7 * deltaTime;
    yRad += -0.4 * deltaTime;

    //pass1
    let aspect: number = 256 / 256;
    fbo.bind();
    srcTexture.bind();
    scene.state.setViewPort(0, 0, 256, 256);
    draw(aspect, true);

    //pass2
    tagTexture.bind();
    PlumeGL.FrameBuffer.unBind();
    scene.state.setViewPort(0, 0, PlumeGL.getSize().x, PlumeGL.getSize().y);
    aspect = PlumeGL.getSize().x / PlumeGL.getSize().y;
    draw(aspect, false);

    requestAnimationFrame(renderScene);
}

export const DrawFrameBufferTest = () => {
    gl = createGLContext();
    if (!gl) {
        return;
    }

    scene = initScene();

    const shader = new PlumeGL.Shader(DrawFrameBufferVert, DrawFrameBufferFrag);
    shader.initParameters();
    scene.add(shader);

    const aPosition = PlumeGL.ATTRIBUTE.POSITION;
    const aUv = PlumeGL.ATTRIBUTE.UV;
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(new Float32Array(cubePositions), aPosition, PlumeGL.TYPE.STATIC_DRAW, 3, PlumeGL.TYPE.FLOAT, false);
    mesh.setGeometryAttribute(new Float32Array(cubeTexcoords), aUv, PlumeGL.TYPE.STATIC_DRAW, 2, PlumeGL.TYPE.FLOAT, false);
    mesh.initBufferAttributePoint(shader);

    srcTexture = createSourceTexture();
    tagTexture = createTargetTexture();

    const p3d = new PlumeGL.P3D(mesh);
    shader.addDrawObject(p3d);

    fbo = createFbo(tagTexture);

    requestAnimationFrame(renderScene);
};