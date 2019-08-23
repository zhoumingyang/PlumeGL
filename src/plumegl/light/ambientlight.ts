import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';

export class AmbientLight extends BaseLight {
    public type: Symbol = CONSTANT.AMBIENTLIGHT;
    
    constructor() {
        super();
    }
}