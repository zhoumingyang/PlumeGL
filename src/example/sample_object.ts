import { sampleObjectVertexSource } from './shader/sampler_object_vert';
import { sampleObjectFragmentSource } from './shader/sampler_object_frag';
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

const matData: number[] = [
    0.8, 0.0, 0.0, 0.0,
    0.0, 0.8, 0.0, 0.0,
    0.0, 0.0, 0.8, 0.0,
    0.0, 0.0, 0.0, 1.0
];

export const SampleObject = function () {
    const cav: any = document.getElementById('main-canvas');
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
    const program = new PlumeGL.Shader(gl, sampleObjectVertexSource, sampleObjectFragmentSource);
    program.initParameters();

    const positions: Float32Array = new Float32Array(posData);
    const texcoords: Float32Array = new Float32Array(uvData);

    const Mesh = new PlumeGL.Mesh(gl);
    Mesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    Mesh.setGeometryAttribute(texcoords, 'textureCoordinates', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    Mesh.initBufferAttributePoint(program);

    let texture = new PlumeGL.Texture2D(gl);
    const samplerA = texture.generateSampler();
    samplerA.setFilterMode({
        MIN_FILTER: gl.NEAREST_MIPMAP_NEAREST,
        MAG_FILTER: gl.NEAREST
    });
    samplerA.setWrapMode(gl.CLAMP_TO_EDGE, { WRAP_R: true });
    samplerA.setLodMode({
        MIN_LOD: -1000.0,
        MAX_LOD: 1000.0
    });
    samplerA.setCompareMode({
        COMPARE_MODE: gl.NONE,
        COMPARE_FUNC: gl.LEQUAL
    });

    const samplerB = texture.generateSampler();
    samplerB.setFilterMode({
        MIN_FILTER: gl.NEAREST_MIPMAP_LINEAR,
        MAG_FILTER: gl.LINEAR
    });
    samplerB.setWrapMode(gl.CLAMP_TO_EDGE, { WRAP_R: true });
    samplerB.setLodMode({
        MIN_LOD: -1000.0,
        MAX_LOD: 1000.0
    });
    samplerB.setCompareMode({
        COMPARE_MODE: gl.NONE,
        COMPARE_FUNC: gl.LEQUAL
    });

    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);

    const p3d = new PlumeGL.P3D(Mesh, texture);

    function render() {
        if (!texture) {
            return;
        }
        sceneState.stateChange();
        program.use();
        const matrix: Float32Array = new Float32Array(matData);
        program.setUniformData('mvp',[matrix]);
        program.setUniformData('material.diffuse[0]',[0]);
        program.setUniformData('material.diffuse[1]', [1]);
        p3d.prepare([0, 1]);
        p3d.draw({ start: 0, cnt: 6 }, undefined, { instance: true, cnt: 1 });
        p3d.dispose();
        program.dispose();
    }

    ImageLoader.load('../res/Di-3d.png', (image: any) => {
        texture.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.setTextureFromImage(image);
        texture.mipmap();
        render();
    });
};