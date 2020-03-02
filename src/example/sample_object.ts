import { sampleObjectVertexSource } from './shader/sampler_object_vert';
import { sampleObjectFragmentSource } from './shader/sampler_object_frag';
import { PlumeGL } from '../plumegl/engine/plumegl';
import { ImageLoader } from '../PlumeGL/loader/imageloader';

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

export const SampleObject2 = function () {

}

export const SampleObject = function () {
    const cav: any = document.getElementById('main-canvas');
    cav.width = Math.min(window.innerWidth, window.innerHeight);
    cav.height = cav.width;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    if (!gl) {
        return;
    }

    const program = new PlumeGL.Shader(sampleObjectVertexSource, sampleObjectFragmentSource);
    program.initParameters();
    program.initGlobalUniformValues({
        'material.diffuse[0]': [0],
        'material.diffuse[1]': [1]
    });

    const positions: Float32Array = new Float32Array(posData);
    const texcoords: Float32Array = new Float32Array(uvData);

    const mesh = new PlumeGL.Mesh();
    mesh.setGeometryAttribute(positions, PlumeGL.ATTRIBUTE.POSITION, PlumeGL.TYPE.STATIC_DRAW, 2, PlumeGL.TYPE.FLOAT, false);
    mesh.setGeometryAttribute(texcoords, PlumeGL.ATTRIBUTE.UV, PlumeGL.TYPE.STATIC_DRAW, 2, PlumeGL.TYPE.FLOAT, false);
    mesh.initBufferAttributePoint(program);

    let texture = new PlumeGL.Texture2D();
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

    const sceneState = new PlumeGL.State();
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);

    const p3d = new PlumeGL.P3D(mesh, texture);
    p3d.setInstance(true, 1);
    p3d.shader = program;
    const node = new PlumeGL.Node(p3d);
    node.setWorldTransform(new PlumeGL.Vec3(0, 0, 0), new PlumeGL.Quat(0, 0, 0, 1), new PlumeGL.Vec3(0.8, 0.8, 0.8));

    const scene = new PlumeGL.Scene();
    scene.addChild(node);
    scene.setSceneState(sceneState);
    scene.add(program);

    //camera
    const fov: number = 60.0 * Math.PI / 180;
    const aspect: number = 1;
    const zNear: number = 0.1;
    const zFar: number = 1000.0;
    const camera = new PlumeGL.PerspectiveCamera();
    camera.setPersective(fov, aspect, zNear, zFar);
    camera.setView(
        new PlumeGL.Vec3(0.0, 0.0, 10.0),
        new PlumeGL.Vec3(0.0, 0.0, -1000.0),
        new PlumeGL.Vec3(0.0, 1.0, 0.0));

    scene.setActiveCamera(camera);

    function render() {
        if (!texture) {
            return;
        }
        scene.render();
    }

    ImageLoader.load('../res/Di-3d.png', (image: any) => {
        texture.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.setTextureFromImage(image);
        texture.mipmap();
        render();
    });
};