import { PlumeGL } from '../plumegl/plumegl';
import { interleavedTransformVert } from './shader/interleaved_transform_vert';
import { interleavedTransformFrag } from './shader/interleaved_transform_frag';
import { interleavedFeedbackVert } from './shader/interleaved_feedback_vert';
import { interleavedFeedbackFrag } from './shader/interleaved_feedback_frag';

const verData: number[] = [
    -1.0, -1.0, 0.0, 1.0,
    1.0, -1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    -1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 1.0
];

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = Math.min(window.innerWidth, window.innerHeight);
    cav.height = cav.width;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
}

export const TransformFeedbackInterleaved = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const sceneState = new PlumeGL.State();
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    sceneState.setRasterDiscard(true); // Disable rasterization, vertices processing only

    const PROGRAM_TRANSFORM = 0;
    const PROGRAM_FEEDBACK = 1;
    const fb = {
        vars: ['gl_Position', 'v_color'],
        bufferMode: gl.INTERLEAVED_ATTRIBS
    };
    const transformShaderObj = new PlumeGL.Shader(interleavedTransformVert, interleavedTransformFrag, fb);
    transformShaderObj.initParameters();
    const feedbackShaderObj = new PlumeGL.Shader(interleavedFeedbackVert, interleavedFeedbackFrag);
    feedbackShaderObj.initParameters();
    const shaderObjs = [transformShaderObj, feedbackShaderObj];

    // -- Init Buffer
    const SIZE_V4C4 = 32;
    const VERTEX_COUNT = 6;
    const vertices = new Float32Array(verData);
    const tfMesh = new PlumeGL.Mesh();
    tfMesh.setGeometryAttribute(vertices, 'position', gl.STATIC_DRAW, 4, gl.FLOAT, false);
    tfMesh.initBufferAttributePoint(shaderObjs[PROGRAM_TRANSFORM]);

    const fbMesh = new PlumeGL.Mesh();
    fbMesh.setGeometryAttributes(SIZE_V4C4 * VERTEX_COUNT, [{
        name: 'position', size: 4,
        type: gl.FLOAT, normalize: false,
    }, {
        name: 'color', size: 4,
        type: gl.FLOAT, normalize: false,
    }]);
    fbMesh.initBufferAttributePoint(shaderObjs[PROGRAM_FEEDBACK]);

    // -- Init TransformFeedback: Track output buffer
    const feedBack = new PlumeGL.FeedBack();
    feedBack.bindBuffer(fbMesh, 0);
    feedBack.unBind();

    // -- Render
    sceneState.stateChange();
    shaderObjs[PROGRAM_TRANSFORM].use();
    var matrix = new Float32Array([
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    shaderObjs[PROGRAM_TRANSFORM].setUniformData('MVP', [matrix, false]);
    tfMesh.prepare();
    feedBack.begin(gl.TRIANGLES);
    tfMesh.draw({ start: 0, cnt: VERTEX_COUNT }, undefined, { instance: true, cnt: 1 });
    feedBack.end();

    // Second draw, reuse captured attributes
    sceneState.setRasterDiscard(false).change();
    shaderObjs[PROGRAM_FEEDBACK].use();
    fbMesh.prepare();
    fbMesh.draw({ start: 0, cnt: VERTEX_COUNT }, undefined, { instance: true, cnt: 1 });

    // -- Delete WebGL resources
    feedBack.dispose();
    shaderObjs[PROGRAM_TRANSFORM].dispose();
    shaderObjs[PROGRAM_FEEDBACK].dispose();
    tfMesh.dispose();
    fbMesh.dispose();
}