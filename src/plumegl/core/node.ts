import { BaseObject } from './baseobject';
import { CONSTANT } from '../engine/constant';
import { Mat4 } from '../math/mat4';
import { P3D } from './p3d';

export class Node extends BaseObject {
    private _father: Node;
    private _children: Node[];
    private _p3d: P3D;
    private _worldMatrix: Mat4 = new Mat4();
    private _matrix: Mat4 = new Mat4();
    public type: Symbol = CONSTANT.NODE;

    constructor(p3d?: P3D) {
        super();
        this._p3d = p3d;
    }

    public set father(f: Node) {
        this._father = f;
        this._dirty = true;
    }

    public get father() {
        return this._father;
    }

    public get children() {
        return this._children;
    }

    public set worldMatrix(mat: Mat4) {
        this._worldMatrix = mat;
        this._dirty = true;
    }

    public get worldMatrix() {
        return this._worldMatrix.clone();
    }

    public get matrix() {
        return this._matrix.clone();
    }

    public get p3d() {
        return this._p3d;
    }

    public getChild(index?: number) {
        return this._children[index];
    }

    public updateP3D(p3d: P3D): void {
        this._p3d = p3d;
        this._dirty = true;
    }

    public removeChild(child: Node | number): Node {
        if (child instanceof Node && this._children.includes(child)) {
            const index: number = this._children.indexOf(child);
            this._children.splice(index, 1);
        } else if (typeof child === "number") {
            this._children.splice(child, 1);
            return this._children[child];
        }

        return child;
    }

    public addChild(child: Node): void {
        if (this._children.includes(child)) {
            this._children.push(child);
            child.father = this;
        }
    }

    public traverse(callback: Function): void {
        callback(this);
        const len = this.children.length;
        for (let i = 0; i < len; i++) {
            this.children[i].traverse(callback);
        }
    }

    public updateWoldMatrix(): void {
        if (!this._dirty) {
            return;
        }

        let cloneMat: Mat4 = this.worldMatrix.clone();
        let father = this.father;

        while (father) {
            cloneMat = father.worldMatrix.clone().multiply(cloneMat);
            father = father.father;
        }

        this._matrix = cloneMat.clone();
        this._dirty = true;
    }
};