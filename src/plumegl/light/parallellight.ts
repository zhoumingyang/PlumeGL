import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';

export class ParallelLight extends BaseLight {
    public type: Symbol = CONSTANT.PARALLELLIGHT;
    public direction: number[] = [0.0, 0.0, 0.0];

    constructor() {
        super();
    }

    public setDirection(dir: number[]): void {
        if (!dir || dir.length < 3) {
            console.warn('direction should be vector3');
            return;
        }
        this.direction = dir;
    }
}