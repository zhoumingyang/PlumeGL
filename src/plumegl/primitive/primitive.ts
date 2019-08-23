import { VAO } from './vao';
import { ArrayBuffer } from '../buffer/arraybuffer';
import { Shader } from '../core/shader';
import { IndexBuffer } from '../buffer/indexbuffer';
import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';

interface Attribute {
    name: string;
    size: number;
    type: number;
    normalize: boolean;
};

export class Primitive {
    public gl: WGL | WGL2 = GL.gl;
    public type: Symbol = CONSTANT.PRIMITIVE;
    public DrawTypes: number[] = [];
    public uid: string;
    public children: Primitive[] = [];  // TODO, now do not consider the children
    public attributes: any = {};
    public buffers: any = {};
    public modelMatrix: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];  // TODO, now do not consider the matrix
    public vao: VAO;
    public indexBuffer: IndexBuffer;
    public uniqueBuffer: ArrayBuffer = undefined;
    protected drawType: number;

    constructor(gl?: WGL | WGL2) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        if (this.gl instanceof WebGL2RenderingContext) {
            this.vao = new VAO(undefined, this.gl);
        }
    }

    public setDrawType(drawType: number): void {
        if (!this.DrawTypes.includes(drawType)) {
            console.warn('draw type is not match gl primitive');
            return
        }
        this.drawType = drawType;
    }

    public getDrawType(): number {
        return this.drawType;
    }

    public setGeometryAttributes(datas: number[] | Float32Array | number, attribs: Attribute[], drawType?: number): void {
        if (!datas) {
            console.warn(`data is undefined in setGeometryAttribute`);
            return;
        }

        if (!attribs || !attribs.length) {
            console.warn(`no attribute infos`);
            return;
        }
        const _gl: WGL | WGL2 = this.gl;
        drawType = drawType || _gl.STATIC_DRAW;
        const arrayBuffer = new ArrayBuffer(drawType, _gl);
        arrayBuffer.setBufferData(datas);
        attribs.forEach((ab: Attribute) => {
            this.attributes[ab.name] = datas;
            arrayBuffer.attrib(ab.name, ab.size || 3, ab.type || _gl.FLOAT, ab.normalize || false);
            this.buffers[ab.name] = arrayBuffer;
        });
        if (this.vao) {
            this.vao.addBuffer(arrayBuffer);
        }
        this.uniqueBuffer = arrayBuffer;
    }

    public setGeometryAttribute(datas: number[] | Float32Array | number, name: string, drawType?: number, size?: number, type?: number, normalize?: boolean): void {
        if (!datas) {
            console.warn(`data is undefined in setGeometryAttribute`);
            return;
        }

        if (!name) {
            console.warn(`need attribute name`);
            return;
        }

        const _gl: WGL | WGL2 = this.gl;
        this.attributes[name] = datas;
        drawType = drawType || _gl.STATIC_DRAW;
        const arrayBuffer = new ArrayBuffer(drawType, _gl);
        arrayBuffer.setBufferData(datas);
        arrayBuffer.attrib(name, size || 3, type || _gl.FLOAT, normalize || false);
        if (this.vao) {
            this.vao.addBuffer(arrayBuffer);
        }
        this.buffers[name] = arrayBuffer;
    }

    public feedBackAttribute(name: string | string[], index: number = 0): void {
        if (name instanceof Array) {
            name.forEach((n: string, i: number) => {
                const arrayBuffer = this.buffers[n];
                if (arrayBuffer) {
                    arrayBuffer.feedBack = true;
                    arrayBuffer.feedBackIndex = i;
                }
            });
        } else {
            const arrayBuffer = this.buffers[name];
            if (arrayBuffer) {
                arrayBuffer.feedBack = true;
                arrayBuffer.feedBackIndex = index;
            }
        }
    }

    public initBufferAttributePoint(program: Shader): void {
        if (this.vao) {
            this.vao.initBufferAttributePoint(program);
        } else {
            const buffers: any = this.buffers;
            for (let key in buffers) {
                buffers[key].setAttributePoint(program);
            }
        }
        if (this.indexBuffer) {
            ArrayBuffer.unBind(this.gl);
            this.indexBuffer.bind();
        }
        VAO.unBind();
    }

    public prepare(slot?: number[]): void {
        if (this.vao) {
            this.vao.bind();
        } else {
            const buffers: any = this.buffers;
            for (let key in buffers) {
                buffers[key].bind();
            }
        }
        if (this.indexBuffer) {
            this.indexBuffer.bind();
        }
    }

    public unPrepare(): void {
        if (this.vao) {
            VAO.unBind();
        } else {
            const buffers: any = this.buffers;
            for (let key in buffers) {
                buffers[key].unBind();
            }
        }
        if (this.indexBuffer) {
            IndexBuffer.unBind();
        }
    }

    public addChild(child: Primitive): void {
        if (!child) {
            return;
        }
        this.children.push(child);
    }

    public deleteChild(index: number): void {
        const len: number = this.children.length;
        if (index >= len || index < 0) {
            return;
        }
        this.children.splice(index, 1);
    }

    public draw(arrayArg?: any, elementArg?: any, option?: any): void {
        const _gl: WGL | WGL2 = this.gl;
        if (this.indexBuffer) {
            const cnt = (elementArg && elementArg.cnt != null) ? elementArg.cnt : 0;
            const type = (elementArg && elementArg.type != null) ? elementArg.type : _gl.UNSIGNED_INT;
            const offset = (elementArg && elementArg.offset != null) ? elementArg.offset : 0;
            if (option && option.instance && (_gl instanceof WebGL2RenderingContext)) {
                const number = option.cnt || 1;
                _gl.drawElementsInstanced(this.drawType, cnt, type, offset, number);
            } else {
                _gl.drawElements(this.drawType, cnt, type, offset);
            }
        } else {
            let start = (arrayArg && arrayArg.start != null) ? arrayArg.start : 0;
            let cnt = (arrayArg && arrayArg.cnt != null) ? arrayArg.cnt : 0;
            if (option && option.instance && (_gl instanceof WebGL2RenderingContext)) {
                const number = option.cnt || 1;
                _gl.drawArraysInstanced(this.drawType, start, cnt, number);
            } else {
                _gl.drawArrays(this.drawType, start, cnt);
            }
        }
    }

    public dispose(): void {
        if (this.vao) {
            this.vao.dispose();
            this.vao = null;
        }
        const buffers = this.buffers;
        for (let key in buffers) {
            buffers[key].dispose();
        }
        this.buffers = {};
        this.uid = null;
        if (this.indexBuffer) {
            this.indexBuffer.dispose();
            this.indexBuffer = null;
        }
        this.uniqueBuffer = null;
    }
}