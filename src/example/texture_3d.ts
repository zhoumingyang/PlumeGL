import { PlumeGL } from '../plumegl/plumegl';
import { texture3DVert } from './shader/texture_3d_vert';
import { texture3DFrag } from './shader/texture_3d_frag';

const snoise = (arg: number[]) => {

    function step(edge: number[], x: number[]): number[] {
        return [
            (x[0] < edge[0]) ? 0.0 : 1.0,
            (x[1] < edge[1]) ? 0.0 : 1.0,
            (x[2] < edge[2]) ? 0.0 : 1.0
        ];
    }

    function step_vec4(edge: number[], x: number[]): number[] {
        return [
            (x[0] < edge[0]) ? 0.0 : 1.0,
            (x[1] < edge[1]) ? 0.0 : 1.0,
            (x[2] < edge[2]) ? 0.0 : 1.0,
            (x[3] < edge[3]) ? 0.0 : 1.0
        ];
    }

    function min(x: number[], y: number[]): number[] {
        return [
            y[0] < x[0] ? y[0] : x[0],
            y[1] < x[1] ? y[1] : x[1],
            y[2] < x[2] ? y[2] : x[2]
        ];
    }

    function max(x: number[], y: number[]): number[] {
        return [
            y[0] > x[0] ? y[0] : x[0],
            y[1] > x[1] ? y[1] : x[1],
            y[2] > x[2] ? y[2] : x[2]
        ];
    }

    function max_vec4(x: number[], y: number[]): number[] {
        return [
            y[0] > x[0] ? y[0] : x[0],
            y[1] > x[1] ? y[1] : x[1],
            y[2] > x[2] ? y[2] : x[2],
            y[3] > x[3] ? y[3] : x[3]
        ];
    }

    function vec4_dot(left: number[], right: number[]): number {
        return left[0] * right[0] +
            left[1] * right[1] +
            left[2] * right[2] +
            left[3] * right[3];
    }

    function mod289_vec3(x: number[]): number[] {
        let temp: number = (1.0 / 289.0);
        return [
            x[0] - Math.floor(x[0] * temp) * 289.0,
            x[1] - Math.floor(x[1] * temp) * 289.0,
            x[2] - Math.floor(x[2] * temp) * 289.0
        ];
    }

    function mod289_vec4(x: number[]): number[] {
        let temp: number = (1.0 / 289.0);
        return [
            x[0] - Math.floor(x[0] * temp) * 289.0,
            x[1] - Math.floor(x[1] * temp) * 289.0,
            x[2] - Math.floor(x[2] * temp) * 289.0,
            x[3] - Math.floor(x[3] * temp) * 289.0
        ];
    }

    function permute_vec4(x: number[]): number[] {
        return mod289_vec4([
            ((x[0] * 34.0) + 1.0) * x[0],
            ((x[1] * 34.0) + 1.0) * x[1],
            ((x[2] * 34.0) + 1.0) * x[2],
            ((x[3] * 34.0) + 1.0) * x[3]
        ]);
    }

    function taylorInvSqrt_vec4(r: number[]): number[] {
        return [
            1.79284291400159 - 0.85373472095314 * r[0],
            1.79284291400159 - 0.85373472095314 * r[1],
            1.79284291400159 - 0.85373472095314 * r[2],
            1.79284291400159 - 0.85373472095314 * r[3]
        ];
    }

    function dot3(v1: number[], v2: number[]): number {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }

    function add3(v1: number[], v2: number[]): number[] {
        return [v1[0] + v2[0], v1[1] + v2[1], v2[2] + v2[2]];
    }

    function subtract3(v1: number[], v2: number[]): number[] {
        return [v1[0] - v2[0], v1[1] - v2[1], v2[2] - v2[2]];
    }

    const generateData = (v: number[]): number => {

        let C = [1.0 / 6.0, 1.0 / 3.0];
        let D = [0.0, 0.5, 1.0, 2.0];
        let temp0: number[] = [0, 0, 0];
        let temp3 = dot3(v, [C[1], C[1], C[1]]);
        temp0 = add3([temp3, temp3, temp3], v);
        let i: number[] = [Math.floor(temp0[0]), Math.floor(temp0[1]), Math.floor(temp0[2])];
        let temp1: number[] = [0, 0, 0];
        temp1 = subtract3(v, i);
        let temp2 = dot3(i, [C[0], C[0], C[0]]);
        let x0: number[] = [0, 0, 0];
        x0 = add3([temp2, temp2, temp2], temp1);

        let g = step([x0[1], x0[2], x0[0]], [x0[0], x0[1], x0[2]]);
        let l = [1.0 - g[0], 1.0 - g[1], 1.0 - g[2]];
        let i1 = min([g[0], g[1], g[2]], [l[2], l[0], l[1]]);
        let i2 = max([g[0], g[1], g[2]], [l[2], l[0], l[1]]);

        let temp4: number[] = [0, 0, 0];
        temp4 = subtract3(x0, i1);
        let x1: number[] = [0, 0, 0];
        x1 = add3([C[0], C[0], C[0]], temp4);
        let temp5: number[] = [0, 0, 0];
        temp5 = subtract3(x0, i2);
        let x2: number[] = [0, 0, 0];
        x2 = add3([C[1], C[1], C[1]], temp5);
        let x3: number[] = [0, 0, 0];
        x3 = subtract3(x0, [D[1], D[1], D[1]]);

        i = mod289_vec3(i);
        var p = permute_vec4([i[2] + 0.0, i[2] + i1[2], i[2] + i2[2], i[2] + 1.0]);
        p[0] += i[1] + 0.0;
        p[1] += i[1] + i1[1];
        p[2] += i[1] + i2[1];
        p[3] += i[1] + 1.0;
        p = permute_vec4(p);
        p[0] += i[0] + 0.0;
        p[1] += i[0] + i1[0];
        p[2] += i[0] + i2[0];
        p[3] += i[0] + 1.0;
        p = permute_vec4(p);

        var ns = [
            0.28571430,
            -0.92857140,
            0.14285715
        ];

        var j = [
            p[0] - 49.0 * Math.floor(p[0] * ns[2] * ns[2]),
            p[1] - 49.0 * Math.floor(p[1] * ns[2] * ns[2]),
            p[2] - 49.0 * Math.floor(p[2] * ns[2] * ns[2]),
            p[3] - 49.0 * Math.floor(p[3] * ns[2] * ns[2])
        ];

        var x_ = [
            Math.floor(j[0] * ns[2]),
            Math.floor(j[1] * ns[2]),
            Math.floor(j[2] * ns[2]),
            Math.floor(j[3] * ns[2])
        ];
        var y_ = [
            Math.floor(j[0] - 7.0 * x_[0]),
            Math.floor(j[1] - 7.0 * x_[1]),
            Math.floor(j[2] - 7.0 * x_[2]),
            Math.floor(j[3] - 7.0 * x_[3])
        ];

        var x = [
            x_[0] * ns[0] + ns[1],
            x_[1] * ns[0] + ns[1],
            x_[2] * ns[0] + ns[1],
            x_[3] * ns[0] + ns[1]
        ];
        var y = [
            y_[0] * ns[0] + ns[1],
            y_[1] * ns[0] + ns[1],
            y_[2] * ns[0] + ns[1],
            y_[3] * ns[0] + ns[1]
        ];
        var h = [
            1.0 - Math.abs(x[0]) - Math.abs(y[0]),
            1.0 - Math.abs(x[1]) - Math.abs(y[1]),
            1.0 - Math.abs(x[2]) - Math.abs(y[2]),
            1.0 - Math.abs(x[3]) - Math.abs(y[3])
        ];

        var b0 = [x[0], x[1], y[0], y[1]];
        var b1 = [x[2], x[3], y[2], y[3]];

        var s0 = [
            Math.floor(b0[0]) * 2.0 + 1.0,
            Math.floor(b0[1]) * 2.0 + 1.0,
            Math.floor(b0[2]) * 2.0 + 1.0,
            Math.floor(b0[3]) * 2.0 + 1.0
        ];
        var s1 = [
            Math.floor(b1[0]) * 2.0 + 1.0,
            Math.floor(b1[1]) * 2.0 + 1.0,
            Math.floor(b1[2]) * 2.0 + 1.0,
            Math.floor(b1[3]) * 2.0 + 1.0
        ];
        var sh = step_vec4(h, [0.0, 0.0, 0.0, 0.0]);
        sh[0] = -sh[0];
        sh[1] = -sh[1];
        sh[2] = -sh[2];
        sh[3] = -sh[3];

        var a0 = [
            b0[0] + s0[0] * sh[0],
            b0[2] + s0[2] * sh[0],
            b0[1] + s0[1] * sh[1],
            b0[3] + s0[3] * sh[1]
        ];
        var a1 = [
            b1[0] + s1[0] * sh[2],
            b1[2] + s1[2] * sh[2],
            b1[1] + s1[1] * sh[3],
            b1[3] + s1[3] * sh[3]
        ];

        var p0 = [a0[0], a0[1], h[0]];
        var p1 = [a0[2], a0[3], h[1]];
        var p2 = [a1[0], a1[1], h[2]];
        var p3 = [a1[2], a1[3], h[3]];

        var norm = taylorInvSqrt_vec4([dot3(p0, p0), dot3(p1, p1), dot3(p2, p2), dot3(p3, p3)]);
        p0 = [p0[0] * norm[0], p0[1] * norm[0], p0[2] * norm[0]];
        p1 = [p1[0] * norm[1], p1[1] * norm[1], p1[2] * norm[1]];
        p2 = [p2[0] * norm[2], p2[1] * norm[2], p2[2] * norm[2]];
        p3 = [p3[0] * norm[3], p3[1] * norm[3], p3[2] * norm[3]];

        var m = max_vec4([
            0.6 - dot3(x0, x0),
            0.6 - dot3(x1, x1),
            0.6 - dot3(x2, x2),
            0.6 - dot3(x3, x3)
        ], [
                0.0,
                0.0,
                0.0,
                0.0
            ]);
        m[0] *= m[0];
        m[1] *= m[1];
        m[2] *= m[2];
        m[3] *= m[3];

        return 42.0 * vec4_dot([
            m[0] * m[0],
            m[1] * m[1],
            m[2] * m[2],
            m[3] * m[3]
        ], [
                dot3(p0, x0),
                dot3(p1, x1),
                dot3(p2, x2),
                dot3(p3, x3)
            ]);
    };

    return generateData(arg);
}

