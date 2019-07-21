
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

    public setTextureFromData(data: any, sizes: number[], index?: number): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        if (sizes && sizes.length >= 3) {
            this.width = sizes[0] || this.width;
            this.height = sizes[1] || this.height;
            this.depth = sizes[2] || this.depth;
        } else {
            console.warn('sizes at least include 3 param: width, height and depth');
        }
        data = data || null;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage3D(this.textureType, this.level, this.internal, this.width, this.height, this.depth, 0, this.format, this.colorType, data);
    }

}
