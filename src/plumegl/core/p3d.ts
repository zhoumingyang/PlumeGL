import { Primitive } from '../primitive/primitive';
import { Texture } from '../texture/texture';
import { State } from './state';
import { Util } from '../util/util';
import { CONSTANT } from '../engine/constant';
import { Mat4 } from '../math/mat4';
import { Shader } from '../shader/shader';

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

    constructor(primitive: Primitive, texture?: Texture, state?: State) {
        this.primitive = primitive;
        this.texture = texture;
        this.state = state || new State();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    private _prepareInner(slots: number[] = [0]): void {
        this.primitive && this.primitive.prepare();
        if (this.texture) {
            slots.forEach((slot) => {
                this.texture.bind(slot);
            });
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

    public getModelMat(): Mat4 {
        const cloneModelMat: Mat4 = this.modelMatrix.clone();
        const primitiveModelMat: Mat4 = this.primitive.modelMatrix.clone();
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
        this.selfUniform = JSON.parse(JSON.stringify(shaderUniform));
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