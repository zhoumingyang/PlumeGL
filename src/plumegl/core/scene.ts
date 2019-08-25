import { Util } from '../util/util';
import { Shader } from './shader';
import { State } from './state';
import { CONSTANT } from '../engine/constant';
import { BaseLight } from '../light/baselight';
import { AmbientLight } from '../light/ambientlight';
import { PointLight } from '../light/pointlight';
import { ParallelLight } from '../light/parallellight';
import { SpotLight } from '../light/spotlight';

let uuid: number = 0;
export class Scene {
    private shaders: Map<string, Shader> = new Map();
    public state: State;
    public type: Symbol = CONSTANT.SCENE;
    public uid: string;
    public ambientLights: any;
    public pointLights: any;
    public parallelLights: any;
    public spotLights: any
    static MAX_AMBIENT_LIGHTS = 10;
    static MAX_PARALLEL_LIGHTS = 10;
    static MAX_POINT_LIGHTS = 10;
    static MAX_SPOT_LIGHTS = 10;

    constructor() {
        this.state = undefined;
        this.uid = Util.random13(13, uuid++);
        if (uuid >= 1000) uuid = 0;
        this.ambientLights = {};
        this.pointLights = {};
        this.parallelLights = {};
        this.spotLights = {};
    }

    public addLight(light: any): void {
        switch (true) {
            case light instanceof AmbientLight:
                this.ambientLights[light.uid] = light;
                break;
            case light instanceof ParallelLight:
                this.parallelLights[light.uid] = light;
                break;
            case light instanceof PointLight:
                this.pointLights[light.uid] = light;
                break;
            case light instanceof SpotLight:
                this.spotLights[light.uid] = light;
                break;
            default:
                break;
        }
    }

    public removeLight(arg: string | BaseLight): void {
        const key: string = (arg instanceof BaseLight) ? arg.uid : arg;
        delete this.ambientLights[key];
        delete this.parallelLights[key];
        delete this.pointLights[key];
        delete this.pointLights[key];
    }

