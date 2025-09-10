"use client";

import { useState, useEffect, useCallback } from 'react';
import CanvasGrid from '@/components/CanvasGrid';
import ColorPicker from '@/components/ColorPicker';
import Toolbar from '@/components/Toolbar';
import { usePixelArt } from '@/hooks/usePixelArt';
import { exportCanvasAsPNG, generateRandomPixels } from '@/utils/pixelArtUtils';
import { useAuth } from '@/context/AuthContext';
import { CanvasCell, PixelArtProject } from '@/types/pixelArt';
import { v4 as uuidv4 } from 'uuid';

type Tool = 'draw' | 'erase' | 'fill';

export default function Home() {
  const { user } = useAuth();
  const [customPalette, setCustomPalette] = useState<string[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>('Untitled Project');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    size,
    pixels,
    currentColor,
    tool,
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
  } = usePixelArt({ initialSize: 16 });

  const handleAddCustomColor = (color: string) => {
    setCustomPalette((prev) => [...prev, color]);
  };

  const handleExport = () => {
    exportCanvasAsPNG(pixels, size);
  };

  const handleRandomize = useCallback(() => {
    const newPixels = generateRandomPixels(size);
    loadProject(newPixels, size);
  }, [size, loadProject]);

  const handleChallenge = () => {
    alert('Challenge Mode: Draw a Tree! (Feature coming soon)');
  };

  const handleToggleSize = useCallback((newSize: number) => {
    setCanvasSize(newSize);
    setCurrentProjectId(null); // Clear project when size changes
    setCurrentProjectName('Untitled Project');
  }, [setCanvasSize]);

  const saveProject = useCallback(async () => {
    if (!user) { alert('Please login to save your project.'); return; }

    const projectName = prompt('Enter project name:', currentProjectName);
    if (!projectName) return;

    setLoading(true);
    setError(null);
    const projectId = currentProjectId || uuidv4();

    const projectData: PixelArtProject = {
      id: projectId,
      name: projectName,
      username: user.username,
      size,
      pixels,
      createdAt: currentProjectId ? (Date.now() - 1000) : Date.now(), // Preserve creation time if existing
      updatedAt: Date.now(),
    };

    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) throw new Error('Failed to save project');

      const result = await res.json();
      setCurrentProjectId(result.projectId);
      setCurrentProjectName(projectName);
      alert('Project saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Error saving project.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, currentProjectId, currentProjectName, size, pixels]);

  const loadUserProjects = useCallback(async () => {
    if (!user) { alert('Please login to load your projects.'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/project?username=${user.username}`);
      if (!res.ok) throw new Error('Failed to fetch projects');

      const projects: PixelArtProject[] = await res.json();

      if (projects.length === 0) {
        alert('No projects found for your account.');
        return;
      }

      const projectList = projects.map(p => `${p.name} (Last saved: ${new Date(p.updatedAt).toLocaleDateString()})`).join('\n');
      const chosenProjectName = prompt(`Your projects:\n${projectList}\nEnter the name of the project to load:`);

      if (!chosenProjectName) return; // User cancelled

      const chosenProject = projects.find(p => p.name === chosenProjectName);
      if (chosenProject) {
        loadProject(chosenProject.pixels, chosenProject.size);
        setCurrentProjectId(chosenProject.id);
        setCurrentProjectName(chosenProject.name);
        alert(`Project '${chosenProject.name}' loaded.`);
      } else {
        alert('Project not found with that name.');
      }

    } catch (err: any) {
      setError(err.message || 'Error loading projects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, loadProject]);

  const handleShare = useCallback((projectId: string) => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Shareable link copied to clipboard: ${shareUrl}`);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-8 w-full max-w-7xl">
      <div className="flex flex-col items-center space-y-4 w-full lg:w-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4 text-center">Pixel Playground</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center max-w-md">Unleash your creativity with pixel art! Draw, erase, fill, and save your masterpieces.</p>
        
        <Toolbar
          currentTool={tool}
          setTool={setTool}
          onClear={clearCanvas}
          onUndo={undo}
          onRedo={redo}
          onExport={handleExport}
          onSave={saveProject}
          onLoad={loadUserProjects}
          onRandomize={handleRandomize}
          onChallenge={handleChallenge}
          onToggleSize={handleToggleSize}
          canvasSize={size}
          isLoggedIn={!!user}
          onShare={handleShare}
          currentProjectId={currentProjectId}
        />
      </div>

      <div className="flex flex-col items-center space-y-4">
        <CanvasGrid
          pixels={pixels}
          size={size}
          onPixelClick={handlePixelClick}
          onPixelDrag={handlePixelDrag}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
        />
        {loading && <p className="text-blue-500 dark:text-blue-400">Loading...</p>}
        {error && <p className="text-red-500 dark:text-red-400">Error: {error}</p>}
      </div>

      <div className="w-full lg:w-auto">
        <ColorPicker
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          customPalette={customPalette}
          onAddCustomColor={handleAddCustomColor}
        />
      </div>
    </div>
  );
}
