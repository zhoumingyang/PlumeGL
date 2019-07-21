import { Texture } from './texture';
import { CONSTANT } from './constant';

export class TextureCube extends Texture {

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.TEXTURECUBE;
        this.textureType = gl.TEXTURE_CUBE_MAP;
    }

    static unBind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
        gl && gl.bindTexture(gl.TEXTURE_CUBE_MAP, 0);
    }

    public setTextureFromImage(image: TexImageSource, index?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.width = image.width;
        this.height = image.height;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, this.level, this.internal, this.format, this.colorType, image);
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
        _gl.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + index, this.level, this.internal, this.width,
            this.height, 0, this.format, this.colorType, data);
    }
}