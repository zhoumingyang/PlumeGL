import { Util } from '../util/util';
import { UniformFactory } from '../aid/uniform';
import { UniformBuffer } from '../buffer/uniformbuffer';
import { P3D } from '../core/p3d';
import { Primitive } from '../primitive/primitive';
import { CONSTANT } from '../engine/constant';
import { GL, WGL, WGL2 } from '../engine/gl';

interface UniformInfo {
    uniformName: string;
    uniformDefineName: string;
    defineArray: boolean;
    attribInfos: any[];
    type?: number;
    location?: WebGLUniformLocation;
    setter?: Function;
}

interface FeedBack {
    vars: string[],
    bufferMode: GLenum;
}

let uuid: number = 0;
export class Shader {
    public gl: WGL | WGL2 = GL.gl;
    private vertexShader: WebGLShader;
    private fragmentShader: WebGLShader;
    private readyState: boolean = false;
    public instance: WebGLProgram;
    public vertexSource: string;
    public fragmentSource: string;
    public uid: string;
    public attribsInfo: Map<string, GLint> = new Map();
    public uniformSetterMap: Map<string, Function> = new Map();
    public uniformLocationMap: Map<string, WebGLUniformLocation> = new Map();
    public uniformBufferMap: Map<string, UniformBuffer> = new Map();
    private _p3ds: Map<string, P3D | Primitive> = new Map();
    public type: Symbol = CONSTANT.SHADER;
    public fb: FeedBack;
    public selfUniform: any = undefined;
    public uniform: any = {};
    protected globalUniform: any = undefined;

    constructor(vertexSource?: string, fragmentSource?: string, fb?: FeedBack, gl?: WGL | WGL2, ) {
        this.gl = gl || this.gl;
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
        this.instance = this.gl.createProgram();
        this.fb = fb;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
        if (vertexSource !== undefined && fragmentSource !== undefined) {
            this.compileShader();
        }
    }

    public initSelfUniform(uniformObj?: any): void {
        this.selfUniform = uniformObj;
    }

    public initUniform(): void {
        if (!this.uniform) {
            this.uniform = {};
        }
        if (!Util.isEmptyObject(this.uniform)) {
            return;
        }
        if (!this.uniformSetterMap) {
            return;
        }
        this.uniformSetterMap.forEach((v: any, k: string) => {
            let uniformAttr = k;
            if (uniformAttr[0] === 'u') {
                let uniformArray: string[] = Array.from(uniformAttr.slice(1));
                uniformArray[0] = uniformArray[0].toLocaleLowerCase();
                uniformAttr = uniformArray.join('');
            }
            this.uniform[uniformAttr] = k;
        });
    }

    public setShaderSource(vertexSource?: string, fragmentSource?: string) {
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
    }

    public get p3ds() {
        return this._p3ds;
    }

