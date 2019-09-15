/**
 * reference: https://github.com/toji/gl-matrix/tree/master/src 
 * */

import { CONSTANT } from "../engine/constant";

const EPSILON = 0.000001;

export class Mat3 {
    public type: Symbol = CONSTANT.MAT3;
    private _value: Float32Array = new Float32Array(9);

    constructor() {
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[5] = 0;
        this._value[6] = 0;
        this._value[7] = 0;

        this._value[0] = 1;
        this._value[4] = 1;
        this._value[8] = 1;
    }

    get value() {
        return this._value;
    }

    set value(m: Float32Array) {
        if (m.length != 9) {
            console.warn("matrix must be 4x4");
            return;
        }
        this._value = m;
    }

    public clone(): Mat3 {
        const result = new Mat3();
        result.value[0] = this._value[0];
        result.value[1] = this._value[1];
        result.value[2] = this._value[2];
        result.value[3] = this._value[3];
        result.value[4] = this._value[4];
        result.value[5] = this._value[5];
        result.value[6] = this._value[6];
        result.value[7] = this._value[7];
        result.value[8] = this._value[8];
        return result;
    }

    public identity(): Mat3 {
        this._value[0] = 1;
        this._value[1] = 0;
        this._value[2] = 0;
        this._value[3] = 0;
        this._value[4] = 1;
        this._value[5] = 0;
        this._value[6] = 0;
        this._value[7] = 0;
        this._value[8] = 1;
        return this;
    }

    public transpose(): Mat3 {
        const out = new Mat3();
        out.value[0] = this._value[0];
        out.value[1] = this._value[3];
        out.value[2] = this._value[6];
        out.value[3] = this._value[1];
        out.value[4] = this._value[4];
        out.value[5] = this._value[7];
        out.value[6] = this._value[2];
        out.value[7] = this._value[5];
        out.value[8] = this._value[8];
        return out;
    }

    public invert(): Mat3 {
        let a00 = this._value[0], a01 = this._value[1], a02 = this._value[2];
        let a10 = this._value[3], a11 = this._value[4], a12 = this._value[5];
        let a20 = this._value[6], a21 = this._value[7], a22 = this._value[8];

        let b01 = a22 * a11 - a12 * a21;
        let b11 = -a22 * a10 + a12 * a20;
        let b21 = a21 * a10 - a11 * a20;

        // Calculate the determinant
        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        this._value[0] = b01 * det;
        this._value[1] = (-a22 * a01 + a02 * a21) * det;
        this._value[2] = (a12 * a01 - a02 * a11) * det;
        this._value[3] = b11 * det;
        this._value[4] = (a22 * a00 - a02 * a20) * det;
        this._value[5] = (-a12 * a00 + a02 * a10) * det;
        this._value[6] = b21 * det;
        this._value[7] = (-a21 * a00 + a01 * a20) * det;
        this._value[8] = (a11 * a00 - a01 * a10) * det;

        return this;
    }

    public getNormalMat(m: any): Mat3 {
        let a00 = m.value[0], a01 = m.value[1], a02 = m.value[2], a03 = m.value[3];
        let a10 = m.value[4], a11 = m.value[5], a12 = m.value[6], a13 = m.value[7];
        let a20 = m.value[8], a21 = m.value[9], a22 = m.value[10], a23 = m.value[11];
        let a30 = m.value[12], a31 = m.value[13], a32 = m.value[14], a33 = m.value[15];

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

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        this.value[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.value[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.value[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        this.value[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.value[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.value[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        this.value[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.value[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.value[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return this;
    }

}