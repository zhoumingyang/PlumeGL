import { ArrayBuffer } from './arraybuffer';
import { Primitive } from './primitive';
import { P3D } from './p3d';
import { CONSTANT } from './constant';
import { Util } from './util';
import { GL, WGL2 } from './gl';

let uuid = 0;
export class FeedBack {
    public gl: WGL2 = <WGL2>GL.gl;
    public instance: WebGLTransformFeedback;
    public type: Symbol = CONSTANT.FEEDBACK;
    public uid: string;

    constructor(gl?: WGL2) {
        this.gl = gl || this.gl;
        this.instance = this.gl.createTransformFeedback();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public bind(): void {
        const _gl: WGL2 = this.gl;
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
    }

    static unBind(_gl: WGL2): void {
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
    }

    private getWebGLBuffers(buffer: ArrayBuffer | WebGLBuffer | Primitive | P3D): WebGLBuffer[] | WebGLBuffer {
        const getbuffer = (uniqueBuffer: ArrayBuffer, buffers: any): any => {
            let tmpBuffer: any;
            if (uniqueBuffer) {
                tmpBuffer = uniqueBuffer.instance;
            } else if (buffers) {
                tmpBuffer = <WebGLBuffer>[];
                for (let key in buffers) {
                    tmpBuffer.push(buffers[key].instance);
                }
            }
            return tmpBuffer;
        };

        let tmpBuffer: any = (buffer instanceof WebGLBuffer) && buffer;
        if (buffer instanceof P3D) {
            const pri = buffer.primitive;
            const uniqueBuffer = pri && pri.uniqueBuffer;
            const buffers = pri && pri.buffers;
            tmpBuffer = getbuffer(uniqueBuffer, buffers);
        } else if (buffer instanceof Primitive) {
            const buffers = buffer.buffers;
            const uniqueBuffer = buffer.uniqueBuffer;
            tmpBuffer = getbuffer(uniqueBuffer, buffers);
        } else if (buffer instanceof ArrayBuffer) {
            tmpBuffer = buffer.instance;
        }
        return tmpBuffer;
    }

    public bindBuffer(buffer: ArrayBuffer | WebGLBuffer | Primitive | P3D, index: number = 0): void {
        const _gl: WGL2 = this.gl;
        let tmpBuffer = this.getWebGLBuffers(buffer);
        if (tmpBuffer instanceof Array) {
            this.bindBuffers(tmpBuffer);
        } else {
            _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
            _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, index, tmpBuffer);
            _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
            _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, index, null);
        }
    }

    public bindBuffers(buffers: (ArrayBuffer | WebGLBuffer | Primitive | P3D)[]): void {
        const _gl: WGL2 = this.gl;
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
        buffers.forEach((buffer, i) => {
            const tmpBuffer = this.getWebGLBuffers(buffer);
            if (tmpBuffer instanceof Array) {
                tmpBuffer.forEach((b, j) => {
                    _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, i + j, b);
                });
            } else {
                _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, i, tmpBuffer);
            }
        });
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
        buffers.forEach((buffer, i) => {
            const tmpBuffer = this.getWebGLBuffers(buffer);
            if (tmpBuffer instanceof Array) {
                tmpBuffer.forEach((b, j) => {
                    _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, i + j, b);
                });
            } else {
                _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
            }
        });
    }

    public begin(drawMode: number): void {
        const _gl: WGL2 = this.gl;
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
        drawMode = drawMode || _gl.TRIANGLES;
        _gl.beginTransformFeedback(drawMode);
    }

    public end(): void {
        const _gl: WGL2 = this.gl;
        _gl.endTransformFeedback();
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
    }

    public dispose(): void {
        const _gl: WGL2 = this.gl;
        _gl.deleteTransformFeedback(this.instance);
    }
}