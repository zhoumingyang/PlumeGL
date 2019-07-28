import { Util } from './util';
import { CONSTANT } from './constant';
import { GL, WGL, WGL2 } from './gl';

let uuid: number = 0;
export class RenderBuffer {
    public gl: WGL | WGL2 = GL.gl;
    public uid: string;
    public width: number = 0;
    public height: number = 0;
    public instance: WebGLRenderbuffer;
    public format: number;
    public type: Symbol = CONSTANT.RENDERBUFFER;
    private _valid: boolean = false;

    constructor(format?: number, gl?: WGL | WGL2) {
        this.gl = gl || this.gl;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
        this.instance = this.gl.createRenderbuffer();
        this.format = format || this.gl.DEPTH_COMPONENT16;
        this._renderBufferStorage();
    }

    public bind(): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, this.instance);
    }

    static unBind(gl?: WGL | WGL2): void {
        const tmpGl = gl || GL.gl;
        tmpGl && tmpGl.bindRenderbuffer(tmpGl.RENDERBUFFER, null);
    }

    public dispose(): void {
        RenderBuffer.unBind(this.gl);
        this.gl && this.gl.deleteRenderbuffer(this.instance);
        this.instance = null;
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
        const _gl: WGL | WGL2 = this.gl;
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
