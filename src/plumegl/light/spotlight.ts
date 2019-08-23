import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';
import { LightAttenuation } from './attenuation';

export class SpotLight extends BaseLight {
    public type: Symbol = CONSTANT.SPOTLIGHT;
    public cutoff: number = 0.0;
    public direction: number[] = [0.0, 0.0, 0.0];
    public position: number[] = [0.0, 0.0, 0.0];
    public attenuation: LightAttenuation = {
        constant: 1.0,
        linear: 0.0,
        exponent: 0.0
    }

    constructor() {
        super();
    }

    public setAttenuation(att: LightAttenuation): void {
        if (!att) {
            return;
        }
        this.attenuation.constant = att.constant || this.attenuation.constant;
        this.attenuation.linear = att.linear || this.attenuation.linear;
        this.attenuation.exponent = att.exponent || this.attenuation.exponent;
    }

    public setDirection(dir: number[]): void {
        if (!dir || dir.length < 3) {
            console.warn('direction should be vector3');
            return;
        }
        this.direction = dir;
    }

    public setPosition(pos: number[]): void {
        if (!pos || pos.length < 3) {
            console.warn('position should be vector3');
            return;
        }
        this.position = pos;
    }

    public setCutoff(ctf: number): void {
        if (ctf == undefined) {
            return;
        }
        this.cutoff = ctf;
    }
}