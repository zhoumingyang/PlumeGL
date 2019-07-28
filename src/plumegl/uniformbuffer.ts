import { Util } from './util';
import { CONSTANT } from './constant';
import { GL, WGL2 } from './gl';

let uuid: number = 0;
export class UniformBuffer {
    public gl: WGL2 = <WGL2>GL.gl;
    public instance: WebGLBuffer;
    public drawType: number;
    public type: Symbol = CONSTANT.UNIFORMBUFFER;
    public uid: string;

    constructor(drawType?: number, gl?: WGL2) {
        this.gl = gl || this.gl;
        this.instance = this.gl.createBuffer();
        this.drawType = drawType;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public bind(): void {
        const _gl: WGL2 = this.gl;
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
    }

    static unBind(gl: WGL2): void {
        gl && gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }

    public setBufferData(_array: any, option?: any): void {
        if (!_array) {
            return;
        }
        const _gl: WGL2 = this.gl;
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
        _gl.bufferData(_gl.UNIFORM_BUFFER, _array, this.drawType);
        if (option && option.subData) {
            const offset = option.offset || 0;
            _gl.bufferSubData(_gl.UNIFORM_BUFFER, offset, _array);
        }
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, null);
    }

    public setSubBufferData(_array: any, offset: number = 0): void {
        const _gl: WGL2 = this.gl;
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
        _gl.bufferSubData(_gl.UNIFORM_BUFFER, offset, _array);
        _gl.bindBuffer(_gl.UNIFORM_BUFFER, null);
    }

    public dispose(): void {
        const _gl: WGL2 = this.gl;
        UniformBuffer.unBind(_gl);
        _gl && _gl.deleteBuffer(this.instance);
        this.instance = undefined;
        this.drawType = undefined;
    }
}