const posData: number[] = [
    -1.0, -1.0,
    1.0, -1.0,
    1.0, 1.0,
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0
];

const texData: number[] = [
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0
];

let cav: any;
const createGLContext = () => {
    cav = document.getElementById('main-canvas');
    cav.width = Math.min(window.innerWidth, window.innerHeight);
    cav.height = cav.width;
    if (!cav) {
        return;
    }
    let gl = cav.getContext('webgl2', { antialias: true });
    if (!gl) {
        console.warn('webgl2 is not avaliable');
        gl = cav.getContext('webgl', { antialias: true });
        if (!gl) {
            return;
        }
    }
    return gl;
};

export const DrawTexture3D = () => {
    const gl = createGLContext();
    if (!gl) {
        return;
    }

    const windowSize = {
        x: cav.width,
        y: cav.height
    };

    const Corners = {
        TOP_LEFT: 0,
        TOP_RIGHT: 1,
        BOTTOM_RIGHT: 2,
        BOTTOM_LEFT: 3,
        MAX: 4
    };

    const viewport = new Array(Corners.MAX);
    viewport[Corners.BOTTOM_LEFT] = {
        x: 0,
        y: 0,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    viewport[Corners.BOTTOM_RIGHT] = {
        x: windowSize.x / 2,
        y: 0,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    viewport[Corners.TOP_RIGHT] = {
        x: windowSize.x / 2,
        y: windowSize.y / 2,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    viewport[Corners.TOP_LEFT] = {
        x: 0,
        y: windowSize.y / 2,
        z: windowSize.x / 2,
        w: windowSize.y / 2
    };

    // -- Initialize texture
    const SIZE: number = 32;
    var data = new Uint8Array(SIZE * SIZE * SIZE);
    for (let k = 0; k < SIZE; ++k) {
        for (let j = 0; j < SIZE; ++j) {
            for (let i = 0; i < SIZE; ++i) {
                const arg: number[] = [i, j, k];
                data[i + j * SIZE + k * SIZE * SIZE] = snoise(arg) * 256;
            }
        }
    }
    const tmpTexture = new PlumeGL.Texture3D(gl);
    tmpTexture.setFormat(gl.RED, gl.R8, gl.UNSIGNED_BYTE);
    tmpTexture.active(0);
    tmpTexture.setTextureFromData(data, [SIZE, SIZE, SIZE]);
    tmpTexture.setLevelSection(0, Math.log2(SIZE));
    tmpTexture.filterMode(true, false, true);
    tmpTexture.mipmap();

    // -- Initialize program
    const shaderObj = new PlumeGL.Shader(gl, texture3DVert, texture3DFrag);
    shaderObj.initParameters();

    // -- Initialize buffer
    const positions = new Float32Array(posData);
    const texCoords = new Float32Array(texData);
    const quadMesh = new PlumeGL.Mesh(gl);
    quadMesh.setGeometryAttribute(positions, 'position', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.setGeometryAttribute(texCoords, 'in_texcoord', gl.STATIC_DRAW, 2, gl.FLOAT, false);
    quadMesh.initBufferAttributePoint(shaderObj);

    // -- Render
    let orientation: number[] = [0.0, 0.0, 0.0];
    requestAnimationFrame(render);
    function yawPitchRoll(yaw: number, pitch: number, roll: number) {
        const cosYaw: number = Math.cos(yaw);
        const sinYaw: number = Math.sin(yaw);
        const cosPitch: number = Math.cos(pitch);
        const sinPitch: number = Math.sin(pitch);
        const cosRoll: number = Math.cos(roll);
        const sinRoll: number = Math.sin(roll);
        return [
            cosYaw * cosPitch,
            cosYaw * sinPitch * sinRoll - sinYaw * cosRoll,
            cosYaw * sinPitch * cosRoll + sinYaw * sinRoll,
            0.0,
            sinYaw * cosPitch,
            sinYaw * sinPitch * sinRoll + cosYaw * cosRoll,
            sinYaw * sinPitch * cosRoll - cosYaw * sinRoll,
            0.0,
            -sinPitch,
            cosPitch * sinRoll,
            cosPitch * cosRoll,
            0.0,
            0.0, 0.0, 0.0, 1.0
        ];
    }

    const sceneState = new PlumeGL.State(gl);
    sceneState.setClearColor(0.0, 0.0, 0.0, 1.0);
    sceneState.setClear(true, false, false);
    function render() {
        orientation[0] += 0.020;
        orientation[1] += 0.010;
        orientation[2] += 0.005;
        const yawMatrix = new Float32Array(yawPitchRoll(orientation[0], 0.0, 0.0));
        const pitchMatrix = new Float32Array(yawPitchRoll(0.0, orientation[1], 0.0));
        const rollMatrix = new Float32Array(yawPitchRoll(0.0, 0.0, orientation[2]));
        const yawPitchRollMatrix = new Float32Array(yawPitchRoll(orientation[0], orientation[1], orientation[2]));
        const matrices = [yawMatrix, pitchMatrix, rollMatrix, yawPitchRollMatrix];
        sceneState.setMark(PlumeGL.STATE.VIEWPORT, false);
        sceneState.stateChange();
        shaderObj.use();
        shaderObj.setUniformData('diffuse', [0]);
        tmpTexture.bind();
        quadMesh.prepare();
        for (let i = 0; i < Corners.MAX; ++i) {
            sceneState.setViewPort(viewport[i].x, viewport[i].y, viewport[i].z, viewport[i].w).change();
            shaderObj.setUniformData('orientation', [matrices[i]]);
            quadMesh.draw({ start: 0, cnt: 6 }, undefined, { instance: true, cnt: 1 });
        }
        requestAnimationFrame(render);
    }
};