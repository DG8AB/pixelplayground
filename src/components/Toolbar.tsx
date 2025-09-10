import React from 'react';
import { PaintBrushIcon, EraserIcon, PaintBucketIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, TrashIcon, PhotoIcon, PlusIcon, MinusIcon, CubeTransparentIcon, LightBulbIcon, ShareIcon } from '@heroicons/react/24/outline';
import { PaintBrushIcon as PaintBrushIconSolid, EraserIcon as EraserIconSolid, PaintBucketIcon as PaintBucketIconSolid } from '@heroicons/react/24/solid';

type Tool = 'draw' | 'erase' | 'fill';

interface ToolbarProps {
  currentTool: Tool;
  setTool: (tool: Tool) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onSave: () => void;
  onLoad: () => void;
  onRandomize: () => void;
  onChallenge: () => void;
  onToggleSize: (size: number) => void;
  canvasSize: number;
  isLoggedIn: boolean;
  onShare: (projectId: string) => void;
  currentProjectId: string | null;
}

const Toolbar = ({
  currentTool,
  setTool,
  onClear,
  onUndo,
  onRedo,
  onExport,
  onSave,
  onLoad,
  onRandomize,
  onChallenge,
  onToggleSize,
  canvasSize,
  isLoggedIn,
  onShare,
  currentProjectId,
}: ToolbarProps) => {
  const renderToolButton = (tool: Tool, IconOutline: React.ElementType, IconSolid: React.ElementType, label: string) => (
    <button
      key={tool}
      onClick={() => setTool(tool)}
      className={`p-2 rounded-md ${currentTool === tool ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center`} 
      title={label}
      aria-label={label}
    >
      {currentTool === tool ? <IconSolid className="h-6 w-6" /> : <IconOutline className="h-6 w-6" />}
    </button>
  );

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner w-full max-w-xs md:max-w-none">
      <div className="grid grid-cols-3 gap-2">
        {renderToolButton('draw', PaintBrushIcon, PaintBrushIconSolid, 'Draw')}
        {renderToolButton('erase', EraserIcon, EraserIconSolid, 'Erase')}
        {renderToolButton('fill', PaintBucketIcon, PaintBucketIconSolid, 'Fill')}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onUndo} className="toolbar-button" title="Undo"><ArrowUturnLeftIcon className="h-6 w-6" /></button>
        <button onClick={onRedo} className="toolbar-button" title="Redo"><ArrowUturnRightIcon className="h-6 w-6" /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onClear} className="toolbar-button bg-red-500 hover:bg-red-600 text-white" title="Clear Canvas"><TrashIcon className="h-6 w-6" /></button>
        <button onClick={onExport} className="toolbar-button" title="Export as PNG"><PhotoIcon className="h-6 w-6" /></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => onToggleSize(16)} className={`toolbar-button ${canvasSize === 16 ? 'bg-blue-600 text-white' : ''}`} title="16x16 Canvas">16x16</button>
        <button onClick={() => onToggleSize(32)} className={`toolbar-button ${canvasSize === 32 ? 'bg-blue-600 text-white' : ''}`} title="32x32 Canvas">32x32</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onRandomize} className="toolbar-button bg-purple-500 hover:bg-purple-600 text-white" title="Randomize Pixels"><CubeTransparentIcon className="h-6 w-6" /></button>
        <button onClick={onChallenge} className="toolbar-button bg-green-500 hover:bg-green-600 text-white" title="Challenge Mode"><LightBulbIcon className="h-6 w-6" /></button>
      </div>

      {isLoggedIn && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onSave} className="toolbar-button bg-indigo-500 hover:bg-indigo-600 text-white" title="Save Project">Save</button>
          <button onClick={onLoad} className="toolbar-button bg-indigo-500 hover:bg-indigo-600 text-white" title="Load Project">Load</button>
        </div>
      )}
      {isLoggedIn && currentProjectId && (
        <button onClick={() => onShare(currentProjectId)} className="toolbar-button bg-teal-500 hover:bg-teal-600 text-white mt-2" title="Share Project"><ShareIcon className="h-6 w-6" /> Share</button>
      )}
    </div>
  );
};

export default Toolbar;
