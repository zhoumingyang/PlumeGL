import { Util } from './util';
import { Primitive } from './primitive';
import { CONSTANT } from './constant';

let uuid = 0;
export class Line extends Primitive {

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.LINE;
        this.DrawTypes = [gl.LINES, gl.LINE_LOOP, gl.LINE_STRIP];
        this.setDrawType(gl.LINES);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    setLineWidth(lw: number) {
        const _gl = this.gl;
        _gl.lineWidth(lw);
    }
}