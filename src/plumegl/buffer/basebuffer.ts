
import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';
import { Util } from '../util/util';

let uuid: number = 0;
export class BaseBuffer {
    public gl: WGL | WGL2 = GL.gl;
    public type: Symbol = CONSTANT.BASEBUFFER;
    public instance: WebGLBuffer;
    public bufferType: number;
    public drawType: number;
    public uid: string;

    constructor(gl?: WGL | WGL2) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.instance = this.gl.createBuffer();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    public bind(): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(this.bufferType, this.instance);
    }

    static unBind(gl?: WGL | WGL2): void {

    }

    public setBufferData(_array: any, option?: any): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(this.bufferType, this.instance);
        _gl.bufferData(this.bufferType, _array, this.drawType);
        _gl.bindBuffer(this.bufferType, null);
    }

    public setSubBufferData(_array: any, offset: number = 0): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl.bindBuffer(this.bufferType, this.instance);
        _gl.bufferSubData(this.bufferType, offset, _array);
        _gl.bindBuffer(this.bufferType, null);
    }

    public dispose(): void {
        if (this.gl) {
            this.gl.bindBuffer(this.bufferType, null);
            this.gl.deleteBuffer(this.instance);
        }
    }

}