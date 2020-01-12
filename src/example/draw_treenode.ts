import { PlumeGL } from '../plumegl/engine/plumegl';
import { Camera } from '../plumegl/camera/camera';

let cav: any;
let gl: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 680;
    cav.height = 680;
    if (!cav) {
        return;
    }
    return <WebGL2RenderingContext>PlumeGL.initGL(cav);
};

const createSphereP3D = (shader: any): any => {
    const sphereGeometry = new PlumeGL.SphereGeometry();
    sphereGeometry.create(2.0, 30, 30);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(sphereGeometry.vertices, shader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.initBufferAttributePoint(shader);
    const p3d = new PlumeGL.P3D(mesh);
    return p3d;
}

export const DrawTreeNode = () => {

    gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultColor = new PlumeGL.DefaultColorShader();
    defaultColor.initParameters();

    const p3d1 = createSphereP3D(defaultColor);
    const node1 = new PlumeGL.Node(p3d1);
    node1.setWorldTransform(new PlumeGL.Vec3(-6.0, 0.0, 0.0), new PlumeGL.Quat(), new PlumeGL.Vec3());
    const p3d2 = createSphereP3D(defaultColor);
    const node2 = new PlumeGL.Node(p3d2);
    const p3d3 = createSphereP3D(defaultColor);
    const node3 = new PlumeGL.Node(p3d3);
    node3.setWorldTransform(new PlumeGL.Vec3(6.0, 0.0, 0.0), new PlumeGL.Quat(), new PlumeGL.Vec3());

    const scene = new PlumeGL.Scene();
    scene.addChild(node1);
    scene.addChild(node2);
    scene.addChild(node3);
    scene.add(defaultColor);
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
    scene.state.setClear(true, false, false);
    scene.state.setDepthTest(true);

    const fov: number = 60.0 * Math.PI / 180;
    const aspect: number = 1;
    const zNear: number = 0.1;
    const zFar: number = 1000.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fov, aspect, zNear, zFar);
    camera.setView(
        new PlumeGL.Vec3(0.0, 0.0, 0.0),
        new PlumeGL.Vec3(0.0, 0.0, 1000.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();
    scene.setActiveCamera(camera);

    scene.render(() => { });

}