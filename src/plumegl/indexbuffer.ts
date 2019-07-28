import { Util } from './util';
import { CONSTANT } from './constant';
import { GL, WGL, WGL2 } from './gl';

let uuid: number = 0;
export class IndexBuffer {
    public gl: WGL | WGL2 = GL.gl;
    public instance: WebGLBuffer;
    public drawType: number;
    public dataType: any;
    public dataTypeSize: any;
    public dataByteSize: any;
    public type: Symbol = CONSTANT.INDEXBUFFER;
    public uid: string;

    constructor(drawType: number = GL.gl.STATIC_DRAW, dataType: number = GL.gl.UNSIGNED_SHORT, gl?: WGL | WGL2) {
        this.gl = gl || GL.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.instance = this.gl.createBuffer();
        this.drawType = drawType;
        this.setDataType(dataType);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public setDataType(dataType: number): void {
        this.dataType = dataType;
        this.dataTypeSize = Util.getTypeSize(dataType);
    }

    public bind(): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.instance);
    }

    static unBind(gl?: WGL | WGL2): void {
        const _gl = gl || GL.gl;
        _gl && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public dispose(): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl && this.gl.deleteBuffer(this.instance);
        this.instance = null;
    }

    public setElementData(_array: any): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.instance);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, _array, this.drawType);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
        this.dataByteSize = (_array.byteLength === undefined) ? _array : _array.byteLength;
    }

    public setSubElementData(_array: any, offset: number): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
        _gl.bufferSubData(_gl.ARRAY_BUFFER, offset, _array);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    }
}