import { Mat4 } from "../math/mat4";
import { Vec3 } from "../math/vec3";
import { Camera, View } from "./camera";
import { CONSTANT } from "../engine/constant";

interface Perspective {
    fovy?: number;
    aspect?: number;
    near?: number;
    far?: number;
};

export class PerspectiveCamera extends Camera {
    public type: Symbol = CONSTANT.PERSPECTIVECAMERA;
    public fovy: number = 0;
    public aspect: number = 1;
    public near: number = 0;
    public far: number = 0;
    private projectMatrix: Mat4 = new Mat4();
    private viewMatrix: Mat4 = new Mat4();

    constructor(pro?: Perspective, view?: View) {
        super(view);
        if (pro) {
            this.fovy = pro.fovy || this.fovy;
            this.aspect = pro.aspect || this.aspect;
            this.near = pro.near || this.near;
            this.far = pro.far || this.far;
        }
    }

    public setPersective(fovy: number, aspect: number, near: number, far: number) {
        this.fovy = fovy || this.fovy;
        this.aspect = aspect || this.aspect;
        this.near = near || this.near;
        this.far = far || this.far;
    }

    public setView(position: Vec3, target: Vec3, up: Vec3) {
        this.position = position || this.position;
        this.target = target;
        this.up = up;
    }

    public updatePersective(pro: Perspective) {
        this.fovy = pro.fovy || this.fovy;
        this.aspect = pro.aspect || this.aspect;
        this.near = pro.near || this.near;
        this.far = pro.far || this.far;
        this.updateMat();
    }

    public updateView(view: View) {
        this.position = view.position || this.position;
        this.target = view.target || this.target;
        this.up = view.up || this.up;
        this.updateMat();
    }

    public updateMat(): void {
        this.viewMatrix = new Mat4().lookAt(this.position, this.target, this.up);
        this.projectMatrix = new Mat4().perspective(this.fovy, this.aspect, this.near, this.far);
    }

    public getViewMat(): Mat4 {
        return this.viewMatrix;
    }

    public getProjectMat(): Mat4 {
        return this.projectMatrix
    }

    public getModelViewMat(modelMatrix: Mat4): Mat4 {
        const viewMatrix: Mat4 = this.viewMatrix.clone();
        return viewMatrix.multiply(modelMatrix);
    }

    public getProjectViewModelMat(modelMatrix: Mat4): Mat4 {
        const projectMatrix: Mat4 = this.projectMatrix.clone();
        const modelViewMatrix: Mat4 = this.getModelViewMat(modelMatrix);
        return projectMatrix.multiply(modelViewMatrix);
    }

}