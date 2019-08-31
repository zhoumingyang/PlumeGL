import { Util } from '../util/util';
import { CONSTANT } from '../engine/constant';
import { LightAttenuation } from './attenuation';
import { Vec3 } from '../math/vec3';

let uuid: number = 0;
export class BaseLight {
    public type: Symbol = CONSTANT.BASELIGHT;
    public uid: string;
    public color: Vec3 = new Vec3(1.0, 1.0, 1.0);
    public ambient: number = 1.0;
    public diffuse: number = 1.0;

    constructor() {
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    public setDirection(dir: Vec3): void {

    }

    public setPosition(pos: Vec3): void {

    }

    public setAttenuation(att: LightAttenuation): void {

    }

}