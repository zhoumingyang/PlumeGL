
import { Texture } from './texture';
import { CONSTANT } from './constant';

export class Texture2DArray extends Texture {

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.TEXTURE2DARRAY;
        this.textureType = gl.TEXTURE_2D_ARRAY;
    }

    static unBind(gl: WebGL2RenderingContext): void {
        gl && gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }

    public setTextureFromData(data: any, width: number, height: number, depth?: number, index?: number): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        this.width = width || this.width;
        this.height = height || this.height;
        this.depth = depth || this.depth;
        data = data || null;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage3D(this.textureType, 0, this.internal, width, height, depth, 0, this.format, this.colorType, data);
    }
    
}