    private compileSource(shaderSource: string, type: number): WebGLShader {
        const _gl: WGL | WGL2 = this.gl;
        const shader: WebGLShader = _gl.createShader(type);
        _gl.shaderSource(shader, shaderSource);
        _gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.warn('compile error: ' + _gl.getShaderInfoLog(shader));
            return undefined;
        }
        return shader;
    }

    public compileShader(): boolean {
        const vertexSource: string = this.vertexSource;
        const fragmentSource: string = this.fragmentSource;
        const _gl: WGL | WGL2 = this.gl;
        const _program: WebGLProgram = this.instance;
        this.vertexShader = this.compileSource(vertexSource, _gl.VERTEX_SHADER);
        this.fragmentShader = this.compileSource(fragmentSource, _gl.FRAGMENT_SHADER);
        this.vertexShader && _gl.attachShader(_program, this.vertexShader);
        this.fragmentShader && _gl.attachShader(_program, this.fragmentShader);
        if (this.fb && this.instance && (_gl instanceof WebGL2RenderingContext)) {
            _gl.transformFeedbackVaryings(this.instance, this.fb.vars, this.fb.bufferMode);
        }
        _gl.linkProgram(_program);
        if (!_gl.getProgramParameter(_program, _gl.LINK_STATUS)) {
            console.warn('link error: ' + _gl.getProgramInfoLog(_program));
            return false;
        }
        return true;
    }

    private parseUniformArrayLength(start: number, source: string): number {
        if (start < 0 || !source || !source.length) {
            return 0;
        }
        let i: number = start;
        let left: number = -1;
        let right: number = -1;
        for (let len = source.length; i < len; i++) {
            if (source[i] === '[') { left = i; }
            if (source[i] === ']') { right = i; }
            if (source[i] === ';') { break; }
        }
        if (left === -1 || right === -1) {
            console.warn(`error glsl source code: nearly ${start}`);
            return 0;
        }
        const lenString: string = source.substring(left + 1, right);
        const lenNumber = Number(lenString);
        if (isNaN(lenNumber)) {
            return lenNumber;
        }
        //TODO #define or const
        const lenStringIndex: number = source.indexOf(lenString);
        if (lenStringIndex < 0) {
            console.warn(`error glsl source code: no ${lenString}`);
            return 0;
        }
        return lenNumber;
    }

    private setArrayUniformVar(tmp: string, attribLen: number, attribInfos: any, source: string, test: string[]): void {
        for (let j = 0; j < attribLen; j++) {
            const attribInfo: any = attribInfos[j];
            const aName: string = attribInfo.name;
            const aIndex: number = source.indexOf(aName);
            if (aIndex < 0) { console.warn(`error glsl source code: no struct attrib var ${aName}`); continue; }
            const testLen: number = test.length;
            if (attribInfo.isArray) {
                const attribNameLen: number = this.parseUniformArrayLength(aIndex, source) || 0;
                if (testLen > 0) {
                    let newTest: string[] = [];
                    test.forEach((t: string) => {
                        for (let p = 0; p < attribNameLen; p++) {
                            newTest.push(`${t}.${aName}[${p}]`);
                        }
                    });
                    test = newTest;
                } else {
                    for (let p = 0; p < attribNameLen; p++) {
                        test.push(`${tmp}.${aName}[${p}]`);
                    }
                }
            } else {
                if (testLen > 0) {
                    test = test.map((t: string) => {
                        return `${t}.${name}`;
                    });
                } else {
                    test.push(`${tmp}.${aName}`);
                }
            }
        }
    }

    private parseUniformArrayVar(uniform: UniformInfo, source: string): string[] {
        if (!uniform || !source || !source.length) {
            return [];
        }
        const defineName: string = uniform.uniformDefineName;
        const attribInfos: any[] = uniform.attribInfos;
        const defineArray: boolean = uniform.defineArray;
        const find: number = source.indexOf(defineName);
        if (find < 0) {
            return [];
        }
        let defineNameLen: number = defineArray ? this.parseUniformArrayLength(find, source) : 0;
        let attribLen: number = attribInfos.length;
        let tmp: string = '';
        let finals: string[] = [];
        let test: string[] = [];
        if (defineNameLen > 0) {
            for (let i = 0; i < defineNameLen; i++) {
                tmp = `${defineName}[${i}]`;
                test = [];
                attribLen ? this.setArrayUniformVar(tmp, attribLen, attribInfos, source, test) : test.push(tmp);
                finals = finals.concat(test);
            }
        } else {
            tmp = `${defineName}`;
            this.setArrayUniformVar(tmp, attribLen, attribInfos, source, finals);
        }
        return finals;
    }

    private parseStructUniformVar(remainAttribName: string): any[] {
        if (!remainAttribName || !remainAttribName.length) {
            return [];
        }
        let isArray: boolean = false;
        let aIndex: number = -1;
        let pIndex: number = -1;
        let aName: string = '';
        const attribVarInfos: any[] = [];
        while ((remainAttribName && remainAttribName.length)) {
            pIndex = remainAttribName.indexOf('.');
            if (pIndex < 0) {
                aIndex = remainAttribName.indexOf('[');
                isArray = (aIndex >= 0) ? true : false;
                aName = isArray ? remainAttribName.substring(0, aIndex) : remainAttribName;
                attribVarInfos.push({
                    name: aName,
                    isArray
                });
                break;
            }
            const front: string = remainAttribName.substring(0, pIndex);
            aIndex = front.indexOf('[');
            isArray = (aIndex >= 0) ? true : false;
            aName = isArray ? front.substring(0, aIndex) : front;
            attribVarInfos.push({
                name: aName,
                isArray
            });
            remainAttribName = remainAttribName.substring(pIndex + 1);
        }
        return attribVarInfos;
    }

    public initParameters(): void {
        const _gl: WGL | WGL2 = this.gl;
        const _program: WebGLProgram = this.instance;
        let option: any = {
            texCnt: 0,
            ublockCnt: 0
        };

        //uniform init
        const uniformsCnt: number = _gl.getProgramParameter(_program, _gl.ACTIVE_UNIFORMS);
        for (let i: number = 0; i < uniformsCnt; i++) {
            const uniform = _gl.getActiveUniform(_program, i);
            if (uniform === undefined) {
                Util.errorCheck(_gl, { onlyFlush: true });
                continue;
            }
            let uniformVarName: string = uniform.name;
            const arraySymbol: number = uniformVarName.indexOf('[');
            const attribSymbol: number = uniformVarName.indexOf('.');
            if (arraySymbol >= 0) {
                // let uniformDefineName: string;
                // let defineArray: boolean = false;
                // let attribVarInfos: any[] = [];
                // if (attribSymbol > -1) {
                //     let tmpIndex = attribSymbol < arraySymbol ? attribSymbol : arraySymbol;
                //     if (arraySymbol < attribSymbol) { defineArray = true; }
                //     uniformDefineName = uniformVarName.substring(0, tmpIndex);
                //     let remainAttribName = uniformVarName.substring(attribSymbol + 1);
                //     attribVarInfos = this.parseStructUniformVar(remainAttribName);
                // } else {
                //     uniformDefineName = uniformVarName.substring(0, arraySymbol);
                //     defineArray = true;
                // }
                // let allUniformNames: string[] = [];
                // let allVerUniformNames: string[] = this.parseUniformArrayVar({
                //     uniformDefineName,
                //     uniformName: uniformVarName,
                //     attribInfos: attribVarInfos,
                //     defineArray
                // }, this.vertexSource);
                // let allFragUniformNames: string[] = this.parseUniformArrayVar({
                //     uniformDefineName,
                //     uniformName: uniformVarName,
                //     attribInfos: attribVarInfos,
                //     defineArray
                // }, this.fragmentSource);
                // allUniformNames = allVerUniformNames.concat(allFragUniformNames);
                // allUniformNames.forEach((uniformVarName: string) => {
                //     if (!this.uniformLocationMap.has(uniformVarName)) {
                //         const uniformLocation: WebGLUniformLocation = _gl.getUniformLocation(_program, uniformVarName);
                //         this.uniformLocationMap.set(uniformVarName, uniformLocation);
                //         const setterFunction: Function = UniformFactory.uniformSetter(uniform.type, uniformLocation, _gl, option);
                //         this.uniformSetterMap.set(uniformVarName, setterFunction);
                //     }
                // });
                //TODO: some performence problem here
            } else {
                // const uniformLocation: WebGLUniformLocation = _gl.getUniformLocation(_program, uniform.name);
                // if (uniformLocation !== undefined) {
                //     this.uniformLocationMap.set(uniformVarName, uniformLocation);
                //     const setterFunction: Function = UniformFactory.uniformSetter(uniform.type, uniformLocation, _gl, option);
                //     this.uniformSetterMap.set(uniformVarName, setterFunction);
                // }
            }
            const uniformLocation: WebGLUniformLocation = _gl.getUniformLocation(_program, uniform.name);
            if (uniformLocation !== undefined) {
                this.uniformLocationMap.set(uniformVarName, uniformLocation);
                const setterFunction: Function = UniformFactory.uniformSetter(uniform.type, uniformLocation, _gl, option);
                this.uniformSetterMap.set(uniformVarName, setterFunction);
            }
        }

        //attribute init
        const attribsCnt: number = _gl.getProgramParameter(_program, _gl.ACTIVE_ATTRIBUTES);
        for (let k = 0; k < attribsCnt; k++) {
            const attribName: string = _gl.getActiveAttrib(_program, k).name;
            const aLocation: GLint = _gl.getAttribLocation(_program, attribName);
            this.attribsInfo.set(attribName, aLocation);
        }

        //uniform block init
        if (_gl instanceof WebGL2RenderingContext && _gl.ACTIVE_UNIFORM_BLOCKS != undefined) {
            const blocksCnt = _gl.getProgramParameter(_program, _gl.ACTIVE_UNIFORM_BLOCKS);
            for (let j = 0; j < blocksCnt; j++) {
                const uniformBlockName: string = _gl.getActiveUniformBlockName(_program, j);
                const setterFunction: Function = UniformFactory.blockUniformSetter(j, _gl, _program, option);
                this.uniformSetterMap.set(uniformBlockName, setterFunction);
                this.uniformLocationMap.set(uniformBlockName, j);
            }
        }
        this.initUniform();
        this.readyState = true;
    }

    public setUniformBufferData(name: string, dataArray: any, drawType?: any, option?: any): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        if (!this.uniformLocationMap.has(name)) {
            return;
        }
        drawType = drawType || _gl.DYNAMIC_DRAW;
        const uniformBuffer = new UniformBuffer(drawType, _gl);
        uniformBuffer.setBufferData(dataArray, option);
        this.uniformBufferMap.set(name, uniformBuffer);
    }

    public changeUniformBufferSubData(name: string, dataArray: any, offset: number = 0): void {
        if (!this.uniformLocationMap.has(name)) {
            return;
        }
        const uniformBuffer = this.uniformBufferMap.get(name);
        uniformBuffer.setSubBufferData(dataArray, offset);
    }

    public bindBase(): void {
        this.uniformBufferMap.forEach((uniformBUffer: UniformBuffer, name: string) => {
            this.uniformSetterMap.get(name).call(UniformFactory, uniformBUffer.instance);
        });
    }

    public bindBaseByName(name: string): void {
        if (!this.uniformLocationMap.has(name)) {
            return;
        }
        const uniformBuffer = this.uniformBufferMap.get(name);
        this.uniformSetterMap.get(name).call(UniformFactory, uniformBuffer.instance);
    }

    public initGlobalUniformValues(uniformParams: any): void {

        if (!this.uniform || Util.isEmptyObject(this.uniform)) {
            return;
        }

        //将uniform变量归为4个部分
        //1. self uniform， 用于开发者设置，例如相关材质属性
        //2. matrix uniform，矩阵信息，由绘制物品本身以及camera决定
        //3. light uniform，由设置的光照决定
        //4. global uniform，需要全局设置的的uniform，不属于上述3者情况

        //该函数主要设置global uniform，由开发者决定哪些uniform变量是global类型
        //在render的时候会调用gl低层函数设置对应参数

        if (!this.globalUniform) {
            this.globalUniform = {};
        }

        for (let key in uniformParams) {
            if (!this.globalUniform[key]) {
                this.globalUniform[key] = {};
            }
            this.globalUniform[key].value = uniformParams[key];
        }
    }

    public setGlobalUniformValues(): void {

        if (!this.globalUniform || Util.isEmptyObject(this.globalUniform)) {
            return;
        }

        for (let key in this.globalUniform) {
            this.setUniformData(key, this.globalUniform[key].value);
        }
    }

    public setUniformData(name: string, arg: any[]): void {
        if (!name || !arg) {
            return;
        }
        const uniformSetterMap = this.uniformSetterMap;
        uniformSetterMap.has(name) && uniformSetterMap.get(name).call(UniformFactory, ...arg);
    }

    public use(): void {
        const _gl: WGL | WGL2 = this.gl;
        const _program: WebGLProgram = this.instance;
        if (!this.readyState) {
            this.initParameters();
        }
        _gl.useProgram(_program);
    }

    public unUse(): void {
        const _gl: WGL | WGL2 = this.gl;
        _gl && _gl.useProgram(null);
    }

    public addDrawObject(p3d: P3D | Primitive): void {
        this._p3ds.set(p3d.uid, p3d);
        if (p3d instanceof P3D) {
            p3d.shader = this;
        }
    }

    public forEachDraw(callback: Function): void {
        if (!this._p3ds) {
            return;
        }
        //sort p3ds by order
        const p3dArray = Array.from(this._p3ds.values());
        p3dArray.sort((a: P3D | Primitive, b: P3D | Primitive) => {
            return a.order - b.order;
        });
        p3dArray.forEach((p3d: P3D | Primitive, key: number) => {
            p3d.initSelfUniform(this);
            callback.call(this, p3d, key);
        });
    }

    public feedBackVary(varyings: string[], operation: number): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        _gl.transformFeedbackVaryings(this.instance, varyings, operation);
    }

    public clone() {

    }

    public dispose(): void {
        const _gl: WGL | WGL2 = this.gl;
        this.unUse();
        if (_gl) {
            _gl.deleteProgram(this.instance);
            _gl.deleteShader(this.vertexShader);
            _gl.deleteShader(this.fragmentShader);
        }
        this.uniformBufferMap.forEach((uniformBuffer) => {
            uniformBuffer.dispose();
        });
        this.vertexSource = null;
        this.fragmentSource = null;
        this.instance = null;
        this.attribsInfo = new Map();
        this.uniformLocationMap = new Map();
        this.uniformSetterMap = new Map();
        this.uniformBufferMap = new Map();
    }

    public dispose3D(arg: string | P3D | Primitive): void {
        const key: string = ((arg instanceof P3D) || (arg instanceof Primitive)) ? arg.uid : arg;
        this._p3ds.has(key) && this._p3ds.get(key).dispose();
        this._p3ds.delete(key);
    }

    public dispose3Ds(): void {
        this._p3ds.forEach((p3d: P3D | Primitive) => {
            p3d && p3d.dispose();
        });
        this._p3ds.clear();
        this._p3ds = new Map();
    }
}