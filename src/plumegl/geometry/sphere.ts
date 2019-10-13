import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";
import { Vec3 } from "../math/vec3";

export class SphereGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.SPHEREGEOMETRY;

    constructor() {
        super();
    }

    create(radius: number, horizontalSegments: number,
        verticalSegments: number, phiStart: number,
        phiLength: number, thetaStart: number,
        thetaLength: number): void {

        radius = radius || 1;

        const defaultHorSegments: number = 10;
        const defaulVerSegments: number = 8;
        horizontalSegments = Math.max(3, Math.floor(horizontalSegments) || defaultHorSegments);
        verticalSegments = Math.max(2, Math.floor(verticalSegments) || defaulVerSegments);

        phiStart = phiStart !== undefined ? phiStart : 0;
        phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

        thetaStart = thetaStart !== undefined ? thetaStart : 0;
        thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

        const thetaEnd: number = Math.min(thetaStart + thetaLength, Math.PI);

        let ix, iy;

        let index: number = 0;
        let grid = [];

        let vertex = new Vec3();
        let normal = new Vec3();

        // buffers
        let indices: number[] = [];
        let vertices: number[] = [];
        let normals: number[] = [];
        let uvs: number[] = [];

        for (iy = 0; iy <= verticalSegments; iy++) {
            let verticesRow = [];
            let v = iy / verticalSegments;
            let uOffset: number = 0;

            if (iy == 0 && thetaStart == 0) {
                uOffset = 0.5 / horizontalSegments;
            } else if (iy == verticalSegments && thetaEnd == Math.PI) {
                uOffset = - 0.5 / horizontalSegments;
            }

            for (ix = 0; ix <= horizontalSegments; ix++) {

                let u: number = ix / horizontalSegments;

                // vertex
                vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertices.push(vertex.x, vertex.y, vertex.z);

                // normal
                normal = vertex.clone();
                normals.push(normal.x, normal.y, normal.z);

                // uv
                uvs.push(u + uOffset, 1 - v);
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }

        for (iy = 0; iy < horizontalSegments; iy++) {
            for (ix = 0; ix < horizontalSegments; ix++) {
                let a = grid[iy][ix + 1];
                let b = grid[iy][ix];
                let c = grid[iy + 1][ix];
                let d = grid[iy + 1][ix + 1];
                if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
                if (iy !== horizontalSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
            }
        }

        this._indices = new Int32Array(indices);
        this._vertices = new Float32Array(vertices);
        this._normals = new Float32Array(normals);
        this._uvs = new Float32Array(uvs);
    }
}