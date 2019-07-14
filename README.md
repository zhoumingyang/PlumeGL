# PlumeGL
 TypeScript构建的羽量级WebGL库，包含所有WebGL 2.0新增特性，快速搭建3D场景  
 |- webpack.config.js  
 |- package.json    
 |- .babelrc  
 |- .tsconfig.json  
 |- template.html  
 |- /src  
    |- /plumegl  
        |- arraybuffer.ts  
        |- constant.ts  
        |- framebuffer.ts  
        |- indexbuffer.ts  
        |- line.ts  
        |- mesh.ts  
        |- p3d.ts  
        |- plumegl.ts  
        |- point.ts  
        |- primitive.ts  
        |- renderbuffer.ts  
        |- sampler.ts  
        |- scene.ts  
        |- shader.ts  
        |- state.ts  
        |- texture.ts  
        |- texture2D.ts  
        |- texturecube.ts  
        |- uniform.ts  
        |- uniformbuffer.ts  
        |- util.st  
        |- vao.ts  
    |- /loader  
        |- imageloader.ts  
    |- /example  
  
采用gl标准的状态管理机制。场景管理每个program，program管理需要绘制的对象P3D或Primitive。  
绘制时设置整个场景的状态，遍历场景中每个program，通过program遍历所有draw objects更改u-  
niform或uniform buffer，绑定对应的buffer以及texture，调用draw进行绘制。  
Scene -- |- Shaders:[Shader, Shader, ...]  
         |- State  
Shader -- |- drawObjects:[P3D, Primitive, ...]  
          |- uniforms  
          |- UniformBuffer  
          |- attributes  
          |- program  
P3D -- |- Primitive: {Mesh, Line, Point}  
       |- Texture  
       |- State  
Primitive -- |- vao VAO  
             |- vbo ArrayBuffer    
             |- ibo IndexBuffer  
Texture -- |- Sampler  
FrameBuffer -- |- Texture  
               |- RenderBuffer  
  
绘制：  
Scene.stateChange  
Scene.forEachRender((Shader)=>{  
    Shader.use  
    Shader.forEachDrawObjects((obj)=>{  
        Shader.setUniform  
        obj.stateChange  
        obj.bindVao  
        obj.draw  
        obj.unBind  
    })  
})  

运行example：npm run develop   
