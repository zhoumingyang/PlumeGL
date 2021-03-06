import { DefaultImageProcessVert } from './resource/defaultimageprocess_vert';
import { DefaultImageProcessFrag } from './resource/defaultimageprocess_frag';
import { Shader } from './shader';
import { CONSTANT, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultImageProcessShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTIMAGEPROCESSSHADER;
    public positionAttribute: string = ATTRIBUTE.POSITION;
    public uvAttribute: string = ATTRIBUTE.UV;

    constructor(gl?: WGL | WGL2) {
        super(DefaultImageProcessVert, DefaultImageProcessFrag, undefined, gl);

        this.selfUniform = {
            "uResolution": {
                type: "vec2",
                value: [512, 512]
            },
            "uFlipY": {
                type: "float",
                value: [1.0]
            },
            "uTexture": {
                type: "sampler2D",
                value: [0]
            },
            "uTextureSize": {
                type: "vec2",
                value: [0, 0]
            },
            "uKernelWeight": {
                type: "float",
                value: [1]
            },
            "uKernel[0]": {
                type: "float array",
                value: [0, 0, 0, 0, 1, 0, 0, 0, 0]
            }
        };

        this.uniform = {
            texture: 'uTexture',
            textureSize: 'uTextureSize',
            kernelWeight: 'uKernelWeight',
            resolution: 'uResolution',
            flipY: 'uFlipY',
            kernel: 'uKernel[0]',
        };
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }

}