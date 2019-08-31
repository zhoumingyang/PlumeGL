import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';
import { Vec3 } from '../math/vec3';

export class ParallelLight extends BaseLight {
    public type: Symbol = CONSTANT.PARALLELLIGHT;
    public direction: Vec3 = new Vec3(1.0, 1.0, 1.0);

    constructor() {
        super();
    }

    public setDirection(dir: Vec3): void {
        this.direction = dir;
    }
}