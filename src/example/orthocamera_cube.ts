import { PlumeGL } from '../plumegl/engine/plumegl';

let cubeVert: number[] = [
    //front
    -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,
    //right
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
    //back
    1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
    -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
    //left
    -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
    -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
    //top
    1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    //bottom
    1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
    1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0
];

let cubeNormal: number[] = [
    //front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    //right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    //back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    //left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    //top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    //bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
];

let cubeUv: number[] = [
    //front
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
    //right
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
    //back
    1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0, -1.0, -1.0, -1.0,
    //left
    -1.0, 1.0, -1.0, -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0, -1.0, -1.0, 1.0,
    //top
    1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, -1.0, 1.0, -1.0, 1.0,
    //bottom
    1.0, -1.0, 1.0, -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0
];

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

export const DrawOrthoCube = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const normaLines: any[] = [];
    const offset: number = 0.2;
    for (let i = 0, len = cubeVert.length; i < len; i += 6) {
        for (let j = i; j + 2 < (i + 6); j += 3) {
            let s: number[] = [cubeVert[j], cubeVert[j + 1], cubeVert[j + 2]];
            let n: number[] = [cubeNormal[j], cubeNormal[j + 1], cubeNormal[j + 2]];
            let e: number[] = [
                cubeVert[j] + cubeNormal[j] * offset,
                cubeVert[j + 1] + cubeNormal[j + 1] * offset,
                cubeVert[j + 2] + cubeNormal[j + 2] * offset];
            normaLines.push([s, e]);
        }
    }

    const defaultLightShader = new PlumeGL.DefaultLightShader();
    defaultLightShader.initParameters();
    const basicLineShader = new PlumeGL.BasicLineShader();
    basicLineShader.initParameters();

    const scene = new PlumeGL.Scene();
    scene.add(defaultLightShader);
    scene.add(basicLineShader);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    const ambientLight = new PlumeGL.AmbientLight();
    ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    ambientLight.ambient = 0.25;

    const parallelLight = new PlumeGL.ParallelLight();
    parallelLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    parallelLight.setDirection(new PlumeGL.Vec3(-2.0, -2.0, -2.0));

    scene.addLight(ambientLight);
    scene.addLight(parallelLight);

    const vertices = new Float32Array(cubeVert);
    const normals = new Float32Array(cubeNormal);
    const uvs = new Float32Array(cubeUv);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(vertices, defaultLightShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(normals, defaultLightShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(uvs, defaultLightShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(defaultLightShader);

    let p3d = new PlumeGL.P3D(mesh);
    defaultLightShader.addDrawObject(p3d);

    for (let i = 0; i < normaLines.length; i++) {
        const line = new PlumeGL.Line();
        const data: Float32Array = Float32Array.from(normaLines[i][0].concat(normaLines[i][1]));
        line.setGeometryAttribute(data, basicLineShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
        line.initBufferAttributePoint(basicLineShader);
        p3d = new PlumeGL.P3D(line);
        basicLineShader.addDrawObject(p3d);
    }

    const left: number = -3;
    const right: number = 3;
    const top: number = 3;
    const bottom: number = -3;
    const near: number = 0.1;
    const far: number = 100.0;
    const camera = new PlumeGL.OrthoCamera();
    camera.setOrtho(left, right, top, bottom, near, far);
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
        const eyePos = activeCamera.position;

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
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTLIGHTSHADER) {
                shaderObj.setUniformData(shaderObj.uniformEyePosition, [eyePos.x, eyePos.y, eyePos.z]);
                shaderObj.setUniformData(shaderObj.uniformSpecStrength, [1.0]);
                shaderObj.setUniformData(shaderObj.uniformSpecPower, [2]);
                shaderObj.forEachDraw((obj: any) => {
                    const modelMat = tmpModelMat.clone().multiply(obj.getModelMat());
                    const normalMat = tmpNormalMat.clone().multiply(obj.getNormalMat());
                    const MVP = activeCamera.getProjectViewModelMat(modelMat);
                    shaderObj.setUniformData(shaderObj.uniformWorlMatirx, [modelMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniformNormalMatrix, [normalMat.value, false]);
                    shaderObj.setUniformData(shaderObj.uniformMvp, [MVP.value, false]);
                    obj.prepare();
                    obj.draw({ start: 0, cnt: 36 });
                    obj.unPrepare();
                });
            }
            if (shaderObj.type === PlumeGL.CONSTANT.BASICLINESHADER) {
                shaderObj.setUniformData(shaderObj.uniformColor, [1.0, 1.0, 1.0]);
                shaderObj.forEachDraw((obj: any) => {
                    const modelMat = tmpModelMat.clone().multiply(obj.getModelMat());
                    const MVP = activeCamera.getProjectViewModelMat(modelMat);
                    shaderObj.setUniformData(shaderObj.uniformMvp, [MVP.value, false]);
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
};