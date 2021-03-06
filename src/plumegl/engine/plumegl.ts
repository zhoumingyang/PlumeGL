import { ArrayBuffer } from '../buffer/arraybuffer';
import { FrameBuffer } from '../core/framebuffer';
import { RenderBuffer } from '../buffer/renderbuffer';
import { IndexBuffer } from '../buffer/indexbuffer';
import { Texture } from '../texture/texture';
import { Texture2D } from '../texture/texture2D';
import { Texture2DArray } from '../texture/texture2Darray';
import { Texture3D } from '../texture/texture3D';
import { TextureCube } from '../texture/texturecube';
import { Sampler } from '../texture/sampler';
import { Shader } from '../shader/shader';
import { VAO } from '../primitive/vao';
import { UniformFactory } from '../aid/uniform';
import { Primitive } from '../primitive/primitive';
import { Mesh } from '../primitive/mesh';
import { Line } from '../primitive/line';
import { Point } from '../primitive/point';
import { State } from '../core/state';
import { P3D } from '../core/p3d';
import { UniformBuffer } from '../buffer/uniformbuffer';
import { Scene } from '../core/scene';
import { Pass } from '../core/pass';
import { Stage } from '../core/stage';
import { Pipeline } from '../core/pipeline';
import { Query } from '../aid/query';
import { CONSTANT, STATE, ENVMAP, TYPE, ATTRIBUTE } from './constant';
import { FeedBack } from '../aid/feedback';
import { GL, WGL, WGL2 } from './gl';
import { Util } from '../util/util';
import { BaseLight } from '../light/baselight';
import { AmbientLight } from '../light/ambientlight';
import { ParallelLight } from '../light/parallellight';
import { PointLight } from '../light/pointlight';
import { SpotLight } from '../light/spotlight';
import { DefaultLightShader } from '../shader/defaultlight';
import { BasicLineShader } from '../shader/basicline';
import { DefaultColorShader } from '../shader/defaultcolor';
import { DefaultLambertShader } from '../shader/lambert';
import { DefaultPhongShader } from '../shader/phong';
import { DefaultCubeMapShader } from '../shader/cubemap';
import { DefaultEnvMapShader } from '../shader/envmap';
import { DefaultDashLineShader } from '../shader/dashline';
import { DefaultSobelShader } from '../shader/sobel';
import { DefaultCopyShader } from '../shader/copy';
import { DefaultImageProcessShader } from '../shader/imageprocess';
import { PerspectiveCamera } from '../camera/perspectivecamera';
import { OrthoCamera } from "../camera/orthocamera";
import { SphereGeometry } from '../geometry/sphere';
import { CubeGeometry } from '../geometry/cube';
import { PlaneGeometry } from '../geometry/plane';
import { TorusGeometry } from '../geometry/torus';
import { ScreenPlaneGeometry } from '../geometry/screenplane';
import { MathApi } from '../math/api';
import { ImageLoader } from '../loader/imageloader';
import { Node } from '../core/node';
import { Vec2 } from '../math/vec2';

const initGL = (ele?: WGL | WGL2 | HTMLCanvasElement): WGL | WGL2 => {
    if (ele instanceof HTMLCanvasElement) {
        let gl: any = ele.getContext('webgl2', { antialias: true });
        if (!gl) {
            console.warn('not support webgl2');
            gl = ele.getContext('webgl', { antialias: true });
        }
        GL.gl = gl;
    } else {
        GL.gl = ele;
    }
    GL.width = GL.gl.canvas.width;
    GL.height = GL.gl.canvas.height;
    return GL.gl;
};

const getSize = (): Vec2 => {
    return new Vec2(GL.width, GL.height);
};

const updateSize = (w?: number, h?: number): void => {
    GL.width = w || GL.gl.canvas.width;
    GL.height = h || GL.gl.canvas.height;
};

export const PlumeGL = {
    ArrayBuffer,
    FrameBuffer,
    RenderBuffer,
    IndexBuffer,
    UniformBuffer,
    Texture,
    Texture2D,
    Texture2DArray,
    Texture3D,
    TextureCube,
    Sampler,
    Shader,
    VAO,
    Primitive,
    Mesh,
    Line,
    Point,
    UniformFactory,
    State,
    P3D,
    Scene,
    Pass,
    Stage,
    Pipeline,
    Query,
    CONSTANT,
    ATTRIBUTE,
    TYPE,
    STATE,
    ENVMAP,
    FeedBack,
    initGL,
    getSize,
    updateSize,
    Util,
    BaseLight,
    AmbientLight,
    ParallelLight,
    PointLight,
    SpotLight,
    DefaultLightShader,
    BasicLineShader,
    DefaultColorShader,
    DefaultLambertShader,
    DefaultPhongShader,
    DefaultCubeMapShader,
    DefaultEnvMapShader,
    DefaultDashLineShader,
    DefaultSobelShader,
    DefaultCopyShader,
    DefaultImageProcessShader,
    PerspectiveCamera,
    OrthoCamera,
    SphereGeometry,
    CubeGeometry,
    PlaneGeometry,
    TorusGeometry,
    ScreenPlaneGeometry,
    Mat4: MathApi.Mat4,
    Vec3: MathApi.Vec3,
    Vec2: MathApi.Vec3,
    Quat: MathApi.Quat,
    Mat3: MathApi.Mat3,
    ImageLoader,
    Node
};