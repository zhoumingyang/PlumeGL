import { CONSTANT, STATE } from './constant';
import { GL, WGL, WGL2 } from './gl';

interface state {
    value: any,
    defalutValue?: any,
    setMark: boolean,
    stateName?: string,
    setFunction?: Function;
}

export class State {
    public gl: WGL | WGL2 = GL.gl;
    public type: Symbol = CONSTANT.STATE;
    public sceneClear: state;
    public viewport: state;
    public bufferClear: state;
    public colorClear: state;
    public colorMask: state;
    public depthTest: state;
    public depthMask: state;
    public depthFunc: state;
    public depthClear: state;
    public stencilTest: state;
    public rasterDiscard: state;
    public stencilMask: state;
    public stencilFunc: state;
    public stencilOp: state;
    public stencilClear: state;
    public cullFace: state;
    public polygonOffset: state;
    public blendTest: state;
    public blendFunc: state;
    public changeStates: any = {};
    public currentState: state = undefined;

    constructor(gl?: WGL | WGL2) {
        if (!gl) {
            gl = GL.gl;
        } else {
            this.gl = gl;
        }
        if (!this.gl) {
            console.error('no gl context', this.type);
            return;
        }
        //scene state
        this.sceneClear = {
            value: gl.COLOR_BUFFER_BIT,
            defalutValue: gl.COLOR_BUFFER_BIT,
            setMark: false,
            stateName: STATE.SCENECLEAR,
            setFunction: (option?: any) => {
                this.glClear(option);
            }
        };

        this.viewport = {
            value: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            defalutValue: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            setMark: false,
            stateName: STATE.VIEWPORT,
            setFunction: (option?: any) => {
                this.glViewPort(option);
            }
        };

        this.bufferClear = {
            value: {
                name: 'color',
                drawBuffer: 0,
                param: [0, 0, 0, 1.0],
            },
            defalutValue: {
                name: 'color',
                drawBuffer: 0,
                param: [0, 0, 0, 1.0],
            },
            stateName: STATE.BUFFERCLEAR,
            setMark: false,
            setFunction: (option?: any) => {
                this.glClearBuffer(option);
            }
        };

        //color buffer
        this.colorClear = {
            value: { r: 0, g: 0, b: 0, a: 0 },
            defalutValue: { r: 0, g: 0, b: 0, a: 0 },
            setMark: false,
            stateName: STATE.COLORCLERA,
            setFunction: (option?: any) => {
                this.glClearColor(option);
            }
        };

        this.colorMask = {
            value: { r: false, g: false, b: false, a: false },
            defalutValue: { r: false, g: false, b: false, a: false },
            setMark: false,
            stateName: STATE.COLORMASK,
            setFunction: (option?: any) => {
                this.glColorMask(option);
            }
        };

        //depth buffers
        this.depthTest = {
            value: true,
            defalutValue: true,
            setMark: false,
            stateName: STATE.DEPTHTEST,
            setFunction: (option?: any) => {
                this.glDepthTest(option);
            }
        };

        this.depthMask = {
            value: false,
            defalutValue: false,
            setMark: false,
            stateName: STATE.DEPTHMASK,
            setFunction: (option?: any) => {
                this.glDepthMask(option);
            }
        };

        this.depthFunc = {
            value: STATE.FUNC_LESSEQUAL,
            defalutValue: STATE.FUNC_LESSEQUAL,
            setMark: false,
            stateName: STATE.DEPTHFUNC,
            setFunction: (option?: any) => {
                this.glDepthFunc(option);
            }
        };

        this.depthClear = {
            value: 0,
            defalutValue: 0,
            setMark: false,
            stateName: STATE.DEPTHCLEAR,
            setFunction: (option?: any) => {
                this.glClearDepth(option);
            }
        };

        //stencil buffer
        this.stencilTest = {
            value: false,
            defalutValue: false,
            setMark: false,
            stateName: STATE.STENCILCLEAR,
            setFunction: (option?: any) => {
                this.glStencilTest(option);
            }
        };

        this.stencilMask = {
            value: 1,
            defalutValue: 1,
            setMark: false,
            stateName: STATE.STENCILMASK,
            setFunction: (option?: any) => {
                this.glStencilMask(option);
            }
        };

        this.stencilFunc = {
            value: {
                func: STATE.FUNC_ALWAYS,
                ref: 0,
                mask: 1
            },
            defalutValue: {
                func: STATE.FUNC_ALWAYS,
                ref: 0,
                mask: 1
            },
            setMark: false,
            stateName: STATE.STENCILFUNC,
            setFunction: (option?: any) => {
                this.glStencilFunc(option);
            }
        };

        this.stencilOp = {
            value: {
                fail: gl.KEEP,
                zfail: gl.KEEP,
                zpass: gl.KEEP
            },
            defalutValue: {
                fail: gl.KEEP,
                zfail: gl.KEEP,
                zpass: gl.KEEP
            },
            setMark: false,
            stateName: STATE.STENCILOP,
            setFunction: (option?: any) => {
                this.glStencilOp(option);
            }
        };

        this.stencilClear = {
            value: 0,
            defalutValue: 0,
            setMark: false,
            stateName: STATE.STENCILCLEAR,
            setFunction: (option?: any) => {
                this.glStencilClear(option);
            }
        };

        this.cullFace = {
            value: {
                able: true,
                mode: STATE.CULLFACE_BACK,
            },
            defalutValue: {
                able: true,
                mode: STATE.CULLFACE_BACK,
            },
            setMark: false,
            stateName: STATE.CULLFACE,
            setFunction: (option?: any) => {
                this.glCullFace(option);
            }
        };

        this.polygonOffset = {
            value: {
                able: false,
                factor: 0,
                units: 0,
            },
            defalutValue: {
                able: false,
                factor: 0,
                units: 0,
            },
            setMark: false,
            stateName: STATE.STENCILCLEAR,
            setFunction: (option?: any) => {
                this.glPolygonOffset(option);
            }
        };

        this.blendTest = {
            value: false,
            defalutValue: false,
            setMark: false,
            stateName: STATE.BLENDTEST,
            setFunction: (option?: any) => {
                this.glBlendTest(option);
            }
        };

        this.blendFunc = {
            value: STATE.FUNC_ADD,
            defalutValue: STATE.FUNC_ADD,
            setMark: false,
            stateName: STATE.BLENDFUNC,
            setFunction: (option?: any) => {
                this.glBlendFunc(option);
            }
        };

        this.rasterDiscard = {
            value: false,
            defalutValue: false,
            setMark: false,
            stateName: STATE.RASTERDISCARD,
            setFunction: (option?: any) => {
                this.glRasterDiscard(option);
            }
        };
    }

