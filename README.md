# PlumeGL
基于WebGL2.0的羽量级实时渲染库，方便开发人员快速搭建3D场景，同时兼顾灵活性。<br>
已实现的特性：<br>
* 场景管理<br>
* 基本图元：点、线和网格<br>
* 基本光照：环境光、平行光、点光源、聚光灯<br>
* 相机：透视和正交<br>
* 管线状态管理<br>
## 实例
### 使用方式
* 初始化shader<br>
const defaultLightShader = new PlumeGL.DefaultLightShader();<br>
defaultLightShader.initParameters();<br>
const basicLineShader = new PlumeGL.BasicLineShader();<br>
basicLineShader.initParameters();<br>
* 初始化场景以及状态<br>
const scene = new PlumeGL.Scene();<br>
scene.add(defaultLightShader);<br>
scene.add(basicLineShader);<br>
scene.setSceneState(new PlumeGL.State());<br>
scene.state.setClearColor(0.0, 0.0, 0.0, 1.0);<br>
scene.state.setClear(true, false, false);<br>
scene.state.setDepthTest(true);<br>
* 设置场景光源<br>
const ambientLight = new PlumeGL.AmbientLight();<br>
ambientLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);<br>
ambientLight.ambient = 0.25;<br>
const parallelLight = new PlumeGL.ParallelLight();<br>
parallelLight.color = new PlumeGL.Vec3(1.0, 1.0, 1.0);<br>
parallelLight.setDirection(new PlumeGL.Vec3(-2.0, -2.0, -2.0));<br>
scene.addLight(ambientLight);<br>
scene.addLight(parallelLight);<br>
* 设置P3D对象，用于管理绘制物图元数据、纹理对象以及材质对象(self uniform)<br>
const mesh = new PlumeGL.Mesh();<br>
mesh.setGeometryAttribute(vertices, defaultLightShader.positionAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);<br>
mesh.setGeometryAttribute(normals, defaultLightShader.normalAttribute, gl.STATIC_DRAW, 3, gl.FLOAT, false);<br>
mesh.setGeometryAttribute(uvs, defaultLightShader.uvAttribute, gl.STATIC_DRAW, 2, gl.FLOAT, false);<br>
mesh.initBufferAttributePoint(defaultLightShader);<br>
let p3d = new PlumeGL.P3D(mesh);<br>
defaultLightShader.addDrawObject(p3d);<br>
p3d.setSelfUniform(defaultLightShader.uniform.secStrength, [1.0]);<br>
p3d.setSelfUniform(defaultLightShader.uniform.specPower, [2.0]);<br>
p3d.setSelfUniform(defaultLightShader.uniform.color, [1.0, 0.2, 0.2]);<br>
* 设置相机<br>
const camera = new PlumeGL.PerspectiveCamera();<br>
camera.setPersective(fieldOfView, aspect, zNear, zFar);<br>
camera.setView(<br>
    new PlumeGL.Vec3(0.0, 0.0, 0.0),<br>
    new PlumeGL.Vec3(0.0, 0.0, -100.0),<br>
    new PlumeGL.Vec3(0.0, 1.0, 0.0));<br>
camera.updateMat();<br>
scene.setActiveCamera(camera);<br>
* 渲染<br>
scene.state.stateChange();<br>
scene.forEachRender((shaderObj: any) => {<br>
    shaderObj.forEachDraw((obj: any) => {<br>
        obj.prepare();<br>
        obj.draw();<br>
        obj.unPrepare();<br>
    });<br>
});<br>
### 示例：parallel light cube
### 示例：ortho camera cube
### 示例：texture sample
### 示例：fbo split
### 示例：buffer uniform
### 示例：fbo multisample
运行事例：npm run develop <br>
