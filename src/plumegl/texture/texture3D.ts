import { Texture } from './texture';
import { CONSTANT } from '../engine/constant';
import { GL, WGL2 } from '../engine/gl';
import { Vec2 } from '../math/vec2';
import { Vec3 } from '../math/vec3';

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

    public setTextureFromData(data: any, sizes: number[] | Vec2 | Vec3, index?: number): void {
        const _gl: WGL2 = <WGL2>this.gl;
        if (sizes && (sizes instanceof Array) && sizes.length >= 3) {
            this.width = sizes[0] || this.width;
            this.height = sizes[1] || this.height;
            this.depth = sizes[2] || this.depth;
        } else if (sizes instanceof Vec3) {
            this.width = sizes.x;
            this.height = sizes.y;
            this.depth = sizes.z;
        } else {
            console.warn('sizes at least include 3 param: width, height and depth');
        }
        data = data || null;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage3D(this.textureType, this.level, this.internal, this.width, this.height,
            this.depth, 0, this.format, this.colorType, data);
    }

    public subStorage(data: any, offsets: number[] | Vec2 | Vec3, sizes: number[] | Vec2 | Vec3): void {
        let x = 0, y = 0, z = 0;
        let w = 0, h = 0, d = 0;

        if (offsets && (offsets instanceof Array) && offsets.length >= 3) {
            x = offsets[0] || x;
            y = offsets[1] || y;
            z = offsets[2] || z;
        } else if (offsets instanceof Vec3) {
            x = offsets.x || x;
            y = offsets.y || y;
            z = offsets.z || z;
        } else {
            console.warn('sizes at least include 3 param: width, height and depth');
        }

        if (sizes && (sizes instanceof Array) && sizes.length >= 3) {
            w = sizes[0] || w;
            h = sizes[1] || h;
            d = sizes[2] || d;
        } else if (sizes instanceof Vec3) {
            w = sizes.x || w;
            h = sizes.y || h;
            d = sizes.z || d;
        } else {
            console.warn('sizes at least include 3 param: width, height and depth');
        }

        const _gl: WGL2 = <WGL2>this.gl;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texStorage3D(this.textureType, this.levels, this.internal, w, h, d);
        _gl.texSubImage3D(this.textureType, this.level, x, y, z, w, h, d, this.format, this.colorType, data);
    }
}