    public stateChange(stateName?: string): void {
        const changeStates = this.changeStates;
        if (!stateName) {
            for (let key in changeStates) {
                const curState: any = changeStates[key];
                if (curState.setMark) {
                    curState.setFunction();
                } else {
                    delete changeStates[key];
                }
            }
        } else {
            const curState: any = changeStates[stateName.toString()];
            if (curState.setMark) {
                curState.setFunction();
            } else {
                delete changeStates[stateName.toString()];
            }
        }
    }

    public change(): void {
        const curState = this.currentState;
        if (!curState) {
            return;
        }
        const stateName = curState.stateName;
        if (!stateName) {
            return;
        }
        this.stateChange(stateName);
    }

    public stateReset(): void {
        const changeStates = this.changeStates;
        for (let key in changeStates) {
            const curState: any = changeStates[key];
            if (curState.setMark) {
                curState.setFunction({ default: true });
            } else {
                delete changeStates[key];
            }
        }
    }

    public clone(): State {
        const _gl = this.gl;
        const newState = new State(_gl);
        for (let key in this) {
            const curState: any = this[key];
            if (curState.setFunction) {
                newState.setState(key, curState.value, curState.setMark);
            }
        }
        return newState;
    }

    public setState(name: string, value: any, setMark: boolean = true): void {
        let curState: any;
        // TODO:performence problem
        for (let key in this) {
            if (key === name) {
                curState = this[key];
                break;
            }
        }
        if (curState && curState.setFunction) {
            curState.setMark = setMark;
            if (typeof value === 'object') {
                if (value instanceof Array) {
                    curState.value = value.slice(0);
                } else {
                    curState.value = JSON.parse(JSON.stringify(value));
                }
            } else {
                curState.value = value;
            }
        }
    }

    public setMark(name: string, mark: boolean = false): void {
        let curState: any;
        // TODO:performence problem
        for (let key in this) {
            if (key === name) {
                curState = this[key];
                break;
            }
        }
        if (curState && curState.setFunction) {
            curState.setMark = mark;
        }
        if (mark === false) {
            delete this.changeStates[name.toString()];
        }
    }

