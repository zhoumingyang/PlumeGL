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

const initDrawObject = (shader: any): any => {
    const planeGeometry = new PlumeGL.PlaneGeometry();
    planeGeometry.create(25, 25, 5, 5);
    const planeMesh = new PlumeGL.Mesh().initFromGeometry(planeGeometry, shader);
    const planeP3d = new PlumeGL.P3D(planeMesh);
    planeP3d.shader = shader;
    planeP3d.setSelfUniform('uColor', [0.5, 0.0, 0.7]);
    const planeNode = new PlumeGL.Node(planeP3d);
    const rotMat = new PlumeGL.Mat4().rotate(-Math.PI / 2, new PlumeGL.Vec3(1.0, 0.0, 0.0));
    planeNode.worldMatrix = rotMat.clone();
    planeNode.order = 0;

    const torusGeometry = new PlumeGL.TorusGeometry();
    torusGeometry.create(1.5, 0.5, 12, 24, Math.PI * 2);
    const torusMesh = new PlumeGL.Mesh().initFromGeometry(torusGeometry, shader);
    const torusP3d = new PlumeGL.P3D(torusMesh);
    torusP3d.shader = shader;
    torusP3d.setSelfUniform('uColor', [0.5, 0.6, 0.0]);
    const torusNode = new PlumeGL.Node(torusP3d);
    const transMat = new PlumeGL.Mat4().translate(new PlumeGL.Vec3(-3.0, 4.0, 1.5));
    const scaleMat = new PlumeGL.Mat4().scale(new PlumeGL.Vec3(1.0, 1.0, 1.0));
    const mat = transMat.clone().multiply(scaleMat.clone());
    torusNode.worldMatrix = mat.clone();
    torusNode.order = 1;

    const cubeGeometry = new PlumeGL.CubeGeometry();
    cubeGeometry.create(2.0, 2.0, 2.0);
    const cubeMesh = new PlumeGL.Mesh().initFromGeometry(cubeGeometry, shader);
    const cubeP3d = new PlumeGL.P3D(cubeMesh);
    cubeP3d.shader = shader;
    cubeP3d.setSelfUniform('uColor', [0.3, 0.8, 0.5]);
    const tm = new PlumeGL.Mat4().translate(new PlumeGL.Vec3(5.0, 2.0, 2.4));
    const rm = new PlumeGL.Mat4().rotate(-Math.PI / 4, new PlumeGL.Vec3(0.0, 1.0, 0.0));
    const sm = new PlumeGL.Mat4().scale(new PlumeGL.Vec3(1, 1, 1));
    const tmp = rm.clone().multiply(sm);
    const fm = tm.clone().multiply(tmp);
    const cubeNode = new PlumeGL.Node(cubeP3d);
    cubeNode.worldMatrix = fm.clone();
    cubeNode.order = 2;

    const sphereGeometry = new PlumeGL.SphereGeometry();
    sphereGeometry.create(2.0, 30, 30);
    const sphereMesh = new PlumeGL.Mesh().initFromGeometry(sphereGeometry, shader);
    const sphereP3d = new PlumeGL.P3D(sphereMesh);
    sphereP3d.shader = shader;
    sphereP3d.setSelfUniform('uColor', [0.8, 0.8, 0.8]);
    const sphereNode = new PlumeGL.Node(sphereP3d);
    const stm = new PlumeGL.Mat4().translate(new PlumeGL.Vec3(0.8, 1.5, 0.0));
    sphereNode.worldMatrix = stm.clone();
    sphereNode.order = 3;

    return {
        planeNode,
        torusNode,
        cubeNode,
        sphereNode,
    };
};

export const DrawBasicGeometryWithNode = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultColorShader = new PlumeGL.DefaultColorShader();
    defaultColorShader.initParameters();

    //init scene
    const scene = initScene();
    scene.add(defaultColorShader);

    //init camera
    const camera = initCamera();
    scene.setActiveCamera(camera);

    const { planeNode, torusNode, cubeNode, sphereNode } = initDrawObject(defaultColorShader);
    cubeNode.setEnable(false);
    scene.addChild(planeNode);
    scene.addChild(torusNode);
    scene.addChild(cubeNode);
    scene.addChild(sphereNode);

    const render = () => {
        scene.render();
        requestAnimationFrame(render);
    };

    render();
    scene.rootNode.removeChild(cubeNode);
    cubeNode.p3d.dispose();
}