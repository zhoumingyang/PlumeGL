import { Texture } from './texture';
import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';
import { Vec2 } from '../math/vec2';
import { Vec3 } from '../math/vec3';

export class Texture2D extends Texture {

    constructor(gl?: WGL | WGL2) {
        super(gl);
        this.type = CONSTANT.TEXTURE2D;
        this.textureType = this.gl.TEXTURE_2D;
    }

    static unBind(gl?: WGL | WGL2): void {
        const tmpGL = gl || GL.gl;
        tmpGL && tmpGL.bindTexture(tmpGL.TEXTURE_2D, null);
    }

    public setTextureFromImage(image: TexImageSource, index?: number): void {
        const _gl: WGL | WGL2 = this.gl;
        this.width = image.width;
        this.height = image.height;
        _gl.bindTexture(this.textureType, this.instance);
        // _gl.texImage2D(this.textureType, this.level, this.internal, this.format, this.colorType, image);
        if (image instanceof HTMLCanvasElement ||
            image instanceof HTMLImageElement ||
            image instanceof HTMLVideoElement ||
            image instanceof ImageBitmap ||
            image instanceof ImageData) {
            _gl.texImage2D(this.textureType,
                this.level,
                this.internal,
                this.format,
                this.colorType,
                image);
        }
    }

    public setTextureFromData(data: any, sizes: number[] | Vec2 | Vec3, index?: number): void {
        const _gl: WGL | WGL2 = this.gl;
        if (sizes && (sizes instanceof Array) && sizes.length >= 2) {
            this.width = sizes[0] || this.width;
            this.height = sizes[1] || this.height;
        } else if ((sizes instanceof Vec2) || (sizes instanceof Vec3)) {
            this.width = sizes.x || this.width;
            this.height = sizes.y || this.height;
        } else {
            console.warn('sizes at least include 2 param: width, height');
        }
        data = data || null;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texImage2D(this.textureType, this.level, this.internal, this.width, this.height, 0, this.format, this.colorType, data);
    }

    public subStorage(data: any, offsets: number[] | Vec2 | Vec3, sizes: number[]): void {
        let x = 0, y = 0, z = 0;
        let w = 0, h = 0, d = 0;

        if (offsets && (offsets instanceof Array) && offsets.length >= 2) {
            x = offsets[0] || x;
            y = offsets[1] || y;
        } else if ((offsets instanceof Vec2) || (offsets instanceof Vec3)) {
            x = offsets.x || x;
            y = offsets.y || y;
        }

        if (sizes && (sizes instanceof Array) && sizes.length >= 2) {
            w = sizes[0] || w;
            h = sizes[1] || h;
        } else if ((sizes instanceof Vec2) || (sizes instanceof Vec3)) {
            w = sizes.x || w;
            h = sizes.y || h;
        }

        const _gl: WGL2 = <WGL2>this.gl;
        _gl.bindTexture(this.textureType, this.instance);
        _gl.texStorage2D(this.textureType, this.levels, this.internal, w, h);
        _gl.texSubImage2D(this.textureType, this.level, x, y, w, h, this.format, this.colorType, data);
    }
}