    public resetAllMark(): void {
        for (let key in this) {
            const curState: any = this[key];
            if (curState && curState.setFunction) {
                curState.setMark = false;
            }
        }
        this.changeStates = {};
    }

    public restAllState(): void {
        for (let key in this) {
            const curState: any = this[key];
            if (curState && curState.setFunction) {
                if (curState.setMark === true) {
                    const value = curState.defalutValue;
                    if (typeof value === 'object') {
                        curState.value = JSON.parse(JSON.stringify(value));
                    } else {
                        curState.value = value;
                    }
                    curState.setMark = false;
                }
            }
        }
        this.changeStates = {};
    }

    private glClear(option?: any): void {
        const _gl = this.gl;
        const sceneClear = this.sceneClear;
        if (!sceneClear.setMark) {
            return;
        }
        const value = (option && option.default) ? sceneClear.defalutValue : sceneClear.value;
        _gl.clear(value);
    }

    private glViewPort(option?: any): void {
        const _gl = this.gl;
        const viewport = this.viewport;
        if (!viewport.setMark) {
            return;
        }
        const value = (option && option.default) ? viewport.defalutValue : viewport.value;
        _gl.viewport(value.x, value.y, value.width, value.height);
    }

    private glClearBuffer(option?: any): void {
        const _gl = this.gl;
        const bufferClear = this.bufferClear;
        if (!bufferClear.setMark) {
            return;
        }
        const value = (option && option.default) ? bufferClear.defalutValue : bufferClear.value;
        const name = value.name;
        const drawBuffer = value.drawBuffer;
        const param = value.param;
        //TODO much methods to be used we need consider
        if (_gl instanceof WebGL2RenderingContext) {
            switch (name) {
                case STATE.COLOR_BUFFER:
                    _gl.clearBufferfv(_gl.COLOR, drawBuffer, param);
                    break;
                case STATE.DEPTH_BUFFER:
                    break;
                case STATE.STENCIL_BUFFER:
                    break;
                case STATE.DEPTH_STENCIL_BUFFER:
                default:
                    break;
            }
        }
    }

    private glClearColor(option?: any): void {
        const _gl = this.gl;
        const colorClear = this.colorClear;
        if (!colorClear.setMark) {
            return;
        }
        const value = (option && option.default) ? colorClear.defalutValue : colorClear.value;
        _gl.clearColor(value.r, value.g, value.b, value.a);
    }

    private glColorMask(option?: any): void {
        const _gl = this.gl;
        const colorMask = this.colorMask;
        if (!colorMask.setMark) {
            return;
        }
        const value = (option && option.default) ? colorMask.defalutValue : colorMask.value;
        _gl.colorMask(value.r, value.g, value.b, value.a);
    }

    private glDepthTest(option?: any): void {
        const _gl = this.gl;
        const depthTest = this.depthTest;
        if (!depthTest.setMark) {
            return;
        }
        const value = (option && option.default) ? depthTest.defalutValue : depthTest.value;
        if (value) {
            this.stateEnbale(_gl.DEPTH_TEST);
        } else {
            this.stateDisable(_gl.DEPTH_TEST);
        }
    }

    private glDepthMask(option?: any): void {
        const _gl = this.gl;
        const depthMask = this.depthMask;
        if (!depthMask.setMark) {
            return;
        }
        const value = (option && option.default) ? depthMask.defalutValue : depthMask.value;
        _gl.depthMask(value);
    }

    private glDepthFunc(option?: any): void {
        const _gl = this.gl;
        const depthFunc = this.depthFunc;
        if (!depthFunc.setMark) {
            return;
        }
        const value = (option && option.default) ? depthFunc.defalutValue : depthFunc.value;
        switch (value) {
            case STATE.FUNC_NEVER:
                _gl.depthFunc(_gl.NEVER);
                break;
            case STATE.FUNC_ALWAYS:
                _gl.depthFunc(_gl.ALWAYS);
                break;
            case STATE.FUNC_LESS:
                _gl.depthFunc(_gl.LESS);
                break;
            case STATE.FUNC_LESSEQUAL:
                _gl.depthFunc(_gl.LEQUAL);
                break;
            case STATE.FUNC_GREATEREQUAL:
                _gl.depthFunc(_gl.GEQUAL)
                break;
            case STATE.FUNC_GREATER:
                _gl.depthFunc(_gl.GREATER);
                break;
            case STATE.FUNC_NOTEQUAL:
                _gl.depthFunc(_gl.NOTEQUAL);
                break;
            default:
                _gl.depthFunc(_gl.LEQUAL);
                break;
        }
    }

