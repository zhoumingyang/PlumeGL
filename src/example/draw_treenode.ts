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

const createSphereP3D = (shader: any, color?: any): any => {
    const sphereGeometry = new PlumeGL.SphereGeometry();
    sphereGeometry.create(2.0, 30, 30);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(sphereGeometry.vertices, shader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.initBufferAttributePoint(shader);
    const p3d = new PlumeGL.P3D(mesh);
    p3d.shader = shader;
    if (color) {
        p3d.setSelfUniform('uColor', [color.x, color.y, color.z]);
    }
    return p3d;
}

export const DrawTreeNode = () => {

    gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultColor = new PlumeGL.DefaultColorShader();
    defaultColor.initParameters();

    const p3d1 = createSphereP3D(defaultColor, new PlumeGL.Vec3(1.0, 0.0, 0.0));
    const node1 = new PlumeGL.Node(p3d1);
    node1.setWorldTransform(new PlumeGL.Vec3(-4.0, 0.0, 0.0), new PlumeGL.Quat(0.0, 0.0, 0.0, 1.0), new PlumeGL.Vec3(0.7, 0.7, 0.7));
    const p3d2 = createSphereP3D(defaultColor, new PlumeGL.Vec3(0.0, 1.0, 0.0));
    const node2 = new PlumeGL.Node(p3d2);
    const p3d3 = createSphereP3D(defaultColor, new PlumeGL.Vec3(0.0, 0.0, 1.0));
    const node3 = new PlumeGL.Node(p3d3);
    node3.setWorldTransform(new PlumeGL.Vec3(4.0, 0.0, 0.0), new PlumeGL.Quat(0.0, 0.0, 0.0, 1.0), new PlumeGL.Vec3(0.7, 0.7, 0.7));

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
        new PlumeGL.Vec3(0.0, 0.0, 10.0),
        new PlumeGL.Vec3(0.0, 0.0, -1000.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));
    camera.updateMat();
    scene.setActiveCamera(camera);

    scene.state.change();
    scene.render((shaderObj: any) => {
        shaderObj.forEachDraw((obj: any) => {
            const pm = scene.activeCamera.getProjectMat();
            const mv = scene.activeCamera.getModelViewMat(obj.getModelMat());
            shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [mv.value, false]);
            shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [pm.value, false]);
            obj.prepare();
            if (obj.primitive.attributes["indices"] && obj.primitive.attributes["indices"].length) {
                obj.draw(undefined, { cnt: obj.primitive.attributes["indices"].length, type: gl.UNSIGNED_SHORT });
            } else if (obj.primitive.attributes["aPosition"] && obj.primitive.attributes["aPosition"].length) {
                obj.draw({ start: 0, cnt: obj.primitive.attributes["aPosition"].length / 3 });
            }
            obj.unPrepare();
        });
    });

}