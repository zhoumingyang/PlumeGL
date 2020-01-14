import { Util } from '../util/util';
import { Shader } from '../shader/shader';
import { State } from './state';
import { CONSTANT } from '../engine/constant';
import { BaseLight } from '../light/baselight';
import { AmbientLight } from '../light/ambientlight';
import { PointLight } from '../light/pointlight';
import { ParallelLight } from '../light/parallellight';
import { SpotLight } from '../light/spotlight';
import { Camera } from '../camera/camera';
import { Node } from './node';
import { P3D } from './p3d';
import { Mat4 } from '../math/mat4';
import { TYPE, ATTRIBUTE } from '../engine/constant';

let uuid: number = 0;
export class Scene {
    private shaders: Map<string, Shader> = new Map();
    public state: State;
    public type: Symbol = CONSTANT.SCENE;
    public uid: string;
    public ambientLights: any;
    public pointLights: any;
    public parallelLights: any;
    public spotLights: any;
    public activeCamera: Camera;
    public cameras: any;
    public rootNode: Node = new Node();
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
        this.cameras = {};
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

    public addCamera(camera: any): void {
        this.cameras[camera.uid] = camera;
    }

    public removeCamera(arg: string | Camera): void {
        const key: string = (arg instanceof Camera) ? arg.uid : arg;
        if (this.activeCamera && this.activeCamera.uid === key) {
            this.activeCamera = undefined;
        }
        delete this.cameras[key];
    }

