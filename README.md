# PlumeGL
基于WebGL2.0的羽量级实时渲染库，方便开发人员快速搭建3D场景，同时兼顾灵活性。<br>
已实现的特性：<br>
* 场景管理<br>
* 基本图元：点、线和网格<br>
* 基本几何：球、长方体<br>
* 基本光照：环境光、平行光、点光源、聚光灯<br>
* 光照模型：朗伯体光照、冯氏光照<br>
* 相机：透视和正交<br>
* 管线状态管理<br>
## 实例
### 使用方式
* 初始化shader<br>
```
const defaultLightShader = new PlumeGL.DefaultLightShader();
defaultLightShader.initParameters();
const basicLineShader = new PlumeGL.BasicLineShader();
basicLineShader.initParameters();
```
* 初始化场景以及状态<br>
```
const scene = new PlumeGL.Scene();
scene.add(defaultLightShader);
scene.add(basicLineShader);
scene.setSceneState(new PlumeGL.State());
scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);
scene.state.setClear(true, false, false);
scene.state.setDepthTest(true);
```
* 设置场景光源<br>
```
const ambientLight = new PlumeGL.AmbientLight();
ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
ambientLight.ambient = 0.25;
const parallelLight = new PlumeGL.ParallelLight();
parallelLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);
parallelLight.setDirection(new PlumeGL.Vec3(-2.0, -2.0, -2.0));
scene.addLight(ambientLight);
scene.addLight(parallelLight);
```
* 设置P3D对象，用于管理绘制物图元数据、纹理对象以及材质对象(self uniform)<br>
```
const mesh = new PlumeGL.Mesh();
mesh.setGeometryAttribute(vertices, defaultLightShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
mesh.setGeometryAttribute(normals, defaultLightShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);
mesh.setGeometryAttribute(uvs, defaultLightShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);
mesh.initBufferAttributePoint(defaultLightShader);
let p3d = new PlumeGL.P3D(mesh);
defaultLightShader.addDrawObject(p3d);
p3d.setSelfUniform(defaultLightShader.uniform.secStrength, [1.0]);
p3d.setSelfUniform(defaultLightShader.uniform.specPower, [2.0]);
p3d.setSelfUniform(defaultLightShader.uniform.color, [1.0, 0.2, 0.2]);
```
* 设置相机<br>
```
const camera = new PlumeGL.PerspectiveCamera();
camera.setPersective(fieldOfView, aspect, zNear, zFar);
camera.setView(
    new PlumeGL.Vec3(0.0, 0.0, 0.0),
    new PlumeGL.Vec3(0.0, 0.0, -100.0),
    new PlumeGL.Vec3(0.0, 1.0, 0.0));
camera.updateMat();<br>
scene.setActiveCamera(camera);
```
* 渲染<br>
```
scene.state.stateChange();
scene.forEachRender((shaderObj: any) => {
    shaderObj.forEachDraw((obj: any) => {
        obj.prepare();
        obj.draw();
        obj.unPrepare();
    });
});
```
运行示例：npm run develop <br>
### 示例：parallel light cube
![image](https://github.com/zhoumingyang/PlumeGL/blob/master/demoimage/parallellightcube.png)<br>
### 示例：ortho camera cube
![image](https://github.com/zhoumingyang/PlumeGL/blob/master/demoimage/orthocameracube.png)<br>
### 示例：texture sample
![image](https://github.com/zhoumingyang/PlumeGL/blob/master/demoimage/sampletexture.png)<br>
### 示例：fbo split
![image](https://github.com/zhoumingyang/PlumeGL/blob/master/demoimage/fbosplit.png)<br>
### 示例：buffer uniform
![image](https://github.com/zhoumingyang/PlumeGL/blob/master/demoimage/bufferuniform.png)<br>
### 示例：fbo multisample
![image](https://github.com/zhoumingyang/PlumeGL/blob/master/demoimage/multifbo.png)<br>