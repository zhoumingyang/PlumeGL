import { BaseGeometry } from './basegeometry';
import { CONSTANT } from "../engine/constant";
import { Vec3 } from "../math/vec3";

export class SphereGeometry extends BaseGeometry {
    public type: Symbol = CONSTANT.SPHEREGEOMETRY;

    constructor() {
        super();
    }

    create(radius: number = 1.0, latitudeBands: number = 25, longitudeBands: number = 25): void {

        let vertexPositionData = [];
        let normalData = [];
        let textureCoordData = [];
        let indexData = [];

        for (let latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
            let theta = latNumber * Math.PI / latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; ++longNumber) {
                let phi = longNumber * 2 * Math.PI / longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                let u = 1 - (longNumber / longitudeBands);
                let v = 1 - (latNumber / latitudeBands);

                vertexPositionData.push(radius * x);
                vertexPositionData.push(radius * y);
                vertexPositionData.push(radius * z);

                normalData.push(x);
                normalData.push(y);
                normalData.push(z);

                textureCoordData.push(u);
                textureCoordData.push(v);
            }
        }

        for (let latNumber = 0; latNumber < latitudeBands; ++latNumber) {
            for (let longNumber = 0; longNumber < longitudeBands; ++longNumber) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;

                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);

                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }

        this._indices = new Uint16Array(indexData);
        this._vertices = new Float32Array(vertexPositionData);
        this._normals = new Float32Array(normalData);
        this._uvs = new Float32Array(textureCoordData);
    }
}