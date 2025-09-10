"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasCell } from '@/types/pixelArt';

type Tool = 'draw' | 'erase' | 'fill';

interface UsePixelArtProps {
  initialSize?: number;
  initialPixels?: CanvasCell[];
  defaultColor?: string;
}

export const usePixelArt = ({ initialSize = 16, initialPixels, defaultColor = '#FFFFFF' }: UsePixelArtProps) => {
  const [size, setSize] = useState<number>(initialSize);
  const [pixels, setPixels] = useState<CanvasCell[]>(initialPixels || Array(initialSize * initialSize).fill(defaultColor));
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [tool, setTool] = useState<Tool>('draw');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const historyRef = useRef<CanvasCell[][]>([pixels]);
  const historyPointerRef = useRef<number>(0);

  useEffect(() => {
    // Reset history when pixels or size changes from external source (e.g., loading a project)
    if (pixels !== historyRef.current[historyPointerRef.current]) {
      historyRef.current = [pixels];
      historyPointerRef.current = 0;
    }
  }, [pixels, size]);

  const updateHistory = useCallback((newPixels: CanvasCell[]) => {
    const newHistory = historyRef.current.slice(0, historyPointerRef.current + 1);
    newHistory.push(newPixels);
    historyRef.current = newHistory;
    historyPointerRef.current = newHistory.length - 1;
    setPixels(newPixels);
  }, []);

  const handlePixelClick = useCallback((index: number) => {
    const newPixels = [...pixels];
    let colorToApply = currentColor;

    if (tool === 'erase') {
      colorToApply = defaultColor; // Eraser uses the default background color
    }

    if (tool === 'fill') {
      const targetColor = newPixels[index];
      if (targetColor === colorToApply) return;

      const queue: number[] = [index];
      const visited = new Set<number>();
      const newFillPixels = [...newPixels];
      const maxIndex = size * size;

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current) || current < 0 || current >= maxIndex || newFillPixels[current] !== targetColor) {
          continue;
        }

        visited.add(current);
        newFillPixels[current] = colorToApply;

        const row = Math.floor(current / size);
        const col = current % size;

        // Check neighbors
        if (col > 0) queue.push(current - 1); // Left
        if (col < size - 1) queue.push(current + 1); // Right
        if (row > 0) queue.push(current - size); // Up
        if (row < size - 1) queue.push(current + size); // Down
      }
      updateHistory(newFillPixels);
    } else if (newPixels[index] !== colorToApply) {
      newPixels[index] = colorToApply;
      updateHistory(newPixels);
    }
  }, [pixels, currentColor, tool, defaultColor, size, updateHistory]);

  const handlePixelDrag = useCallback((index: number) => {
    if (!isDrawing) return;
    const newPixels = [...pixels];
    let colorToApply = currentColor;

    if (tool === 'erase') {
      colorToApply = defaultColor;
    }

    if (newPixels[index] !== colorToApply) {
      newPixels[index] = colorToApply;
      // For performance during drag, only update history once drag ends.
      // Set pixels directly for immediate visual feedback.
      setPixels(newPixels);
    }
  }, [isDrawing, pixels, currentColor, tool, defaultColor]);

  const startDrawing = useCallback(() => {
    setIsDrawing(true);
  }, []);

  const endDrawing = useCallback(() => {
    if (isDrawing) {
      // When dragging ends, add the current state to history if it's different
      if (pixels !== historyRef.current[historyPointerRef.current]) {
        updateHistory(pixels);
      }
      setIsDrawing(false);
    }
  }, [isDrawing, pixels, updateHistory]);

  const clearCanvas = useCallback(() => {
    const newPixels = Array(size * size).fill(defaultColor);
    updateHistory(newPixels);
  }, [size, defaultColor, updateHistory]);

  const undo = useCallback(() => {
    if (historyPointerRef.current > 0) {
      historyPointerRef.current--;
      setPixels(historyRef.current[historyPointerRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyPointerRef.current < historyRef.current.length - 1) {
      historyPointerRef.current++;
      setPixels(historyRef.current[historyPointerRef.current]);
    }
  }, []);

  const setCanvasSize = useCallback((newSize: number) => {
    setSize(newSize);
    const newPixels = Array(newSize * newSize).fill(defaultColor);
    updateHistory(newPixels);
  }, [defaultColor, updateHistory]);

  const loadProject = useCallback((loadedPixels: CanvasCell[], loadedSize: number) => {
    setSize(loadedSize);
    setPixels(loadedPixels);
    historyRef.current = [loadedPixels]; // Reset history for loaded project
    historyPointerRef.current = 0;
  }, []);

  return {
    size,
    pixels,
    currentColor,
    tool,
    isDrawing,
    setCurrentColor,
    setTool,
    handlePixelClick,
    handlePixelDrag,
    startDrawing,
    endDrawing,
    clearCanvas,
    undo,
    redo,
    setCanvasSize,
    loadProject,
  };
};
