import { DefaultLambertVert } from "./resource/defaultLambert_vert";
import { DefaultLambertFrag } from "./resource/defaultLambert_frag";
import { Shader } from './shader';
import { Version } from './chunk/version';
import { CONSTANT, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultLambertShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTLAMBERTSHADER;
    public positionAttribute: string = ATTRIBUTE.POSITION;
    public normalAttribute: string = ATTRIBUTE.NORMAL;
    public uvAttribute: string = ATTRIBUTE.UV;

    constructor(useTexture: boolean = false, gl?: WGL | WGL2) {
        super(undefined, undefined, undefined, gl);

        let vs: string = DefaultLambertVert;
        let fs: string = DefaultLambertFrag;
        if (useTexture) {
            fs = `#define USE_TEXTURE 1 \n` + fs;
        }
        vs = Version + vs;
        fs = Version + fs;
        this.setShaderSource(vs, fs);
        this.compileShader();

        this.selfUniform = {
            "uDiffuse": {
                type: 'vec3',
                value: [1.0, 1.0, 1.0]
            },
            "uEmissive": {
                type: 'vec3',
                value: [0.0, 0.0, 0.0]
            },
            "uOpacity": {
                type: 'float',
                value: [1.0]
            }
        };

        this.uniform = {
            modelMatrix: "uModelMatrix",
            normalMatrix: "uNormalMatrix",
            modelViewMatrix: "uModelViewMatrix",
            projectionMatrix: "uProjectionMatrix",
            diffuse: "uDiffuse",
            emissive: "uEmissive",
            opacity: "uOpacity",
        };
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }
}
