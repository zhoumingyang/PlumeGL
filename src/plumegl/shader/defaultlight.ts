import { DefaultLightVert } from './resource/defaultLight_vert';
import { DefaultLightFrag } from './resource/defaultLight_frag';
import { Version } from './chunk/version';
import { Shader } from './shader';
import { CONSTANT, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultLightShader extends Shader {

    public type: Symbol = CONSTANT.DEFAULTLIGHTSHADER;
    public positionAttribute: string = ATTRIBUTE.POSITION;
    public normalAttribute: string = ATTRIBUTE.NORMAL;
    public uvAttribute: string = ATTRIBUTE.UV;

    constructor(useMap: boolean = false, gl?: WGL | WGL2) {
        super(undefined, undefined, undefined, gl);
        let vs: string = DefaultLightVert;
        let fs: string = DefaultLightFrag;
        if (useMap) {
            fs = `#define USE_MAP 1 \n` + fs;
        }
        vs = Version + vs;
        fs = Version + fs;
        this.setShaderSource(vs, fs);
        this.compileShader();

        this.selfUniform = {
            "uSpecStrength": {
                type: 'float',
                value: [1.0]
            },
            "uSpecPower": {
                type: 'float',
                value: [1.0]
            },
            "uTexture": {
                type: 'sampler2D',
                value: [1]
            },
            "uColor": {
                type: 'vec3',
                value: [1.0, 1.0, 1.0]
            }
        };

        this.uniform = {
            mvp: "uMvp",
            worldMatrix: "uWorldMatrix",
            normalMatrix: "uNormalMatrix",
            eyePosition: "uEyePosition",
            specStrength: "uSpecStrength",
            specPower: "uSpecPower",
            texture: "uTexture",
            color: "uColor",
        };

    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }
}