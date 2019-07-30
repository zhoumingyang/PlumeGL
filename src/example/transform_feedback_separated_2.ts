import { PlumeGL } from '../plumegl/plumegl';
import { TfbSeparated2Vert } from './shader/tfb_separated2_vert';
import { TfbSeparated2Frag } from './shader/tfb_separated2_frag';
import { Util } from '../plumegl/util';

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

export const DrawTfbSeparated2 = () => {
    // -- Init WebGL Context
    var gl = createGLContext();
    cav.addEventListener("webglcontextlost", function (event: any) {
        event.preventDefault();
    }, false);

    // -- Declare variables for the particle system
    let NUM_PARTICLES = 1000;
    let ACCELERATION = -1.0;
    let appStartTime = Date.now();
    let currentSourceIdx = 0;
    const fb = {
        vars: ['v_position', 'v_velocity', 'v_spawntime', 'v_lifetime'],
        bufferMode: gl.SEPARATE_ATTRIBS
    };
    const shaderObj = new PlumeGL.Shader(TfbSeparated2Vert, TfbSeparated2Frag, fb);
    shaderObj.initParameters();

    // -- Initialize particle data
    var particlePositions = new Float32Array(NUM_PARTICLES * 2);
    var particleVelocities = new Float32Array(NUM_PARTICLES * 2);
    var particleSpawntime = new Float32Array(NUM_PARTICLES);
    var particleLifetime = new Float32Array(NUM_PARTICLES);
    var particleIDs = new Float32Array(NUM_PARTICLES);
    for (var p = 0; p < NUM_PARTICLES; ++p) {
        particlePositions[p * 2] = 0.0;
        particlePositions[p * 2 + 1] = 0.0;
        particleVelocities[p * 2] = 0.0;
        particleVelocities[p * 2 + 1] = 0.0;
        particleSpawntime[p] = 0.0;
        particleLifetime[p] = 0.0;
        particleIDs[p] = p;
    }

    const ptfbs = [new PlumeGL.FeedBack(), new PlumeGL.FeedBack()];
    const pointSys = [new PlumeGL.Point(), new PlumeGL.Point()];
    for (let i = 0; i < 2; ++i) {
        pointSys[i].setGeometryAttribute(particlePositions, 'a_position', gl.STREAM_COPY, 2, gl.FLOAT, false);
        pointSys[i].setGeometryAttribute(particleVelocities, 'a_velocity', gl.STREAM_COPY, 1, gl.FLOAT, false);
        pointSys[i].setGeometryAttribute(particleSpawntime, 'a_spawntime', gl.STREAM_COPY, 1, gl.FLOAT, false);
        pointSys[i].setGeometryAttribute(particleLifetime, 'a_lifetime', gl.STREAM_COPY, 1, gl.FLOAT, false);
        pointSys[i].setGeometryAttribute(particleIDs, 'a_ID', gl.STREAM_COPY, 1, gl.FLOAT, false);
        pointSys[i].initBufferAttributePoint(shaderObj);
        pointSys[i].feedBackAttribute(['a_position', 'a_velocity', 'a_spawntime', 'a_lifetime']);
        ptfbs[i].bindBuffer(pointSys[i]);
    }

    shaderObj.use();
    shaderObj.setUniformData('u_color', [0.0, 1.0, 1.0, 1.0]);
    shaderObj.setUniformData('u_acceleration', [0.0, ACCELERATION]);

    const sceneState = new PlumeGL.State();
    sceneState.setBlendTest(true);
    sceneState.setBlendFunc(PlumeGL.STATE.BLENDFUNC);
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    function render() {

        var time = Date.now() - appStartTime;
        var destinationIdx = (currentSourceIdx + 1) % 2;
        sceneState.stateChange();
        sceneState.setViewPort(0, 0, cav.width, cav.height - 10).change();

        const srcPoint = pointSys[currentSourceIdx];
        const disPoint = pointSys[destinationIdx];
        const dptfbs = ptfbs[currentSourceIdx];
        srcPoint.prepare();
        dptfbs.bindBuffer(disPoint);

        shaderObj.setUniformData('u_time', [time]);
        dptfbs.begin(gl.POINTS);
        srcPoint.draw({ start: 0, cnt: NUM_PARTICLES });
        dptfbs.end();

        currentSourceIdx = (currentSourceIdx + 1) % 2;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
};