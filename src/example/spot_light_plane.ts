import { PlumeGL } from '../plumegl/engine/plumegl';

let planeVert: number[] = [
    -10.0, 0.0, 10.0,
    10.0, 0.0, 10.0,
    10.0, 0.0, -10.0,
    -10.0, 0.0, -10.0,
    -10.0, 0.0, 10.0,
    10.0, 0.0, -10.0
];

let planeNormal: number[] = [
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
];

let planeUv: number[] = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    1.0, 1.0
];

const create = (): Float32Array => {
    let out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

const perspective = (fovy: number, aspect: number, near: number, far: number): Float32Array => {
    let out = new Float32Array(16);
    let f: number = 1.0 / Math.tan(fovy / 2.0);
    let nf: number = 1.0 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = 2 * far * near * nf;
    out[15] = 0;
    return out;
};

const lookAt = (eye: Float32Array, center: Float32Array, up: Float32Array): Float32Array => {

    let out = new Float32Array(16);

    let x0: number = void 0,
        x1: number = void 0,
        x2: number = void 0,
        y0: number = void 0,
        y1: number = void 0,
        y2: number = void 0,
        z0: number = void 0,
        z1: number = void 0,
        z2: number = void 0,
        len: number = void 0;
    let eyex = eye[0];
    let eyey = eye[1];
    let eyez = eye[2];
    let upx = up[0];
    let upy = up[1];
    let upz = up[2];
    let centerx = center[0];
    let centery = center[1];
    let centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return create();
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
}

const cross = (a: Float32Array, b: Float32Array): Float32Array => {
    let out = new Float32Array(3);
    let ax = a[0], ay = a[1], az = a[2];
    let bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}

const multiply = (a: Float32Array, b: Float32Array): Float32Array => {
    const out: Float32Array = new Float32Array(16);
    let a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    let a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    let a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    let a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

    // Cache only the current line of the second matrix
    let b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}

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

export const DrawSpotLightPlane = () => {
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
    ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    ambientLight.ambient = 0.25;

    const spotLight = new PlumeGL.SpotLight();
    spotLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
    spotLight.position = new PlumeGL.Vec3(0.0, 2.0, 0.0);
    spotLight.direction = new PlumeGL.Vec3(0.0, -1.0, 0.0);
    spotLight.diffuse = 1.0;
    spotLight.cutoff = 0.75;
    spotLight.setAttenuation({
        constant: 1.0,
        linear: 0.25,
        exponent: 0.0,
    });

    scene.addLight(ambientLight);
    scene.addLight(spotLight);

    const vertices = new Float32Array(planeVert);
    const normals = new Float32Array(planeNormal);
    const uvs = new Float32Array(planeUv);
    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(vertices, defaultLightShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(normals, defaultLightShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
    mesh.setGeometryAttribute(uvs, defaultLightShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(defaultLightShader);

    const p3d = new PlumeGL.P3D(mesh);
    defaultLightShader.addDrawObject(p3d);
    p3d.setSelfUniform(defaultLightShader.uniform.specStrength, [1.0]);
    p3d.setSelfUniform(defaultLightShader.uniform.specPower, [2]);

    let modelMat = create();
    let viewMat = create();
    let projectionMat = create();
    let mv = create();
    let mvp = create();

    let left = Float32Array.from([1.0, 0.0, 0.0]);
    let eyePos = Float32Array.from([0.0, 1.0, -11.0]);
    let center = Float32Array.from([0.0, 0.0, 0.0]);
    let cameraDir = Float32Array.from([0.0, -1.0, 0.0]);
    let up = cross(cameraDir, left);
    viewMat = lookAt(eyePos, center, up);

    const fieldOfView: number = 60.0 * Math.PI / 180;
    const aspect: number = 512 / 512;
    const zNear: number = 0.1;
    const zFar: number = 100.0;
    projectionMat = perspective(fieldOfView, aspect, zNear, zFar);

    mv = multiply(viewMat, modelMat);
    mvp = multiply(projectionMat, mv);

    scene.state.stateChange();
    function render() {
        scene.forEachRender((shaderObj: any) => {
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTLIGHTSHADER) {
                shaderObj.setUniformData(shaderObj.uniform.mvp, [mvp, false]);
                shaderObj.setUniformData(shaderObj.uniform.worlMatirx, [modelMat, false]);
                shaderObj.setUniformData(shaderObj.uniform.normalMatrix, [modelMat, false]);
                shaderObj.setUniformData(shaderObj.uniform.eyePosition, [eyePos[0], eyePos[1], eyePos[2]]);
                shaderObj.forEachDraw((obj: any) => {
                    obj.prepare();
                    obj.draw({ start: 0, cnt: 6 });
                    obj.unPrepare();
                });
            }
        });
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}