    public initLights(shader: Shader): void {
        //init light uniform, for default shader color
        const ambientKeys: string[] = Object.keys(this.ambientLights);
        const ambientNum = ambientKeys.length > Scene.MAX_AMBIENT_LIGHTS ?
            Scene.MAX_AMBIENT_LIGHTS : ambientKeys.length;

        const parallelKeys: string[] = Object.keys(this.parallelLights);
        const parallelNum = parallelKeys.length > Scene.MAX_PARALLEL_LIGHTS ?
            Scene.MAX_AMBIENT_LIGHTS : parallelKeys.length;

        const pointKeys: string[] = Object.keys(this.pointLights);
        const pointNum = pointKeys.length > Scene.MAX_POINT_LIGHTS ?
            Scene.MAX_POINT_LIGHTS : pointKeys.length;

        const spotKeys: string[] = Object.keys(this.spotLights);
        const spotNum = spotKeys.length > Scene.MAX_SPOT_LIGHTS ?
            Scene.MAX_SPOT_LIGHTS : spotKeys.length;

        let key: string;

        shader.setUniformData(`uNumAmbientLight`, [ambientNum]);
        for (let i = 0; i < ambientNum; i++) {
            key = ambientKeys[i];
            const ambientLight = this.ambientLights[key];
            shader.setUniformData(`uAmbientLights[${i}].color`, [ambientLight.color[0], ambientLight.color[1], ambientLight.color[2]]);
            shader.setUniformData(`uAmbientLights[${i}].ambient`, [ambientLight.ambient]);
            shader.setUniformData(`uAmbientLights[${i}].diffuse`, [ambientLight.diffuse]);
        }

        shader.setUniformData(`uNumParallelLight`, [parallelNum]);
        for (let i = 0; i < parallelNum; i++) {
            key = parallelKeys[i];
            const parallelLight = this.parallelLights[key];
            shader.setUniformData(`uParallelLights[${i}].color`, [parallelLight.color[0], parallelLight.color[1], parallelLight.color[2]]);
            shader.setUniformData(`uSpotLights[${i}].direction`, [parallelLight.direction[0], parallelLight.direction[1], parallelLight.direction[2]]);
            shader.setUniformData(`uParallelLights[${i}].ambient`, [parallelLight.ambient]);
            shader.setUniformData(`uParallelLights[${i}].diffuse`, [parallelLight.diffuse]);
        }

        shader.setUniformData(`uNumPointLight`, [pointNum]);
        for (let i = 0; i < pointNum; i++) {
            key = pointKeys[i];
            const pointLight = this.pointLights[key];
            shader.setUniformData(`uPointLights[${i}].color`, [pointLight.color[0], pointLight.color[1], pointLight.color[2]]);
            shader.setUniformData(`uPointLights[${i}].ambient`, [pointLight.ambient]);
            shader.setUniformData(`uPointLights[${i}].diffuse`, [pointLight.diffuse]);
            shader.setUniformData(`uPointLights[${i}].position`, [pointLight.position[0], pointLight.position[1], pointLight.position[2]]);
            shader.setUniformData(`uPointLights[${i}].attenuation.constant`, [pointLight.attenuation.constant]);
            shader.setUniformData(`uPointLights[${i}].attenuation.linear`, [pointLight.attenuation.linear]);
            shader.setUniformData(`uPointLights[${i}].attenuation.exponent`, [pointLight.attenuation.exponent]);
        }

        shader.setUniformData(`uNumSpotLight`, [spotNum]);
        for (let i = 0; i < spotNum; i++) {
            key = spotKeys[i];
            const spotLight = this.spotLights[key];
            shader.setUniformData(`uSpotLights[${i}].color`, [spotLight.color[0], spotLight.color[1], spotLight.color[2]]);
            shader.setUniformData(`uSpotLights[${i}].ambient`, [spotLight.ambient]);
            shader.setUniformData(`uSpotLights[${i}].diffuse`, [spotLight.diffuse]);
            shader.setUniformData(`uSpotLights[${i}].position`, [spotLight.position[0], spotLight.position[1], spotLight.position[2]]);
            shader.setUniformData(`uSpotLights[${i}].direction`, [spotLight.direction[0], spotLight.direction[1], spotLight.direction[2]]);
            shader.setUniformData(`uSpotLights[${i}].attenuation.constant`, [spotLight.attenuation.constant]);
            shader.setUniformData(`uSpotLights[${i}].attenuation.linear`, [spotLight.attenuation.linear]);
            shader.setUniformData(`uSpotLights[${i}].attenuation.exponent`, [spotLight.attenuation.exponent]);
        }
    }

    public setSceneState(state: State): void {
        this.state = state;
    }

    public add(shaderObj: Shader): void {
        this.shaders.set(shaderObj.uid, shaderObj);
    }

    public remove(arg: string | Shader): void {
        const key: string = (arg instanceof Shader) ? arg.uid : arg;
        this.shaders.delete(key);
    }

    public forEachRender(callback: Function): void {
        this.shaders.forEach((shader: Shader, key: string) => {
            //TODO init lights uniform
            shader.use();
            this.initLights(shader);
            callback.call(this, shader, key);
            shader.unUse();
        });
    }

    public stateChange(name?: string): void {
        this.state.stateChange(name);
    }

    public dispose(): void {
        this.shaders.forEach((shader: Shader) => {
            shader.dispose3Ds();
            shader.dispose();
        });
        this.shaders.clear();
        this.shaders = new Map();
        this.state = undefined;
        this.ambientLights.clear();
        this.ambientLights = new Map();
        this.parallelLights.clear();
        this.parallelLights = new Map();
        this.pointLights.clear();
        this.pointLights = new Map();
        this.spotLights.clear();
        this.spotLights = new Map();
    }
}