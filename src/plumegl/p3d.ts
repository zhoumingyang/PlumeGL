import { Mesh } from './mesh';
import { Texture } from './texture';
import { State } from './state';
import { Util } from './util';
import { CONSTANT } from './constant';

let uuid = 0;
export class P3D {
    public mesh: Mesh;
    public texture: Texture;
    public state: State;
    public ready: boolean;
    public uid: string;
    public type: Symbol;

    constructor(mesh: Mesh, texture?: Texture, state?: State) {
        this.mesh = mesh;
        this.texture = texture;
        this.state = state || new State(mesh.gl);
        this.ready = false;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
        this.type = CONSTANT.P3D;
    }

    private _prepareInner(slots: number[] = [0]): void {
        this.mesh && this.mesh.prepare();
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
        this.mesh && this.mesh.unPrepare();
        if (this.texture && this.mesh) {
            Texture.unBind(this.mesh.gl);
        }
        this.ready = false;
    }

    public changeMesh(mesh: Mesh) {
        this.mesh = mesh;
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
            this.mesh && this.mesh.draw(arrayArg, elementArg, option);
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
        if (this.mesh) {
            this.mesh.dispose();
            this.mesh = null;
        }
    }
}