
/**
 * 
 * reference:https://github.com/toji/gl-matrix/tree/master/src
 *  */

import { CONSTANT } from '../engine/constant';

export class Vec2 {
    public type: Symbol = CONSTANT.VEC3;
    private _value: Float32Array = new Float32Array(2);
    private _x: number = 0;
    private _y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
        this._value = new Float32Array(2);
        this._value[0] = this._x;
        this._value[1] = this._y;
    }

    set x(n: number) {
        this._x = n;
        this._value[0] = this._x;
    }

    set y(n: number) {
        this._y = n;
        this._value[1] = this._y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get value() {
        return this._value;
    }

    public set(x: number, y: number): void {
        this._x = x || 0;
        this._y = y || 0;
        this._value[0] = this._x;
        this._value[1] = this._y;
    }

    public setFromValue(v: Vec2 | Float32Array | number[]): void {
        if (v instanceof Vec2) {
            this.x = v.x || 0;
            this.y = v.y || 0;
        } else {
            if (v.length < 2) {
                console.warn("must be a vector2");
            }
            this.x = v[0] || 0;
            this.y = v[1] || 0;
        }
    }

    public clone(): Vec2 {
        let cloneVec3 = new Vec2();
        cloneVec3.x = this._x;
        cloneVec3.y = this._y;
        return cloneVec3;
    }

    public add(b: Vec2): Vec2 {
        this.x = this.x + b.x;
        this.y = this.y + b.y;
        return this;
    }

    public substract(b: Vec2): Vec2 {
        this.x = this.x - b.x;
        this.y = this.y - b.y;
        return this;
    }

    public multiply(b: Vec2): Vec2 {
        this.x = this.x * b.x;
        this.y = this.y * b.y;
        return this;
    }

    public divide(b: Vec2): Vec2 {
        this.x = this.x / b.x;
        this.y = this.y / b.y;
        return this;
    }

    public length(): number {
        let x = this.x;
        let y = this.y;
        return Math.hypot(x, y);
    }

    public squaredLength(): number {
        let x = this.x;
        let y = this.y;
        return x * x + y * y;
    }

    public scale(a: number): Vec2 {
        this.x = this.x * a;
        this.y = this.y * a;
        return this;
    }

    public distance(v: Vec2): number {
        let x = this.x - v.x;
        let y = this.y - v.y;
        return Math.hypot(x, y);
    }

    public squareDistance(v: Vec2): number {
        let x = this.x - v.x;
        let y = this.y - v.y;
        return x * x + y * y;
    }

    public negate(): Vec2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    public inverse(): Vec2 {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;
        return this;
    }

    public normalize(): Vec2 {
        let x = this.x;
        let y = this.x;
        let z = this.x;
        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
        }
        this.x *= len;
        this.y *= len;
        return this;
    }

    public dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    public cross(v: Vec2): number {
        let ax = this.x, ay = this.y;
        let bx = v.x, by = v.y;
        return ax * v.y - v.x * ay;
    }

    public applyMat3(m: any): Vec2 {
        let mv = m.value;
        let x = this.x;
        let y = this.y;
        this.x = m[0] * x + m[3] * y + m[6];
        this.y = m[1] * x + m[4] * y + m[7];
        return this;
    }
}