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
import { Query } from '../aid/query';
import { CONSTANT, STATE } from './constant';
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
import { PerspectiveCamera } from '../camera/perspectivecamera';
import { OrthoCamera } from "../camera/orthocamera";
import { SphereGeometry } from '../geometry/sphere';
import { CubeGeometry } from '../geometry/cube';
import { MathApi } from '../math/api';

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
    return GL.gl;
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
    Query,
    CONSTANT,
    STATE,
    FeedBack,
    initGL,
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
    PerspectiveCamera,
    OrthoCamera,
    SphereGeometry,
    CubeGeometry,
    Mat4: MathApi.Mat4,
    Vec3: MathApi.Vec3,
    Quat: MathApi.Quat,
    Mat3: MathApi.Mat3
};