    public setActiveCamera(camera: string | Camera): void {
        if (camera instanceof Camera) {
            this.activeCamera = camera;
            this.cameras[camera.uid] = camera;
        } else {
            const tmpCamera = this.cameras[camera];
            this.activeCamera = tmpCamera;
        }
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

        /**
         * struct AmbientLight {
         *      vec3 color;
         *      float ambient;
         * }
        */
        shader.setUniformData(`uNumAmbientLight`, [ambientNum]);
        for (let i = 0; i < ambientNum; i++) {
            key = ambientKeys[i];
            const ambientLight = this.ambientLights[key];
            shader.setUniformData(`uAmbientLights[${i}].color`, [ambientLight.color.value[0], ambientLight.color.value[1], ambientLight.color.value[2]]);
            shader.setUniformData(`uAmbientLights[${i}].ambient`, [ambientLight.ambient]);
            // shader.setUniformData(`uAmbientLights[${i}].diffuse`, [ambientLight.diffuse]);
        }

        /**
         * struct ParallelLight {
         *      vec3 color;
         *      vec3 direction;
         * }
        */
        shader.setUniformData(`uNumParallelLight`, [parallelNum]);
        for (let i = 0; i < parallelNum; i++) {
            key = parallelKeys[i];
            const parallelLight = this.parallelLights[key];
            shader.setUniformData(`uParallelLights[${i}].color`, [parallelLight.color.value[0], parallelLight.color.value[1], parallelLight.color.value[2]]);
            shader.setUniformData(`uParallelLights[${i}].direction`, [parallelLight.direction.value[0], parallelLight.direction.value[1], parallelLight.direction.value[2]]);
            // shader.setUniformData(`uParallelLights[${i}].ambient`, [parallelLight.ambient]);
            // shader.setUniformData(`uParallelLights[${i}].diffuse`, [parallelLight.diffuse]);
        }

        /**
         * struct PointLight {
         *      vec3 color;
         *      float diffuse;
         *      vec3 position;
         *      LightAttenuation attenuation;
         * }
        */
        shader.setUniformData(`uNumPointLight`, [pointNum]);
        for (let i = 0; i < pointNum; i++) {
            key = pointKeys[i];
            const pointLight = this.pointLights[key];
            shader.setUniformData(`uPointLights[${i}].color`, [pointLight.color.value[0], pointLight.color.value[1], pointLight.color.value[2]]);
            // shader.setUniformData(`uPointLights[${i}].ambient`, [pointLight.ambient]);
            shader.setUniformData(`uPointLights[${i}].diffuse`, [pointLight.diffuse]);
            shader.setUniformData(`uPointLights[${i}].position`, [pointLight.position.value[0], pointLight.position.value[1], pointLight.position.value[2]]);
            shader.setUniformData(`uPointLights[${i}].attenuation.constant`, [pointLight.attenuation.constant]);
            shader.setUniformData(`uPointLights[${i}].attenuation.linear`, [pointLight.attenuation.linear]);
            shader.setUniformData(`uPointLights[${i}].attenuation.exponent`, [pointLight.attenuation.exponent]);
        }

        /**
         * struct SpotLight {
         *      vec3 color;
         *      float diffuse;
         *      float cutoff;
         *      float coneCos;
         *      float penumbraCos;
         *      vec3 position;
         *      vec3 direction;
         *      LightAttenuation attenuation;
         * }
        */
        shader.setUniformData(`uNumSpotLight`, [spotNum]);
        for (let i = 0; i < spotNum; i++) {
            key = spotKeys[i];
            const spotLight = this.spotLights[key];
            shader.setUniformData(`uSpotLights[${i}].color`, [spotLight.color.value[0], spotLight.color.value[1], spotLight.color.value[2]]);
            // shader.setUniformData(`uSpotLights[${i}].ambient`, [spotLight.ambient]);
            shader.setUniformData(`uSpotLights[${i}].coneCos`, [spotLight.coneCos]);
            shader.setUniformData(`uSpotLights[${i}].penumbraCos`, [spotLight.penumbraCos]);
            shader.setUniformData(`uSpotLights[${i}].cutoff`, [spotLight.cutoff]);
            shader.setUniformData(`uSpotLights[${i}].diffuse`, [spotLight.diffuse]);
            shader.setUniformData(`uSpotLights[${i}].position`, [spotLight.position.value[0], spotLight.position.value[1], spotLight.position.value[2]]);
            shader.setUniformData(`uSpotLights[${i}].direction`, [spotLight.direction.value[0], spotLight.direction.value[1], spotLight.direction.value[2]]);
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

    public addChild(node: Node): void {
        this.rootNode.addChild(node);
    }

    public render(): void {
        //状态改变
        this.state.change();

        //矩阵更新同时转换到由shader管理
        this.rootNode.traverse((child: Node) => {
            child.updateWoldMatrix();
            if (child && child.p3d) {
                const drawObject = child.p3d;
                if (drawObject.shader && !drawObject.shader.p3ds.has(drawObject.uid)) {
                    drawObject.shader.addDrawObject(child.p3d);
                }
            }
        });

        this.forEachRender((shaderObj: Shader) => {
            if (!shaderObj) {
                return;
            }

            shaderObj.forEachDraw((drawObj: P3D) => {
                if (!drawObj) {
                    return;
                }
                const modelMatrix: Mat4 = drawObj.getModelMat();
                const modelViewMatrix: Mat4 = this.activeCamera.getModelViewMat(modelMatrix);
                const projectionMatrix: Mat4 = this.activeCamera.getProjectMat();
                if (shaderObj.uniform) {

                    if (shaderObj.uniform.modelMatrix) {
                        shaderObj.setUniformData(shaderObj.uniform.modelMatrix, [modelMatrix.value, false]);
                    }

                    if (shaderObj.uniform.modelViewMatrix) {
                        shaderObj.setUniformData(shaderObj.uniform.modelViewMatrix, [modelViewMatrix.value, false]);
                    }

                    if (shaderObj.uniform.projectionMatrix) {
                        shaderObj.setUniformData(shaderObj.uniform.projectionMatrix, [projectionMatrix.value, false]);
                    }
                }

                drawObj.prepare();
                if (drawObj.primitive.attributes[ATTRIBUTE.INDICES] && drawObj.primitive.attributes[ATTRIBUTE.INDICES].length) {
                    drawObj.draw(undefined, { cnt: drawObj.primitive.attributes[ATTRIBUTE.INDICES].length, type: TYPE.UNSIGNED_SHORT });
                } else if (drawObj.primitive.attributes[ATTRIBUTE.POSITION] && drawObj.primitive.attributes[ATTRIBUTE.POSITION].length) {
                    drawObj.draw({ start: 0, cnt: drawObj.primitive.attributes[ATTRIBUTE.POSITION].length / 3 });
                }
                drawObj.unPrepare();
            });
        });
    }

    public dispose(): void {
        this.shaders.forEach((shader: Shader) => {
            shader.dispose3Ds();
            shader.dispose();
        });
        this.shaders.clear();
        this.shaders = new Map();
        this.state = undefined;
        this.ambientLights = {};
        this.parallelLights = {};
        this.pointLights = {};
        this.spotLights = {};
        this.cameras = {};
    }
}