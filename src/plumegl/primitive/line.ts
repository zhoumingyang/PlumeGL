import { Util } from '../util/util';
import { Primitive } from './primitive';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';

let uuid = 0;
export class Line extends Primitive {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.LINE;
        this.DrawTypes = [this.gl.LINES, this.gl.LINE_LOOP, this.gl.LINE_STRIP];
        this.setDrawType(this.gl.LINES);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    setLineWidth(lw: number) {
        const _gl = this.gl;
        _gl.lineWidth(lw);
    }
}