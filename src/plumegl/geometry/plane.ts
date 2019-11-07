import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";

export class PlaneGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.PLANEGEOMETRY;

    constructor() {
        super();
    }

    create(w: number, h: number, wSegs: number, hSegs: number) {

        if (w <= 0 || h <= 0) {
            console.warn('error param to create a plane');
            return;
        }

        const halfw = w / 2;
        const halfh = h / 2;

        wSegs = Math.floor(wSegs);
        hSegs = Math.floor(hSegs);

        const stepw = w / wSegs;
        const steph = h / hSegs;

        const cntw = wSegs + 1;
        const cnth = hSegs + 1;


        let vertexPositionData: number[] = [];
        let normalData: number[] = [];
        let textureCoordData: number[] = [];
        let indexData: number[] = [];

        for (let j = 0; j < cnth; j++) {
            const y = j * steph - halfh;
            for (let i = 0; i < cntw; i++) {
                const x = i * stepw - halfw;
                vertexPositionData.push(x, -y, 0);
                normalData.push(0, 0, 1);
                textureCoordData.push((i / cntw), (1 - (j / cnth)));
            }
        }

        for (let j = 0; j < wSegs; j++) {
            for (let i = 0; i < hSegs; i++) {
                let a = i + cntw * j;
                let b = i + cntw * (j + 1);
                let c = (i + 1) + cntw * (j + 1);
                let d = (i + 1) + cntw * j;
                indexData.push(a, b, d);
                indexData.push(b, c, d);
            }
        }

        this._indices = new Uint16Array(indexData);
        this._vertices = new Float32Array(vertexPositionData);
        this._normals = new Float32Array(normalData);
        this._uvs = new Float32Array(textureCoordData);

    }
}