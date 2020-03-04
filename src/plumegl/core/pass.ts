import { CONSTANT } from '../engine/constant';
import { Scene } from './scene';
import { FrameBuffer } from './framebuffer';
import { State } from './state';
import { Util } from '../util/util';

let uuid: number = 0;
export class Pass {
    private _scene: Scene;
    private _frameBuffer: FrameBuffer;
    private _state: State;
    public uid: string;
    public type: Symbol = CONSTANT.PASS;

    constructor(scene: Scene, fbo: FrameBuffer) {
        this._scene = scene;
        this._frameBuffer = fbo;
        this._state = undefined;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    public get scene() {
        return this._scene;
    }

    public get frameBuffer() {
        return this._frameBuffer;
    }

    public get state() {
        return this._state;
    }

    public setState(state: State): void {
        this._state = state;
    }

    public render(): void {
        this._state && this._state.change();
        this._frameBuffer && this._frameBuffer.bind();
        this._scene && this._scene.render();
        FrameBuffer.unBind();
    }


}