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
    const camPosition = new PlumeGL.Vec3(0, 8, 15);
    const camTarget = new PlumeGL.Vec3(0, 0, 0);
    const xRay = new PlumeGL.Vec3(1.0, 0.0, 0.0);
    const yRay = camTarget.clone().substract(camPosition.clone());
    const camUp = xRay.clone().cross(yRay.clone());
    camera.setView(camPosition, camTarget, camUp);
    camera.updateMat();
    return camera;
};

const initMeshFromGeometry = (geometry: any, shader: any, gl: any, option?: any): any => {
    const mesh = new PlumeGL.Mesh();
    if (shader.positionAttribute) {
        mesh.setGeometryAttribute(geometry.vertices, shader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    }
    if (shader.normalAttribute) {
        mesh.setGeometryAttribute(geometry.normals, shader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    }
    if (shader.uvAttribute) {
        mesh.setGeometryAttribute(geometry.normals, shader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    }
    if (option.setIndices) {
        mesh.setIndices(geometry.indices, gl.STATIC_DRAW);
    }
    return mesh;
}

const initDrawObject = (shader: any, gl: any): any => {

}

export const DrawBasicGeometry = () => {

    const gl = createGLContext();
    if (!gl) {
        return;
    }

    //init scene
    const scene = initScene();

    //init camera
    const camera = initCamera();
    scene.setActiveCamera(camera);
}