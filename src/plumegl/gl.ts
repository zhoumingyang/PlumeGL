export type WGL = WebGLRenderingContext;
export type WGL2 = WebGL2RenderingContext;

interface WebGL {
    gl: WGL | WGL2,
}

export const GL: WebGL = {
    gl: null,
};