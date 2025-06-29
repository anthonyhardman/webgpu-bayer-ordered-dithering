import "./style.css";
import { initializeWebGPU, createVertexBuffer } from './webgpu-setup.js';
import { TextureManager } from './texture-manager.js';
import { UIControls, type ControlsState } from './ui-controls.js';
import { Renderer, type UniformData } from './renderer.js';
import { initializeIcons } from './icons.js';

class App {
  private renderer!: Renderer;
  private textureManager!: TextureManager;
  private _controls!: UIControls; // Controls UI event listeners
  private currentImageBitmap!: ImageBitmap;
  private uniformData!: UniformData;

  async initialize(): Promise<void> {
    // Initialize icons first
    initializeIcons();
    
    const canvas = document.getElementById("gpu-canvas") as HTMLCanvasElement;
    const webgpuContext = await initializeWebGPU(canvas);
    const vertexBuffer = createVertexBuffer(webgpuContext.device);

    this.renderer = new Renderer(webgpuContext, vertexBuffer);
    this.textureManager = new TextureManager(webgpuContext.device);

    const { imageBitmap, resources } = await this.textureManager.loadImageTexture("pittsburgh.jpg");
    this.currentImageBitmap = imageBitmap;
    this.renderer.updateTexture(resources);

    const initialState: ControlsState = {
      matrixSize: 2,
      edgeWeight: 4,
      displayMode: 'dithering',
    };

    this.uniformData = {
      matrixSize: initialState.matrixSize,
      edgeWeight: initialState.edgeWeight,
      imageBitmap: this.currentImageBitmap,
      displayMode: this.getDisplayModeValue(initialState.displayMode),
    };

    this._controls = new UIControls(
      initialState,
      (state) => this.onControlsUpdate(state),
      (file) => this.onImageUpload(file)
    );
    void this._controls;

    this.renderer.startAnimation(this.uniformData);
  }

  private onControlsUpdate(state: ControlsState): void {
    this.uniformData.matrixSize = state.matrixSize;
    this.uniformData.edgeWeight = state.edgeWeight;
    this.uniformData.displayMode = this.getDisplayModeValue(state.displayMode);
  }

  private getDisplayModeValue(mode: 'dithering' | 'edges' | 'original'): number {
    switch (mode) {
      case 'dithering': return 0;
      case 'edges': return 1;
      case 'original': return 2;
      default: return 0;
    }
  }

  private async onImageUpload(file: File): Promise<void> {
    try {
      const { imageBitmap, resources } = await this.textureManager.loadFileTexture(file);
      this.currentImageBitmap = imageBitmap;
      this.uniformData.imageBitmap = imageBitmap;
      this.renderer.updateTexture(resources);
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  }
}

const app = new App();
app.initialize().catch(console.error);