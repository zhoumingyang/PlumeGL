import { fboBlendVert } from './shader/fbo_blend_vert';
import { fboBlendFrag } from './shader/fbo_blend_frag';
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

const texCoordData: number[] = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0
];

const matrixData: number[] = [
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

export const FboNewBlenEquation = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const windowSize: any = {
        x: cav.width,
        y: cav.height
    };

    const Corners = {
        TOP_LEFT: 0,
        TOP_RIGHT: 1,
        BOTTOM_RIGHT: 2,
        BOTTOM_LEFT: 3,
        MAX: 4
    };

    const viewport = new Array(Corners.MAX);
    viewport[Corners.BOTTOM_LEFT] = {
        x: 0,
        y: 0,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    viewport[Corners.BOTTOM_RIGHT] = {
        x: windowSize.x / 2,
        y: 0,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    viewport[Corners.TOP_RIGHT] = {
        x: windowSize.x / 2,
        y: windowSize.y / 2,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    viewport[Corners.TOP_LEFT] = {
        x: 0,
        y: windowSize.y / 2,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };
    // init scene
    const scene = new PlumeGL.Scene();

    // init shader program
    const shaderObj = new PlumeGL.Shader(gl, fboBlendVert, fboBlendFrag);
    shaderObj.initParameters();
    scene.add(shaderObj);

    // init P3D object includes {mesh, texture, state}
    const positions = new Float32Array(posData);
    const texcoords = new Float32Array(texCoordData);
    const mesh = new PlumeGL.Mesh(gl);
    mesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.setGeometryAttribute(texcoords, 'textureCoordinates', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    mesh.initBufferAttributePoint(shaderObj);
    const texture = new PlumeGL.Texture2D(gl);
    const state = new PlumeGL.State(gl);
    const p3d = new PlumeGL.P3D(mesh, texture, state);
    shaderObj.addDrawObject(p3d);

    ImageLoader.load('../res/Di-3d.png', (image: any) => {
        texture.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.setTextureFromImage(image);
        texture.setFilterMode(true, false, false);
        texture.mipmap();
        render();
    });

    // init scene state
    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0.5, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    scene.setSceneState(sceneState);

    const matrix = new Float32Array(matrixData);
    function render() {
        scene.stateChange('colorclear');
        scene.stateChange('sceneclear');
        scene.forEachRender((shaderObj: any) => {
            shaderObj.use();
            shaderObj.setUniformData("mvp", [matrix, false]);
            shaderObj.setUniformData("diffuse", [0]);
            shaderObj.forEachDraw((_p3d: any) => {
                _p3d.prepareDraw();
                _p3d.state.setBlendTest(true).change();
                for (let i = 0; i < Corners.MAX; i++) {
                    const curView = viewport[i];
                    scene.state.setViewPort(curView.x, curView.y, curView.z, curView.w).change();
                    if (i == Corners.TOP_LEFT) {
                        //pass
                    }
                    else if (i == Corners.TOP_RIGHT) {
                        _p3d.draw({ start: 0, cnt: 6 });
                    }
                    else if (i == Corners.BOTTOM_RIGHT) {
                        _p3d.state.setBlendFunc('min').change();
                        _p3d.draw({ start: 0, cnt: 6 });
                    }
                    else if (i == Corners.BOTTOM_LEFT) {
                        _p3d.state.setBlendFunc('max').change();
                        _p3d.draw({ start: 0, cnt: 6 });
                    }
                }
            });
        });
        scene.dispose();
    }
}