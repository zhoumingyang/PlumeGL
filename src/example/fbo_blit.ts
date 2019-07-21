import { fboBlitVert } from './shader/fbo_blit_vert';
import { fboBlitFrag } from './shader/fbo_blit_frag';
import { PlumeGL } from '../plumegl/plumegl';
import { ImageLoader } from '../loader/imageloader';

const posData: number[] = [
    -1.0, -1.0,
    1.0, -1.0,
    1.0, 1.0,
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0
];

const uvData: number[] = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0
];

const sclData: number[] = [
    0.8, 0.0, 0.0, 0.0,
    0.0, 0.8, 0.0, 0.0,
    0.0, 0.0, 0.8, 0.0,
    0.0, 0.0, 0.0, 1.0
];

const idenData: number[] = [
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
];

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = Math.min(window.innerWidth, window.innerHeight);
    cav.height = cav.width;
    if (!cav) {
        return;
    }
    let gl = cav.getContext('webgl2', { antialias: true });
    if (!gl) {
        console.warn('webgl2 is not avaliable');
        gl = cav.getContext('webgl', { antialias: true });
        if (!gl) {
            return;
        }
    }
    return gl;
}

export const FboBlit = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const scene = new PlumeGL.Scene();
    const program = new PlumeGL.Shader(gl, fboBlitVert, fboBlitFrag);
    program.initParameters();

    const positions: Float32Array = new Float32Array(posData);
    const texcoords: Float32Array = new Float32Array(uvData);
    const mesh = new PlumeGL.Mesh(gl);
    mesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.setGeometryAttribute(texcoords, 'texcoord', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(program);

    const textureDiffuse = new PlumeGL.Texture2D(gl);
    const textureColorBuffer = new PlumeGL.Texture2D(gl);
    const tmpP3d = new PlumeGL.P3D(mesh, textureDiffuse);
    program.addDrawObject(tmpP3d);
    scene.add(program);
    scene.setSceneState(new PlumeGL.State(gl));
    ImageLoader.load('../res/Di-3d.png', (image: any) => {

        const FRAMEBUFFER_SIZE = {
            x: image.width,
            y: image.height
        };

        PlumeGL.Texture2D.setPixelStorei(gl, gl.UNPACK_FLIP_Y_WEBGL, true);
        textureDiffuse.active(0);
        textureDiffuse.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        textureDiffuse.setTextureFromImage(image);
        textureDiffuse.filterMode(true, false, false);

        textureColorBuffer.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        textureColorBuffer.setTextureFromData(null, [FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y]);
        textureColorBuffer.filterMode(true, false, false);
        PlumeGL.Texture2D.unBind(gl);

        // -- Init Frame Buffer
        const framebufferRender = new PlumeGL.FrameBuffer(gl);
        const framebufferResolve = new PlumeGL.FrameBuffer(gl);
        const colorRenderbuffer = new PlumeGL.RenderBuffer(gl, gl.RGBA4);
        colorRenderbuffer.setSize(FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y);
        colorRenderbuffer.allocate();
        framebufferRender.attachRenderBuffer(colorRenderbuffer, gl.COLOR_ATTACHMENT0);
        framebufferResolve.attachTexture(textureColorBuffer, gl.COLOR_ATTACHMENT0);

        // Pass 1
        framebufferRender.bind();
        scene.state.setViewPort(0, 0, FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y).change();
        scene.state.setClearBuffer(PlumeGL.STATE.COLOR_BUFFER, 0, [0.3, 0.3, 0.3, 1.0]).change();
        scene.state.setMark(PlumeGL.STATE.VIEWPORT, false);
        const SCALE = new Float32Array(sclData);
        scene.forEachRender((shaderObj: any) => {
            shaderObj.use();
            shaderObj.setUniformData('diffuse', [0]);
            shaderObj.setUniformData('MVP', [SCALE, false]);
            shaderObj.forEachDraw((_p3d: any) => {
                _p3d.prepare([0]);
                _p3d.draw({ start: 0, cnt: 6 });
                _p3d.unPrepare();
            });
        });
        // PlumeGL.Texture2D.unBind(gl);

        // Blit framebuffers
        framebufferRender.setReadBuffer();
        framebufferResolve.setDrawBuffer();
        scene.state.setClearBuffer(PlumeGL.STATE.COLOR_BUFFER, 0, [0.7, 0.0, 0.0, 1.0]).change();
        const TILE = 4;
        const BORDER = 2;
        for (let j = 0; j < TILE; j++) {
            for (let i = 0; i < TILE; i++) {
                if ((i + j) % 2) {
                    continue;
                }
                PlumeGL.FrameBuffer.blitFrameBuffer(gl,
                    0, 0, FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y,
                    FRAMEBUFFER_SIZE.x / TILE * (i + 0) + BORDER,
                    FRAMEBUFFER_SIZE.x / TILE * (j + 0) + BORDER,
                    FRAMEBUFFER_SIZE.y / TILE * (i + 1) - BORDER,
                    FRAMEBUFFER_SIZE.y / TILE * (j + 1) - BORDER,
                    gl.COLOR_BUFFER_BIT, gl.LINEAR
                );
            }
        }

        // Pass 2
        PlumeGL.FrameBuffer.unBind(gl);
        scene.state.setViewPort(0, 0, cav.width, cav.height).change();
        scene.state.setClearBuffer(PlumeGL.STATE.COLOR_BUFFER, 0, [0.7, 0.0, 0.0, 1.0]).change();
        const IDENTITY = new Float32Array(idenData);
        scene.forEachRender((shaderObj: any) => {
            shaderObj.use();
            shaderObj.setUniformData('MVP', [IDENTITY, false]);
            shaderObj.forEachDraw((_p3d: any) => {
                _p3d.disposeTexture();
                _p3d.changeTexture(textureColorBuffer);
                _p3d.prepare([0]);
                _p3d.draw({ start: 0, cnt: 6 });
                _p3d.unPrepare();
            });
        });

        framebufferRender.dispose();
        framebufferResolve.dispose();
        scene.dispose();
    });
};