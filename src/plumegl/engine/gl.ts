export type WGL = WebGLRenderingContext;
export type WGL2 = WebGL2RenderingContext;

interface WebGL {
    gl: WGL | WGL2,
    width?: number,
    height?: number
}

export const GL: WebGL = {
    gl: null,
    width: 0,
    height: 0,
};