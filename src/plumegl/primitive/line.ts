import { Util } from '../util/util';
import { Primitive } from './primitive';
import { CONSTANT, TYPE, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { Vec3 } from '../math/vec3';

let uuid = 0;
export class Line extends Primitive {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.LINE;
        this.DrawTypes = [TYPE.LINES, TYPE.LINE_LOOP, TYPE.LINE_STRIP];
        this.setDrawType(TYPE.LINES);
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    setLineWidth(lw: number) {
        const _gl = this.gl;
        _gl.lineWidth(lw);
    }

    initLineLengthAttribute(attributeName: string, drawType?: number): void {
        if (this.attributes[ATTRIBUTE.POSITION]) {
            const positionData = this.attributes[ATTRIBUTE.POSITION];
            const cnt = positionData.length / 3;
            let lineLength: any = new Array(cnt).fill(0);
            for (let i = 1; i < cnt; i++) {
                const stIdx = i - 1;
                const edIdx = i;
                const start: Vec3 = new Vec3(positionData[stIdx * 3], positionData[stIdx * 3 + 1], positionData[stIdx * 3 + 2]);
                const end: Vec3 = new Vec3(positionData[edIdx * 3], positionData[edIdx * 3 + 1], positionData[edIdx * 3 + 2]);
                lineLength[i] = lineLength[i - 1];
                lineLength[i] += start.distance(end);
            }
            lineLength = new Float32Array(lineLength);
            this.setGeometryAttribute(lineLength, attributeName, drawType || TYPE.STATIC_DRAW, 1, TYPE.FLOAT, false);
        }
    }
}