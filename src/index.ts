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
import { TransformFeedbackInterleaved } from './example/transform_feedback_interleaved';
import { TransformFeedbackSeparated } from './example/transform_feedback_separated';
import { DrawTfbSeparated2 } from './example/transform_feedback_separated_2';
import { DrawLightCube } from './example/light_cube';
import { DrawPointLightCube } from './example/point_light_cube';
import { DrawSpotLightPlane } from './example/spot_light_plane';
import { DrawOrthoCube } from './example/orthocamera_cube';
import { DrawLambertCube } from './example/lambert_cube';
import { DrawPhongSphere } from './example/phong_sphere';
import { DrawCubeMap } from './example/draw_cubemap';
import { DrawEnvMap } from './example/draw_envmap';
import { DrawDashLine } from './example/draw_dashline';
import { DrawBasicGeometry } from './example/draw_basic_geometry';
import { DrawOffscreenEdge } from './example/draw_offscreen_edge';
import { DrawFrameBufferTest } from './example/draw_framebuffer_test';

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
    // QueryOcclusion();
    // TransformFeedbackInterleaved();
    // TransformFeedbackSeparated();
    // DrawTfbSeparated2();
    // DrawLightCube();
    // DrawPointLightCube();
    // DrawSpotLightPlane();
    // DrawOrthoCube();
    // DrawLambertCube();
    // DrawPhongSphere();
    // DrawCubeMap();
    // DrawEnvMap();
    // DrawDashLine();
    // DrawBasicGeometry();
    DrawOffscreenEdge();
    // DrawFrameBufferTest();
};
appRun();