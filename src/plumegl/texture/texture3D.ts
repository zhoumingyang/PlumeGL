import { Texture } from './texture';
import { CONSTANT } from '../engine/constant';
import { GL, WGL2 } from '../engine/gl';

export class Texture3D extends Texture {

    constructor(gl?: WGL2) {
        super(gl);
        this.type = CONSTANT.TEXTURE3D;
        const tmpGl = <WGL2>this.gl;
        this.textureType = tmpGl.TEXTURE_3D;
    }

    static unBind(gl: WGL2): void {
        const tmpGl = gl || <WGL2>GL.gl;
        tmpGl && tmpGl.bindTexture(tmpGl.TEXTURE_3D, null);
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
        const _gl: WGL2 = <WGL2>this.gl;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texStorage3D(this.textureType, this.levels, this.internal, w, h, d);
        _gl.texSubImage3D(this.textureType, this.level, x, y, z, w, h, d, this.format, this.colorType, data);
    }
}