# WebGPU Bayer Ordered Dithering

A real-time image processing application that demonstrates Bayer ordered dithering with Sobel edge detection using WebGPU. Built with TypeScript, Vite, and Tailwind CSS.

## ✨ Features

- **Real-time WebGPU rendering** with custom shaders
- **Bayer ordered dithering** with 2×2 and 4×4 matrix options
- **Sobel edge detection** for enhanced dithering effects
- **Three display modes**:
  - Dithering with edge enhancement
  - Edge detection visualization
  - Original image preview
- **Interactive controls** for matrix size and edge strength
- **Image upload** support for custom images
- **Responsive dark theme** UI with modern design
- **Smooth animations** and real-time parameter updates

## 🚀 Live Demo

Visit the live demo: [https://anthonyhardman.github.io/webgpu-bayer-ordered-dithering/](https://anthonyhardman.github.io/webgpu-bayer-ordered-dithering/)

## 🛠️ Technology Stack

- **WebGPU** - GPU-accelerated rendering and compute
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library

## 🏗️ Architecture

The application is built with a modular architecture:

- `webgpu-setup.ts` - WebGPU initialization and vertex buffer creation
- `shaders.ts` - Vertex and fragment shader definitions
- `texture-manager.ts` - Image loading and texture management
- `ui-controls.ts` - UI event handling with callbacks
- `renderer.ts` - Render pipeline and animation loop
- `main.ts` - Application orchestration

## 🎨 How It Works

### Bayer Ordered Dithering
Uses predefined threshold matrices (2×2 or 4×4) to create dithering patterns that simulate grayscale images with binary colors.

### Sobel Edge Detection
Applies a 3×3 convolution kernel to detect edges in the image, which are then used to enhance the dithering effect by preserving edge details.

### Color Palette
Features a cyberpunk-inspired purple-to-cyan color scheme that creates visually striking results.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- A WebGPU-compatible browser (Chrome 113+, Firefox 110+)

### Installation

```bash
# Clone the repository
git clone https://github.com/anthonyhardman/webgpu-bayer-ordered-dithering.git
cd webgpu-bayer-ordered-dithering

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎮 Usage

1. **Select Dither Matrix**: Choose between 2×2 or 4×4 Bayer matrices
2. **Upload Image**: Click "Upload Image" to process your own images
3. **Choose Display Mode**:
   - **Dithering**: See the full effect with edge-enhanced dithering
   - **Edge Detection**: Visualize detected edges in color
   - **Original**: View the unprocessed source image
4. **Adjust Edge Strength**: Use the slider to control edge detection intensity

## 🌟 Browser Support

Requires a WebGPU-enabled browser:
- Chrome 113+ (stable)
- Firefox 110+ (with `dom.webgpu.enabled` flag)
- Safari Technology Preview

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.