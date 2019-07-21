import { Texture } from './texture';
import { CONSTANT } from './constant';

export class Texture3D extends Texture {

    constructor(gl: WebGL2RenderingContext) {
        super(gl);
        this.type = CONSTANT.TEXTURE3D;
        this.textureType = gl.TEXTURE_3D;
    }

    static unBind(gl: WebGL2RenderingContext): void {
        gl && gl.bindTexture(gl.TEXTURE_3D, null);
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
        _gl.texImage3D(this.textureType, this.level, this.internal, this.width, this.height,
            this.depth, 0, this.format, this.colorType, data);
    }

    public subStorage(data: any, offsets: number[], sizes: number[]): void {
        let x = 0, y = 0, z = 0;
        let w = 0, h = 0, d = 0;
        if (offsets && offsets.length >= 3) {
            x = offsets[0] || x;
            y = offsets[1] || y;
            z = offsets[2] || z;
        }
        if (sizes && sizes.length >= 3) {
            w = sizes[0] || w;
            h = sizes[1] || h;
            d = sizes[2] || d;
        }
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texStorage3D(this.textureType, this.levels, this.internal, w, h, d);
        _gl.texSubImage3D(this.textureType, this.level, x, y, z, w, h, d, this.format, this.colorType, data);
    }
}