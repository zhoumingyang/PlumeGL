
/**
 * reference: https://github.com/toji/gl-matrix/tree/master/src 
 * */

import { CONSTANT } from "../engine/constant";

const EPSILON = 0.000001;

export class Mat4 {
    public type: Symbol = CONSTANT.MAT4;
    private _value: Float32Array = new Float32Array(16);

    constructor() {
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 0;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 0;
        this._value[9] = 0;
        this._value[11] = 0;
        this._value[12] = 0;
        this._value[13] = 0;
        this._value[14] = 0;

        this._value[0] = 1;
        this._value[5] = 1;
        this._value[10] = 1;
        this._value[15] = 1;
    }

    public identity(): Mat4 {
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 0;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 0;
        this._value[9] = 0;
        this._value[11] = 0;
        this._value[12] = 0;
        this._value[13] = 0;
        this._value[14] = 0;

        this._value[0] = 1;
        this._value[5] = 1;
        this._value[10] = 1;
        this._value[15] = 1;
        return this;
    }

    get value() {
        return this._value;
    }

    set value(m: Float32Array) {
        if (m.length != 16) {
            console.warn("matrix must be 4x4");
            return;
        }
        this._value = m;
    }

    public clone(): Mat4 {
        const reslut = new Mat4();
        reslut.value[0] = this._value[0];
        reslut.value[1] = this._value[1];
        reslut.value[2] = this._value[2];
        reslut.value[3] = this._value[3];
        reslut.value[4] = this._value[4];
        reslut.value[5] = this._value[5];
        reslut.value[6] = this._value[6];
        reslut.value[7] = this._value[7];
        reslut.value[8] = this._value[8];
        reslut.value[9] = this._value[9];
        reslut.value[10] = this._value[10];
        reslut.value[11] = this._value[11];
        reslut.value[12] = this._value[12];
        reslut.value[13] = this._value[13];
        reslut.value[14] = this._value[14];
        reslut.value[15] = this._value[15];
        return reslut;
    }

    public transpose(): Mat4 {
        this._value[0] = this._value[0];
        this._value[1] = this._value[4];
        this._value[2] = this._value[8];
        this._value[3] = this._value[12];
        this._value[4] = this._value[1];
        this._value[5] = this._value[5];
        this._value[6] = this._value[9];
        this._value[7] = this._value[13];
        this._value[8] = this._value[2];
        this._value[9] = this._value[6];
        this._value[10] = this._value[10];
        this._value[11] = this._value[14];
        this._value[12] = this._value[3];
        this._value[13] = this._value[7];
        this._value[14] = this._value[11];
        this._value[15] = this._value[15];
        return this;
    }

