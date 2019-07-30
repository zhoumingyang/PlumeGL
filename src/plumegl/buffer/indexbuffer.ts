import { Util } from '../util/util';
import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';
import { BaseBuffer } from './basebuffer';

export class IndexBuffer extends BaseBuffer {
    public dataType: any;
    public dataTypeSize: any;
    public dataByteSize: any;
    public type: Symbol = CONSTANT.INDEXBUFFER;
    public uid: string;

    constructor(drawType: number = GL.gl.STATIC_DRAW, dataType: number = GL.gl.UNSIGNED_SHORT, gl?: WGL | WGL2) {
        super(gl);
        this.bufferType = this.gl.ELEMENT_ARRAY_BUFFER;
        this.drawType = drawType;
        this.setDataType(dataType);
    }

    public setDataType(dataType: number): void {
        this.dataType = dataType;
        this.dataTypeSize = Util.getTypeSize(dataType);
    }

    static unBind(gl?: WGL | WGL2): void {
        const _gl = gl || GL.gl;
        _gl && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public dispose(): void {
        super.dispose();
        this.instance = null;
    }

    public setBufferData(_array: any, option?: any): void {
        if (!_array) {
            return;
        }
        super.setBufferData(_array);
        this.dataByteSize = (_array.byteLength === undefined) ? _array : _array.byteLength;
    }
}