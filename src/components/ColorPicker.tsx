import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const colorPresets = [
  "#4A90E2", "#2C3E50", "#34495E", "#16A085", "#27AE60", "#2980B9",
  "#8E44AD", "#E74C3C", "#E67E22", "#F39C12", "#95A5A6", "#ECF0F1",
  "#34495E", "#7F8C8D", "#BDC3C7", "#E8F6F3", "#EBF5FB", "#FDF2E9"
];

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState(color);

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
    setCustomColor(presetColor);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Custom Color Input */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium text-foreground">Custom Color</label>
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-border cursor-pointer shadow-sm"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange(e.target.value);
            }}
            className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-border rounded-lg bg-background text-foreground text-xs sm:text-sm"
            placeholder="#4A90E2"
          />
        </div>
      </div>

      {/* Color Presets */}
      <div className="space-y-2">
        <label className="text-xs sm:text-sm font-medium text-foreground">Color Presets</label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 sm:gap-2">
          {colorPresets.map((presetColor, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`w-8 h-8 sm:w-12 sm:h-12 p-0 border-2 hover:scale-105 transition-transform ${
                color === presetColor ? 'ring-2 ring-primary ring-offset-1 sm:ring-offset-2' : ''
              }`}
              style={{ backgroundColor: presetColor }}
              onClick={() => handlePresetClick(presetColor)}
              title={presetColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};