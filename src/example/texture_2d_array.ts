import { PlumeGL } from '../plumegl/plumegl';
import { texture2DArrayVert } from './shader/texture_2d_array_vert';
import { texture2DArrayFrag } from './shader/texture_2d_array_frag';
import { ImageLoader } from '../loader/imageloader';

const posData: number[] = [
    -1.0, -1.0,
    1.0, -1.0,
    1.0, 1.0,
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0
];

const texData: number[] = [
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
    cav.height = window.innerHeight;
    cav.width = cav.height * 960 / 540;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

export const DrawTexture2DArray = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const shaderObj = new PlumeGL.Shader(texture2DArrayVert, texture2DArrayFrag);
    shaderObj.initParameters();

    // -- Init buffers
    const positions = new Float32Array(posData);
    const texCoords = new Float32Array(texData);
    const quadMesh = new PlumeGL.Mesh();
    quadMesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.setGeometryAttribute(texCoords, 'texcoord', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.initBufferAttributePoint(shaderObj);

    const tmpTexture = new PlumeGL.Texture2DArray();
    tmpTexture.setFormat(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
    const sceneState = new PlumeGL.State();
    sceneState.setClearColor(1.0, 1.0, 1.0, 1.0);
    sceneState.setClear(true, false, false);
    ImageLoader.load('../res/di-animation-array.jpg', (image: any) => {
        const NUM_IMAGES = 3;
        const IMAGE_SIZE = {
            width: 960,
            height: 540
        };
        // use canvas to get the pixel data array of the image
        let canvas = document.createElement('canvas');
        canvas.width = IMAGE_SIZE.width;
        canvas.height = IMAGE_SIZE.height * NUM_IMAGES;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, IMAGE_SIZE.width, IMAGE_SIZE.height * NUM_IMAGES);
        const pixels = new Uint8Array(imageData.data.buffer);

        // -- Init Texture
        tmpTexture.active(0);
        tmpTexture.setTextureFromData(pixels, [IMAGE_SIZE.width, IMAGE_SIZE.height, NUM_IMAGES]);
        tmpTexture.filterMode(true, false, false);

        shaderObj.use();
        quadMesh.prepare();
        const matrix = new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
        shaderObj.setUniformData('MVP', [matrix, false]);
        shaderObj.setUniformData('diffuse', [0]);
        let frame = 0;
        (function render() {
            // -- Render
            sceneState.stateChange();
            shaderObj.setUniformData('layer', [frame]);
            frame = (frame + 1) % NUM_IMAGES;
            quadMesh.draw({ start: 0, cnt: 6 });
            setTimeout(function () {
                requestAnimationFrame(render);
            }, 200);
        })();
    });

    // quadMesh.dispose();
    // tmpTexture.dispose();
    // shaderObj.dispose();
}