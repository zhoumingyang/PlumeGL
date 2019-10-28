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
        '../../res/cubemap/up.jpg', '../../res/cubemap/down.jpg',
        '../../res/cubemap/front.jpg', '../../res/cubemap/back.jpg'];

    const cubeGeometry = new PlumeGL.CubeGeometry();
    cubeGeometry.create(200, 200, 200);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(cubeGeometry.vertices, defaultCubeMap.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.initBufferAttributePoint(defaultCubeMap);

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
        new PlumeGL.Vec3(0.0, 0.0, 1000.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();

    const scene = new PlumeGL.Scene();
    scene.add(defaultCubeMap);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);
    scene.state.setDepthFunc(PlumeGL.STATE.FUNC_LESSEQUAL);
    scene.setActiveCamera(camera);

    const axis = new PlumeGL.Vec3(0.0, 1.0, 0.0);
    let angle = 0.0;

    function render() {
        scene.stateChange();
        angle += 0.005;
        let rad = angle * Math.PI / 180;
        if (rad > 2 * Math.PI) {
            angle = 0.0;
        }
        const cameraRotMat = new PlumeGL.Mat4().rotate(angle, axis);
        camera.updateMat();
        camera.applyMat(cameraRotMat);
        scene.forEachRender((shaderObj: any) => {
            const projectMat = camera.getProjectMat();
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTCUBEMAPSHADER) {
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
            ((j) => {
                img[j] = new Image();
                img[j].crossOrigin = 'anonymous';
                img[j].onload = () => {
                    cnt++;
                    if (cnt === 6) {
                        for (let k = 0; k < cnt; k++) {
                            cubTex.setTextureFromImage(img[k], k);
                            cubTex.wrapMode(true);
                            cubTex.filterMode(true, false, false);
                        }
                        cubTex.mipmap();
                    }
                }
                img[j].src = urls[j];
            })(i);
        }
    }

    loadTextureCube(imgUrls);
    requestAnimationFrame(render);
};