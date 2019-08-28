import { PlumeGL } from '../plumegl/engine/plumegl';
import { separatedTransformVert } from './shader/separated_transform_vert';
import { separatedTransformFrag } from './shader/separated_transform_frag';
import { separatedFeedbackVert } from './shader/separated_feedback_vert';
import { separatedFeedbackFrag } from './shader/separated_feedback_frag';

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
};

export const TransformFeedbackSeparated = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }
    const sceneState = new PlumeGL.State();
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    sceneState.setRasterDiscard(true); // Disable rasterization, vertices processing only

    const fb = {
        vars: ['gl_Position', 'v_color'],
        bufferMode: gl.SEPARATE_ATTRIBS
    };
    const transformShaderObj = new PlumeGL.Shader(separatedTransformVert, separatedTransformFrag, fb);
    transformShaderObj.initParameters();
    const feedbackShaderObj = new PlumeGL.Shader(separatedFeedbackVert, separatedFeedbackFrag);
    feedbackShaderObj.initParameters();

    // -- Init Buffer
    const VERTEX_COUNT = 6;
    const positions = new Float32Array(verData);
    const tfMesh = new PlumeGL.Mesh();
    tfMesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 4, gl.FLOAT, false);
    tfMesh.initBufferAttributePoint(transformShaderObj);

    const fbMesh = new PlumeGL.Mesh();
    const posSize = positions.length * Float32Array.BYTES_PER_ELEMENT;
    const colorSize = positions.length * Float32Array.BYTES_PER_ELEMENT;
    fbMesh.setGeometryAttribute(posSize, 'position', gl.STATIC_COPY, 4, gl.FLOAT, false);
    fbMesh.setGeometryAttribute(colorSize, 'color', gl.STATIC_COPY, 4, gl.FLOAT, false);
    fbMesh.feedBackAttribute(['position', 'color']);
    fbMesh.initBufferAttributePoint(feedbackShaderObj);

    // -- Init TransformFeedback
    const feedback = new PlumeGL.FeedBack(undefined);
    feedback.bindBuffer(fbMesh);
    feedback.unBind();

    // -- Render
    sceneState.stateChange();  // First draw, capture the attributes
    transformShaderObj.use();
    var matrix = new Float32Array([
        0.5, 0.0, 0.0, 0.0,
        0.0, 0.5, 0.0, 0.0,
        0.0, 0.0, 0.5, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    transformShaderObj.setUniformData('MVP', [matrix, false]);
    tfMesh.prepare();
    feedback.begin(gl.TRIANGLES);
    tfMesh.draw({ start: 0, cnt: VERTEX_COUNT }, undefined, { instance: true, cnt: 1 });
    feedback.end();

    sceneState.setRasterDiscard(false).change();
    feedbackShaderObj.use();
    fbMesh.prepare();
    fbMesh.draw({ start: 0, cnt: VERTEX_COUNT }, undefined, { instance: true, cnt: 1 });

    // -- Delete WebGL resources
    feedback.dispose();
    transformShaderObj.dispose();
    feedbackShaderObj.dispose();
    tfMesh.dispose();
    fbMesh.dispose();
}