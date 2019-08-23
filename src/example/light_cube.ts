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

let mat: number[] = [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
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

export const DrawLightCube = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultLightShader = new PlumeGL.DefaultLightShader();
    defaultLightShader.initParameters();

    const scene = new PlumeGL.Scene();
    scene.add(defaultLightShader);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    const ambientLight = new PlumeGL.AmbientLight();
    ambientLight.ambient = 0.70;
    ambientLight.diffuse = 1.0;

    const parallelLight = new PlumeGL.ParallelLight();
    parallelLight.setDirection([1.0, 1.0, 1.0]);

    // const pointLight = new PlumeGL.PointLight();
    // pointLight.setPosition([0.0, 2.0, 0.0]);
    // pointLight.setAttenuation({
    //     constant: 1.0,
    //     linear: 0.5,
    //     exponent: 0.0
    // });

    // const spotLight = new PlumeGL.SpotLight();
    // spotLight.setPosition([0.0, 2.0, 0.0]);
    // spotLight.setCutoff(0.75);
    // spotLight.setDirection([0.0, -1.0, 0.0]);
    // spotLight.setAttenuation({
    //     constant: 1.0,
    //     linear: 0.25,
    //     exponent: 0.0,
    // });

    scene.addLight(ambientLight);
    scene.addLight(parallelLight);
    // scene.addLight(pointLight);
    // scene.addLight(spotLight);

    const vertices = new Float32Array(cubeVert);
    const normals = new Float32Array(cubeNormal);
    const uvs = new Float32Array(cubeUv);

    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(vertices, defaultLightShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(normals, defaultLightShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(uvs, defaultLightShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(defaultLightShader);

    const p3d = new PlumeGL.P3D(mesh);
    defaultLightShader.addDrawObject(p3d);

    function render() {
        scene.state.stateChange();
        scene.forEachRender((shaderObj: any) => {
            shaderObj.setUniformData(shaderObj.uniformMvp, [mat, false]);
            shaderObj.setUniformData(shaderObj.uniformWorlMatirx, [mat, false]);
            shaderObj.setUniformData(shaderObj.uniformNormalMatrix, [mat, false]);
            shaderObj.setUniformData(shaderObj.uniformEyePosition, [0.0, 1.5, 1.5]);
            shaderObj.setUniformData(shaderObj.uniformBoolMap, [1]);
            shaderObj.setUniformData(shaderObj.uniformSpecStrength, [1.0]);
            shaderObj.setUniformData(shaderObj.uniformSpecPower, [2]);
            p3d.prepare();
            p3d.draw({ start: 0, cnt: 24 });
            p3d.unPrepare();
        });
        requestAnimationFrame(render);
    }
    render();
};