    public invert(): Mat4 {
        let a00 = this._value[0], a01 = this._value[1], a02 = this._value[2], a03 = this._value[3];
        let a10 = this._value[4], a11 = this._value[5], a12 = this._value[6], a13 = this._value[7];
        let a20 = this._value[8], a21 = this._value[9], a22 = this._value[10], a23 = this._value[11];
        let a30 = this._value[12], a31 = this._value[13], a32 = this._value[14], a33 = this._value[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

    }

    public multiply(m: Mat4): Mat4 {
        let a00 = this._value[0], a01 = this._value[1], a02 = this._value[2], a03 = this._value[3];
        let a10 = this._value[4], a11 = this._value[5], a12 = this._value[6], a13 = this._value[7];
        let a20 = this._value[8], a21 = this._value[9], a22 = this._value[10], a23 = this._value[11];
        let a30 = this._value[12], a31 = this._value[13], a32 = this._value[14], a33 = this._value[15];

        // Cache only the current line of the second matrix
        let b0 = m.value[0], b1 = m.value[1], b2 = m.value[2], b3 = m.value[3];
        this._value[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._value[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._value[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._value[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = m.value[4]; b1 = m.value[5]; b2 = m.value[6]; b3 = m.value[7];
        this._value[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._value[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._value[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._value[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = m.value[8]; b1 = m.value[9]; b2 = m.value[10]; b3 = m.value[11];
        this._value[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._value[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._value[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._value[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = m.value[12]; b1 = m.value[13]; b2 = m.value[14]; b3 = m.value[15];
        this._value[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._value[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._value[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._value[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }

    public setTranslation(v: any): Mat4 {
        this._value[0] = 1;
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 0;
        this._value[5] = 1;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 0;
        this._value[9] = 0;
        this._value[10] = 1;
        this._value[11] = 0;
        this._value[12] = v.x;
        this._value[13] = v.y;
        this._value[14] = v.z;
        this._value[15] = 1;
        return this;
    }

    public setScale(v: any): Mat4 {
        this._value[0] = v.x;
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 0;
        this._value[5] = v.y;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 0;
        this._value[9] = 0;
        this._value[10] = v.z;
        this._value[11] = 0;
        this._value[12] = 0;
        this._value[13] = 0;
        this._value[14] = 0;
        this._value[15] = 1;

        return this;
    }

    public setRotation(rad: number, axis: any): Mat4 {
        axis.normalize();
        let x = axis.x;
        let y = axis.y;
        let z = axis.z;

        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let t = 1 - c;

        this._value[0] = x * x * t + c;
        this._value[1] = y * x * t + z * s;
        this._value[2] = z * x * t - y * s;
        this._value[3] = 0;
        this._value[4] = x * y * t - z * s;
        this._value[5] = y * y * t + c;
        this._value[6] = z * y * t + x * s;
        this._value[7] = 0;
        this._value[8] = x * z * t + y * s;
        this._value[9] = y * z * t - x * s;
        this._value[10] = z * z * t + c;
        this._value[11] = 0;
        this._value[12] = 0;
        this._value[13] = 0;
        this._value[14] = 0;
        this._value[15] = 1;

        return this;
    }

    public getTranslation(re: any) {

        re.x = this._value[12];
        re.y = this._value[13];
        re.z = this._value[14];

        return re;
    }

    public getScaling(re: any) {
        let m11 = this._value[0];
        let m12 = this._value[1];
        let m13 = this._value[2];
        let m21 = this._value[4];
        let m22 = this._value[5];
        let m23 = this._value[6];
        let m31 = this._value[8];
        let m32 = this._value[9];
        let m33 = this._value[10];

        re.x = Math.hypot(m11, m12, m13);
        re.y = Math.hypot(m21, m22, m23);
        re.z = Math.hypot(m31, m32, m33);
    }

    public perspective(fovy: number, aspect: number, near: number, far: number): Mat4 {
        let f: number = 1.0 / Math.tan(fovy / 2);
        let nf: number;
        this._value[0] = f / aspect;
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 0;
        this._value[5] = f;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 0;
        this._value[9] = 0;
        this._value[11] = -1;
        this._value[12] = 0;
        this._value[13] = 0;
        this._value[15] = 0;
        if (far != null && far !== Infinity) {
            nf = 1 / (near - far);
            this._value[10] = (far + near) * nf;
            this._value[14] = (2 * far * near) * nf;
        } else {
            this._value[10] = -1;
            this._value[14] = -2 * near;
        }
        return this;
    }

    public lookAt(eye: any, center: any, up: any): Mat4 {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        let eyex = eye.x;
        let eyey = eye.y;
        let eyez = eye.z;
        let upx = up.x;
        let upy = up.y;
        let upz = up.z;
        let centerx = center.x;
        let centery = center.y;
        let centerz = center.z;

        if (Math.abs(eyex - centerx) < EPSILON &&
            Math.abs(eyey - centery) < EPSILON &&
            Math.abs(eyez - centerz) < EPSILON) {
            return this.identity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);
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

        len = Math.hypot(y0, y1, y2);
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

        this._value[0] = x0;
        this._value[1] = y0;
        this._value[2] = z0;
        this._value[3] = 0;
        this._value[4] = x1;
        this._value[5] = y1;
        this._value[6] = z1;
        this._value[7] = 0;
        this._value[8] = x2;
        this._value[9] = y2;
        this._value[10] = z2;
        this._value[11] = 0;
        this._value[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        this._value[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        this._value[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        this._value[15] = 1;

        return this;
    }

    public ortho(left: number, right: number, bottom: number,
        top: number, near: number, far: number): Mat4 {
        let lr: number = 1 / (left - right);
        let bt: number = 1 / (bottom - top);
        let nf: number = 1 / (near - far);
        this._value[0] = -2 * lr;
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 0;
        this._value[5] = -2 * bt;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 0;
        this._value[9] = 0;
        this._value[10] = 2 * nf;
        this._value[11] = 0;
        this._value[12] = (left + right) * lr;
        this._value[13] = (top + bottom) * bt;
        this._value[14] = (far + near) * nf;
        this._value[15] = 1;
        return this;
    }

    public translate(v: any): Mat4 {
        let x = v.x,
            y = v.y,
            z = v.z;
        let out = new Mat4();
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

        a00 = this._value[0]; a01 = this._value[1]; a02 = this._value[2]; a03 = this._value[3];
        a10 = this._value[4]; a11 = this._value[5]; a12 = this._value[6]; a13 = this._value[7];
        a20 = this._value[8]; a21 = this._value[9]; a22 = this._value[10]; a23 = this._value[11];

        out.value[0] = a00; out.value[1] = a01; out.value[2] = a02; out.value[3] = a03;
        out.value[4] = a10; out.value[5] = a11; out.value[6] = a12; out.value[7] = a13;
        out.value[8] = a20; out.value[9] = a21; out.value[10] = a22; out.value[11] = a23;

        out.value[12] = a00 * x + a10 * y + a20 * z + out.value[12];
        out.value[13] = a01 * x + a11 * y + a21 * z + out.value[13];
        out.value[14] = a02 * x + a12 * y + a22 * z + out.value[14];
        out.value[15] = a03 * x + a13 * y + a23 * z + out.value[15];

        return out;
    }

    public rotate(rad: number, axis: any): Mat4 {
        const out = new Mat4();
        let x: number = axis.x,
            y: number = axis.y,
            z: number = axis.z;
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

        a00 = this._value[0]; a01 = this._value[1]; a02 = this._value[2]; a03 = this._value[3];
        a10 = this._value[4]; a11 = this._value[5]; a12 = this._value[6]; a13 = this._value[7];
        a20 = this._value[8]; a21 = this._value[9]; a22 = this._value[10]; a23 = this._value[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
        b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
        b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out.value[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out.value[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out.value[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out.value[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out.value[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out.value[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out.value[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out.value[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out.value[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out.value[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out.value[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out.value[11] = a03 * b20 + a13 * b21 + a23 * b22;

        out.value[12] = this._value[12];
        out.value[13] = this._value[13];
        out.value[14] = this._value[14];
        out.value[15] = this._value[15];

        return out;
    }

    public scale(v: any): Mat4 {
        let x = v.x, y = v.y, z = v.z;

        const out = new Mat4();
        out.value[0] = this._value[0] * x;
        out.value[1] = this._value[1] * x;
        out.value[2] = this._value[2] * x;
        out.value[3] = this._value[3] * x;
        out.value[4] = this._value[4] * y;
        out.value[5] = this._value[5] * y;
        out.value[6] = this._value[6] * y;
        out.value[7] = this._value[7] * y;
        out.value[8] = this._value[8] * z;
        out.value[9] = this._value[9] * z;
        out.value[10] = this._value[10] * z;
        out.value[11] = this._value[11] * z;
        out.value[12] = this._value[12];
        out.value[13] = this._value[13];
        out.value[14] = this._value[14];
        out.value[15] = this._value[15];

        return out;
    }

    public fromRotationTranslation(q: any, v: any): Mat4 {
        let x = q.x, y = q.y, z = q.z, w = q.w;
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        this._value[0] = 1 - (yy + zz);
        this._value[1] = xy + wz;
        this._value[2] = xz - wy;
        this._value[3] = 0;
        this._value[4] = xy - wz;
        this._value[5] = 1 - (xx + zz);
        this._value[6] = yz + wx;
        this._value[7] = 0;
        this._value[8] = xz + wy;
        this._value[9] = yz - wx;
        this._value[10] = 1 - (xx + yy);
        this._value[11] = 0;
        this._value[12] = v[0];
        this._value[13] = v[1];
        this._value[14] = v[2];
        this._value[15] = 1;

        return this;
    }

}