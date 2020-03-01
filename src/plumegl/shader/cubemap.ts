import { DefaultCubeMapVert } from './resource/defaultCubeMap_vert';
import { DefaultCubeMapFrag } from './resource/defaultCubeMap_frag';
import { Shader } from './shader';
import { CONSTANT, ATTRIBUTE } from '../engine/constant';
import { WGL, WGL2 } from '../engine/gl';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';

export class DefaultCubeMapShader extends Shader {
    public type: Symbol = CONSTANT.DEFAULTCUBEMAPSHADER;
    public positionAttribute: string = ATTRIBUTE.POSITION;

    constructor(gl?: WGL | WGL2) {
        super(DefaultCubeMapVert, DefaultCubeMapFrag, undefined, gl);

        this.uniform = {
            modelMatrix: 'uModelMatrix',
            modelViewMatrix: 'uModelViewMatrix',
            projectionMatrix: 'uProjectionMatrix',
            cube: 'uCube',
            flip: 'uFlip',
            opacity: 'uOpacity',
            exposure: 'uToneMappingExposure',
        };

        this.selfUniform = {
            "uOpacity": {
                type: 'float',
                value: [1.0]
            },
            "uFlip": {
                type: 'float',
                value: [1.0]
            },
            "uToneMappingExposure": {
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