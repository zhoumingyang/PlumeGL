/**
 *https://threejs.org/docs/index.html#api/en/geometries/TorusBufferGeometry
 */

import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";
import { Vec3 } from "../math/vec3";

export class TorusGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.TORUSGEOMETRY;
    constructor() {
        super();
    }

    create(radius: number = 1, tube: number = 0.4,
        radialSegments: number = 8, tubularSegments: number = 6,
        arc: number = Math.PI * 2): void {

        let vertexPositionData: number[] = [];
        let normalData: number[] = [];
        let textureCoordData: number[] = [];
        let indexData: number[] = [];

        for (let j = 0; j <= radialSegments; j++) {
            for (let i = 0; i <= tubularSegments; i++) {
                let u: number = i / tubularSegments * arc;
                let v: number = j / radialSegments * Math.PI * 2;

                let x: number = (radius + tube * Math.cos(v)) * Math.cos(u);
                let y: number = (radius + tube * Math.cos(v)) * Math.sin(u);
                let z: number = tube * Math.sin(v);

                vertexPositionData.push(x, y, z);

                let cx: number = radius * Math.cos(u);
                let cy: number = radius * Math.sin(u);

                let ver = new Vec3(x, y, z);
                let cer = new Vec3(cx, cy, 0);
                let nor = ver.clone().substract(cer.clone()).normalize();
                normalData.push(nor.x, nor.y, nor.z);

                textureCoordData.push(i / tubularSegments, j / radialSegments);
            }
        }

        for (let j = 1; j <= radialSegments; j++) {
            for (let i = 1; i <= tubularSegments; i++) {
                let a: number = (tubularSegments + 1) * j + i - 1;
                let b: number = (tubularSegments + 1) * (j - 1) + i - 1;
                let c: number = (tubularSegments + 1) * (j - 1) + i;
                let d: number = (tubularSegments + 1) * j + i;

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