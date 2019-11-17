import { PlumeGL } from '../plumegl/engine/plumegl';

const kernels: any = {
    normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ],
    gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ],
    gaussianBlur3: [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ],
    unsharpen: [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
    ],
    sharpness: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ],
    sharpen: [
        -1, -1, -1,
        -1, 16, -1,
        -1, -1, -1
    ],
    edgeDetect: [
        -0.125, -0.125, -0.125,
        -0.125, 1, -0.125,
        -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ],
    edgeDetect3: [
        -5, 0, 0,
        0, 0, 0,
        0, 0, 5
    ],
    edgeDetect4: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
    ],
    edgeDetect5: [
        -1, -1, -1,
        2, 2, 2,
        -1, -1, -1
    ],
    edgeDetect6: [
        -5, -5, -5,
        -5, 39, -5,
        -5, -5, -5
    ],
    sobelHorizontal: [
        1, 2, 1,
        0, 0, 0,
        -1, -2, -1
    ],
    sobelVertical: [
        1, 0, -1,
        2, 0, -2,
        1, 0, -1
    ],
    previtHorizontal: [
        1, 1, 1,
        0, 0, 0,
        -1, -1, -1
    ],
    previtVertical: [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
    ],
    boxBlur: [
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111
    ],
    triangleBlur: [
        0.0625, 0.125, 0.0625,
        0.125, 0.25, 0.125,
        0.0625, 0.125, 0.0625
    ],
    emboss: [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ]
};

let cav: any;
let gl: any;

const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 398;
    cav.height = 298;
    if (!cav) {
        return;
    }
    gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

const createRectangle = (x: number, y: number, img: any): any => {
    const width: number = img.width || 0;
    const height: number = img.height || 0;
    let x1: number = x;
    let x2: number = x + width;
    let y1: number = y;
    let y2: number = y + height;

    return new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]);
};

const createTexture = (): any => {
    const texture = new PlumeGL.Texture2D();
    texture.bind();
    texture.clamp();
    texture.setFilterMode(gl.NEAREST, gl.NEAREST);
    return texture;
}

const computeKernelWeight = (kernel: any): number => {
    const weight: number = kernel.reduce(function (prev: number, curr: number) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
}

export const DrawImageProcess = () => {
    createGLContext();

    const scene = new PlumeGL.Scene();
    scene.setSceneState(new PlumeGL.State());
    scene.state.setClear(true, false, false);

    const shader = new PlumeGL.DefaultImageProcessShader();
    shader.initParameters();
    scene.add(shader);

    PlumeGL.ImageLoader.load('../../res/saber.jpg', (img: any) => {

        if (!img) {
            return;
        }

        const recPosition = createRectangle(0, 0, img);
        const recUv = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,]);

        const recMesh = new PlumeGL.Mesh();
        recMesh.setGeometryAttribute(recPosition, shader.positionAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
        recMesh.setGeometryAttribute(recUv, shader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
        recMesh.initBufferAttributePoint(shader);

        const originTexture = createTexture();
        originTexture.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        originTexture.setTextureFromImage(img);

        const p3d = new PlumeGL.P3D(recMesh);
        shader.addDrawObject(p3d);
        p3d.setSelfUniform(shader.uniform.flipY, [1.0]);
        p3d.setSelfUniform(shader.uniform.textureSize, [img.width, img.height]);
        p3d.setSelfUniform(shader.uniform.resolution, [img.width, img.height]);
        p3d.setSelfUniform(shader.uniform.texture, [0]);

        const textures: any[] = [];
        const frameBuffers: any[] = [];
        for (let i = 0; i < 2; i++) {
            const texture = createTexture();
            texture.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
            textures.push(texture);
            texture.setTextureFromData(null, [img.width, img.height]);

            const fb = new PlumeGL.FrameBuffer();
            frameBuffers.push(fb);
            fb.attachTexture(texture, gl.COLOR_ATTACHMENT0);
        }

        const kernelLocation = shader.uniformLocationMap.get('uKernel[0]');

        //pass 1
        gl.clearColor(0, 0, 0, 1);
        scene.state.stateChange();
        originTexture.bind();

        let selectedKernels: string[] = ["gaussianBlur", "gaussianBlur2", "gaussianBlur3"];
        let count: number = 0;
        for (let key in kernels) {
            if (selectedKernels.includes(key)) {
                const fbo = frameBuffers[count % 2];
                fbo.bind();
                scene.state.resetAllMark();
                scene.state.setViewPort(0, 0, img.width, img.height).change();
                const kernelValue = kernels[key];
                const kernelWeight = computeKernelWeight(kernels[key]);
                p3d.setSelfUniform(shader.uniform.kernelWeight, [kernelWeight]);
                p3d.setSelfUniform(shader.uniform.kernel, [kernelValue]);
                scene.forEachRender((shaderObj: any) => {
                    if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTIMAGEPROCESSSHADER) {
                        shaderObj.forEachDraw((obj: any) => {
                            obj.prepare();
                            obj.draw({ start: 0, cnt: 6 });
                            obj.unPrepare();
                        });
                    }
                });
                textures[count % 2].bind();
                ++count;
            }
        }

        //pass 2
        PlumeGL.FrameBuffer.unBind();
        scene.state.setViewPort(0, 0, gl.canvas.width, gl.canvas.height).change();
        const normalKernelValue = kernels["normal"];
        const normalKernelWeight = computeKernelWeight(kernels["normal"]);
        p3d.setSelfUniform(shader.uniform.flipY, [-1.0]);
        p3d.setSelfUniform(shader.uniform.kernelWeight, [normalKernelWeight]);
        p3d.setSelfUniform(shader.uniform.kernel, [normalKernelValue]);
        scene.forEachRender((shaderObj: any) => {
            if (shaderObj.type === PlumeGL.CONSTANT.DEFAULTIMAGEPROCESSSHADER) {
                //gl.uniform1fv(kernelLocation, normalKernelValue);
                shaderObj.forEachDraw((obj: any) => {
                    obj.prepare();
                    obj.draw({ start: 0, cnt: 6 });
                    obj.unPrepare();
                });
            }
        });

    });
};