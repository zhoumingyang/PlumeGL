import { SampleObject } from './example/sample_object';
import { FboBlit } from './example/fbo_blit';
import { BufferUniform } from './example/buffer_uniform';
import { DrawInstancedUbo } from './example/draw_instanced_ubo';
import { FboNewBlenEquation } from './example/fbo_new_blend_equation';
import { FboRttDrawBuffers } from './example/fbo_rtt_draw_buffers';
import { DrawLine } from './example/draw_line';
import { DrawPoints } from './example/draw_points';
import { FboMultiSample } from './example/fbo_multisample';
import { DrawTexture3D } from './example/texture_3d';
import { DrawTexture2DArray } from './example/texture_2d_array';
import { QueryOcclusion } from './example/query_occlusion';

const appRun = () => {
    // SampleObject();
    // FboBlit();
    // BufferUniform();
    // DrawInstancedUbo();
    // FboNewBlenEquation();
    // FboRttDrawBuffers();
    // DrawLine();
    // DrawPoints();
    // FboMultiSample();
    // DrawTexture3D();
    // DrawTexture2DArray();
    QueryOcclusion();
};
appRun();