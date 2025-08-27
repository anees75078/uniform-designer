import { useState } from "react";
import { SvgUniformPreview } from "./SvgUniformPreview";
import { SvgColorCustomizer } from "./SvgColorCustomizer";
import { ViewSelector } from "./ViewSelector";
import { getDefaultColorsForView, getAllViews, getLayersForView } from "@/config/uniformLayers";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export const UniformDesigner = () => {
  const allViews = getAllViews();
  const [currentView, setCurrentView] = useState(allViews[0]?.id || 'shirt-front');
  const [colors, setColors] = useState(getDefaultColorsForView(currentView));
  
  // Get the first layer as default selected layer
  const currentLayers = getLayersForView(currentView);
  const [selectedLayer, setSelectedLayer] = useState(currentLayers[0]?.id || '');

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    const newColors = getDefaultColorsForView(viewId);
    setColors(newColors);
    
    // Update selected layer to first layer of new view
    const newLayers = getLayersForView(viewId);
    setSelectedLayer(newLayers[0]?.id || '');
  };

  const handleColorChange = (layerId: string, color: string) => {
    setColors(prev => ({
      ...prev,
      [layerId]: color
    }));
  };

  const resetColors = () => {
    setColors(getDefaultColorsForView(currentView));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 text-center mb-2">
            Uniform Designer
          </h1>
          <p className="text-sm sm:text-base text-slate-600 text-center max-w-2xl mx-auto">
            Customize your uniform with our interactive design tool. Change colors, add logos, and create text to make it uniquely yours.
          </p>
        </div>

        {/* View Selector - Full Width on Mobile, Sidebar on Desktop */}
        <div className="mb-6 sm:mb-8">
          <div className="lg:hidden">
            <ViewSelector 
              currentView={currentView} 
              onViewChange={handleViewChange}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Hidden on Mobile, Visible on Desktop */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* View Selector for Desktop */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Select View</h2>
                <ViewSelector 
                  currentView={currentView} 
                  onViewChange={handleViewChange}
                />
              </div>

              {/* Color Customizer */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Customize Colors</h2>
                  <Button 
                    onClick={resetColors} 
                    variant="outline" 
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <RotateCw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <SvgColorCustomizer
                  currentView={currentView}
                  colors={colors}
                  onColorChange={handleColorChange}
                  selectedLayer={selectedLayer}
                  onLayerSelect={setSelectedLayer}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9">
            {/* Mobile Color Customizer - Above Preview on Small Screens */}
            <div className="xl:hidden mb-6">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Customize Colors</h2>
                  <Button 
                    onClick={resetColors} 
                    variant="outline" 
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <RotateCw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                </div>
                <SvgColorCustomizer
                  currentView={currentView}
                  colors={colors}
                  onColorChange={handleColorChange}
                  selectedLayer={selectedLayer}
                  onLayerSelect={setSelectedLayer}
                />
              </div>
            </div>

            {/* Uniform Preview */}
            <SvgUniformPreview
              currentView={currentView}
              colors={colors}
              onColorChange={handleColorChange}
            />
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="xl:hidden mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">💡 Mobile Tips</h3>
            <p className="text-sm text-blue-700">
              Use the color picker above to customize your uniform. Tap and hold on the preview to zoom, and use two fingers to pan around.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};