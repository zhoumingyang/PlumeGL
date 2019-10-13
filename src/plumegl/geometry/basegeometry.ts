import { CONSTANT } from '../engine/constant';

export class BaseGeometry {
    public type: Symbol = CONSTANT.BASEGEOMETRY;
    protected _vertices: Float32Array;
    protected _normals: Float32Array;
    protected _uvs: Float32Array;
    protected _indices: Int32Array;

    constructor() {

    }

    get vertices(): Float32Array {
        return this._vertices;
    }

    get normals(): Float32Array {
        return this._normals;
    }

    get uvs(): Float32Array {
        return this._uvs;
    }

    get indices(): Int32Array {
        return this._indices;
    }

}