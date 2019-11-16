import { PlumeGL } from '../plumegl/engine/plumegl';

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

export const DrawImageProcess = () => {
    createGLContext();

    const shader = new PlumeGL.DefaultImageProcessShader();
    shader.initParameters();
    console.log(shader);

    PlumeGL.ImageLoader.load('', (img: any) => {
        if (!img) {
            return;
        }

        
    });
};