export interface ControlsState {
  matrixSize: number;
  edgeWeight: number;
}

export type ControlsUpdateCallback = (state: ControlsState) => void;
export type ImageUploadCallback = (file: File) => void;

export class UIControls {
  private state: ControlsState;
  private onUpdate: ControlsUpdateCallback;
  private onImageUpload: ImageUploadCallback;

  constructor(
    initialState: ControlsState,
    onUpdate: ControlsUpdateCallback,
    onImageUpload: ImageUploadCallback
  ) {
    this.state = { ...initialState };
    this.onUpdate = onUpdate;
    this.onImageUpload = onImageUpload;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.setupMatrixSizeControls();
    this.setupEdgeWeightControl();
    this.setupImageUploadControl();
  }

  private setupMatrixSizeControls(): void {
    document.querySelectorAll('input[name="matrixSize"]').forEach((radio) => {
      radio.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        const value = parseInt(target.value, 10);

        if (value === 2 || value === 4) {
          this.state.matrixSize = value;
          this.onUpdate(this.state);
        }
      });
    });
  }

  private setupEdgeWeightControl(): void {
    const edgeWeightInput = document.getElementById("edgeWeight") as HTMLInputElement;
    edgeWeightInput?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const value = parseFloat(target.value);
      this.state.edgeWeight = value;
      this.onUpdate(this.state);
    });
  }

  private setupImageUploadControl(): void {
    const imageInput = document.getElementById("imageInput") as HTMLInputElement;
    imageInput?.addEventListener("change", () => {
      const file = imageInput.files?.[0];
      if (file) {
        this.onImageUpload(file);
      }
    });
  }

  getState(): ControlsState {
    return { ...this.state };
  }
}