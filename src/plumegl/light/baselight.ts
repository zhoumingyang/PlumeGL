import { Util } from '../util/util';
import { CONSTANT } from '../engine/constant';
import { LightAttenuation } from './attenuation';

let uuid: number = 0;
export class BaseLight {
    public type: Symbol = CONSTANT.BASELIGHT;
    public uid: string;
    public color: number[] = [1.0, 1.0, 1.0];
    public ambient: number = 1.0;
    public diffuse: number = 1.0;

    constructor() {
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    public setDirection(dir: number[]): void {

    }

    public setPosition(pos: number[]): void {

    }

    public setAttenuation(att: LightAttenuation): void {

    }

}