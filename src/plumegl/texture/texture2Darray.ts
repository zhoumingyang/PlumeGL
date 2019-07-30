
import { Texture } from './texture';
import { CONSTANT } from '../engine/constant';
import { GL, WGL2 } from '../engine/gl';

export class Texture2DArray extends Texture {

    constructor(gl?: WGL2) {
        super(gl);
        this.type = CONSTANT.TEXTURE2DARRAY;
        const tmpGl = <WGL2>this.gl;
        this.textureType = tmpGl.TEXTURE_2D_ARRAY;
    }

    static unBind(gl?: WGL2): void {
        const tmpGl = gl || <WGL2>GL.gl;
        tmpGl && tmpGl.bindTexture(tmpGl.TEXTURE_2D_ARRAY, null);
    }

    public setTextureFromData(data: any, sizes: number[], index?: number): void {
        const _gl: WGL2 = <WGL2>this.gl;
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
