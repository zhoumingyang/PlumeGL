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
    protected viewMatrix: Mat4 = new Mat4();
    protected projectMatrix: Mat4 = new Mat4();

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

    public applyMat(mat: Mat4): void {
        this.viewMatrix.multiply(mat);
    }

    public updateView(view: View): void {
        this.position = view.position || this.position;
        this.target = view.target || this.target;
        this.up = view.up || this.up;
    }

    public setView(position: Vec3, target: Vec3, up: Vec3) {
        this.position = position || this.position;
        this.target = target || this.target;
        this.up = up || this.up;
    }

    public getViewMat(): Mat4 {
        return this.viewMatrix.clone();
    }

    public getProjectMat(): Mat4 {
        return this.projectMatrix.clone();
    }

    public getModelViewMat(modelMatrix: Mat4 = new Mat4()): Mat4 {
        const viewMatrix: Mat4 = this.viewMatrix.clone();
        return viewMatrix.multiply(modelMatrix);
    }

    public getProjectViewModelMat(modelMatrix: Mat4): Mat4 {
        const projectMatrix: Mat4 = this.projectMatrix.clone();
        const modelViewMatrix: Mat4 = this.getModelViewMat(modelMatrix);
        return projectMatrix.multiply(modelViewMatrix);
    }

    public updateFov(fov: number): void {

    }

    public updateAspect(aspect: number): void {
    }

    public updateNearClipPlane(near: number): void {
    }

    public updateFarClipPlane(far: number): void {
    }
}
