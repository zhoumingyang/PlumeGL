import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';
import { LightAttenuation } from './attenuation';

export class PointLight extends BaseLight {
    public type: Symbol = CONSTANT.POINTLIGHT;
    public position: number[] = [0.0, 0.0, 0.0];
    public attenuation: LightAttenuation = {
        constant: 1.0,
        linear: 0.0,
        exponent: 0.0
    }

    constructor() {
        super();
    }

    public setPosition(pos: number[]): void {
        if (!pos || pos.length < 3) {
            console.warn('position should be vector3');
            return;
        }
        this.position = pos;
    }

    public setAttenuation(att: LightAttenuation): void {
        if (!att) {
            return;
        }
        this.attenuation.constant = att.constant || this.attenuation.constant;
        this.attenuation.linear = att.linear || this.attenuation.linear;
        this.attenuation.exponent = att.exponent || this.attenuation.exponent;
    }

}