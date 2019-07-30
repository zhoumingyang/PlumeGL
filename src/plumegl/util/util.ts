export const Util = {

    errorCheck: (gl: WebGLRenderingContext, option?: any): void => {
        const err = gl.getError();
        if (err !== gl.NO_ERROR && (!option || (option && !option.onlyFlush))) {
            console.warn(err);
        }
    },

    random13: (len: number = 13, index?: number | string): string => {
        len = len > 13 ? 13 : len;
        const num: number = new Date().getTime();
        let timeId: string = num.toString().substring(13 - len);
        if (index === undefined) {
            return timeId;
        }
        if (typeof index === 'number') {
            timeId += index.toString();
        } else {
            timeId += index;
        }
        return timeId;
    },

    getTypeSize: (type: GLenum) => {
        switch (type) {
            case 0x1400: //gl.BYTE:
            case 0x1401: //gl.UNSIGNED_BYTE:
                return 1;
            case 0x1402: //gl.SHORT:
            case 0x1403: //gl.UNSIGNED_SHORT:
                return 2;
            case 0x1404: //gl.INT:
            case 0x1405: //gl.UNSIGNED_INT:
            case 0x1406: //gl.FLOAT:
                return 4;
            default:
                return 0;
        }
    }
};