import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllViews } from "@/config/uniformLayers";

interface ViewSelectorProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const ViewSelector = ({ currentView, onViewChange }: ViewSelectorProps) => {
  const allViews = getAllViews();

  return (
    <Card className="p-4 sm:p-6 bg-card shadow-medium">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-center lg:text-left">
        Select View
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
        {allViews.map((view) => (
          <Button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            variant={currentView === view.id ? "default" : "outline"}
            className="w-full text-xs sm:text-sm lg:text-base py-2 sm:py-3 h-auto min-h-[40px] sm:min-h-[44px] lg:min-h-[48px]"
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">{view.label}</span>
              <span className="text-xs opacity-70 hidden sm:block">{view.uniformName}</span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};