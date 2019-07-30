import { Util } from '../util/util';
import { Shader } from './shader';
import { State } from './state';
import { CONSTANT } from '../engine/constant';

let uuid: number = 0;
export class Scene {
    private shaders: Map<string, Shader>;
    public state: State;
    public type: Symbol;
    public uid: string;

    constructor() {
        this.shaders = new Map();
        this.state = undefined;
        this.type = CONSTANT.SCENE;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public setSceneState(state: State): void {
        this.state = state;
    }

    public add(shaderObj: Shader): void {
        this.shaders.set(shaderObj.uid, shaderObj);
    }

    public remove(arg: string | Shader): void {
        const key: string = (arg instanceof Shader) ? arg.uid : arg;
        this.shaders.delete(key);
    }

    public forEachRender(callback: Function): void {
        this.shaders.forEach((shader: Shader, key: string) => {
            callback.call(this, shader, key);
        });
    }

    public stateChange(name?: string): void {
        this.state.stateChange(name);
    }

    public dispose(): void {
        this.shaders.forEach((shader: Shader) => {
            shader.dispose3Ds();
            shader.dispose();
        });
        this.shaders.clear();
        this.shaders = new Map();
        this.state = undefined;
    }
}