import { ArrayBuffer } from './arraybuffer';
import { FrameBuffer } from './framebuffer';
import { RenderBuffer } from './renderbuffer';
import { IndexBuffer } from './indexbuffer';
import { Texture } from './texture';
import { Texture2D } from './texture2D';
import { Texture2DArray } from './texture2Darray';
import { Texture3D } from './texture3D';
import { TextureCube } from './texturecube';
import { Sampler } from './sampler';
import { Shader } from './shader';
import { VAO } from './vao';
import { UniformFactory } from './uniform';
import { Primitive } from './primitive';
import { Mesh } from './mesh';
import { Line } from './line';
import { Point } from './point';
import { State } from './state';
import { P3D } from './p3d';
import { UniformBuffer } from './uniformbuffer';
import { Scene } from './scene';
import { Query } from './query';
import { CONSTANT, STATE } from './constant';
import { FeedBack } from './feedback';
import { GL, WGL, WGL2 } from './gl';

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
    initGL
};