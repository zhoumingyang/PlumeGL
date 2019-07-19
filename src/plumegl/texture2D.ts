import { Texture } from './texture';
import { Sampler } from './sampler';
import { CONSTANT } from './constant';

export class Texture2D extends Texture {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.TEXTURE2D;
    }

    public bind(slot?: number, sampler?: Sampler | string): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.active(slot);
        _gl.bindTexture(_gl.TEXTURE_2D, this.instance);
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
        gl && gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public setTextureFromImage(image: TexImageSource, index?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.width = image.width;
        this.height = image.height;
        _gl.bindTexture(_gl.TEXTURE_2D, this.instance);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, this.internal, this.format, this.colorType, image);
    }

    public setTextureFromData(data: any, width: number, height: number, index?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.width = width;
        this.height = height;
        data = data || null;
        _gl.bindTexture(_gl.TEXTURE_2D, this.instance);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, this.internal, width, height, 0, this.format, this.colorType, data);
    }

    public wrapMode(clampEdge: boolean = true): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const mode: number = clampEdge === true ? _gl.CLAMP_TO_EDGE : _gl.REPEAT;
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, mode);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, mode);
    }

    public filterMode(linear: boolean = true, mipmap: boolean = false, mipmapLinear: boolean = false): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const filter = this.textureFilter(!!linear, !!mipmap, !!mipmapLinear);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, this.textureFilter(!!linear, false, false));
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, filter);
    }

    public setWrapMode(mode: number): void {
        if (mode === undefined) {
            return;
        }
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, mode);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, mode);
    }

    public setFilterMode(linear: boolean = true, mipmap: boolean = false, mipmapLinear: boolean = false): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const filter = this.textureFilter(!!linear, !!mipmap, !!mipmapLinear);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, this.textureFilter(!!linear, false, false));
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, filter);
    }

    public mipmap(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.generateMipmap(_gl.TEXTURE_2D);
    }
}