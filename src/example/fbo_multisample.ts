import { PlumeGL } from '../plumegl/plumegl';
import { fboMultiSampleVsRender } from './shader/fbo_multisample_vs_render';
import { fboMultiSampleFsRender } from './shader/fbo_multisample_fs_render';
import { fboMultiSampleVsSplash } from './shader/fbo_multisample_vs_splash';
import { fboMultiSampleFsSplash } from './shader/fbo_multisample_fs_splash';

const posData = [
    -1.0, -1.0,
    1.0, -1.0,
    1.0, 1.0,
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0
];

const texData = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0
];

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = window.innerWidth;
    cav.height = window.innerHeight;
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
};

export const FboMultiSample = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const PROGRAM = {
        TEXTURE: 0,
        SPLASH: 1,
        MAX: 2
    };

    const textureShader = new PlumeGL.Shader(gl, fboMultiSampleVsRender, fboMultiSampleFsRender);
    textureShader.initParameters();
    const splashShader = new PlumeGL.Shader(gl, fboMultiSampleVsSplash, fboMultiSampleFsSplash);
    splashShader.initParameters();

    const programs: any[] = [
        textureShader,
        splashShader
    ];

    // -- Init primitive data
    const vertexCount = 18;
    const data = new Float32Array(vertexCount * 2);
    let angle;
    let radius = 0.1;
    for (let i = 0; i < vertexCount; i++) {
        angle = Math.PI * 2 * i / vertexCount;
        data[2 * i] = radius * Math.sin(angle);
        data[2 * i + 1] = radius * Math.cos(angle);
    }

    const lineLoop = new PlumeGL.Line(gl);
    lineLoop.setDrawType(gl.LINE_LOOP);
    lineLoop.setGeometryAttribute(data, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    lineLoop.initBufferAttributePoint(textureShader);

    var positions = new Float32Array(posData);
    var texCoords = new Float32Array(texData);

    const quadMesh = new PlumeGL.Mesh(gl);
    quadMesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.setGeometryAttribute(texCoords, 'texcoord', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.initBufferAttributePoint(splashShader);

    // -- Init Texture
    // used for draw framebuffer storage
    const FRAMEBUFFER_SIZE = {
        x: cav.width,
        y: cav.height
    };
    const tmpTexture = new PlumeGL.Texture2D(gl);
    tmpTexture.setTextureFromData(null, FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y);
    tmpTexture.setFilterMode(false, false, false);
    PlumeGL.Texture2D.unBind(gl);

    // -- Init Frame Buffers
    const FRAMEBUFFER = {
        RENDERBUFFER: 0,
        COLORBUFFER: 1
    };
    const tmpFrameBuffers = [
        new PlumeGL.FrameBuffer(gl),
        new PlumeGL.FrameBuffer(gl)
    ];
    const tmpColorRenderBuffer = new PlumeGL.RenderBuffer(gl, gl.RGBA8);
    tmpColorRenderBuffer.setSize(FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y);
    tmpColorRenderBuffer.allocateMultisample(4);
    tmpFrameBuffers[FRAMEBUFFER.RENDERBUFFER].attachRenderBuffer(tmpColorRenderBuffer, gl.COLOR_ATTACHMENT0);
    tmpFrameBuffers[FRAMEBUFFER.COLORBUFFER].attachTexture(tmpTexture, gl.COLOR_ATTACHMENT0);

    // Pass 1
    const sceneState = new PlumeGL.State(gl);
    tmpFrameBuffers[FRAMEBUFFER.RENDERBUFFER].bind();
    programs[PROGRAM.TEXTURE].use();
    lineLoop.prepare();
    const IDENTITY = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    programs[PROGRAM.TEXTURE].setUniformData('MVP', [IDENTITY, false]);
    lineLoop.draw({ start: 0, cnt: vertexCount });

    tmpFrameBuffers[FRAMEBUFFER.RENDERBUFFER].setReadBuffer();
    tmpFrameBuffers[FRAMEBUFFER.COLORBUFFER].setDrawBuffer();
    sceneState.setClearBuffer(PlumeGL.STATE.COLOR_BUFFER, 0, [0.0, 0.0, 0.0, 1.0]).change();
    PlumeGL.FrameBuffer.blitFrameBuffer(gl,
        0, 0, FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y,
        0, 0, FRAMEBUFFER_SIZE.x, FRAMEBUFFER_SIZE.y,
        gl.COLOR_BUFFER_BIT, gl.NEAREST
    );

    // Pass 2
    const mvp = new Float32Array(
        [
            8, 0, 0, 0,
            0, 8, 0, 0,
            0, 0, 8, 0,
            0, 0, 0, 1
        ]);
    PlumeGL.FrameBuffer.unBind(gl);
    programs[PROGRAM.SPLASH].use();
    programs[PROGRAM.SPLASH].setUniformData('diffuseLocation', 0);
    programs[PROGRAM.SPLASH].setUniformData('MVP', [mvp, false]);
    tmpTexture.bind();
    quadMesh.prepare();
    quadMesh.draw({ start: 0, cnt: 6 });

    // -- Delete WebGL resources
    quadMesh.dispose();
    lineLoop.dispose();
    tmpTexture.dispose();
    tmpFrameBuffers[FRAMEBUFFER.RENDERBUFFER].dispose();
    tmpFrameBuffers[FRAMEBUFFER.COLORBUFFER].dispose();
    programs[PROGRAM.TEXTURE].dispose();
    programs[PROGRAM.SPLASH].dispose();
}