import { DefaultPhongVert } from "./resource/defaultPhong_vert";
import { DefaultPhongFrag } from "./resource/defaultPhong_frag";
import { Shader } from './shader';
import { Version } from './chunk/version';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultPhongShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTPHONGSHADER;
    public positionAttribute: string = "aPosition";
    public normalAttribute: string = "aNormal";
    public uvAttribute: string = "aUv";

    constructor(useTexture: boolean = false, gl?: WGL | WGL2) {
        super(undefined, undefined, undefined, gl);

        let vs: string = DefaultPhongVert;
        let fs: string = DefaultPhongFrag;

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
            },
            "uSpecular": {
                type: 'vec3',
                value: [0.0, 0.0, 0.0]
            },
            "uSpecPower": {
                type: 'float',
                value: [2.0]
            },
            "uSpecStrength": {
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
            specular: "uSpecular",
            specularPower: "uSpecPower",
            specularStrength: "uSpecStrength",
        };
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        super.addDrawObject(p3d);
        if (p3d instanceof P3D && this.selfUniform) {
            p3d.mountSelfUniform(this.selfUniform);
        }
    }
}