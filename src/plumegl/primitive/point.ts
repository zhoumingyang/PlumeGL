import { Util } from '../util/util';
import { Primitive } from './primitive';
import { CONSTANT, TYPE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';

let uuid = 0;
export class Point extends Primitive {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.POINT;
        this.DrawTypes = [TYPE.POINTS];
        this.setDrawType(TYPE.POINTS);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

}