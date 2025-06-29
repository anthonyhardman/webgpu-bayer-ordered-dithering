import { createIcons, Settings, Grid3x3, Upload, Zap, Info, Eye } from 'lucide';

export function initializeIcons(): void {
  createIcons({
    icons: {
      Settings,
      Grid3x3,
      Upload,
      Zap,
      Info,
      Eye,
    }
  });
}