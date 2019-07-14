import { Texture } from './texture';
import { RenderBuffer } from './renderbuffer';
import { Util } from './util';
import { CONSTANT } from './constant';

let uuid: number = 0;
export class FrameBuffer {
    public gl: WebGLRenderingContext | WebGL2RenderingContext;
    public instance: WebGLFramebuffer;
    public width: number;
    public height: number;
    public mounts: any;
    public mountArray: (Texture | RenderBuffer)[];
    public uid: string;
    public attachPoints: number[];
    public type: Symbol;

    constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        this.gl = gl;
        this.instance = gl.createFramebuffer();
        this.width = 0;
        this.height = 0;
        this.mounts = {};
        this.mountArray = [];
        this.uid = Util.random13(13, uuid++);
        this.type = CONSTANT.FRAMEBUFFER;
        if(uuid >= 10) uuid = 0;
    }

    public setReadBuffer(): void {
        const _gl = this.gl;
        if (_gl instanceof WebGL2RenderingContext) {
            _gl.bindFramebuffer(_gl.READ_FRAMEBUFFER, this.instance);
        }
    }

    public rmReadBuffer(): void {
        const _gl = this.gl;
        if (_gl instanceof WebGL2RenderingContext) {
            _gl.bindFramebuffer(_gl.READ_FRAMEBUFFER, null);
        }
    }

    public setDrawBuffer(): void {
        const _gl = this.gl;
        if (_gl instanceof WebGL2RenderingContext) {
            _gl.bindFramebuffer(_gl.DRAW_FRAMEBUFFER, this.instance);
        }
    }

    public rmDrawBuffer(): void {
        const _gl = this.gl;
        if (_gl instanceof WebGL2RenderingContext) {
            _gl.bindFramebuffer(_gl.DRAW_FRAMEBUFFER, null);
        }
    }

    public bind(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, this.instance);
    }

    static unBind(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public dispose(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
        _gl.deleteFramebuffer(this.instance);
        const mountArray = this.mountArray;
        mountArray.forEach((mount: (Texture | RenderBuffer)) => {
            mount.dispose();
        });
        this.gl = null;
        this.instance = null;
    }

    public attachTexture(texture: Texture, attachPoint: GLenum, level: number = 0): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        texture.attachBuffer = texture.attachBuffer || _gl.FRAMEBUFFER;
        _gl.bindFramebuffer(texture.attachBuffer, this.instance);
        _gl.framebufferTexture2D(texture.attachBuffer, attachPoint, _gl.TEXTURE_2D, texture.instance, level);
        this.mounts[attachPoint.toString()] = texture;
        this.mountArray.push(texture);
        _gl.bindFramebuffer(texture.attachBuffer, null);
    }

    public attachRenderBuffer(renderbuffer: RenderBuffer, attachPoint: GLenum): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, this.instance);
        _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, attachPoint, _gl.RENDERBUFFER, renderbuffer.instance);
        this.mounts[attachPoint.toString()] = renderbuffer;
        this.mountArray.push(renderbuffer);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
    }

    public detach(attachPoint: GLenum, texture: boolean, level: number = 0): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const mount = this.mounts[attachPoint.toString()];
        if (mount === undefined) {
            return;
        }
        var index = this.mountArray.indexOf(mount);
        this.mountArray.splice(index, 1);
        texture ? _gl.framebufferTexture2D(_gl.FRAMEBUFFER, attachPoint, _gl.TEXTURE_2D, null, level) :
            _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, attachPoint, _gl.RENDERBUFFER, null);
        delete this.mounts[attachPoint.toString()];
    }

    public statusCheck(): void {
        const _gl: WebGLRenderingContext | WebGL2RenderingContext = this.gl;
        const status: GLenum = _gl.checkFramebufferStatus(_gl.FRAMEBUFFER);
        if (status != _gl.FRAMEBUFFER_COMPLETE) {
            console.warn(`Can't initialize an FBO render texture. FBO initialization failed.`);
        }
    }

    static blitFrameBUffer(gl: WebGL2RenderingContext,
        srcX0: GLint, srcY0: GLint, srcX1: GLint, srcY1: GLint,
        dstX0: GLint, dstY0: GLint, dstX1: GLint, dstY1: GLint,
        mask: number, filter: GLenum): void {
        gl.blitFramebuffer(srcX0, srcY0, srcX1, srcY1,
            dstX0, dstY0, dstX1, dstY1,
            mask, filter);
    }

    public setDrawBuffers(attachPoints: number[]): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.bindFramebuffer(_gl.DRAW_FRAMEBUFFER, this.instance);
        _gl.drawBuffers(attachPoints);
    }
}