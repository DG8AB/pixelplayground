import { CanvasCell } from '@/types/pixelArt';

export const exportCanvasAsPNG = (pixels: CanvasCell[], size: number, cellSize: number = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = size * cellSize;
  canvas.height = size * cellSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  for (let i = 0; i < pixels.length; i++) {
    const x = (i % size) * cellSize;
    const y = Math.floor(i / size) * cellSize;
    ctx.fillStyle = pixels[i];
    ctx.fillRect(x, y, cellSize, cellSize);
  }

  const dataURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `pixel-art-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateRandomPixels = (size: number): CanvasCell[] => {
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF', '#000000'];
  const newPixels: CanvasCell[] = [];
  for (let i = 0; i < size * size; i++) {
    newPixels.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  return newPixels;
};
