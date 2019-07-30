import { Util } from '../util/util';
import { Shader } from '../core/shader';
import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';
import { BaseBuffer } from './basebuffer';

export class ArrayBuffer extends BaseBuffer {
    public attribs: any[] = [];
    public stride: number = 0;
    public byteLength: number = 0;
    public length: number = 0;
    public uid: string;
    public type: Symbol = CONSTANT.ARRAYBUFFER;
    public feedBack: boolean = false;
    public feedBackIndex: number = 0;

    constructor(drawType: number = GL.gl.STATIC_DRAW, gl?: WGL | WGL2) {
        super(gl);
        this.bufferType = this.gl.ARRAY_BUFFER;
        this.drawType = drawType;
    }

    private _drawLengthChange(): void {
        if (this.stride > 0) {
            this.length = this.byteLength / this.stride;
        }
    }

    public attrib(name: string, size: number, type: GLenum, normalize: boolean): void {
        this.attribs.push({
            name: name,
            type: 0 | type,
            size: 0 | size,
            normalize: !!normalize,
            offset: this.stride
        });
        this.stride += Util.getTypeSize(type) * size;
        this._drawLengthChange();
    }

    // public bind(): void {
    //     const _gl: WGL | WGL2 = this.gl;
    //     _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
    // }

    static unBind(gl?: WGL | WGL2): void {
        const tmpGL = gl || GL.gl;
        tmpGL && tmpGL.bindBuffer(tmpGL.ARRAY_BUFFER, null);
    }

    public setBufferData(_array: any, option?: any): void {
        if (!_array) {
            return;
        }
        // const _gl: WGL | WGL2 = this.gl;
        // _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
        // _gl.bufferData(_gl.ARRAY_BUFFER, _array, this.drawType);
        // _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
        super.setBufferData(_array);
        this.byteLength = (_array.byteLength === undefined) ? _array : _array.byteLength;
        this._drawLengthChange();
    }

    // public setSubBufferData(_array: any, offset: number): void {
    //     const _gl: WGL | WGL2 = this.gl;
    //     _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
    //     _gl.bufferSubData(_gl.ARRAY_BUFFER, offset, _array);
    //     _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    // }

    public setAttributePoint(program: Shader): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
        const attribs: any[] = this.attribs;
        const attribsLength = attribs.length;
        if (!program) {
            return;
        }
        const prgAttribs = program.attribsInfo;
        if (!prgAttribs) {
            return;
        }
        for (let i: number = 0; i < attribsLength; i++) {
            const attrib: any = attribs[i];
            const name: string = attrib.name;
            if (prgAttribs.has(name)) {
                const attribLocation: GLint = prgAttribs.get(name);
                _gl.enableVertexAttribArray(attribLocation);
                _gl.vertexAttribPointer(attribLocation, attrib.size, attrib.type,
                    attrib.normalize, this.stride, attrib.offset);
            }
        }
        _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    }

    public dispose(): void {
        // ArrayBuffer.unBind();
        // this.gl && this.gl.deleteBuffer(this.instance);
        super.dispose();
        this.instance = null;
        this.attribs = [];
        this.stride = 0;
        this.byteLength = 0;
        this.length = 0;
    }
}