import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";

export class RingGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.RINGGEOMETRY;

    constructor() {
        super();
    }

    create(row: number, col: number, ir: number, or: number): void {
        row = Math.floor(row);
        col = Math.floor(col)
        for (let i = 0; i <= row; i++) {

        }
    }
}