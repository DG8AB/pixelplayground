import React from 'react';
import { CanvasCell } from '@/types/pixelArt';

interface CanvasGridProps {
  pixels: CanvasCell[];
  size: number;
  onPixelClick: (index: number) => void;
  onPixelDrag: (index: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

const CanvasGrid = React.memo(({ pixels, size, onPixelClick, onPixelDrag, onMouseDown, onMouseUp }: CanvasGridProps) => {
  const cellSize = 500 / size; // Max width 500px for the grid

  return (
    <div
      className="grid border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 touch-none"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: '500px', height: '500px' }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp} // End drawing if mouse leaves the canvas
    >
      {pixels.map((color, index) => (
        <div
          key={index}
          className="pixel border border-gray-200 dark:border-gray-600 hover:opacity-75 transition-opacity duration-75 ease-out"
          style={{ backgroundColor: color, width: cellSize, height: cellSize }}
          onClick={() => onPixelClick(index)}
          onMouseDown={() => onPixelClick(index)} // Allow immediate click for single pixel draw
          onMouseEnter={() => onPixelDrag(index)}
        />
      ))}
    </div>
  );
});

CanvasGrid.displayName = 'CanvasGrid';

export default CanvasGrid;
