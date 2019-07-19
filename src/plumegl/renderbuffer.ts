import { Util } from './util';
import { CONSTANT } from './constant';

let uuid: number = 0;
export class RenderBuffer {
    public gl: WebGLRenderingContext | WebGL2RenderingContext;
    public uid: string;
    public width: number;
    public height: number;
    public instance: WebGLRenderbuffer;
    public format: number;
    public type: Symbol;
    private _valid: boolean;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, format?: number) {
        this.gl = gl;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
        this.width = 0;
        this.height = 0;
        this.instance = gl.createRenderbuffer();
        this.format = format || gl.DEPTH_COMPONENT16;
        this._valid = false;
        this.type = CONSTANT.RENDERBUFFER;
        this._renderBufferStorage();
    }

    public bind(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, this.instance);
    }

    static unBind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
        gl && gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    public dispose(): void {
        RenderBuffer.unBind(this.gl);
        this.gl && this.gl.deleteRenderbuffer(this.instance);
        this.instance = null;
        this.gl = null;
    }

    public setSize(w: number, h: number): void {
        if (this.width !== w || this.height !== h) {
            this.width = w;
            this.height = h;
            this._valid = false;
        }
    }

    public allocate(): void {
        if (!this._valid && this.width > 0 && this.height > 0) {
            this._renderBufferStorage();
            this._valid = true;
        }
    }

    public allocateMultisample(samples: number = 4): void {
        if (!this._valid && this.width > 0 && this.height > 0) {
            this._renderBufferStorageMultisample(samples);
            this._valid = true;
        }
    }

    private _renderBufferStorage(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, this.instance);
        _gl.renderbufferStorage(_gl.RENDERBUFFER, this.format, this.width, this.height);
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, null);
    }

    private _renderBufferStorageMultisample(samples: number = 4): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, this.instance);
        _gl.renderbufferStorageMultisample(_gl.RENDERBUFFER, samples, this.format, this.width, this.height);
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, null);
    }
}
