import { BaseLight } from './baselight';
import { CONSTANT } from '../engine/constant';
import { LightAttenuation } from './attenuation';
import { Vec3 } from '../math/vec3';

export class SpotLight extends BaseLight {
    public type: Symbol = CONSTANT.SPOTLIGHT;
    public cutoff: number = 0.0;
    public direction: Vec3 = new Vec3(0.0, 0.0, 0.0);
    public position: Vec3 = new Vec3(0.0, 0.0, 0.0);
    public attenuation: LightAttenuation = {
        constant: 1.0,
        linear: 0.0,
        exponent: 0.0
    };
    public angle: number = Math.PI / 3;
    public penumbra: number = 0;
    private _coneCos: number;
    private _penumbraCos: number;

    constructor() {
        super();
        this.updateCone();
    }

    public setAttenuation(att: LightAttenuation): void {
        if (!att) {
            return;
        }
        this.attenuation.constant = att.constant || this.attenuation.constant;
        this.attenuation.linear = att.linear || this.attenuation.linear;
        this.attenuation.exponent = att.exponent || this.attenuation.exponent;
    }

    public setDirection(dir: Vec3): void {
        this.direction = dir;
    }

    public setPosition(pos: Vec3): void {
        this.position = pos;
    }

    public setCutoff(ctf: number): void {
        if (ctf == undefined) {
            return;
        }
        this.cutoff = ctf;
    }

    private updateCone(): void {
        this._coneCos = Math.cos(this.angle);
        this._penumbraCos = Math.cos(this.angle * (1 - this.penumbra));
    }

    public setAngle(angle: number): void {
        this.angle = angle;
        this.updateCone();
    }

    public setPenumbra(penumbra: number): void {
        this.penumbra = penumbra;
        this.updateCone();
    }

    get coneCos() {
        return this._coneCos;
    }

    get penumbraCos() {
        return this._penumbraCos;
    }
}