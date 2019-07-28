import { Util } from './util';
import { IndexBuffer } from './indexbuffer';
import { Primitive } from './primitive';
import { CONSTANT } from './constant';
import { WGL, WGL2 } from './gl';

let uuid = 0;
export class Mesh extends Primitive {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.MESH;
        this.DrawTypes = [this.gl.TRIANGLES, this.gl.TRIANGLE_STRIP, this.gl.TRIANGLE_FAN];
        this.setDrawType(this.gl.TRIANGLES);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public setIndices(datas: any, drawType?: number, dataType?: number): void {
        if (!datas) {
            return;
        }
        if (!(datas instanceof Uint8Array) && !(datas instanceof Uint16Array)) {
            datas = new Uint8Array(datas);
        }
        this.attributes['indices'] = datas;
        if (!this.indexBuffer) {
            this.indexBuffer = new IndexBuffer(drawType, dataType, this.gl);
        }
        this.indexBuffer.setElementData(datas);
    }
}