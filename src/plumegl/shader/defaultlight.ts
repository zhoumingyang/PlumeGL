import { DefaultLightVert } from './resource/defaultLight_vert';
import { DefaultLightFrag } from './resource/defaultLight_frag';
import { Shader } from '../core/shader';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';

export class DefaultLightShader extends Shader {

    public type: Symbol = CONSTANT.DEFAULTLIGHTSHADER;
    public positionAttribute: string = "aPosition";
    public normalAttribute: string = "aNormal";
    public uvAttribute: string = "aUv";
    public uniformMvp: string = "uMvp";
    public uniformWorlMatirx: string = "uWorldMatrix";
    public uniformNormalMatrix: string = "uNormalMatrix";
    public uniformSpecStrength: string = "uSpecStrength";
    public uniformSpecPower: string = "uSpecPower";
    public uniformEyePosition: string = "uEyePosition";
    public uniformTexture: string = "uTexture";
    public uniformBoolMap: string = "ubMap";

    constructor(gl?: WGL | WGL2) {
        super(DefaultLightVert, DefaultLightFrag, undefined, gl);
    }
}