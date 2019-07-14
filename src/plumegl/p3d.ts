import { Primitive } from './primitive';
import { Texture } from './texture';
import { State } from './state';
import { Util } from './util';
import { CONSTANT } from './constant';

let uuid = 0;
export class P3D {
    public primitive: Primitive;
    public texture: Texture;
    public state: State;
    public ready: boolean;
    public uid: string;
    public type: Symbol;

    constructor(primitive: Primitive, texture?: Texture, state?: State) {
        this.primitive = primitive;
        this.texture = texture;
        this.state = state || new State(primitive.gl);
        this.ready = false;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
        this.type = CONSTANT.P3D;
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
}