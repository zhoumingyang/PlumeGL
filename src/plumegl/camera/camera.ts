import { Vec3 } from "../math/vec3";
import { CONSTANT } from "../engine/constant";
import { Util } from '../util/util';
import { Mat4 } from "../math/mat4";

export interface View {
    position?: Vec3;
    target?: Vec3;
    up?: Vec3;
}

let uuid: number = 0;
export class Camera {
    public type: Symbol = CONSTANT.CAMERA;
    public uid: string;
    private _position: Vec3 = new Vec3();
    private _target: Vec3 = new Vec3();
    private _up: Vec3 = new Vec3();

    constructor(v?: View) {
        if (v) {
            this._position = v.position || this._position;
            this._target = v.target || this._target;
            this._up = v.up || this._up;
        }
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    set position(p: Vec3) {
        this._position.x = p.x;
        this._position.y = p.y;
        this._position.z = p.z;
    }

    set target(t: Vec3) {
        this._target.x = t.x;
        this._target.y = t.y;
        this._target.z = t.z;
    }

    set up(u: Vec3) {
        this._up.x = u.x;
        this._up.y = u.y;
        this._up.z = u.z;
    }

    get position() {
        return this._position;
    }

    get target() {
        return this._target;
    }

    get up() {
        return this._up;
    }

    public updateMat(): void {

    }

    public getViewMat(): Mat4 {
        return new Mat4();
    }

    public getProjectMat(): Mat4 {
        return new Mat4();
    }

    public getModelViewMat(modelMatrix: Mat4): Mat4 {
        return modelMatrix.clone();
    }

    public getProjectViewModelMat(modelMatrix: Mat4): Mat4 {
        return modelMatrix.clone();
    }
}
