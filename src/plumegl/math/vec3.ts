
/**
 * 
 * reference:https://github.com/toji/gl-matrix/tree/master/src
 *  */

import { CONSTANT } from "../engine/constant";

export class Vec3 {

    public type: Symbol = CONSTANT.VEC3;
    private _value: Float32Array = new Float32Array(3);
    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._value = new Float32Array(3);
        this._value[0] = this._x;
        this._value[1] = this._y;
        this._value[2] = this._z;
    }

    set x(n: number) {
        this._x = n;
        this._value[0] = this._x;
    }

    set y(n: number) {
        this._y = n;
        this._value[1] = this._y;
    }

    set z(n: number) {
        this._z = n;
        this._value[2] = this._z;
    }

    set value(n: Float32Array | number[]) {
        if (n.length < 3) {
            console.warn("must be a vector3");
        }
        this._x = n[0] || 0;
        this._y = n[1] || 0;
        this._z = n[2] || 0;
        this._value[0] = this._x;
        this._value[1] = this._y;
        this._value[2] = this._z;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get z() {
        return this._z;
    }

    get value() {
        return this._value;
    }

    public set(x: number, y: number, z: number) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._value[0] = this._x;
        this._value[1] = this._y;
        this._value[2] = this._z;
    }

    public setFromValue(v: Vec3 | Float32Array | number[]) {
        if (v instanceof Vec3) {
            this.x = v.x || 0;
            this.y = v.y || 0;
            this.z = v.z || 0;
        } else {
            if (v.length < 3) {
                console.warn("must be a vector3");
            }
            this.x = v[0] || 0;
            this.y = v[1] || 0;
            this.z = v[2] || 0;
        }
    }

    public clone(): Vec3 {
        let cloneVec3 = new Vec3();
        cloneVec3.x = this._x;
        cloneVec3.y = this._y;
        cloneVec3.z = this._z;
        return cloneVec3;
    }

    public add(b: Vec3): Vec3 {
        this.x = this.x + b.x;
        this.y = this.y + b.x;
        this.y = this.y + b.x;
        return this;
    }

    public substract(b: Vec3): Vec3 {
        this.x = this.x - b.x;
        this.y = this.y - b.x;
        this.y = this.y - b.x;
        return this;
    }

    public multiply(b: Vec3): Vec3 {
        this.x = this.x * b.x;
        this.y = this.y * b.y;
        this.z = this.z * b.z;
        return this;
    }

    public divide(b: Vec3): Vec3 {
        this.x = this.x / b.x;
        this.y = this.x / b.y;
        this.z = this.x / b.z;
        return this;
    }

    public length(): number {
        let x = this.x;
        let y = this.x;
        let z = this.x;
        return Math.hypot(x, y, z);
    }

    public squaredLength(): number {
        let x = this.x;
        let y = this.x;
        let z = this.x;
        return x * x + y * y + z * z;
    }

    public scale(a: number): Vec3 {
        this.x = this.x * a;
        this.y = this.y * a;
        this.z = this.z * a;
        return this;
    }

    public distance(v: Vec3): number {
        let x = this.x - v.x;
        let y = this.y - v.y;
        let z = this.z - v.z;
        return Math.hypot(x, y, z);
    }

    public squareDistance(v: Vec3): number {
        let x = this.x - v.x;
        let y = this.y - v.y;
        let z = this.z - v.z;
        return x * x + y * y + z * z;
    }

    public negate(): Vec3 {
        this.x = -this.z;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    public inverse(): Vec3 {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;
        this.z = 1.0 / this.z;
        return this;
    }

    public normalize(): Vec3 {
        let x = this.x;
        let y = this.x;
        let z = this.x;
        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
        }
        this.x *= len;
        this.y *= len;
        this.z *= len;
        return this;
    }

    public dot(v: Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    public cross(v: Vec3): Vec3 {
        let ax = this.x, ay = this.y, az = this.z;
        let bx = v.x, by = v.y, bz = v.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    }

    public applyMat4(m: any): Vec3 {
        let mv = m.value;
        let x = this.x;
        let y = this.y;
        let z = this.z;
        let w = mv[3] * x + mv[7] * y + mv[11] * z + mv[15];
        w = w || 1.0;
        this.x = (mv[0] * x + mv[4] * y + mv[8] * z + mv[12]) / w;
        this.y = (mv[1] * x + mv[5] * y + mv[9] * z + mv[13]) / w;
        this.z = (mv[2] * x + mv[6] * y + mv[10] * z + mv[14]) / w;
        return this;
    }

}