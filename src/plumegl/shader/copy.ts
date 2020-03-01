import { DefaultCopyVert } from './resource/defaultcopy_vert';
import { DefaultCopyFrag } from './resource/defaultcopy_frag';
import { Shader } from './shader';
import { CONSTANT, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultCopyShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTCOPYSHADER;
    public positionAttribute: string = ATTRIBUTE.POSITION;
    public uvAttribute: string = ATTRIBUTE.UV;

    constructor(gl?: WGL | WGL2) {
        super(DefaultCopyVert, DefaultCopyFrag, undefined, gl);

        this.uniform = {
            texture: "uTexture",
            modelViewMatrix: "uModelViewMatrix",
            projectionMatrix: "uProjectionMatrix"
        };
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
    }

}