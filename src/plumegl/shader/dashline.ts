import { DefaultDashLineVert } from './resource/defaultdashline_vert';
import { DefaultDashLineFrag } from './resource/defaultdashline_frag';
import { Shader } from './shader';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultDashLineShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTDASHLINESHADER;
    public positionAttribute: string = 'aPosition';
    public lengthAttribute: string = 'aLineLength';

    constructor(gl?: WGL | WGL2) {
        super(DefaultDashLineVert, DefaultDashLineFrag, undefined, gl);

        this.uniform = {
            lineScale: 'uLineScale',
            projectionMatrix: 'uProjectionMatrix',
            modelViewMatrix: 'uModelViewMatrix',
            opacity: 'uOpacity',
            color: 'uColor',
            dashSize: 'uDashSize',
            gapSize: 'uGapSize'
        };

        this.selfUniform = {
            "uLineScale": {
                type: 'float',
                value: [1.0]
            },
            "uOpacity": {
                type: 'float',
                value: [1.0]
            },
            "uColor": {
                type: 'vec3',
                value: [1.0, 1.0, 1.0]
            },
            "uDashSize": {
                type: 'float',
                value: [1.0]
            },
            "uGapSize": {
                type: 'float',
                value: [1.0]
            }
        };
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }
}