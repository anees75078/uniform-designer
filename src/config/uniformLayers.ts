export interface UniformLayer {
  id: string;
  label: string;
  defaultColor: string;
  description?: string;
}

export interface UniformConfig {
  id: string;
  name: string;
  views: {
    [viewId: string]: {
      id: string;
      label: string;
      layers: UniformLayer[];
    };
  };
}

// =============================================================================
// 🎨 UNIFORM CONFIGURATION - UPDATE THIS SECTION FROM ADMIN INTERFACE
// =============================================================================
// 
// To update this configuration:
// 1. Go to http://localhost:8080/admin
// 2. Make your changes (add/edit/delete uniforms, views, layers)
// 3. Copy the generated configuration from the "Configuration Preview" section
// 4. Replace everything between the START and END markers below
// 5. Save the file - your changes will be reflected immediately!
//
// =============================================================================
// START: PASTE YOUR UPDATED CONFIGURATION HERE
// =============================================================================

// Configuration for different uniform types
export const uniformConfigs: UniformConfig[] = [
    {
      "id": "shirt",
      "name": "Shirt",
      "views": {
        "shirt-front": {
          "id": "shirt-front",
          "label": "Shirt Front",
          "layers": [
            {
              "id": "shirt-body-front",
              "label": "Shirt Body",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-collar-front",
              "label": "Collar",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-sleeves-front",
              "label": "Sleeves",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-cuffs-front",
              "label": "Cuffs",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-buttons-front",
              "label": "Buttons",
              "defaultColor": "#2C3E50"
            },
            {
              "id": "pocket-left",
              "label": "Left Pocket",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "pocket-right",
              "label": "Right Pocket",
              "defaultColor": "#4A90E2"
            }
          ]
        },
        "shirt-back": {
          "id": "shirt-back",
          "label": "Shirt Back",
          "layers": [
            {
              "id": "shirt-body-back",
              "label": "Shirt Body",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-collar-back",
              "label": "Collar",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-sleeves-back",
              "label": "Sleeves",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-cuffs-back",
              "label": "Cuffs",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "shirt-yoke-back",
              "label": "Yoke",
              "defaultColor": "#34495E"
            }
          ]
        }
      }
    },
    {
      "id": "pants",
      "name": "Pants",
      "views": {
        "pants-front": {
          "id": "pants-front",
          "label": "Pants Front",
          "layers": [
            {
              "id": "pants-body-front",
              "label": "Pants Body",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "pants-waistband-front",
              "label": "Waistband",
              "defaultColor": "#34495E"
            },
            {
              "id": "pants-pockets-front",
              "label": "Pockets",
              "defaultColor": "#34495E"
            },
            {
              "id": "pants-seams-front",
              "label": "Seams",
              "defaultColor": "#2C3E50"
            },
            {
              "id": "pants-zipper-front",
              "label": "Zipper",
              "defaultColor": "#2C3E50"
            }
          ]
        },
        "pants-back": {
          "id": "pants-back",
          "label": "Pants Back",
          "layers": [
            {
              "id": "pants-body-back",
              "label": "Pants Body",
              "defaultColor": "#4A90E2"
            },
            {
              "id": "pants-waistband-back",
              "label": "Waistband",
              "defaultColor": "#34495E"
            },
            {
              "id": "pants-pockets-back",
              "label": "Back Pockets",
              "defaultColor": "#34495E"
            },
            {
              "id": "pants-seams-back",
              "label": "Seams",
              "defaultColor": "#2C3E50"
            }
          ]
        }
      }
    }
  ];

// =============================================================================
// END: PASTE YOUR UPDATED CONFIGURATION HERE
// =============================================================================
// 
// ⚠️  IMPORTANT: Don't modify anything below this line!
//     The helper functions below are used by the app and should remain unchanged.
// =============================================================================

// Helper function to get all available views
export const getAllViews = () => {
  const views: { id: string; label: string; uniformName: string }[] = [];
  
  uniformConfigs.forEach(config => {
    Object.values(config.views).forEach(view => {
      views.push({
        id: view.id,
        label: view.label,
        uniformName: config.name
      });
    });
  });
  
  return views;
};

// Helper function to get layers for a specific view
export const getLayersForView = (viewId: string): UniformLayer[] => {
  for (const config of uniformConfigs) {
    for (const view of Object.values(config.views)) {
      if (view.id === viewId) {
        return view.layers;
      }
    }
  }
  return [];
};

// Helper function to get default colors for a view
export const getDefaultColorsForView = (viewId: string): Record<string, string> => {
  const layers = getLayersForView(viewId);
  const colors: Record<string, string> = {};
  
  layers.forEach(layer => {
    colors[layer.id] = layer.defaultColor;
  });
  
  return colors;
};

// Helper function to get all default colors for all views
export const getAllDefaultColors = (): Record<string, string> => {
  const colors: Record<string, string> = {};
  
  uniformConfigs.forEach(config => {
    Object.values(config.views).forEach(view => {
      view.layers.forEach(layer => {
        colors[layer.id] = layer.defaultColor;
      });
    });
  });
  
  return colors;
};
