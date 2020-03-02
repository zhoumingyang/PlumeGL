import { Primitive } from '../primitive/primitive';
import { Texture } from '../texture/texture';
import { State } from './state';
import { Util } from '../util/util';
import { CONSTANT } from '../engine/constant';
import { Mat4 } from '../math/mat4';
import { Shader } from '../shader/shader';
import { Node } from './node';

let uuid = 0;
export class P3D {
    public primitive: Primitive;
    public texture: Texture;
    public state: State;
    public ready: boolean = false;
    public uid: string;
    public type: Symbol = CONSTANT.P3D;
    public modelMatrix: Mat4 = new Mat4();
    public normalMatrix: Mat4 = new Mat4();
    private selfUniform: any = undefined;
    private _shader: Shader;
    private refNode: Node;
    private _order: number = 0;
    private _isInstance: boolean = false;
    private _instanceCnt: number = 0;

    constructor(primitive: Primitive, texture?: Texture, state?: State) {
        this.primitive = primitive;
        this.texture = texture;
        this.state = state || new State();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    public get shader() {
        return this._shader;
    }

    public set shader(s: Shader) {
        this._shader = s;
        if (this._shader) {
            this.mountSelfUniform(this._shader.selfUniform);
        }
    }

    public set order(i: number) {
        this._order = i;
    }

    public get isInstance() {
        return this._isInstance;
    }

    public get instanceCount() {
        return this._instanceCnt;
    }

    public setInstance(ins: boolean, cnt: number) {
        this._instanceCnt = cnt;
        this._isInstance = ins;
    }

    public setRefNode(node: Node): void {
        this.refNode = node;
    }

    public getRefNode(): Node {
        return this.refNode;
    }

    private _prepareInner(slots: number[] = [0]): void {
        this.primitive && this.primitive.prepare();
        if (this.texture) {
            if (this.texture.samplers) {
                const len: number = Object.keys(this.texture.samplers).length;
                for (let i = 0; i < len; i++) {
                    this.texture.bind(i);
                }
            } else {
                slots.forEach((slot) => {
                    this.texture.bind(slot);
                });
            }
        }
    }

    public prepareDraw(slots: number[] = [0]): void {
        this._prepareInner(slots);
        this.ready = true;
    }

    public prepareState(): void {
        this.state && this.state.stateChange();
    }

    public prepare(slots: number[] = [0]): void {
        this.state && this.state.stateChange();
        this._prepareInner(slots);
        this.ready = true;
    }

    public unPrepare(): void {
        this.primitive && this.primitive.unPrepare();
        if (this.texture && this.primitive) {
            Texture.unBind(this.primitive.gl);
        }
        this.ready = false;
    }

    public changeMesh(mesh: Primitive) {
        this.primitive = mesh;
        this.ready = false;
    }

    public changeTexture(texture: Texture) {
        this.texture = texture;
        this.ready = false;
    }

    public changeState(state: State) {
        this.state = state;
        this.ready = false;
    }

    public draw(arrayArg?: any, elementArg?: any, option?: any): void {
        if (this.ready) {
            this.primitive && this.primitive.draw(arrayArg, elementArg, option);
        }
    }

    //this method should be called after updateWorldMatrix
    public getModelMat(): Mat4 {
        const cloneModelMat: Mat4 = this.modelMatrix.clone();
        const primitiveModelMat: Mat4 = this.primitive.modelMatrix.clone();
        if (this.refNode != undefined && this.refNode instanceof Node) {
            return this.refNode.matrix.clone().multiply(cloneModelMat.multiply(primitiveModelMat));
        }
        return cloneModelMat.multiply(primitiveModelMat);
    }

    public getNormalMat(): Mat4 {
        const cloneNormalMat: Mat4 = this.normalMatrix.clone();
        const primitiveNormalMat: Mat4 = this.primitive.normalMatrix.clone();
        return cloneNormalMat.multiply(primitiveNormalMat);
    }

    public restitute(): void {
        this.state && this.state.stateReset();
        this.unPrepare();
    }

    public dispose(): void {
        if (this.state) {
            this.state = null;
        }
        this.disposeMesh();
        this.disposeTexture();
        this.ready = false;
    }

    public disposeTexture(): void {
        if (this.texture) {
            this.texture.dispose();
            this.texture = null;
        }
    }

    public disposeMesh(): void {
        if (this.primitive) {
            this.primitive.dispose();
            this.primitive = null;
        }
    }

    public mountSelfUniform(shaderUniform: any): void {
        if (!shaderUniform) {
            return;
        }
        const tmpUniform = JSON.parse(JSON.stringify(shaderUniform));
        if (this.selfUniform) {
            this.selfUniform = Object.assign(tmpUniform, this.selfUniform);
        } else {
            this.selfUniform = tmpUniform;
        }
    }

    public initSelfUniform(shader: Shader): void {
        if (this.selfUniform) {
            for (let key in this.selfUniform) {
                shader.setUniformData(key, this.selfUniform[key].value);
            }
        }
    }

    public setSelfUniform(uniformName: string, value: any[]): void {
        if (this.selfUniform && this.selfUniform[uniformName]) {
            this.selfUniform[uniformName].value = value;
        }
    }
}