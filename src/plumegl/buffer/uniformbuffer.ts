import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';
import { BaseBuffer } from './basebuffer';

export class UniformBuffer extends BaseBuffer {
    public gl: WGL2 = <WGL2>GL.gl;
    public instance: WebGLBuffer;
    public type: Symbol = CONSTANT.UNIFORMBUFFER;
    public uid: string;

    constructor(drawType?: number, gl?: WGL2) {
        super(gl);
        this.bufferType = this.gl.UNIFORM_BUFFER;
        this.drawType = drawType;
    }

    // public bind(): void {
    //     const _gl: WGL2 = this.gl;
    //     _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
    // }

    static unBind(gl?: WGL | WGL2): void {
        const _gl = <WGL2>gl || <WGL2>GL.gl;
        _gl && _gl.bindBuffer(_gl.UNIFORM_BUFFER, null);
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

    // public setSubBufferData(_array: any, offset: number = 0): void {
    //     const _gl: WGL2 = this.gl;
    //     _gl.bindBuffer(_gl.UNIFORM_BUFFER, this.instance);
    //     _gl.bufferSubData(_gl.UNIFORM_BUFFER, offset, _array);
    //     _gl.bindBuffer(_gl.UNIFORM_BUFFER, null);
    // }

    public dispose(): void {
        // const _gl: WGL2 = this.gl;
        // UniformBuffer.unBind(_gl);
        // _gl && _gl.deleteBuffer(this.instance);
        super.dispose();
        this.instance = undefined;
        this.drawType = undefined;
    }
}