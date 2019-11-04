import { PlumeGL } from '../plumegl/engine/plumegl';

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = 512;
    cav.height = 512;
    if (!cav) {
        return;
    }
    let gl = <WebGL2RenderingContext>PlumeGL.initGL(cav);
    return gl;
};

export const DrawDashLine = (): void => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const defaultDashLineShader = new PlumeGL.DefaultDashLineShader();
    defaultDashLineShader.initParameters();

}