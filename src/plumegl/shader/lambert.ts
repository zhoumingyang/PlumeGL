import { DefaultLambertVert } from "./resource/defaultLambert_vert";
import { DefaultLambertFrag } from "./resource/defaultLambert_frag";
import { Shader } from './shader';
import { Version } from './chunk/version';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';

export class DefaultLambertShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTLAMBERTSHADER;
    public positionAttribute: string = "aPosition";
    public normalAttribute: string = "aNormal";
    public uvAttribute: string = "aUv";

    constructor(useMap: boolean = false, gl?: WGL | WGL2) {
        super(undefined, undefined, undefined, gl);

        let vs: string = DefaultLambertVert;
        let fs: string = DefaultLambertFrag;
        if (useMap) {
            fs = `#define USE_MAP 1 \n` + fs;
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
}