    private glClearDepth(option?: any): void {
        const _gl = this.gl;
        const depthClear = this.depthClear;
        if (!depthClear.setMark) {
            return;
        }
        const value = (option && option.default) ? depthClear.defalutValue : depthClear.value;
        _gl.clearDepth(value);
    }

    private glStencilTest(option?: any): void {
        const _gl = this.gl;
        const stencilTest = this.stencilTest;
        if (!stencilTest.setMark) {
            return;
        }
        const value = (option && option.default) ? stencilTest.defalutValue : stencilTest.value;
        if (value) {
            this.stateEnbale(_gl.STENCIL_TEST);
        } else {
            this.stateDisable(_gl.STENCIL_TEST);
        }
    }

    private glStencilMask(option?: any): void {
        const _gl = this.gl;
        const stencilMask = this.stencilMask;
        if (!stencilMask.setMark) {
            return;
        }
        const value = (option && option.default) ? stencilMask.defalutValue : stencilMask.value;
        _gl.stencilMask(value);
    }

    private glStencilFunc(option?: any): void {
        const _gl = this.gl;
        const stencilFunc = this.stencilFunc;
        if (!stencilFunc.setMark) {
            return;
        }
        const value = (option && option.default) ? stencilFunc.defalutValue : stencilFunc.value;
        const func = value.func;
        const ref = value.ref;
        const mask = value.mask;
        switch (func) {
            case STATE.FUNC_NEVER:
                _gl.stencilFunc(_gl.NEVER, ref, mask);
                break;
            case STATE.FUNC_ALWAYS:
                _gl.stencilFunc(_gl.ALWAYS, ref, mask);
                break;
            case STATE.FUNC_LESS:
                _gl.stencilFunc(_gl.LESS, ref, mask);
                break;
            case STATE.FUNC_LESSEQUAL:
                _gl.stencilFunc(_gl.LEQUAL, ref, mask);
                break;
            case STATE.FUNC_GREATEREQUAL:
                _gl.stencilFunc(_gl.GEQUAL, ref, mask)
                break;
            case STATE.FUNC_GREATER:
                _gl.stencilFunc(_gl.GREATER, ref, mask);
                break;
            case STATE.FUNC_EQUAL:
                _gl.stencilFunc(_gl.NOTEQUAL, ref, mask);
                break;
            default:
                _gl.stencilFunc(_gl.LEQUAL, ref, mask);
                break;
        }
    }

    private glStencilOp(option?: any) {
        const _gl = this.gl;
        const stencilOp = this.stencilOp;
        if (!stencilOp.setMark) {
            return;
        }
        const value = (option && option.default) ? stencilOp.defalutValue : stencilOp.value;
        const fail = value.fail;
        const zfail = value.zfail;
        const zpass = value.zpass;
        _gl.stencilOp(fail, zfail, zpass);
    }

    private glStencilClear(option?: any) {
        const _gl = this.gl;
        const stencilClear = this.stencilClear;
        if (!stencilClear.setMark) {
            return;
        }
        const value = (option && option.default) ? stencilClear.defalutValue : stencilClear.value;
        _gl.clearStencil(value);
    }

    private glCullFace(option?: any): void {
        const _gl = this.gl;
        const cullFace = this.cullFace;
        if (!cullFace.setMark) {
            return;
        }
        const value = (option && option.default) ? cullFace.defalutValue : cullFace.value;
        const able = value.able;
        const mode = value.mode;
        if (able) {
            this.stateEnbale(_gl.CULL_FACE);
            switch (mode) {
                case STATE.CULLFACE_FRONT:
                    _gl.cullFace(_gl.FRONT);
                    break;
                case STATE.CULLFACE_BACK:
                    _gl.cullFace(_gl.BACK);
                    break;
                case STATE.CULLFACE_FRONT_AND_BACK:
                    _gl.cullFace(_gl.FRONT_AND_BACK);
                    break;
                default:
                    break;
            }
        } else {
            this.stateDisable(_gl.CULL_FACE)
        }
    }

