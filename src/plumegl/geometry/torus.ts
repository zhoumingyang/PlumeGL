import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";

export class TorusGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.TORUSGEOMETRY;

    constructor() {
        super();
    }

    create(slices: number = 10, loops: number = 20, ir: number = 1, or: number = 3): void {

        slices = Math.floor(slices);
        loops = Math.floor(loops);

        let vertexPositionData = [];
        let normalData = [];
        let textureCoordData = [];
        let indexData = [];

        for (let i = 0; i < slices; i++) {
            const v: number = i / slices;
            const slcAngle: number = v * 2 * Math.PI;

            const cosSlice: number = Math.cos(slcAngle);
            const sinSlice: number = Math.sin(slcAngle);
            const sliceRad: number = ir * cosSlice + or;

            for (let j = 0; j < loops; j++) {
                const u: number = j / loops;
                const loopAngle: number = u * 2 * Math.PI;
                const cosLoops: number = Math.cos(loopAngle);
                const sinLoops: number = Math.sin(loopAngle);

                const x: number = sliceRad * cosLoops;
                const y: number = sliceRad * sinLoops;
                const z: number = ir * sinSlice;

                vertexPositionData.push(x, y, z);
                normalData.push(cosLoops * sinSlice, sinLoops * sinSlice, cosSlice);
                textureCoordData.push(u, v);
            }
        }

        const cnt: number = loops + 1;
        for (let i = 0; i < slices; i++) {
            let v1: number = i * cnt;
            let v2: number = v1 + cnt;
            for (let j = 0; j < loops; j++) {
                indexData.push(v1, v1 + 1, v2);
                indexData.push(v2, v1 + 1, v2 + 1);
                v1 += 1;
                v2 += 1;
            }
        }

        this._indices = new Uint16Array(indexData);
        this._vertices = new Float32Array(vertexPositionData);
        this._normals = new Float32Array(normalData);
        this._uvs = new Float32Array(textureCoordData);
    }
}