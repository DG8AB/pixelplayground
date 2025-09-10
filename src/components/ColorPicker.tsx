import React from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  customPalette: string[];
  onAddCustomColor: (color: string) => void;
}

const defaultColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'];

const ColorPicker = ({ currentColor, onColorChange, customPalette, onAddCustomColor }: ColorPickerProps) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  const handleAddCustomColor = () => {
    if (!customPalette.includes(currentColor)) {
      onAddCustomColor(currentColor);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Current Color</h3>
      <div className="flex items-center space-x-4">
        <input
          type="color"
          value={currentColor}
          onChange={handleColorChange}
          className="w-16 h-16 p-0 border-none rounded-md overflow-hidden cursor-pointer"
          title="Choose a color"
        />
        <span className="text-xl font-medium text-gray-900 dark:text-gray-100 uppercase">{currentColor}</span>
      </div>

      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-2">Palette</h4>
        <div className="grid grid-cols-8 gap-2">
          {defaultColors.concat(customPalette).map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-sm border-2 ${currentColor === color ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} hover:scale-105 transition-transform`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
          <button
            onClick={handleAddCustomColor}
            className="w-8 h-8 rounded-sm border-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Add current color to palette"
            title="Add current color to palette"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
