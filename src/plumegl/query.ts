import { Util } from './util';
import { CONSTANT } from './constant';

let uuid: number = 0;
export class Query {
    public gl: WebGL2RenderingContext;
    public instance: WebGLQuery;
    public uid: string;
    public queryTarget: number;
    public type: Symbol;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.instance = gl.createQuery();
        this.type = CONSTANT.QUERY;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 10) uuid = 0;
    }

    setTarget(target: number) {
        this.queryTarget = target;
    }

    public begin(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.beginQuery(this.queryTarget, this.instance);
    }

    public end(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl.endQuery(this.queryTarget);
    }

    public getParam(type: number): void {
        const _gl: WebGL2RenderingContext = this.gl;
        if (!_gl.getQueryParameter(this.instance, _gl.QUERY_RESULT_AVAILABLE)) {
            return;
        }
        return _gl.getQueryParameter(this.instance, type);
    }

    public dispose(): void {
        const _gl: WebGL2RenderingContext = this.gl;
        _gl && _gl.deleteQuery(this.instance);
        this.instance = null;
        this.uid = null;
        this.queryTarget = null;
    }
}