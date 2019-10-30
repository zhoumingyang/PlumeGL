import { DefaultEnvMapVert } from './resource/defaultEnvMap_vert';
import { DefaultEnvMapFrag } from './resource/defaultEnvMap_frag';
import { Shader } from './shader';
import { CONSTANT } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultEnvMapShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTENVMAPSHADER;
    public positionAttribute: string = "aPosition";
    public normalAttribute: string = "aNormal";

    constructor(gl?: WGL | WGL2) {
        super(DefaultEnvMapVert, DefaultEnvMapFrag, undefined, gl);

        this.uniform = {
            modelMatrix: 'uModelMatrix',
            viewMatrix: 'uViewMatrix',
            projectionMatrix: 'uProjectionMatrix',
            normalMatrix: 'uNormalMatrix',
            refractionRatio: 'uRefractionRatio',
            cameraPosition: 'uCameraPosition',
            envMapFlip: 'uEnvMapFlip'
        };

        this.selfUniform = {
            'uRefractionRatio': {
                type: 'float',
                value: [0.0]
            },
            'uEnvMapFlip': {
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