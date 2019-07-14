import { Util } from './util';
import { Primitive } from './primitive';
import { CONSTANT } from './constant';

let uuid = 0;
export class Point extends Primitive {

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.POINT;
        this.DrawTypes = [gl.POINTS];
        this.setDrawType(gl.POINTS);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

}