import { PlumeGL } from '../plumegl/engine/plumegl';

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 680;
    cav.height = 680;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

export const DrawCubeMap = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultCubeMap = new PlumeGL.DefaultCubeMapShader();
    defaultCubeMap.initParameters();


};