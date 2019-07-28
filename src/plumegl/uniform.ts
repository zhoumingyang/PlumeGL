import { WGL, WGL2 } from './gl';

const uniformMap: any = {
    5126: '1f',     //FLOAT
    35664: '2f',    //FLOAT_VEC2
    35665: '3f',    //FLOAT_VEC3
    35666: '4f',    //FLOAT_VEC4
    35670: '1i',    //BOOL
    5124: '1i',     //INT
    35678: '1i',    //SAMPLER_2D,
    35680: '1i',    //SAMPLER_CUBE
    35671: '2i',    //BOOL_VEC2
    35667: '2i',    //INT_VEC2
    35672: '3i',    //BOOL_VEC3
    35668: '3i',    //INT_VEC3
    35673: '4i',    //BOOL_VEC4
    35669: '4i',    //INT_VEC4
    35674: 'Matrix2f',  //FLOAT_MAT2
    35675: 'Matrix3f',  //FLOAT_MAT3
    35676: 'Matrix4f',  //FLOAT_MAT4
};

const glUniformFunction: Function = (funcName: string, gl: WGL | WGL2): Function => {

    const uniformFunctionMap: any = {
        'uniform1f': gl.uniform1f,
        'uniform2f': gl.uniform2f,
        'uniform3f': gl.uniform3f,
        'uniform4f': gl.uniform4f,
        'uniform1i': gl.uniform1i,
        'uniform2i': gl.uniform2i,
        'uniform3i': gl.uniform3i,
        'uniform4i': gl.uniform4i,
        'uniform1fv': gl.uniform1fv,
        'uniform2fv': gl.uniform2fv,
        'uniform3fv': gl.uniform3fv,
        'uniform4fv': gl.uniform4fv,
        'uniform1iv': gl.uniform1iv,
        'uniform2iv': gl.uniform2iv,
        'uniform3iv': gl.uniform3iv,
        'uniform4iv': gl.uniform4iv,
        'uniformMatrix2f': gl.uniformMatrix2fv,
        'uniformMatrix3f': gl.uniformMatrix3fv,
        'uniformMatrix4f': gl.uniformMatrix4fv,
    };

    return uniformFunctionMap[funcName];
}

export class UniformFactory {

    static uniformSetter(type: number, location: WebGLUniformLocation,
        gl: WGL | WGL2, option: any): Function {
        switch (type) {
            case gl.FLOAT_MAT2:
            case gl.FLOAT_MAT3:
            case gl.FLOAT_MAT4:
                return UniformFactory.matrixUniformSetter(type, location, gl, option);
            case gl.SAMPLER_2D:
            case gl.SAMPLER_CUBE:
                return UniformFactory.sampleUniformSetter(type, location, gl, option);
                break;
            default:
                if (gl instanceof WebGL2RenderingContext) {
                    if (type === gl.SAMPLER_2D_SHADOW || type === gl.SAMPLER_3D) {
                        return UniformFactory.sampleUniformSetter(type, location, gl, option);
                    }
                }
                return UniformFactory.oridinaryUniformSetter(type, location, gl, option);
        }
    }

    static oridinaryUniformSetter(type: number, location: WebGLUniformLocation,
        gl: WGL | WGL2, option: any): Function {
        const param: string = uniformMap[type];
        const funcName: string = `uniform${param}`;
        return function () {
            let setF: Function;
            if (arguments.length === 1 && arguments[0].length !== undefined) {
                setF = glUniformFunction(`${funcName}v`, gl);
                setF && setF(location, arguments[0]);
            } else if (arguments.length > 0) {
                setF = glUniformFunction(funcName, gl);
                setF && setF.apply(gl, Array.prototype.concat.apply(location, arguments));
            }
        };
    }

    static matrixUniformSetter(type: number, location: WebGLUniformLocation,
        gl: WGL | WGL2, option: any): Function {
        const param: string = uniformMap[type];
        const funcName: string = `uniform${param}`;
        return function () {
            let setF: Function;
            if (arguments.length > 0 && arguments[0].length !== undefined) {
                const transpose = (arguments.length > 1) ? !!arguments[1] : false;
                setF = glUniformFunction(funcName, gl);
                setF && setF.call(gl, location, transpose, arguments[0]);
            }
        };
    }

    static sampleUniformSetter(type: number, location: WebGLUniformLocation,
        gl: WGL | WGL2, option: any): Function {
        const unit: number = option.texCnt++;
        return function () {
            if (arguments.length === 1) {
                if (arguments[0].bind !== undefined) {
                    arguments[0].bind(unit);
                    gl.uniform1i(location, unit);
                } else {
                    gl.uniform1i(location, arguments[0]);
                }
            }
        };
    }

    static blockUniformSetter(index: number, gl: WGL2, program: WebGLProgram, option: any) {
        const unit = option.ublockCnt++;
        return function () {
            if (arguments.length === 1) {
                if (arguments[0] instanceof WebGLBuffer) {
                    gl.uniformBlockBinding(program, index, unit);
                    gl.bindBufferBase(gl.UNIFORM_BUFFER, unit, arguments[0]);
                } else {
                    gl.uniformBlockBinding(program, index, arguments[0]);
                }
            }
        };
    }
}