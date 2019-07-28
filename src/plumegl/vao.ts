import { Util } from './util';
import { ArrayBuffer } from './arraybuffer';
import { Shader } from './shader';
import { CONSTANT } from './constant';
import { GL, WGL2 } from './gl';

let uuid = 0;
export class VAO {
    public gl: WGL2 = <WGL2>GL.gl;
    public arrayObject: WebGLVertexArrayObject;
    public uid: string;
    public buffers: Map<string, ArrayBuffer> = new Map();
    public type: Symbol = CONSTANT.VAO;

    constructor(buffers: ArrayBuffer[] = [], gl?: WGL2) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.arrayObject = this.gl.createVertexArray();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
        if (buffers && buffers.length) {
            buffers.forEach((buffer: ArrayBuffer) => {
                this.buffers.set(buffer.uid, buffer);
            });
        }
    }

    public addBuffer(buffer: ArrayBuffer): void {
        if (!buffer || !this.buffers) {
            return;
        }
        this.buffers.set(buffer.uid, buffer);
    }

    public deleteBuffer(key: string): void {
        this.buffers.delete(key);
    }

    public initBufferAttributePoint(program: Shader): void {
        if (!program || !this.buffers) {
            return;
        }
        const _gl: WGL2 = this.gl;
        _gl.bindVertexArray(this.arrayObject);
        this.buffers.forEach((buffer: ArrayBuffer) => {
            buffer.setAttributePoint(program);
        });
        // _gl.bindVertexArray(null);
    }

    public bind(): void {
        const _gl: WGL2 = this.gl;
        _gl.bindVertexArray(this.arrayObject);
    }

    public bindBuffers(): void {
        if (!this.buffers) {
            return;
        }
        this.buffers.forEach((buffer) => {
            buffer.bind();
        });
    }

    public unBindBuffers(): void {
        if (!this.buffers) {
            return;
        }
        ArrayBuffer.unBind(this.gl);
    }

    static unBind(gl?: WGL2): void {
        const _gl = gl || <WGL2>GL.gl;
        _gl && _gl.bindVertexArray(null);
    }

    public disposeBuffes(): void {
        this.buffers.forEach((buffer) => {
            buffer.dispose();
        });
        this.buffers = new Map();
    }

    public dispose(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.bindVertexArray(null);
        this.disposeBuffes();
        _gl.deleteVertexArray(this.arrayObject);
        this.uid = null;
        this.arrayObject = null;
    }
}