import { Util } from './util';
import { CONSTANT } from './constant';

let uuid: number = 0;
export class IndexBuffer {
    public gl: WebGLRenderingContext | WebGL2RenderingContext;
    public instance: WebGLBuffer;
    public drawType: number;
    public dataType: any;
    public dataTypeSize: any;
    public dataByteSize: any;
    public type: Symbol;
    public uid: string;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, drawType?: number, dataType?: number) {
        this.gl = gl;
        this.instance = gl.createBuffer();
        this.drawType = drawType || gl.STATIC_DRAW;
        this.setDataType(dataType || gl.UNSIGNED_SHORT);
        this.type = CONSTANT.INDEXBUFFER;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public setDataType(dataType: number): void {
        this.dataType = dataType;
        this.dataTypeSize = Util.getTypeSize(dataType);
    }

    public bind(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.instance);
    }

    public unBind(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public dispose(): void {
        this.unBind();
        this.gl && this.gl.deleteBuffer(this.instance);
        this.instance = null;
        this.gl = null;
    }

    public setElementData(_array: any): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.instance);
        _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, _array, this.drawType);
        _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
        this.dataByteSize = (_array.byteLength === undefined) ? _array : _array.byteLength;
    }

    public setSubElementData(_array: any, offset: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
        _gl.bufferSubData(_gl.ARRAY_BUFFER, offset, _array);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    }
}