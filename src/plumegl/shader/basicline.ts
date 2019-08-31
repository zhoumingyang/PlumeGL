import { BasicLineVert } from './resource/basicline_vert';
import { BasicLineFrag } from './resource/basicline_frag';
import { Shader } from './shader';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';

export class BasicLineShader extends Shader {
    public type: Symbol = CONSTANT.BASICLINESHADER;
    public positionAttribute: string = "aPosition";
    public uniformMvp: string = "uMvp";
    public uniformColor: string = "uColor";

    constructor(gl?: WGL | WGL2) {
        super(BasicLineVert, BasicLineFrag, undefined, gl);
    }
}