import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';

export class ParallelLight extends BaseLight {
    public type: Symbol = CONSTANT.PARALLELLIGHT;
    public direction: Float32Array = Float32Array.from([0.0, 0.0, 0.0]);

    constructor() {
        super();
    }

    public setDirection(dir: Float32Array): void {
        if (!dir || dir.length < 3) {
            console.warn('direction should be vector3');
            return;
        }
        this.direction = dir;
    }
}