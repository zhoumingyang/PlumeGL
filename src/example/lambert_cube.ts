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

export const DrawLambertCube = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const cubeGeometry = new PlumeGL.CubeGeometry();
    cubeGeometry.create(2, 2, 2);

    const normaLines: any[] = [];
    const offset: number = 0.2;
    for (let i = 0, len = cubeGeometry.vertices.length; i < len; i += 6) {
        for (let j = i; j + 2 < (i + 6); j += 3) {
            let s: number[] = [cubeGeometry.vertices[j], cubeGeometry.vertices[j + 1], cubeGeometry.vertices[j + 2]];
            let n: number[] = [cubeGeometry.normals[j], cubeGeometry.normals[j + 1], cubeGeometry.normals[j + 2]];
            let e: number[] = [
                cubeGeometry.vertices[j] + cubeGeometry.normals[j] * offset,
                cubeGeometry.vertices[j + 1] + cubeGeometry.normals[j + 1] * offset,
                cubeGeometry.vertices[j + 2] + cubeGeometry.normals[j + 2] * offset];
            normaLines.push([s, e]);
        }
    }

    const defaultLambertShader = new PlumeGL.DefaultLambertShader();
    defaultLambertShader.initParameters();
    const basicLineShader = new PlumeGL.BasicLineShader();
    basicLineShader.initParameters();

    const scene = new PlumeGL.Scene();
    scene.add(defaultLambertShader);
    scene.add(basicLineShader);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    const ambientLight = new PlumeGL.AmbientLight();
    ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    ambientLight.ambient = 0.35;

    const parallelLight = new PlumeGL.ParallelLight();
    parallelLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    parallelLight.setDirection(new PlumeGL.Vec3(-1.0, -1.0, -1.0));

    const pointLight = new PlumeGL.PointLight();
    pointLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    pointLight.position = new PlumeGL.Vec3(-1.5, -1.5, -1.5);
    pointLight.diffuse = 1.0;
    pointLight.setAttenuation({
        constant: 1.0,
        linear: 0.5,
        exponent: 0.0
    });

    scene.addLight(ambientLight);
    scene.addLight(parallelLight);
    scene.addLight(pointLight);

    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(cubeGeometry.vertices, defaultLambertShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(cubeGeometry.normals, defaultLambertShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(cubeGeometry.uvs, defaultLambertShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(defaultLambertShader);

    let p3d = new PlumeGL.P3D(mesh);
    defaultLambertShader.addDrawObject(p3d);
    p3d.setSelfUniform(defaultLambertShader.uniform.opacity, [1.0]);
    p3d.setSelfUniform(defaultLambertShader.uniform.emissive, [0.0, 0.0, 0.0]);
    p3d.setSelfUniform(defaultLambertShader.uniform.diffuse, [1.0, 0.2, 0.2]);

    for (let i = 0; i < normaLines.length; i++) {
        const line = new PlumeGL.Line();
        const data: Float32Array = Float32Array.from(normaLines[i][0].concat(normaLines[i][1]));
        line.setGeometryAttribute(data, basicLineShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
        line.initBufferAttributePoint(basicLineShader);
        p3d = new PlumeGL.P3D(line);
        basicLineShader.addDrawObject(p3d);
        p3d.setSelfUniform(basicLineShader.uniform.color, [0.4, 0.4, 1.0]);
    }

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
        let tmpNormalMat = new PlumeGL.Mat4();
        tmpModelMat = tmpModelMat.translate(trans);
        const zAxis = new PlumeGL.Vec3(0, 0, 1);
        const yAxis = new PlumeGL.Vec3(0, 1, 0);
        tmpModelMat = tmpModelMat.rotate(cubeRotation, zAxis);
        tmpModelMat = tmpModelMat.rotate(cubeRotation * 0.7, yAxis);
        tmpNormalMat = tmpNormalMat.rotate(cubeRotation, zAxis);
        tmpNormalMat = tmpNormalMat.rotate(cubeRotation * 0.7, yAxis);

        scene.state.stateChange();
        scene.forEachRender((shaderObj: any) => {
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTLAMBERTSHADER) {
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
                    obj.draw({ start: 0, cnt: 36 });
                    obj.unPrepare();
                });
            }
            if (shaderObj.type === PlumeGL.CONSTANT.BASICLINESHADER) {
                shaderObj.forEachDraw((obj: any) => {
                    const modelMat = tmpModelMat.clone().multiply(obj.getModelMat());
                    const MVP = activeCamera.getProjectViewModelMat(modelMat);
                    shaderObj.setUniformData(shaderObj.uniform.mvp, [MVP.value, false]);
                    obj.prepare();
                    obj.draw({ start: 0, cnt: 2 });
                    obj.unPrepare();
                });
            }
        });
        requestAnimationFrame(render);

        cubeRotation += deltaTime;
    }
    requestAnimationFrame(render);
}