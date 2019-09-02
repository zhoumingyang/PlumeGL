import { Mat4 } from "../math/mat4";
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

    public updatePersective(pro: Perspective) {
        this.fovy = pro.fovy || this.fovy;
        this.aspect = pro.aspect || this.aspect;
        this.near = pro.near || this.near;
        this.far = pro.far || this.far;
        this.updateMat();
    }

    public updateView(view: View) {
        super.updateView(view);
        this.updateMat();
    }

    public updateMat(): void {
        this.viewMatrix = new Mat4().lookAt(this.position, this.target, this.up);
        this.projectMatrix = new Mat4().perspective(this.fovy, this.aspect, this.near, this.far);
    }
}