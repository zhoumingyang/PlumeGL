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

let cubeRotation: number = 0.0;

export const DrawPhongSphere = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultPhongShader = new PlumeGL.DefaultPhongShader();
    defaultPhongShader.initParameters();

    const sphereGeometry = new PlumeGL.SphereGeometry();
    sphereGeometry.create(2.0, 50, 50);

    const scene = new PlumeGL.Scene();
    scene.add(defaultPhongShader);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    const ambientLight = new PlumeGL.AmbientLight();
    ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    ambientLight.ambient = 0.45;

    const parallelLight = new PlumeGL.ParallelLight();
    parallelLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    parallelLight.setDirection(new PlumeGL.Vec3(-2.0, -2.0, -2.0));

    scene.addLight(ambientLight);
    scene.addLight(parallelLight);

    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(sphereGeometry.vertices, defaultPhongShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(sphereGeometry.normals, defaultPhongShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(sphereGeometry.uvs, defaultPhongShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.setIndices(sphereGeometry.indices, gl.STATIC_DRAW);
    mesh.initBufferAttributePoint(defaultPhongShader);

    let p3d = new PlumeGL.P3D(mesh);
    defaultPhongShader.addDrawObject(p3d);

    const fieldOfView: number = 45.0 * Math.PI / 180;
    const aspect: number = 512 / 512;
    const zNear: number = 0.1;
    const zFar: number = 100.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fieldOfView, aspect, zNear, zFar);
    camera.setView(
        new PlumeGL.Vec3(0.0, 0.0, 0.0),
        new PlumeGL.Vec3(0.0, 0.0, -100.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();
    scene.setActiveCamera(camera);

    const trans = new PlumeGL.Vec3(0.0, 0.0, -6.0);
    let then = 0;
    function render(now: number) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;
        const activeCamera = scene.activeCamera;

        let tmpModelMat = new PlumeGL.Mat4();
        // let tmpNormalMat = new PlumeGL.Mat4();
        tmpModelMat = tmpModelMat.translate(trans);
        const zAxis = new PlumeGL.Vec3(0, 0, 1);
        const yAxis = new PlumeGL.Vec3(0, 1, 0);
        // tmpModelMat = tmpModelMat.rotate(cubeRotation, zAxis);
        // tmpModelMat = tmpModelMat.rotate(cubeRotation * 0.7, yAxis);
        // tmpNormalMat = tmpNormalMat.rotate(cubeRotation, zAxis);
        // tmpNormalMat = tmpNormalMat.rotate(cubeRotation * 0.7, yAxis);

        scene.state.stateChange();
        scene.forEachRender((shaderObj: any) => {
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTPHONGSHADER) {
                shaderObj.forEachDraw((obj: any) => {
                    const modelMat = tmpModelMat.clone().multiply(obj.getModelMat());
                    const projectMat = activeCamera.getProjectMat();
                    const mvMat = activeCamera.getModelViewMat(modelMat);
                    const normalMat = new PlumeGL.Mat3().getNormalMat(mvMat);
                    shaderObj.setUniformData(shaderObj.uniform.modelMatrix, [modelMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [mvMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [projectMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniform.normalMatrix, [normalMat.value, false]);
                    obj.prepare();
                    mesh.draw(undefined, { cnt: sphereGeometry.indices.length, type: gl.UNSIGNED_SHORT });
                    obj.unPrepare();
                });
            }
        });
        requestAnimationFrame(render);
        cubeRotation += deltaTime;
    }
    requestAnimationFrame(render);
};