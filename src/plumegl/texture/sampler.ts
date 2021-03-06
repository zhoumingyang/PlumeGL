import { Util } from '../util/util';
import { CONSTANT, TEXTURE } from '../engine/constant';
import { GL, WGL2 } from '../engine/gl';

interface WrapType {
    WRAP_S?: number;
    WRAP_T?: number;
    WRAP_R?: number;
};

interface FilterType {
    MAG_FILTER?: number;
    MIN_FILTER?: number;
}

interface LodType {
    MIN_LOD?: number;
    MAX_LOD?: number;
}

interface CompareType {
    COMPARE_MODE?: number;
    COMPARE_FUNC?: number;
}

let uuid = 0;
export class Sampler {
    public gl: WGL2 = <WGL2>GL.gl;
    public uid: string;
    public instance: WebGLSampler;
    public type: Symbol = CONSTANT.SAMPLER;

    constructor(gl?: WGL2) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
        this.instance = this.gl.createSampler();
    }

    public bind(unit: number): void {
        const _gl: WGL2 = this.gl;
        _gl.bindSampler(unit, this.instance);
    }

    public unBind(): void {

    }

    public dispose(): void {
        this.gl && this.gl.deleteSampler(this.instance);
        this.instance = null;
    }

    public repeat(): void {
        const _gl: WGL2 = this.gl;
        this.setWrapMode(_gl.REPEAT);
    }

    public clamp(): void {
        const _gl: WGL2 = this.gl;
        this.setWrapMode(_gl.CLAMP_TO_EDGE);
    }

    public mirror(): void {
        const _gl: WGL2 = this.gl;
        this.setWrapMode(_gl.MIRRORED_REPEAT);
    }

    private setMode(mode: WrapType | FilterType | LodType | CompareType) {

    }

    public setWrapMode(mode: number | WrapType, option?: any): void {
        if (mode === undefined) {
            return;
        }
        const _gl: WGL2 = this.gl;
        if (typeof mode === 'number') {
            _gl.samplerParameteri(this.instance, _gl.TEXTURE_WRAP_S, mode);
            _gl.samplerParameteri(this.instance, _gl.TEXTURE_WRAP_T, mode);
            if (option && option.WRAP_R) {
                _gl.samplerParameteri(this.instance, _gl.TEXTURE_WRAP_R, mode);
            }
        } else {
            for (let key in mode) {
                let value;
                switch (key) {
                    case TEXTURE.WRAP_S:
                        value = mode.WRAP_S;
                        _gl.samplerParameteri(this.instance, _gl.TEXTURE_WRAP_S, value);
                        break;
                    case TEXTURE.WRAP_T:
                        value = mode.WRAP_T;
                        _gl.samplerParameteri(this.instance, _gl.TEXTURE_WRAP_T, value);
                        break;
                    case TEXTURE.WRAP_R:
                        value = mode.WRAP_R;
                        _gl.samplerParameteri(this.instance, _gl.TEXTURE_WRAP_R, value);
                        break;
                }
            }
        }
    }

    public textureFilter(linear: boolean, mipmap: boolean, mipmapLinear: boolean): number {
        return 0x2600 | (+linear) | (+mipmap << 8) | (+(mipmap && mipmapLinear) << 1);
    }

    public setMagMinFilter(linear: boolean = true, mipmap: boolean = false, mipmapLinear: boolean = false): void {
        const _gl: WGL2 = this.gl;
        const filter = this.textureFilter(!!linear, !!mipmap, !!mipmapLinear);
        _gl.samplerParameteri(this.instance, _gl.TEXTURE_MAG_FILTER, this.textureFilter(!!linear, false, false));
        _gl.samplerParameteri(this.instance, _gl.TEXTURE_MIN_FILTER, filter);
    }

    public setFilterMode(filter: FilterType): void {
        if (!filter) {
            return;
        }
        const _gl: WGL2 = this.gl;
        for (let key in filter) {
            let value;
            switch (key) {
                case TEXTURE.MAG_FILTER:
                    value = filter.MAG_FILTER;
                    _gl.samplerParameteri(this.instance, _gl.TEXTURE_MAG_FILTER, value);
                    break;
                case TEXTURE.MIN_FILTER:
                    value = filter.MIN_FILTER;
                    _gl.samplerParameteri(this.instance, _gl.TEXTURE_MIN_FILTER, value);
                    break;
            }
        }
    }

    public setLodMode(lod: LodType): void {
        if (!lod) {
            return;
        }
        const _gl: WGL2 = this.gl;
        for (let key in lod) {
            let value;
            switch (key) {
                case TEXTURE.MIN_LOD:
                    value = lod.MIN_LOD;
                    _gl.samplerParameteri(this.instance, _gl.TEXTURE_MIN_LOD, value);
                    break;
                case TEXTURE.MAX_LOD:
                    value = lod.MAX_LOD;
                    _gl.samplerParameteri(this.instance, _gl.TEXTURE_MAX_LOD, value);
                    break;
            }
        }
    }

    public setCompareMode(compare: CompareType): void {
        if (!compare) {
            return;
        }
        const _gl: WGL2 = this.gl;
        for (let key in compare) {
            let value;
            switch (key) {
                case TEXTURE.COMPARE_MODE:
                    value = compare.COMPARE_MODE;
                    _gl.samplerParameteri(this.instance, _gl.TEXTURE_COMPARE_MODE, value);
                    break;
                case TEXTURE.COMPARE_FUNC:
                    value = compare.COMPARE_FUNC;
                    _gl.samplerParameteri(this.instance, _gl.TEXTURE_COMPARE_FUNC, value);
                    break;
            }
        }
    }
}