# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Real-time WebGPU Bayer ordered dithering implementation
- Sobel edge detection with configurable strength
- Three display modes: Dithering, Edge Detection, and Original
- Support for 2×2 and 4×4 Bayer dithering matrices
- Image upload functionality for custom image processing
- Responsive dark theme UI with Tailwind CSS
- Lucide icons for enhanced visual design
- Modular TypeScript architecture
- Real-time parameter updates and smooth animations
- Purple-to-cyan color palette for enhanced visual appeal

### Changed
- Replaced basic Vite template with custom WebGPU application
- Updated project name from "webgpu-triangle" to "webgpu-bayer-ordered-dithering"
- Improved edge strength slider with minimum value of 1
- Enhanced UI with compact, professional design
- Made slider labels non-selectable for better UX

### Technical Details
- **WebGPU Setup**: Modular initialization with proper device and context management
- **Shader Architecture**: Separate vertex and fragment shaders with conditional rendering
- **Uniform Management**: Proper GPU buffer handling with correct memory alignment
- **Texture Handling**: Efficient image loading and GPU texture creation
- **Event System**: Callback-based UI controls with type-safe state management
- **Build System**: Vite configuration optimized for GitHub Pages deployment

### Infrastructure
- GitHub Actions workflow for automatic deployment to GitHub Pages
- Proper git history management and repository setup
- TypeScript configuration with strict type checking
- PostCSS integration with Tailwind CSS v4
- ESLint and build validation

## [Initial Release] - 2024-06-29

### Added
- Initial project setup with Vite + TypeScript
- Basic WebGPU triangle rendering example
- Project structure and development environment