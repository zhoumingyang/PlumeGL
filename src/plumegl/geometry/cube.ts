import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";

export class CubeGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.CUBEGEOMETRY;

    constructor() {
        super();
    }

    create(l: number, w: number, h: number): void {

        let x = l / 2.0;
        let y = w / 2.0;
        let z = h / 2.0;

        let cubeVertices: number[] = [
            //front
            -x, y, z, -x, -y, z, x, y, z,
            -x, -y, z, x, -y, z, x, y, z,
            //right
            x, y, z, x, -y, z, x, y, -z,
            x, -y, z, x, -y, -z, x, y, -z,
            //back
            x, y, -z, x, -y, -z, -x, y, -z,
            -x, y, -z, x, -y, -z, -x, -y, -z,
            //left
            -x, y, -z, -x, -y, -z, -x, -y, z,
            -x, y, -z, -x, -y, z, -x, y, z,
            //top
            x, y, -z, -x, y, -z, x, y, z,
            x, y, z, -x, y, -z, -x, y, z,
            //bottom
            x, -y, z, x, -y, -z, -x, -y, -z,
            x, -y, z, -x, -y, z, -x, -y, -z
        ];

        let cubeNormals: number[] = [
            //front
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            //right
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
            //back
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
            //left
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
            //top
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            //bottom
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        ];

        let cubeUvs: number[] = [
            //front
            -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
            //right
            1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
            1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
            //back
            1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0, -1.0, -1.0, -1.0,
            //left
            -1.0, 1.0, -1.0, -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0, -1.0, -1.0, 1.0,
            //top
            1.0, 1.0, -1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, -1.0, 1.0, -1.0, 1.0,
            //bottom
            1.0, -1.0, 1.0, -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0, -1.0, -1.0, -1.0
        ];

        this._vertices = new Float32Array(cubeVertices);
        this._normals = new Float32Array(cubeNormals);
        this._uvs = new Float32Array(cubeUvs);

    }
}