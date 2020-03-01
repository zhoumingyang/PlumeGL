import { DefaultColorVert } from './resource/defaultcolor_vert';
import { DefaultColorFrag } from './resource/defaultcolor_frag';
import { Shader } from './shader';
import { CONSTANT, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultColorShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTCOLORSHADER;
    public positionAttribute: string = ATTRIBUTE.POSITION;

    constructor(gl?: WGL | WGL2) {
        super(DefaultColorVert, DefaultColorFrag, undefined, gl);
        this.selfUniform = {
            "uColor": {
                type: 'vec3',
                value: [1.0, 1.0, 1.0]
            },
            "uOpacity": {
                type: 'float',
                value: [1.0]
            }
        };
        this.uniform = {
            color: "uColor",
            opacity: "uOpacity",
            modelViewMatrix: "uModelViewMatrix",
            projectionMatrix: "uProjectionMatrix",
        };
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }
}