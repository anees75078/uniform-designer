import { Card } from "@/components/ui/card";
import { ColorPicker } from "./ColorPicker";
import { getLayersForView } from "@/config/uniformLayers";

interface SvgColorCustomizerProps {
  currentView: string;
  colors: Record<string, string>;
  onColorChange: (layerId: string, color: string) => void;
  selectedLayer: string;
  onLayerSelect: (layerId: string) => void;
}

export const SvgColorCustomizer = ({ 
  currentView, 
  colors, 
  onColorChange, 
  selectedLayer, 
  onLayerSelect 
}: SvgColorCustomizerProps) => {
  
  // Get layers dynamically from configuration
  const layers = getLayersForView(currentView);

  return (
    <Card className="p-4 sm:p-6 bg-card shadow-medium">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">Customize Colors</h2>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3">Available Parts</h3>
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => onLayerSelect(layer.id)}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 transition-all ${
                  selectedLayer === layer.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 border-border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: colors[layer.id] || layer.defaultColor }}
                />
                <span className="font-medium text-sm sm:text-base truncate">{layer.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedLayer && (
          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-border">
            <h3 className="text-base sm:text-lg font-medium">
              Editing: {layers.find(l => l.id === selectedLayer)?.label}
            </h3>
            <ColorPicker
              color={colors[selectedLayer] || layers.find(l => l.id === selectedLayer)?.defaultColor || '#3b82f6'}
              onChange={(color) => onColorChange(selectedLayer, color)}
            />
          </div>
        )}
      </div>
    </Card>
  );
};