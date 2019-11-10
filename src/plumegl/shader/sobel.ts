import { DefaultSobleVert } from './resource/defaultsobel_vert';
import { DefaultSobelFrag } from './resource/defaultsobel_frag';
import { Shader } from './shader';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultSobelShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTSOBELSHADER;
    public positionAttribute: string = "aPosition";
    public normalAttribute: string = "aUv";

    constructor(gl?: WGL | WGL2) {
        super(DefaultSobleVert, DefaultSobelFrag, undefined, gl);

        this.selfUniform = {
            "uResolution": {
                type: "vec2",
                value: [512, 512]
            },
            "uThreshold": {
                type: "float",
                value: [0.05]
            }
        };

        this.uniform = {
            texture: "uTexture",
            resolution: "uResolution",
            threshold: "uThreshold",
            modelViewMatrix: "uModelViewMatrix",
            projectionMatrix: "uProjectionMatrix"
        };

    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }
}