import { CONSTANT } from '../engine/constant';
import { Util } from '../util/util';

let uuid = 0;
export class BaseObject {
    public type: Symbol = CONSTANT.BASEOBJECT;
    public uid: string;
    protected _dirty: boolean = true;

    constructor() {
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    public dispose(): void {

    }
};