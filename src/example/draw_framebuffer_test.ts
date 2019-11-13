import { PlumeGL } from '../plumegl/engine/plumegl';
import { DrawFrameBufferVert } from './shader/draw_framebuffer_vert';
import { DrawFrameBufferFrag } from './shader/draw_framebuffer_frag';

let cav: any;
let gl: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 398;
    cav.height = 298;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

export const DrawFrameBufferTest = () => {
    gl = createGLContext();
    if (!gl) {
        return;
    }

    const shader = new PlumeGL.Shader(DrawFrameBufferVert, DrawFrameBufferFrag);
    shader.initParameters();

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    setTexcoords(gl);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    {
        const level = 0;
        const internalFormat = gl.LUMINANCE;
        const width = 3;
        const height = 2;
        const border = 0;
        const format = gl.LUMINANCE;
        const type = gl.UNSIGNED_BYTE;
        const data = new Uint8Array([
            128, 64, 128,
            0, 192, 0,
        ]);
        const alignment = 1;
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
            format, type, data);
        // set the filtering so we don't need mips and it's not filtered
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    const targetTextureWidth = 256;
    const targetTextureHeight = 256;
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    {
        // define size and format of level 0
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data: any = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            targetTextureWidth, targetTextureHeight, border,
            format, type, data);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    const level = 0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);

    function degToRad(d: number) {
        return d * Math.PI / 180;
    }

    let fieldOfViewRadians = degToRad(60);
    let modelXRotationRadians = degToRad(0);
    let modelYRotationRadians = degToRad(0);

    // Get the starting time.
    let then = 0;

    requestAnimationFrame(drawScene);

    function drawCube(aspect: number) {
        shader.use();
        gl.enableVertexAttribArray(0);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(0, size, type, normalize, stride, offset);

        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(1, size, type, normalize, stride, offset);

        const camera = new PlumeGL.PerspectiveCamera();
        camera.setPersective(fieldOfViewRadians, aspect, 1, 2000);
        camera.setView(new PlumeGL.Vec3(0, 0, 2), new PlumeGL.Vec3(0, 0, 0), new PlumeGL.Vec3(0, 1, 0));
        camera.updateMat();

        const vm = camera.getViewMat();
        vm.value[12] = Math.abs(vm.value[12]);
        vm.value[13] = Math.abs(vm.value[13]);
        vm.value[14] = Math.abs(vm.value[14]);
        const ivm = vm.clone().invert();

        const pm = camera.getProjectMat();
        const pvm = pm.clone().multiply(ivm);

        // const xrm = new PlumeGL.Mat4().setRotation(modelXRotationRadians, new PlumeGL.Vec3(1, 0, 0));
        const xrm = new PlumeGL.Mat4();
        let yrm = new PlumeGL.Mat4();//.setRotation(modelYRotationRadians, new PlumeGL.Vec3(0, 1, 0));
        yrm = yrm.rotate(modelYRotationRadians,new PlumeGL.Vec3(0, 1, 0));
        const mm = yrm.clone().multiply(xrm);

        const fm = pvm.clone().multiply(mm);

        shader.setUniformData('uMvp', [fm.value, false]);
        shader.setUniformData('uTexture', [0]);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    }

    function drawScene(time: number) {
        time *= 0.001;
        // Subtract the previous time from the current time
        var deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;

        // Animate the rotation
        modelYRotationRadians += -0.7 * deltaTime;
        modelXRotationRadians += -0.4 * deltaTime;

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        {
            // render to our targetTexture by binding the framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

            // render cube with our 3x2 texture
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, targetTextureWidth, targetTextureHeight);

            // Clear the attachment(s).
            gl.clearColor(0, 0, 1, 1);   // clear to blue
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const aspect = targetTextureWidth / targetTextureHeight;
            drawCube(aspect);
        }

        {
            // render to the canvas
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            // render the cube with the texture we just rendered to
            gl.bindTexture(gl.TEXTURE_2D, targetTexture);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas AND the depth buffer.
            gl.clearColor(0, 0, 0, 1);   // clear to white
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            drawCube(aspect);
        }

        requestAnimationFrame(drawScene);
    }

};

const setGeometry = (gl: any) => {
    var positions = new Float32Array(
        [
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,

            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,

            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,

            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,

        ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

const setTexcoords = (gl: any) => {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
            [
                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,

                0, 0,
                0, 1,
                1, 0,
                1, 0,
                0, 1,
                1, 1,

                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,

                0, 0,
                0, 1,
                1, 0,
                1, 0,
                0, 1,
                1, 1,

                0, 0,
                0, 1,
                1, 0,
                0, 1,
                1, 1,
                1, 0,

                0, 0,
                0, 1,
                1, 0,
                1, 0,
                0, 1,
                1, 1,

            ]),
        gl.STATIC_DRAW);
}