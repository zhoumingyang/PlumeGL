import { CONSTANT } from '../engine/constant';
import { Pass } from './pass';
import { Util } from '../util/util';

let uuid: number = 0;
export class Stage {
    private passes: Pass[];
    private name: String = '';
    public type: Symbol = CONSTANT.PASS;
    public uid: string;

    constructor(name?: String) {
        this.name = name;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
    }

    public addPass(pass: Pass) {
        this.passes.push(pass);
    }

    public removePass(pass: Pass | String | number): void {
        if (typeof pass === "number") {
            this.passes.splice(pass, 1);
            return;
        }

        let index = -1;
        for (let i = 0, len = this.passes.length; i < len; i++) {
            if (pass instanceof Pass) {
                if (pass.uid === this.passes[i].uid) {
                    index = i;
                    break;
                }
            } else {
                if (pass === this.passes[i].uid) {
                    index = i;
                    break;
                }
            }
        }

        if (index !== -1) {
            this.passes.splice(index, 1);
        }
    }

    public render(): void {
        this.passes.forEach((pass: Pass) => {
            pass.render();
        });
    }
}