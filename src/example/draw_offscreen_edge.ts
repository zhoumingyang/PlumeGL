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

const initScene = (): any => {
    const scene = new PlumeGL.Scene();
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);
    return scene;
};

const initCamera = (): any => {
    const fov: number = 60.0 * Math.PI / 180;
    const aspect: number = 512 / 512;
    const zNear: number = 0.1;
    const zFar: number = 1000.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fov, aspect, zNear, zFar);
    const camPosition = new PlumeGL.Vec3(0, 10, 15);
    const camTarget = new PlumeGL.Vec3(0, 0, 0);
    const xRay = new PlumeGL.Vec3(1.0, 0.0, 0.0);
    const yRay = camTarget.clone().substract(camPosition.clone());
    let camUp = xRay.clone().cross(yRay.clone());
    camera.setView(camPosition, camTarget, camUp);
    camera.updateMat();
    return camera;
};

const initFBO = (gl: any): any => {
    const frameBuffer = new PlumeGL.FrameBuffer();
    frameBuffer.bind();

    //init texture
    const texture = new PlumeGL.Texture2D();
    texture.setTextureFromData(null, [512, 512]);
    texture.filterMode(false, false, false);
    texture.setLevelSection(0, 0);
    frameBuffer.attachTexture(texture, gl.COLOR_ATTACHMENT0);
    PlumeGL.Texture2D.unBind();

    //init depth render buffer
    const depthBuffer = new PlumeGL.RenderBuffer(gl.DEPTH_COMPONENT24);
    depthBuffer.setSize(512, 512);
    depthBuffer.allocate();
    frameBuffer.attachRenderBuffer(depthBuffer, gl.DEPTH_ATTACHMENT);

    frameBuffer.setDrawBuffers([gl.COLOR_ATTACHMENT0]);
    PlumeGL.FrameBuffer.unBind();

    return frameBuffer;
};

const initDrawObject = (shader: any): any => {
    const planeGeometry = new PlumeGL.PlaneGeometry();
    planeGeometry.create(25, 25, 5, 5);
    const planeMesh = new PlumeGL.Mesh().initFromGeometry(planeGeometry, shader);
    const planeP3d = new PlumeGL.P3D(planeMesh);
    shader.addDrawObject(planeP3d);
    planeP3d.setSelfUniform('uColor', [0.5, 0.0, 0.7]);
    const rotMat = new PlumeGL.Mat4().rotate(-Math.PI / 2, new PlumeGL.Vec3(1.0, 0.0, 0.0));
    planeP3d.modelMatrix = rotMat.clone();

    const torusGeometry = new PlumeGL.TorusGeometry();
    torusGeometry.create(1.5, 0.5, 12, 24, Math.PI * 2);
    const torusMesh = new PlumeGL.Mesh().initFromGeometry(torusGeometry, shader);
    const torusP3d = new PlumeGL.P3D(torusMesh);
    shader.addDrawObject(torusP3d);
    torusP3d.setSelfUniform('uColor', [0.5, 0.6, 0.0]);
    const transMat = new PlumeGL.Mat4().translate(new PlumeGL.Vec3(-3.0, 4.0, 1.5));
    const scaleMat = new PlumeGL.Mat4().scale(new PlumeGL.Vec3(1.0, 1.0, 1.0));
    const mat = transMat.clone().multiply(scaleMat.clone());
    torusP3d.modelMatrix = mat.clone();

    const cubeGeometry = new PlumeGL.CubeGeometry();
    cubeGeometry.create(2.0, 2.0, 2.0);
    const cubeMesh = new PlumeGL.Mesh().initFromGeometry(cubeGeometry, shader);
    const cubeP3d = new PlumeGL.P3D(cubeMesh);
    shader.addDrawObject(cubeP3d);
    cubeP3d.setSelfUniform('uColor', [0.3, 0.8, 0.5]);
    const tm = new PlumeGL.Mat4().translate(new PlumeGL.Vec3(5.0, 2.0, 2.4));
    const rm = new PlumeGL.Mat4().rotate(-Math.PI / 4, new PlumeGL.Vec3(0.0, 1.0, 0.0));
    const sm = new PlumeGL.Mat4().scale(new PlumeGL.Vec3(1, 1, 1));
    const tmp = rm.clone().multiply(sm);
    const fm = tm.clone().multiply(tmp);
    cubeP3d.modelMatrix = fm.clone();

    const sphereGeometry = new PlumeGL.SphereGeometry();
    sphereGeometry.create(2.0, 30, 30);
    const sphereMesh = new PlumeGL.Mesh().initFromGeometry(sphereGeometry, shader);
    const sphereP3d = new PlumeGL.P3D(sphereMesh);
    shader.addDrawObject(sphereP3d);
    sphereP3d.setSelfUniform('uColor', [0.8, 0.8, 0.8]);
    const stm = new PlumeGL.Mat4().translate(new PlumeGL.Vec3(0.8, 1.5, 0.0));
    sphereP3d.modelMatrix = stm.clone();

    return {
        planeP3d,
        torusP3d,
        cubeP3d,
        sphereP3d,
    };
}

const draw = (scene: any, gl: any) => {
    scene.state.change();
    scene.forEachRender((shaderObj: any) => {
        const pm = scene.activeCamera.getProjectMat();
        shaderObj.forEachDraw((obj: any) => {
            const mv = scene.activeCamera.getModelViewMat(obj.getModelMat());
            shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [mv.value, false]);
            shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [pm.value, false]);
            obj.prepare();
            if (obj.primitive.attributes["indices"] && obj.primitive.attributes["indices"].length) {
                obj.draw(undefined, { cnt: obj.primitive.attributes["indices"].length, type: gl.UNSIGNED_SHORT });
            } else if (obj.primitive.attributes["aPosition"] && obj.primitive.attributes["aPosition"].length) {
                obj.draw({ start: 0, cnt: obj.primitive.attributes["aPosition"].length / 3 });
            }
            obj.unPrepare();
        });
    });
};

export const DrawOffscreenEdge = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultColorShader = new PlumeGL.DefaultColorShader();
    defaultColorShader.initParameters();
    const defaultSobelShader = new PlumeGL.DefaultSobelShader();
    defaultSobelShader.initParameters();

    //init scene
    const scene = initScene();
    scene.add(defaultColorShader);

    //init camera
    const camera = initCamera();
    scene.setActiveCamera(camera);

    initDrawObject(defaultColorShader);

    const fbo = initFBO(gl);

    draw(scene, gl);
}