import { PlumeGL } from '../plumegl/engine/plumegl';
import { diffuseSphereVert } from "./shader/diffuse_sphere_vert";
import { diffuseSphereFrag } from "./shader/diffuse_sphere_frag";

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

const createSphereGeometry = (): any => {
    let latitudeBands = 50;
    let longitudeBands = 50;
    let radius = 2;

    let vertexPositionData = [];
    let normalData = [];
    let textureCoordData = [];
    let indexData = [];

    for (let latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
        let theta = latNumber * Math.PI / latitudeBands;
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
            let phi = longNumber * 2 * Math.PI / longitudeBands;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            let x = cosPhi * sinTheta;
            let y = cosTheta;
            let z = sinPhi * sinTheta;

            let u = 1 - (longNumber / longitudeBands);
            let v = 1 - (latNumber / latitudeBands);

            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);

            textureCoordData.push(u);
            textureCoordData.push(v);
        }
    }

    for (let latNumber = 0; latNumber < latitudeBands; ++latNumber) {
        for (let longNumber = 0; longNumber < longitudeBands; ++longNumber) {
            let first = (latNumber * (longitudeBands + 1)) + longNumber;
            let second = first + longitudeBands + 1;

            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

    return {
        vertices: new Float32Array(vertexPositionData),
        normals: new Float32Array(normalData),
        uvs: new Float32Array(textureCoordData),
        indices: new Uint16Array(indexData)
    };
};

let cubeRotation: number = 0.0;

export const DrawPhongSphere = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const { vertices, normals, uvs, indices } = createSphereGeometry();

    const scene = new PlumeGL.Scene();
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    const program = new PlumeGL.Shader(diffuseSphereVert, diffuseSphereFrag);
    program.initParameters();
    scene.add(program);

    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(vertices, 'position', gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(normals, 'normal', gl.STATIC_DRAW, 3, gl.FLOAT, false);

    let p3d = new PlumeGL.P3D(mesh);
    program.addDrawObject(p3d);

    const fieldOfView: number = Math.PI / 6.0;
    const aspect: number = 512 / 512;
    const zNear: number = 0.1;
    const zFar: number = 100.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fieldOfView, aspect, zNear, zFar);
    camera.setView(
        new PlumeGL.Vec3(0.0, 0.0, 10.0),
        new PlumeGL.Vec3(0.0, 0.0, 0.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();

    const modelMat = new PlumeGL.Mat4();
    const project = camera.getProjectMat();
    const modelView = camera.getModelViewMat(modelMat);
    const MVP = camera.getProjectViewModelMat(modelMat);

    scene.forEachRender((shaderObj: any) => {
        shaderObj.use();
        shaderObj.setUniformData("modelViewMatrix", [modelView.value, false]);
        shaderObj.setUniformData("MVP", [MVP.value, false]);
        shaderObj.setUniformData("lightPosition", [10.0, 10.0, 10.0, 1.0]);
        shaderObj.setUniformData("kd", [0.9, 0.5, 0.3]);
        shaderObj.setUniformData("ld", [1.0, 1.0, 1.0]);
        shaderObj.forEachDraw((_p3d: any) => {
            _p3d.prepare();
            _p3d.draw(undefined, { cnt: indices.length, type: gl.UNSIGNED_SHORT });
            _p3d.unPrepare();
        });
    });

    // program.setUniformData("modelViewMatrix", [modelView.value, false]);
    // program.setUniformData("MVP", [MVP.value, false]);

    // const modelViewMatrix = tmpModelMat.clone().multiply(obj.getModelMat());

    // const defaultPhongShader = new PlumeGL.DefaultPhongShader();
    // defaultPhongShader.initParameters();

    // const sphereGeometry = new PlumeGL.SphereGeometry();
    // sphereGeometry.create(2.0, 24, 16, 0, Math.PI * 2, 0, Math.PI);

    // const scene = new PlumeGL.Scene();
    // scene.add(defaultPhongShader);
    // scene.setSceneState(new PlumeGL.State());
    // scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    // scene.state.setClear(true, false, false);
    // scene.state.setDepthTest(true);

    // const ambientLight = new PlumeGL.AmbientLight();
    // ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    // ambientLight.ambient = 0.25;

    // const parallelLight = new PlumeGL.ParallelLight();
    // parallelLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    // parallelLight.setDirection(new PlumeGL.Vec3(-2.0, -2.0, -2.0));

    // scene.addLight(ambientLight);
    // scene.addLight(parallelLight);

    // const mesh = new PlumeGL.Mesh();
    // mesh.setGeometryAttribute(sphereGeometry.vertices, defaultPhongShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    // mesh.setGeometryAttribute(sphereGeometry.normals, defaultPhongShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    // mesh.setGeometryAttribute(sphereGeometry.uvs, defaultPhongShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
    // mesh.setIndices(sphereGeometry.indices, gl.STATIC_DRAW);
    // mesh.initBufferAttributePoint(defaultPhongShader);

    // const drawLength = sphereGeometry.indices.length;

    // let p3d = new PlumeGL.P3D(mesh);
    // defaultPhongShader.addDrawObject(p3d);
    // // p3d.setSelfUniform();

    // const fieldOfView: number = 45.0 * Math.PI / 180;
    // const aspect: number = 512 / 512;
    // const zNear: number = 0.1;
    // const zFar: number = 100.0;
    // const camera = new PlumeGL.PerspectiveCamera();
    // camera.setPersective(fieldOfView, aspect, zNear, zFar);
    // camera.setView(
    //     new PlumeGL.Vec3(0.0, 0.0, 0.0),
    //     new PlumeGL.Vec3(0.0, 0.0, -100.0),
    //     new PlumeGL.Vec3(0.0, 1.0, 0.0));
    // camera.updateMat();
    // scene.setActiveCamera(camera);

    // const trans = new PlumeGL.Vec3(0.0, 0.0, -6.0);
    // let then = 0;
    // function render(now: number) {
    //     now *= 0.001;
    //     const deltaTime = now - then;
    //     then = now;
    //     const activeCamera = scene.activeCamera;

    //     let tmpModelMat = new PlumeGL.Mat4();
    //     let tmpNormalMat = new PlumeGL.Mat4();
    //     tmpModelMat = tmpModelMat.translate(trans);
    //     const zAxis = new PlumeGL.Vec3(0, 0, 1);
    //     const yAxis = new PlumeGL.Vec3(0, 1, 0);
    //     tmpModelMat = tmpModelMat.rotate(cubeRotation, zAxis);
    //     tmpModelMat = tmpModelMat.rotate(cubeRotation * 0.7, yAxis);
    //     tmpNormalMat = tmpNormalMat.rotate(cubeRotation, zAxis);
    //     tmpNormalMat = tmpNormalMat.rotate(cubeRotation * 0.7, yAxis);

    //     scene.state.stateChange();
    //     scene.forEachRender((shaderObj: any) => {
    //         if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTPHONGSHADER) {
    //             shaderObj.forEachDraw((obj: any) => {
    //                 const modelMat = tmpModelMat.clone().multiply(obj.getModelMat());
    //                 const projectMat = activeCamera.getProjectMat();
    //                 const mvMat = activeCamera.getModelViewMat(modelMat);
    //                 const normalMat = new PlumeGL.Mat3().getNormalMat(mvMat);
    //                 shaderObj.setUniformData(shaderObj.uniform.modelMatrix, [modelMat.value, false]);
    //                 shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [mvMat.value, false]);
    //                 shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [projectMat.value, false]);
    //                 shaderObj.setUniformData(shaderObj.uniform.normalMatrix, [normalMat.value, false]);
    //                 obj.prepare();
    //                 //mesh.draw(undefined, { cnt: drawLength, type: gl.UNSIGNED_SHORT });
    //                 obj.unPrepare();
    //             });
    //         }
    //     });
    //     requestAnimationFrame(render);
    //     cubeRotation += deltaTime;
    // }
    // requestAnimationFrame(render);
};