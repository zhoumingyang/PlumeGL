import { Util } from './util';
import { Sampler } from './sampler';
import { CONSTANT } from './constant';

let uuid: number = 0;
export class Texture {
    public gl: WebGLRenderingContext | WebGL2RenderingContext;
    public instance: WebGLTexture;
    public format: number;
    public internal: number;
    public colorType: number;
    public width: number;
    public height: number;
    public depth: number;
    public uid: string;
    public samplers: any;
    public attachBuffer: number;
    public textureType: number;
    public levels: number;
    public level: number;
    public type: Symbol;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        this.gl = gl;
        this.instance = gl.createTexture();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
        this.width = 0;
        this.height = 0;
        this.depth = 0;
        this.format = gl.RGBA;
        this.internal = gl.RGBA;
        this.colorType = gl.UNSIGNED_BYTE;
        this.samplers = {};
        this.attachBuffer = undefined;
        this.type = CONSTANT.TEXTURE;
        this.textureType = null;
        this.levels = 1;
        this.level = 0;
    }

    public setLevelInfo(level?: number, levels?: number): void {
        this.level = level || 0;
        this.levels = levels || 1;
    }

    public attachTo(glBuffer: number) {
        this.attachBuffer = glBuffer;
    }

    public addSampler(sampler: Sampler): void {
        this.samplers[sampler.uid] = sampler;
    }

    public generateSampler(): Sampler {
        if (!(this.gl instanceof WebGL2RenderingContext)) {
            return;
        }
        const sampler = new Sampler(this.gl);
        this.samplers[sampler.uid] = sampler;
        return sampler;
    }

    public deleteSampler(sampler: Sampler | string): void {
        let spl;
        if (typeof sampler === 'string') {
            spl = this.samplers[sampler];
            if (spl) {
                spl.dispose();
                this.samplers[sampler] = undefined;
            }
        } else {
            spl = this.samplers[sampler.uid];
            if (spl) {
                spl.dispose();
                this.samplers[sampler.uid] = undefined;
            }
        }
    }

    public findSampler(sampler: Sampler | string): Sampler {
        let spl;
        if (typeof sampler === 'string') {
            spl = this.samplers[sampler];
        } else {
            spl = this.samplers[sampler.uid];
        }
        return spl;
    }

    public textureFilter(linear: boolean, mipmap: boolean, mipmapLinear: boolean): number {
        return 0x2600 | (+linear) | (+mipmap << 8) | (+(mipmap && mipmapLinear) << 1);
    }

    public setFormat(format: number, internal: number, type: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.format = format || _gl.RGBA;
        this.internal = internal || _gl.RGBA;
        this.colorType = type || _gl.UNSIGNED_BYTE;
    }

    public active(slot?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        if (slot !== undefined) {
            _gl.activeTexture(_gl.TEXTURE0 + slot);
        }
    }

    public bind(slot?: number, sampler?: Sampler | string): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.active(slot);
        _gl.bindTexture(this.textureType, this.instance);
        if (!this.samplers) {
            return;
        }
        let curSampler: Sampler;
        if (!sampler) {
            const samplerArray: Sampler[] = Object.values(this.samplers);
            curSampler = samplerArray[slot];
            curSampler && curSampler.bind(slot);
            return;
        }
        curSampler = this.findSampler(sampler);
        curSampler && curSampler.bind(slot);
    }

    static unBind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {

    }

    static setPixelStorei(gl: WebGLRenderingContext | WebGL2RenderingContext, name: GLenum, param: any): void {
        gl.pixelStorei(name, param);
    }

    public dispose(): void {
        Texture.unBind(this.gl);
        this.gl && this.gl.deleteTexture(this.instance);
        for (let key in this.samplers) {
            const sampler = this.samplers[key];
            sampler && sampler.dispose();
        }
        this.instance = null;
        this.width = 0;
        this.height = 0;
    }

    public setTextureFromImage(image: TexImageSource, index?: number): void {

    }

    public setTextureFromData(data: any, sizes: number[], index?: number): void {

    }

    public subStorage(data: any, offsets: number[], sizes: number[]): void {

    }

    public repeat(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.setWrapMode(_gl.REPEAT);
    }

    public clamp(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.setWrapMode(_gl.CLAMP_TO_EDGE);
    }

    public mirror(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.setWrapMode(_gl.MIRRORED_REPEAT);
    }

    public wrapMode(clampEdge: boolean = true) {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const mode: number = clampEdge === true ? _gl.CLAMP_TO_EDGE : _gl.REPEAT;
        _gl.texParameteri(this.textureType, _gl.TEXTURE_WRAP_S, mode);
        _gl.texParameteri(this.textureType, _gl.TEXTURE_WRAP_T, mode);
    }

    public filterMode(linear: boolean = true, mipmap: boolean = false, mipmapLinear: boolean = false) {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const filter = this.textureFilter(!!linear, !!mipmap, !!mipmapLinear);
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MAG_FILTER, this.textureFilter(!!linear, false, false));
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MIN_FILTER, filter);
    }

    public setWrapMode(mode: number): void {
        if (mode === undefined) {
            return;
        }
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.texParameteri(this.textureType, _gl.TEXTURE_WRAP_S, mode);
        _gl.texParameteri(this.textureType, _gl.TEXTURE_WRAP_T, mode);
    }

    public setFilterMode(minFiler: number, magFiler?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        if (!minFiler && !magFiler) {
            this.filterMode();
            return;
        }
        magFiler = magFiler || minFiler;
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MIN_FILTER, minFiler);
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MAG_FILTER, magFiler);
    }

    public setLevelSection(base: number = 0, max: number = 0): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.texParameteri(this.textureType, _gl.TEXTURE_BASE_LEVEL, base);
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MAX_LEVEL, max);
    }

    public setLod(minLod: number = 0, maxLod: number = 0): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MIN_LOD, minLod);
        _gl.texParameteri(this.textureType, _gl.TEXTURE_MAX_LOD, maxLod);
    }

    public mipmap(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.generateMipmap(this.textureType);
    }

    static pixelStorei(gl: WebGLRenderingContext | WebGL2RenderingContext, pname: number, param: number) {
        gl.pixelStorei(pname, param);
    }
}