    private glPolygonOffset(option?: any): void {
        const _gl = this.gl;
        const polygonOffset = this.polygonOffset;
        if (!polygonOffset.setMark) {
            return;
        }
        const value = (option && option.default) ? polygonOffset.defalutValue : polygonOffset.value;
        const able = value.able;
        const factor = value.factor;
        const units = value.units;
        if (able) {
            this.stateEnbale(_gl.POLYGON_OFFSET_FILL);
            _gl.polygonOffset(factor, units);
        } else {
            this.stateDisable(_gl.POLYGON_OFFSET_FILL);
        }
    }

    private glBlendTest(option?: any): void {
        const _gl = this.gl;
        const blendTest = this.blendTest;
        if (!blendTest.setMark) {
            return;
        }
        const value = (option && option.default) ? blendTest.defalutValue : blendTest.value;
        if (value) {
            this.stateEnbale(_gl.BLEND);
        } else {
            this.stateDisable(_gl.BLEND);
        }
    }

    private glBlendFunc(option?: any): void {
        let _gl = this.gl;
        const blendFunc = this.blendFunc;
        if (!blendFunc.setMark) {
            return;
        }
        const value = (option && option.default) ? blendFunc.defalutValue : blendFunc.value;
        switch (value) {
            case STATE.FUNC_ADD:
                _gl.blendEquation(_gl.FUNC_ADD);
                break;
            case STATE.FUNC_SUBSTRACT:
                _gl.blendEquation(_gl.FUNC_SUBTRACT);
                break;
            case STATE.FUNC_REVERSESUBSTRACT:
                _gl.blendEquation(_gl.FUNC_REVERSE_SUBTRACT);
                break;
            case STATE.FUNC_MIN:
                if (_gl instanceof WebGL2RenderingContext) {
                    _gl.blendEquation(_gl.MIN);
                }
                break;
            case STATE.FUNC_MAX:
                if (_gl instanceof WebGL2RenderingContext) {
                    _gl.blendEquation(_gl.MAX);
                }
                break;
            default:
                _gl.blendEquation(_gl.FUNC_ADD);
                break;
        }
    }

    private glRasterDiscard(option?: any): void {
        const _gl: WebGL2RenderingContext = <WebGL2RenderingContext>this.gl;
        const rasterDiscard = this.rasterDiscard;
        if (!rasterDiscard.setMark) {
            return;
        }
        const value = (option && option.default) ? rasterDiscard.defalutValue : rasterDiscard.value;
        if (value) {
            this.stateEnbale(_gl.RASTERIZER_DISCARD);
        } else {
            this.stateDisable(_gl.RASTERIZER_DISCARD);
        }
    }

    private stateEnbale(id: number): void {
        const _gl = this.gl;
        _gl.enable(id);
    }

    private stateDisable(id: number): void {
        const _gl = this.gl;
        _gl.disable(id);
    }

    public setClear(color: boolean, depth: boolean, stencil: boolean): State {
        const _gl = this.gl;
        let bits = 0;
        if (color === undefined || color) bits |= _gl.COLOR_BUFFER_BIT;
        if (depth === undefined || depth) bits |= _gl.DEPTH_BUFFER_BIT;
        if (stencil === undefined || stencil) bits |= _gl.STENCIL_BUFFER_BIT;
        this.sceneClear.value = bits;
        this.sceneClear.setMark = true;
        this.changeStates[this.sceneClear.stateName] = this.sceneClear;
        this.currentState = this.sceneClear;
        return this;
    }

    public setViewPort(left: number, bottom: number, width: number, height: number): State {
        const viewport = this.viewport;
        const value = viewport.value;
        value.x = left;
        value.y = bottom;
        value.width = width;
        value.height = height;
        viewport.setMark = true;
        this.changeStates[viewport.stateName] = viewport;
        this.currentState = viewport;
        return this;
    }

    public setClearBuffer(name: string, drawBuffer: number, param: any): State {
        const bufferClear = this.bufferClear;
        const value = bufferClear.value;
        value.name = name;
        value.drawBuffer = drawBuffer;
        value.param = param;
        bufferClear.setMark = true;
        this.changeStates[bufferClear.stateName] = bufferClear;
        this.currentState = bufferClear;
        return this;
    }

