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
    cav.width = 512;
    cav.height = 512;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

const create = (): Float32Array => {
    let out = new Float32Array(32);
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
}

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

const translate = (a: Float32Array, v: Float32Array): Float32Array => {
    let x = v[0],
        y = v[1],
        z = v[2];
    let out = new Float32Array(16);
    let a00: number = void 0,
        a01: number = void 0,
        a02: number = void 0,
        a03: number = void 0;
    let a10: number = void 0,
        a11: number = void 0,
        a12: number = void 0,
        a13: number = void 0;
    let a20: number = void 0,
        a21: number = void 0,
        a22: number = void 0,
        a23: number = void 0;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

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

const rotate = (a: Float32Array, rad: number, axis: Float32Array): Float32Array => {
    const out: Float32Array = new Float32Array(16);
    let x: number = axis[0],
        y: number = axis[1],
        z: number = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s: number = void 0,
        c: number = void 0,
        t: number = void 0;
    let a00: number = void 0,
        a01: number = void 0,
        a02: number = void 0,
        a03: number = void 0;
    let a10: number = void 0,
        a11: number = void 0,
        a12: number = void 0,
        a13: number = void 0;
    let a20: number = void 0,
        a21: number = void 0,
        a22: number = void 0,
        a23: number = void 0;
    let b00: number = void 0,
        b01: number = void 0,
        b02: number = void 0;
    let b10: number = void 0,
        b11: number = void 0,
        b12: number = void 0;
    let b20: number = void 0,
        b21: number = void 0,
        b22: number = void 0;

    if (Math.abs(len) < 0.000001) {
        return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
}

let cubeRotation: number = 0.0;

export const DrawLightCube = () => {

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
    ambientLight.color = Float32Array.from([1.0, 1.0, 1.0]);
    ambientLight.ambient = 0.70;
    ambientLight.diffuse = 1.0;

    const parallelLight = new PlumeGL.ParallelLight();
    parallelLight.color = Float32Array.from([1.0, 0.0, 0.0]);
    parallelLight.setDirection(Float32Array.from([1.0, 1.0, 1.0]));

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

    const p3d = new PlumeGL.P3D(mesh);
    defaultLightShader.addDrawObject(p3d);

    for (let i = 0; i < normaLines.length; i++) {
        const line = new PlumeGL.Line();
        const data: Float32Array = Float32Array.from(normaLines[i][0].concat(normaLines[i][1]));
        line.setGeometryAttribute(data, basicLineShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
        line.initBufferAttributePoint(basicLineShader);
        basicLineShader.addDrawObject(line);
    }

    let projectionMat = create();
    let mvp = create();

    const fieldOfView: number = 45.0 * Math.PI / 180;
    const aspect: number = 512 / 512;
    const zNear: number = 0.1;
    const zFar: number = 100.0;
    projectionMat = perspective(fieldOfView, aspect, zNear, zFar);

    let trans = new Float32Array(3);
    trans[0] = 0.0;
    trans[1] = 0.0;
    trans[2] = -6.0;

    let then = 0;
    function render(now: number) {

        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        let modelViewMat = create();
        let normalMat = create();
        modelViewMat = translate(modelViewMat, trans);
        let zAxis: Float32Array = new Float32Array(3);
        let yAxis: Float32Array = new Float32Array(3);
        zAxis[0] = 0; zAxis[1] = 0; zAxis[2] = 1;
        yAxis[0] = 0; yAxis[1] = 1; yAxis[2] = 0;
        cubeRotation = 247.697;
        modelViewMat = rotate(modelViewMat, cubeRotation, zAxis);
        modelViewMat = rotate(modelViewMat, cubeRotation * 0.7, yAxis);
        normalMat = rotate(normalMat, cubeRotation, zAxis);
        normalMat = rotate(normalMat, cubeRotation * 0.7, yAxis);
        mvp = multiply(projectionMat, modelViewMat);

        scene.state.stateChange();
        scene.forEachRender((shaderObj: any) => {
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTLIGHTSHADER) {
                shaderObj.setUniformData(shaderObj.uniformMvp, [mvp, false]);
                shaderObj.setUniformData(shaderObj.uniformWorlMatirx, [modelViewMat, false]);
                shaderObj.setUniformData(shaderObj.uniformNormalMatrix, [normalMat, false]);
                shaderObj.setUniformData(shaderObj.uniformEyePosition, [0.0, 0.0, 0.0]);
                shaderObj.setUniformData(shaderObj.uniformBoolMap, [0]);
                shaderObj.setUniformData(shaderObj.uniformSpecStrength, [1.0]);
                shaderObj.setUniformData(shaderObj.uniformSpecPower, [2]);
                shaderObj.forEachDraw((obj: any) => {
                    obj.prepare();
                    obj.draw({ start: 0, cnt: 24 });
                    obj.unPrepare();
                });
            }
            if (shaderObj.type === PlumeGL.CONSTANT.BASICLINESHADER) {
                shaderObj.setUniformData(shaderObj.uniformMvp, [mvp, false]);
                shaderObj.setUniformData(shaderObj.uniformColor, [1.0, 1.0, 1.0]);
                shaderObj.forEachDraw((obj: any) => {
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