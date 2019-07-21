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
        _gl.texImage2D(this.textureType, 0, this.internal, this.format, this.colorType, image);
    }

    public setTextureFromData(data: any, width: number, height: number, depth?: number, index?: number): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        this.width = width;
        this.height = height;
        data = data || null;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage2D(this.textureType, 0, this.internal, width, height, 0, this.format, this.colorType, data);
    }
}