    public setClearColor(r: number, g: number, b: number, a: number, option?: any): State {
        const colorClear = this.colorClear;
        if (option && option.multipliedAlpha) {
            r *= a;
            g *= a;
            b *= a;
        }
        const color = colorClear.value;
        color.r = r;
        color.g = g;
        color.b = b;
        color.a = a;
        this.colorClear.setMark = true;
        this.changeStates[colorClear.stateName] = colorClear;
        this.currentState = colorClear;
        return this;
    }

    public setColorMask(r: boolean = false, g: boolean = false, b: boolean = false, a: boolean = false): State {
        const colorMask = this.colorMask;
        const value = colorMask.value;
        value.r = r;
        value.g = g;
        value.b = b;
        value.a = a;
        this.colorMask.setMark = true;
        this.changeStates[colorMask.stateName] = colorMask;
        this.currentState = colorMask;
        return this;
    }

    public setDepthTest(test: boolean): State {
        const depthTest = this.depthTest;
        depthTest.value = test;
        depthTest.setMark = true;
        this.changeStates[depthTest.stateName] = depthTest;
        this.currentState = depthTest;
        return this;
    }

    public setDepthMask(mask: boolean): State {
        const depthMask = this.depthMask;
        depthMask.value = mask;
        depthMask.setMark = true;
        this.changeStates[depthMask.stateName] = depthMask;
        this.currentState = depthMask;
        return this;
    }

    public setDepthFunc(func: string): State {
        const depthFunc = this.depthFunc;
        depthFunc.value = func;
        depthFunc.setMark = true;
        this.changeStates[depthFunc.stateName] = depthFunc;
        this.currentState = depthFunc;
        return this;
    }

    public setDepthClear(clear: number): State {
        const depthClear = this.depthClear;
        depthClear.value = clear;
        depthClear.setMark = true;
        this.changeStates[depthClear.stateName] = depthClear;
        this.currentState = depthClear;
        return this;
    }

    public setStencilFunc(func: string, ref: number = 0, mask: number = 1): State {
        const stencilFunc = this.stencilFunc;
        const value = stencilFunc.value;
        value.func = func;
        value.ref = ref;
        value.mask = mask;
        stencilFunc.setMark = true;
        this.changeStates[stencilFunc.stateName] = stencilFunc;
        this.currentState = stencilFunc;
        return this;
    }

    public setStencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): State {
        const stencilOp = this.stencilOp;
        const value = stencilOp.value;
        value.fail = fail;
        value.zfail = zfail;
        value.zpass = zpass;
        stencilOp.setMark = true;
        this.changeStates[stencilOp.stateName] = stencilOp;
        this.currentState = stencilOp;
        return this;
    }

    public setStencilClear(clear: number): State {
        const stencilClear = this.stencilClear;
        stencilClear.value = clear;
        stencilClear.setMark = true;
        this.changeStates[stencilClear.stateName] = stencilClear;
        this.currentState = stencilClear;
        return this;
    }

    public setCullFace(able: boolean, mode: string): State {
        const cullFace = this.cullFace;
        cullFace.value.able = able;
        cullFace.value.mode = mode;
        cullFace.setMark = true;
        this.changeStates[cullFace.stateName] = cullFace;
        this.currentState = cullFace;
        return this;
    }

    public setPolygonOffset(able: boolean, factor: number, units: number): State {
        const polygonOffset = this.polygonOffset;
        polygonOffset.value.able = able;
        polygonOffset.value.factor = factor;
        polygonOffset.value.units = units;
        polygonOffset.setMark = true;
        this.changeStates[polygonOffset.stateName] = polygonOffset;
        this.currentState = polygonOffset;
        return this;
    }

    public setBlendTest(test: boolean): State {
        const blendTest = this.blendTest;
        blendTest.value = test;
        blendTest.setMark = true;
        this.changeStates[blendTest.stateName] = blendTest;
        this.currentState = blendTest;
        return this;
    }

    public setBlendFunc(func: string): State {
        const blendFunc = this.blendFunc;
        blendFunc.value = func;
        blendFunc.setMark = true;
        this.changeStates[blendFunc.stateName] = blendFunc;
        this.currentState = blendFunc;
        return this;
    }

    public setRasterDiscard(discard: boolean): State {
        const rasterDiscard = this.rasterDiscard;
        rasterDiscard.value = discard;
        rasterDiscard.setMark = true;
        this.changeStates[rasterDiscard.stateName] = rasterDiscard;
        this.currentState = rasterDiscard;
        return this;
    }
}