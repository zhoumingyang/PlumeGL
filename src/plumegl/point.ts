import { Util } from './util';
import { Primitive } from './primitive';
import { CONSTANT } from './constant';
import { WGL, WGL2 } from './gl';

let uuid = 0;
export class Point extends Primitive {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.POINT;
        this.DrawTypes = [this.gl.POINTS];
        this.setDrawType(this.gl.POINTS);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

}