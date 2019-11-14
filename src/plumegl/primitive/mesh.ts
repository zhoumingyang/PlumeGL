import { Util } from '../util/util';
import { IndexBuffer } from '../buffer/indexbuffer';
import { Primitive } from './primitive';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { BaseGeometry } from '../geometry/basegeometry';

let uuid = 0;
export class Mesh extends Primitive {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.MESH;
        this.DrawTypes = [this.gl.TRIANGLES, this.gl.TRIANGLE_STRIP, this.gl.TRIANGLE_FAN];
        this.setDrawType(this.gl.TRIANGLES);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
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
        this.indexBuffer.setBufferData(datas);
    }

    public initFromGeometry(geometry: BaseGeometry, shader: any, option?: any) {
        if (shader.positionAttribute) {
            this.setGeometryAttribute(geometry.vertices, shader.positionAttribute, this.gl.STATIC_DRAW, 3, this.gl.FLOAT, false);
        }
        if (shader.normalAttribute) {
            this.setGeometryAttribute(geometry.normals, shader.normalAttribute, this.gl.STATIC_DRAW, 3, this.gl.FLOAT, false);
        }
        if (shader.uvAttribute) {
            this.setGeometryAttribute(geometry.normals, shader.normalAttribute, this.gl.STATIC_DRAW, 2, this.gl.FLOAT, false);
        }
        if (!option || option.setIndices) {
            this.setIndices(geometry.indices, this.gl.STATIC_DRAW);
        }
        this.initBufferAttributePoint(shader);
        return this;
    }
}