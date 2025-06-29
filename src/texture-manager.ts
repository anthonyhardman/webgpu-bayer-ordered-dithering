export interface TextureResources {
  texture: GPUTexture;
  textureView: GPUTextureView;
  sampler: GPUSampler;
}

export class TextureManager {
  private device: GPUDevice;

  constructor(device: GPUDevice) {
    this.device = device;
  }

  async loadImageTexture(imageSrc: string): Promise<{ imageBitmap: ImageBitmap; resources: TextureResources }> {
    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const imageBitmap = await createImageBitmap(img);
    const resources = this.createTextureFromBitmap(imageBitmap);

    return { imageBitmap, resources };
  }

  async loadFileTexture(file: File): Promise<{ imageBitmap: ImageBitmap; resources: TextureResources }> {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    const imageBitmap = await createImageBitmap(img);
    const resources = this.createTextureFromBitmap(imageBitmap);

    return { imageBitmap, resources };
  }

  createTextureFromBitmap(imageBitmap: ImageBitmap): TextureResources {
    const texture = this.device.createTexture({
      size: [imageBitmap.width, imageBitmap.height],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture: texture },
      [imageBitmap.width, imageBitmap.height]
    );

    const textureView = texture.createView();
    const sampler = this.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeW: "clamp-to-edge",
    });

    return { texture, textureView, sampler };
  }
}