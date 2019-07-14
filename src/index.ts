import { SampleObject } from './example/sample_object';
import { FboBlit } from './example/fbo_blit';
import { BufferUniform } from './example/buffer_uniform';
import { DrawInstancedUbo } from './example/draw_instanced_ubo';
import { FboNewBlenEquation } from './example/fbo_new_blend_equation';
import { FboRttDrawBuffers } from './example/fbo_rtt_draw_buffers';
import { DrawLine } from './example/draw_line';
import { DrawPoints } from './example/draw_points';

const appRun = () => {
    // SampleObject();
    // FboBlit();
    // BufferUniform();
    // DrawInstancedUbo();
    // FboNewBlenEquation();
    FboRttDrawBuffers();
    // DrawLine();
    // DrawPoints();
};
appRun();