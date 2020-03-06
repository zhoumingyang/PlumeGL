import { CONSTANT } from '../engine/constant';
import { Stage } from './stage';
import { Util } from '../util/util';

let uuid: number = 0;
export class Pipeline {
    private name: String = '';
    private stages: Stage[];
    public uid: string;
    public type: Symbol = CONSTANT.PIPELINE;

    constructor(name?: String) {
        this.name = name;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
        this.stages = [];
    }

    public addStage(stage: Stage): void {
        this.stages.push(stage);
    }

    public removeStage(stage: Stage | String | number): void {
        if (typeof stage === "number") {
            this.stages.splice(stage, 1);
            return;
        }

        let index = -1;
        for (let i = 0, len = this.stages.length; i < len; i++) {
            if (stage instanceof Stage) {
                if (stage.uid === this.stages[i].uid) {
                    index = i;
                    break;
                }
            } else {
                if (stage === this.stages[i].uid) {
                    index = i;
                    break;
                }
            }
        }

        if (index !== -1) {
            this.stages.splice(index, 1);
        }
    }

    public render(): void {
        this.stages.forEach((stage: Stage) => {
            stage.render();
        });
    }

    public clear(): void {
        this.stages = [];
    }
}