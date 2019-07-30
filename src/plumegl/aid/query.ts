import { Util } from '../util/util';
import { CONSTANT } from '../engine/constant';
import { GL, WGL2 } from '../engine/gl';

let uuid: number = 0;
export class Query {
    public gl: WGL2 = <WGL2>GL.gl;
    public instance: WebGLQuery;
    public uid: string;
    public queryTarget: number;
    public type: Symbol = CONSTANT.QUERY;

    constructor(gl?: WGL2) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.instance = this.gl.createQuery();
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    setTarget(target: number) {
        this.queryTarget = target;
    }

    public begin(): void {
        const _gl: WGL2 = this.gl;
        _gl.beginQuery(this.queryTarget, this.instance);
    }

    public end(): void {
        const _gl: WGL2 = this.gl;
        _gl.endQuery(this.queryTarget);
    }

    public getParam(type: number): void {
        const _gl: WGL2 = this.gl;
        if (!_gl.getQueryParameter(this.instance, _gl.QUERY_RESULT_AVAILABLE)) {
            return;
        }
        return _gl.getQueryParameter(this.instance, type);
    }

    public dispose(): void {
        const _gl: WGL2 = this.gl;
        _gl && _gl.deleteQuery(this.instance);
        this.instance = null;
        this.uid = null;
        this.queryTarget = null;
    }
}