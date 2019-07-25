import { ArrayBuffer } from './arraybuffer';
import { Primitive } from './primitive';

export class FeedBack {
    public gl: WebGL2RenderingContext;
    public instance: WebGLTransformFeedback;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.instance = gl.createTransformFeedback();
    }

    public bind(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
    }

    static unBind(_gl: WebGL2RenderingContext): void {
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
    }

    public bindBuffer(buffer: ArrayBuffer | WebGLBuffer | Primitive, index: number = 0): void {
        const _gl: WebGL2RenderingContext = this.gl;
        let tmpBuffer = buffer;
        if (buffer instanceof Primitive) {
            if (buffer.uniqueBuffer) {
                tmpBuffer = buffer.uniqueBuffer.instance;
            }
        } else if (buffer instanceof ArrayBuffer) {
            tmpBuffer = buffer.instance;
        }
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
        _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, index, tmpBuffer);
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
        _gl.bindBufferBase(_gl.TRANSFORM_FEEDBACK_BUFFER, index, null);
    }

    public begin(drawMode: number): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, this.instance);
        drawMode = drawMode || _gl.TRIANGLES;
        _gl.beginTransformFeedback(drawMode);
    }

    public end(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.endTransformFeedback();
        _gl.bindTransformFeedback(_gl.TRANSFORM_FEEDBACK, null);
    }

    public dispose(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.deleteTransformFeedback(this.instance);
    }
}