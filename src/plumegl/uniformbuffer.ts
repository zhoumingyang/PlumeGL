import { Util } from './util';
import { CONSTANT } from './constant';

let uuid: number = 0;
export class UniformBuffer {
    public gl: WebGL2RenderingContext;
    public instance: WebGLBuffer
    public drawType: number;
    public type: Symbol;
    public uid: string;

    constructor(gl: WebGL2RenderingContext, drawType?: number) {
        this.gl = gl;
        this.instance = gl.createBuffer();
        this.drawType = drawType;
        this.type = CONSTANT.UNIFORMBUFFER;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public bind(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
    }

    static unBind(gl: WebGL2RenderingContext): void {
        gl && gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }

    public setBufferData(_array: any, option?: any): void {
        if (!_array) {
            return;
        }
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
        _gl.bufferData(_gl.UNIFORM_BUFFER, _array, this.drawType);
        if (option && option.subData) {
            const offset = option.offset || 0;
            _gl.bufferSubData(_gl.UNIFORM_BUFFER, offset, _array);
        }
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, null);
    }

    public setSubBufferData(_array: any, offset: number = 0): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
        _gl.bufferSubData(_gl.UNIFORM_BUFFER, offset, _array);
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, null);
    }

    public dispose(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        UniformBuffer.unBind(_gl);
        _gl && _gl.deleteBuffer(this.instance);
        this.instance = undefined;
        this.gl = undefined;
        this.drawType = undefined;
    }
}