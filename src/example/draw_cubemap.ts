import { PlumeGL } from '../plumegl/engine/plumegl';

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 680;
    cav.height = 680;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

export const DrawCubeMap = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultCubeMap = new PlumeGL.DefaultCubeMapShader();
    defaultCubeMap.initParameters();

    const imgUrls: string[] = [
        '../../res/cubemap/right.jpg', '../../res/cubemap/left.jpg',
        '../../res/cubemap/front.jpg', '../../res/cubemap/back.jpg',
        '../../res/cubemap/up.jpg', '../../res/cubemap/down.jpg'];

    const cubeGeometry = new PlumeGL.CubeGeometry();
    cubeGeometry.create(200, 200, 200);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(cubeGeometry.vertices, defaultCubeMap.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);

    const cubTex = new PlumeGL.TextureCube();
    cubTex.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);

    const p3d = new PlumeGL.P3D(mesh, cubTex);
    defaultCubeMap.addDrawObject(p3d);
    p3d.setSelfUniform('uOpacity', [1.0]);
    p3d.setSelfUniform('uFlip', [1.0]);
    p3d.setSelfUniform('uToneMappingExposure', [1.0]);

    const fieldOfView: number = 60.0 * Math.PI / 180;
    const aspect: number = 680 / 680;
    const zNear: number = 0.1;
    const zFar: number = 1000.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fieldOfView, aspect, zNear, zFar);
    camera.setView(
        new PlumeGL.Vec3(0.0, 0.0, 0.0),
        new PlumeGL.Vec3(0.0, 0.0, -1000.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();

    const scene = new PlumeGL.Scene();
    scene.add(defaultCubeMap);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);
    scene.setActiveCamera(camera);

    function render() {
        scene.stateChange();
        scene.forEachRender((shaderObj: any) => {
            const projectMat = camera.getProjectMat();
            if (shaderObj === PlumeGL.CONSTANT.DEFAULTCUBEMAPSHADER) {
                shaderObj.forEachDraw((obj: any) => {
                    const modelMat = obj.getModelMat();
                    const modelViewMat = camera.getModelViewMat(modelMat);
                    shaderObj.setUniformData(shaderObj.uniform.modelMatrix, [modelMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [modelViewMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [projectMat.value, false]);
                    obj.prepare();
                    obj.draw({ start: 0, cnt: 36 });
                    obj.unPrepare();
                });
            }
        });
        requestAnimationFrame(render);
    }

    function loadTextureCube(urls: string[]) {
        if (!urls || !urls.length) {
            return;
        }
        let cnt: number = 0;
        let img: any[] = new Array(urls.length);
        let len: number = urls.length;
        for (let i = 0; i < len; i++) {
            img[i] = new Image();
            img[i].crossOrigin = 'anonymous';
            img[i].onload = () => {
                cnt++;
                if (cnt === 6) {
                    for (let j = 0; j < cnt; j++) {
                        cubTex.setTextureFromImage(img[i], j);
                        cubTex.wrapMode(true);
                    }
                    cubTex.mipmap();
                    requestAnimationFrame(render);
                }
            }
            img[i].src = urls[i];
        }
    }

    loadTextureCube(imgUrls);
};