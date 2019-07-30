import { Util } from './util';
import { Shader } from './shader';
import { CONSTANT } from './constant';
import { GL, WGL, WGL2 } from './gl';

let uuid = 0;
export class ArrayBuffer {
    public gl: WGL | WGL2 = GL.gl;
    public instance: WebGLBuffer;
    public drawType: number;
    public attribs: any[] = [];
    public stride: number = 0;
    public byteLength: number = 0;
    public length: number = 0;
    public uid: string;
    public type: Symbol = CONSTANT.ARRAYBUFFER;
    public feedBack: boolean = false;
    public feedBackIndex: number = 0;

    constructor(drawType: number = GL.gl.STATIC_DRAW, gl?: WGL | WGL2) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.instance = this.gl.createBuffer();
        this.drawType = drawType;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
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

    public bind(): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
    }

    static unBind(gl?: WGL | WGL2): void {
        const tmpGL = gl || GL.gl;
        tmpGL && tmpGL.bindBuffer(tmpGL.ARRAY_BUFFER, null);
    }

    public setBufferData(_array: any): void {
        if (!_array) {
            return;
        }
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
        _gl.bufferData(_gl.ARRAY_BUFFER, _array, this.drawType);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
        this.byteLength = (_array.byteLength === undefined) ? _array : _array.byteLength;
        this._drawLengthChange();
    }

    public setSubBufferData(_array: any, offset: number): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, this.instance);
        _gl.bufferSubData(_gl.ARRAY_BUFFER, offset, _array);
        _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    }

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
        ArrayBuffer.unBind();
        this.gl && this.gl.deleteBuffer(this.instance);
        this.instance = null;
        this.attribs = [];
        this.stride = 0;
        this.byteLength = 0;
        this.length = 0;
    }
}