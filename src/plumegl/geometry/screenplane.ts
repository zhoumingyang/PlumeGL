import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";

export class ScreenPlaneGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.SCREENPLANEGEOMETRY;

    constructor() {
        super();
    }

    create(): void {

        const vertexPositionData: number[] = [
            -1.0 / 2, -1.0 / 2, 0.0, 1.0 / 2, -1.0 / 2, 0.0, 1.0 / 2, 1.0 / 2, 0.0,
            -1.0 / 2, -1.0 / 2, 0.0, 1.0 / 2, 1.0 / 2, 0.0, -1.0 / 2, 1.0 / 2, 0.0
        ];

        const textureCoordData: number[] = [
            0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0, 0.0, 1.0
        ];

        const normalData: number[] = [
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        ];

        this._vertices = new Float32Array(vertexPositionData);
        this._normals = new Float32Array(normalData);
        this._uvs = new Float32Array(textureCoordData);
    }
}