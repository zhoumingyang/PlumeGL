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

export const DrawEnvMap = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const imgUrls: string[] = [
        '../../res/cubemap/right.jpg', '../../res/cubemap/left.jpg',
        '../../res/cubemap/up.jpg', '../../res/cubemap/down.jpg',
        '../../res/cubemap/front.jpg', '../../res/cubemap/back.jpg'];

    //init scene and set state
    const scene = new PlumeGL.Scene();
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    //init shader program for cube map and env map
    const defaultCubeMap = new PlumeGL.DefaultCubeMapShader();
    defaultCubeMap.initParameters();
    scene.add(defaultCubeMap);

    const defaultEnvMap = new PlumeGL.DefaultEnvMapShader(PlumeGL.ENVMAP.REFLECT);
    defaultEnvMap.initParameters();
    scene.add(defaultEnvMap);

    const cubTex = new PlumeGL.TextureCube();
    cubTex.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);

    //create cube skybox
    const cubeGeometry = new PlumeGL.CubeGeometry();
    cubeGeometry.create(200, 200, 200);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(cubeGeometry.vertices, defaultCubeMap.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.initBufferAttributePoint(defaultCubeMap);
    const cubeP3d = new PlumeGL.P3D(mesh, cubTex);
    defaultCubeMap.addDrawObject(cubeP3d);
    cubeP3d.setSelfUniform('uOpacity', [1.0]);
    cubeP3d.setSelfUniform('uFlip', [1.0]);
    cubeP3d.setSelfUniform('uToneMappingExposure', [1.0]);
    cubeP3d.state.setDepthFunc(PlumeGL.STATE.FUNC_LESSEQUAL);

    //create sphere envmap
    const sphereGeometry = new PlumeGL.SphereGeometry();
    sphereGeometry.create(2.0, 50, 50);
    const sphereMesh = new PlumeGL.Mesh();
    sphereMesh.setGeometryAttribute(sphereGeometry.vertices, defaultEnvMap.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    sphereMesh.setGeometryAttribute(sphereGeometry.normals, defaultEnvMap.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    sphereMesh.setIndices(sphereGeometry.indices, gl.STATIC_DRAW);
    sphereMesh.initBufferAttributePoint(defaultEnvMap);
    const sphereP3d = new PlumeGL.P3D(sphereMesh, cubTex);
    defaultEnvMap.addDrawObject(sphereP3d);
    sphereP3d.setSelfUniform('uRefractionRatio', [0.98]);
    sphereP3d.setSelfUniform('uEnvMapFlip', [1.0]);
    sphereP3d.state.setDepthFunc(PlumeGL.STATE.FUNC_LESS);

    //init camera parameter
    const fieldOfView: number = 60.0 * Math.PI / 180;
    const aspect: number = 680 / 680;
    const zNear: number = 0.1;
    const zFar: number = 1000.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fieldOfView, aspect, zNear, zFar);
    camera.setView(
        new PlumeGL.Vec3(0.0, 0.0, -10),
        new PlumeGL.Vec3(0.0, 0.0, 1000.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();
    scene.setActiveCamera(camera);

    //render
    const render = (): void => {
        scene.state.stateChange();
        camera.updateMat();
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
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTENVMAPSHADER) {
                shaderObj.forEachDraw((obj: any) => {
                    const modelMat = obj.getModelMat();
                    const viewMat = camera.getViewMat();
                    const modelViewMat = camera.getModelViewMat(modelMat);
                    const normalMat = new PlumeGL.Mat3().getNormalMat(modelViewMat);
                    shaderObj.setUniformData(shaderObj.uniform.modelMatrix, [modelMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [projectMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.viewMatrix, [viewMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.normalMatrix, [normalMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.cameraPosition, [camera.position.value[0], camera.position.value[1], camera.position.value[2]]);
                    obj.prepare();
                    obj.draw(undefined, { cnt: sphereGeometry.indices.length, type: gl.UNSIGNED_SHORT });
                    obj.unPrepare();
                });
            }
        });
        requestAnimationFrame(render);
    };

    const loadTextureCube = (urls: string[]): void => {
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
    };

    loadTextureCube(imgUrls);
    requestAnimationFrame(render);
};