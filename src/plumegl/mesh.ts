import { Util } from './util';
import { IndexBuffer } from './indexbuffer';
import { Primitive } from './primitive';
import { CONSTANT } from './constant';

let uuid = 0;
export class Mesh extends Primitive {

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.MESH;
        this.DrawTypes = [gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN];
        this.setDrawType(gl.TRIANGLES);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public setIndices(datas: any, drawType?: number, dataType?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        if (!datas) {
            return;
        }
        if (!(datas instanceof Uint8Array) && !(datas instanceof Uint16Array)) {
            datas = new Uint8Array(datas);
        }
        this.attributes['indices'] = datas;
        if (!this.indexBuffer) {
            this.indexBuffer = new IndexBuffer(_gl, drawType, dataType);
        }
        this.indexBuffer.setElementData(datas);
    }
}