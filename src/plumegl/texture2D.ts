import { Texture } from './texture';
import { CONSTANT } from './constant';

export class Texture2D extends Texture {
    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.TEXTURE2D;
        this.textureType = gl.TEXTURE_2D;
    }

    static unBind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
        gl && gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public setTextureFromImage(image: TexImageSource, index?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.width = image.width;
        this.height = image.height;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage2D(this.textureType, this.level, this.internal, this.format, this.colorType, image);
    }

    public setTextureFromData(data: any, sizes: number[], index?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        if (sizes && sizes.length >= 2) {
            this.width = sizes[0] || this.width;
            this.height = sizes[1] || this.height;
        } else {
            console.warn('sizes at least include 2 param: width, height');
        }
        data = data || null;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage2D(this.textureType, this.level, this.internal, this.width, this.height, 0, this.format, this.colorType, data);
    }

    public subStorage(data: any, offsets: number[], sizes: number[]): void {
        let x = 0, y = 0, z = 0;
        let w = 0, h = 0, d = 0;
        if (offsets && offsets.length >= 2) {
            x = offsets[0] || x;
            y = offsets[1] || y;
        }
        if (sizes && sizes.length >= 2) {
            w = sizes[0] || w;
            h = sizes[1] || h;
        }
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texStorage2D(this.textureType, this.levels, this.internal, w, h);
        _gl.texSubImage2D(this.textureType, this.level, x, y, w, h, this.format, this.colorType, data);
    }
}