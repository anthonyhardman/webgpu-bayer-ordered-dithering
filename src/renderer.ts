import type { WebGPUContext } from './webgpu-setup.js';
import type { TextureResources } from './texture-manager.js';
import { vertexShader, fragmentShader } from './shaders.js';

export interface UniformData {
  matrixSize: number;
  edgeWeight: number;
  imageBitmap: ImageBitmap;
  displayMode: number; // 0 = dithering, 1 = edges, 2 = original
}

export class Renderer {
  private device: GPUDevice;
  private context: GPUCanvasContext;
  private format: GPUTextureFormat;
  private pipeline: GPURenderPipeline;
  private uniformBuffer: GPUBuffer;
  private bindGroupLayout: GPUBindGroupLayout;
  private bindGroup!: GPUBindGroup;
  private vertexBuffer: GPUBuffer;
  private frameCount: number = 0;
  private isAnimating: boolean = false;

  constructor(webgpuContext: WebGPUContext, vertexBuffer: GPUBuffer) {
    this.device = webgpuContext.device;
    this.context = webgpuContext.context;
    this.format = webgpuContext.format;
    this.vertexBuffer = vertexBuffer;
    
    this.uniformBuffer = this.createUniformBuffer();
    this.bindGroupLayout = this.createBindGroupLayout();
    this.pipeline = this.createRenderPipeline();
  }

  private createUniformBuffer(): GPUBuffer {
    return this.device.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  private createBindGroupLayout(): GPUBindGroupLayout {
    return this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform",
          },
        },
      ],
    });
  }

  private createRenderPipeline(): GPURenderPipeline {
    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout],
    });

    return this.device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: this.device.createShaderModule({ code: vertexShader }),
        entryPoint: "main",
        buffers: [
          {
            arrayStride: 16,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: "float32x2",
              },
              {
                shaderLocation: 1,
                offset: 8,
                format: "float32x2",
              },
            ],
          },
        ],
      },
      fragment: {
        module: this.device.createShaderModule({ code: fragmentShader }),
        entryPoint: "main",
        targets: [{ format: this.format }],
      },
      primitive: {
        topology: "triangle-strip",
      },
    });
  }

  updateTexture(textureResources: TextureResources): void {
    this.bindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: textureResources.sampler,
        },
        {
          binding: 1,
          resource: textureResources.textureView,
        },
        {
          binding: 2,
          resource: { buffer: this.uniformBuffer },
        },
      ],
    });
  }

  private updateUniforms(uniformData: UniformData): void {
    const buffer = new ArrayBuffer(32);
    const u32View = new Uint32Array(buffer);
    const f32View = new Float32Array(buffer);

    u32View[0] = uniformData.matrixSize;
    u32View[1] = 0; // padding
    f32View[2] = 1 / uniformData.imageBitmap.width;
    f32View[3] = 1 / uniformData.imageBitmap.height;
    f32View[4] = uniformData.edgeWeight;
    f32View[5] = this.frameCount;
    u32View[6] = uniformData.displayMode;
    u32View[7] = 0; // padding

    this.device.queue.writeBuffer(this.uniformBuffer, 0, buffer);
  }

  render(uniformData: UniformData): void {
    this.updateUniforms(uniformData);

    const encoder = this.device.createCommandEncoder();
    const view = this.context.getCurrentTexture().createView();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    });

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.draw(4);
    pass.end();

    this.device.queue.submit([encoder.finish()]);
    this.frameCount++;
  }

  startAnimation(uniformData: UniformData): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    const animate = () => {
      if (!this.isAnimating) return;
      
      this.render(uniformData);
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }

  stopAnimation(): void {
    this.isAnimating = false;
  }
}