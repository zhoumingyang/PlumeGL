import { PlumeGL } from '../plumegl/engine/plumegl';

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = window.innerWidth;
    cav.height = window.innerHeight;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

export const DrawPhongSphere = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultPhongShader = new PlumeGL.DefaultPhongShader();
    defaultPhongShader.initParameters();

};