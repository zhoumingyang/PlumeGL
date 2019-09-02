import { Camera, View } from './camera';
import { CONSTANT } from "../engine/constant";
import { Mat4 } from '../math/mat4';

interface Ortho {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    near?: number;
    far?: number;
};

export class OrthoCamera extends Camera {
    public type: Symbol = CONSTANT.ORTHOCAMERA;
    public left: number = -1;
    public right: number = 1;
    public top: number = 1;
    public bottom: number = -1;
    public near: number = 0.1;
    public far: number = 2000;

    constructor(ortho?: Ortho, view?: View) {
        super(view);
        if (ortho) {
            this.left = ortho.left || this.left;
            this.right = ortho.right || this.right;
            this.top = ortho.top || this.top;
            this.bottom = ortho.bottom || this.bottom;
            this.near = ortho.near || this.near;
            this.far = ortho.far || this.far;
        }
    }

    public setOrtho(left: number, right: number,
        top: number, bottom: number,
        near: number, far: number) {
        this.left = left || this.left;
        this.right = right || this.right;
        this.top = top || this.top;
        this.bottom = bottom || this.bottom;
        this.near = near || this.near;
        this.far = far || this.far;
    }

    public updateOrtho(ortho: Ortho): void {
        this.left = ortho.left || this.left;
        this.right = ortho.right || this.right;
        this.top = ortho.top || this.top;
        this.bottom = ortho.bottom || this.bottom;
        this.near = ortho.near || this.near;
        this.far = ortho.far || this.far;
        this.updateMat();
    }

    public updateView(view: View): void {
        super.updateView(view);
        this.updateMat();
    }

    public updateMat(): void {
        this.viewMatrix = new Mat4().lookAt(this.position, this.target, this.up);
        this.projectMatrix = new Mat4().ortho(this.left, this.right, this.bottom,
            this.top, this.near, this.far);
    }
}