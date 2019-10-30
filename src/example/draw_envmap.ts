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

export const DrawEnvMap = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const imgUrls: string[] = [
        '../../res/cubemap/right.jpg', '../../res/cubemap/left.jpg',
        '../../res/cubemap/up.jpg', '../../res/cubemap/down.jpg',
        '../../res/cubemap/front.jpg', '../../res/cubemap/back.jpg'];

    const defaultCubeMap = new PlumeGL.DefaultCubeMapShader();
    defaultCubeMap.initParameters();

    const defaultEnvMap = new PlumeGL.DefaultEnvMapShader();
    defaultEnvMap.initParameters();

};