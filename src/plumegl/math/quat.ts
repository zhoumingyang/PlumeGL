import { CONSTANT } from '../engine/constant';

const EPSILON = 0.000001;

export class Quat {
    public type: Symbol = CONSTANT.QUAT;
    private _value: Float32Array = new Float32Array(4);
    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;
    private _w: number = 1;

    constructor(x?: number, y?: number, z?: number, w?: number) {
        this._x = x || this._x;
        this._y = y || this._y;
        this._z = z || this._z;
        this._w = w || this._w;
        this._value[0] = this._x;
        this._value[1] = this._y;
        this._value[2] = this._z;
        this._value[3] = this._w;
    }

    set value(v: Float32Array) {
        if (v.length != 4) {
            console.warn("Quaternion must have 4 elements");
            return;
        }
        this._x = v[0];
        this._y = v[1];
        this._z = v[2];
        this._w = v[3];
        this._value[0] = this._x;
        this._value[1] = this._y;
        this._value[2] = this._z;
        this._value[3] = this._w;
    }

    get value() {
        return this._value;
    }

    set x(n: number) {
        this._x = n;
        this._value[0] = this._x;
    }

    get x() {
        return this._x;
    }

    set y(n: number) {
        this._y = n;
        this._value[1] = this._y;
    }

    get y() {
        return this._y;
    }

    set z(n: number) {
        this._z = n;
        this._value[2] = this._z;
    }

    get z() {
        return this._z;
    }

    set w(n: number) {
        this._w = n;
        this._value[3] = this._w;
    }

    get w() {
        return this._w;
    }

    public clone(): Quat {
        const re = new Quat();
        re.x = this.x;
        re.y = this.y;
        re.z = this.z;
        re.w = this.w;
        return re;
    }

    public indentity(): Quat {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;
        return this;
    }

    public setAxisAngle(axis: any, rad: number) {
        rad = rad * 0.5;
        let s: number = Math.sin(rad);
        this.x = s * axis[0];
        this.y = s * axis[1];
        this.z = s * axis[2];
        this.w = Math.cos(rad);
        return this;
    }

    public getAxisAngel(axis: any): number {
        let rad = Math.acos(this.w) * 2.0;
        let s = Math.sin(rad / 2.0);
        if (s > EPSILON) {
            axis.x = this.x / s;
            axis.y = this.y / s;
            axis.z = this.z / s;
        } else {
            axis.x = 1;
            axis.y = 0;
            axis.z = 0;
        }
        return rad;
    }

    public fromEuler(x: number, y: number, z: number): Quat {
        let halfToRad = 0.5 * Math.PI / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);

        this.x = sx * cy * cz - cx * sy * sz;
        this.y = cx * sy * cz + sx * cy * sz;
        this.z = cx * cy * sz - sx * sy * cz;
        this.w = cx * cy * cz + sx * sy * sz;

        return this;
    }

}