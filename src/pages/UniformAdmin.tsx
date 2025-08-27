import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Palette,
  Layers
} from "lucide-react";
import { 
  UniformConfig, 
  UniformLayer, 
  uniformConfigs as defaultConfigs 
} from "@/config/uniformLayers";

const UniformAdmin = () => {
  const [configs, setConfigs] = useState<UniformConfig[]>(defaultConfigs);
  const [editingConfig, setEditingConfig] = useState<UniformConfig | null>(null);
  const [editingView, setEditingView] = useState<string | null>(null);
  const [editingLayer, setEditingLayer] = useState<UniformLayer | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Form states for new items
  const [newConfig, setNewConfig] = useState({
    id: '',
    name: '',
    viewId: '',
    viewLabel: '',
    layerId: '',
    layerLabel: '',
    layerColor: '#4A90E2'
  });

  const handleSaveConfig = () => {
    if (!editingConfig) return;

    const updatedConfigs = configs.map(config => 
      config.id === editingConfig.id ? editingConfig : config
    );
    setConfigs(updatedConfigs);
    setEditingConfig(null);
    toast.success('Configuration saved successfully!');
  };

  const handleAddView = (configId: string) => {
    if (!newConfig.viewId || !newConfig.viewLabel) {
      toast.error('Please fill in view ID and label');
      return;
    }

    const config = configs.find(c => c.id === configId);
    if (!config) return;

    if (config.views[newConfig.viewId]) {
      toast.error('View ID already exists');
      return;
    }

    const updatedConfig = {
      ...config,
      views: {
        ...config.views,
        [newConfig.viewId]: {
          id: newConfig.viewId,
          label: newConfig.viewLabel,
          layers: []
        }
      }
    };

    setConfigs(configs.map(c => c.id === configId ? updatedConfig : c));
    setNewConfig({ ...newConfig, viewId: '', viewLabel: '' });
    toast.success('View added successfully!');
  };

  const handleAddLayer = (configId: string, viewId: string) => {
    if (!newConfig.layerId || !newConfig.layerLabel) {
      toast.error('Please fill in layer ID and label');
      return;
    }

    const config = configs.find(c => c.id === configId);
    if (!config) return;

    const view = config.views[viewId];
    if (!view) return;

    if (view.layers.find(l => l.id === newConfig.layerId)) {
      toast.error('Layer ID already exists in this view');
      return;
    }

    const newLayer: UniformLayer = {
      id: newConfig.layerId,
      label: newConfig.layerLabel,
      defaultColor: newConfig.layerColor
    };

    const updatedView = {
      ...view,
      layers: [...view.layers, newLayer]
    };

    const updatedConfig = {
      ...config,
      views: {
        ...config.views,
        [viewId]: updatedView
      }
    };

    setConfigs(configs.map(c => c.id === configId ? updatedConfig : c));
    setNewConfig({ ...newConfig, layerId: '', layerLabel: '', layerColor: '#4A90E2' });
    toast.success('Layer added successfully!');
  };

  const handleDeleteConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this uniform configuration?')) {
      setConfigs(configs.filter(c => c.id !== configId));
      toast.success('Configuration deleted successfully!');
    }
  };

  const handleDeleteView = (configId: string, viewId: string) => {
    if (confirm('Are you sure you want to delete this view?')) {
      const config = configs.find(c => c.id === configId);
      if (!config) return;

      const { [viewId]: deleted, ...remainingViews } = config.views;
      const updatedConfig = { ...config, views: remainingViews };

      setConfigs(configs.map(c => c.id === configId ? updatedConfig : c));
      toast.success('View deleted successfully!');
    }
  };

  const handleDeleteLayer = (configId: string, viewId: string, layerId: string) => {
    if (confirm('Are you sure you want to delete this layer?')) {
      const config = configs.find(c => c.id === configId);
      if (!config) return;

      const view = config.views[viewId];
      if (!view) return;

      const updatedView = {
        ...view,
        layers: view.layers.filter(l => l.id !== layerId)
      };

      const updatedConfig = {
        ...config,
        views: {
          ...config.views,
          [viewId]: updatedView
        }
      };

      setConfigs(configs.map(c => c.id === configId ? updatedConfig : c));
      toast.success('Layer deleted successfully!');
    }
  };

  const handleExportConfig = () => {
    const configString = JSON.stringify(configs, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uniform-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Configuration exported successfully!');
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setConfigs(imported);
        toast.success('Configuration imported successfully!');
      } catch (error) {
        toast.error('Invalid configuration file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🎨 Uniform Configuration Admin
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manage your uniform configurations visually. Add, edit, and organize uniforms, views, and layers without touching code.
          </p>
        </div>

        {/* Action Bar */}
        <Card className="p-6 mb-6 bg-white shadow-lg">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleExportConfig} variant="outline">
                Export Config
              </Button>
              <Label htmlFor="import-config" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Import Config</span>
                </Button>
                <Input
                  id="import-config"
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                />
              </Label>
            </div>
          </div>
        </Card>

        {/* Configuration List */}
        <div className="space-y-6">
          {configs.map((config) => (
            <Card key={config.id} className="p-6 bg-white shadow-lg">
              {/* Config Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{config.name}</h2>
                    <p className="text-sm text-slate-500">ID: {config.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingConfig(config)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteConfig(config.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Views */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">Views</h3>
                  <Button
                    onClick={() => setEditingView(config.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add View
                  </Button>
                </div>

                {Object.values(config.views).map((view) => (
                  <Card key={view.id} className="p-4 bg-slate-50 border border-slate-200">
                    {/* View Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-green-600" />
                        <h4 className="font-semibold text-slate-700">{view.label}</h4>
                        <span className="text-sm text-slate-500">({view.id})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingLayer(`${config.id}-${view.id}`)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Layer
                        </Button>
                        <Button
                          onClick={() => handleDeleteView(config.id, view.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Layers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {view.layers.map((layer) => (
                        <div
                          key={layer.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
                        >
                          <div
                            className="w-4 h-4 rounded border-2 border-slate-300"
                            style={{ backgroundColor: layer.defaultColor }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-slate-700 truncate">
                              {layer.label}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {layer.id}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteLayer(config.id, view.id, layer.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Add New Config Form */}
        <Card className="p-6 mt-8 bg-white shadow-lg">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Add New Uniform Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-config-id">Uniform ID</Label>
              <Input
                id="new-config-id"
                placeholder="e.g., jacket, cap, shoes"
                value={newConfig.id}
                onChange={(e) => setNewConfig({ ...newConfig, id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-config-name">Uniform Name</Label>
              <Input
                id="new-config-name"
                placeholder="e.g., Jacket, Baseball Cap, Shoes"
                value={newConfig.name}
                onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={() => {
            if (!newConfig.id || !newConfig.name) {
              toast.error('Please fill in both ID and Name');
              return;
            }
            if (configs.find(c => c.id === newConfig.id)) {
              toast.error('Uniform ID already exists');
              return;
            }
            const newConfigObj: UniformConfig = {
              id: newConfig.id,
              name: newConfig.name,
              views: {}
            };
            setConfigs([...configs, newConfigObj]);
            setNewConfig({ ...newConfig, id: '', name: '' });
            toast.success('Uniform configuration added successfully!');
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Uniform
          </Button>
        </Card>

        {/* Edit Config Modal */}
        {editingConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="p-6 bg-white shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Edit Uniform Configuration</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-config-id">Uniform ID</Label>
                  <Input
                    id="edit-config-id"
                    value={editingConfig.id}
                    onChange={(e) => setEditingConfig({ ...editingConfig, id: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-config-name">Uniform Name</Label>
                  <Input
                    id="edit-config-name"
                    value={editingConfig.name}
                    onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveConfig} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={() => setEditingConfig(null)} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add View Modal */}
        {editingView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="p-6 bg-white shadow-2xl max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Add New View</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-view-id">View ID</Label>
                  <Input
                    id="new-view-id"
                    placeholder="e.g., jacket-front, jacket-back"
                    value={newConfig.viewId}
                    onChange={(e) => setNewConfig({ ...newConfig, viewId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-view-label">View Label</Label>
                  <Input
                    id="new-view-label"
                    placeholder="e.g., Jacket Front, Jacket Back"
                    value={newConfig.viewLabel}
                    onChange={(e) => setNewConfig({ ...newConfig, viewLabel: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => handleAddView(editingView)} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add View
                  </Button>
                  <Button onClick={() => setEditingView(null)} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add Layer Modal */}
        {editingLayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="p-6 bg-white shadow-2xl max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Add New Layer</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-layer-id">Layer ID</Label>
                  <Input
                    id="new-layer-id"
                    placeholder="e.g., jacket-body, jacket-zipper"
                    value={newConfig.layerId}
                    onChange={(e) => setNewConfig({ ...newConfig, layerId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-layer-label">Layer Label</Label>
                  <Input
                    id="new-layer-label"
                    placeholder="e.g., Jacket Body, Zipper"
                    value={newConfig.layerLabel}
                    onChange={(e) => setNewConfig({ ...newConfig, layerLabel: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="new-layer-color">Default Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-layer-color"
                      type="color"
                      value={newConfig.layerColor}
                      onChange={(e) => setNewConfig({ ...newConfig, layerColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={newConfig.layerColor}
                      onChange={(e) => setNewConfig({ ...newConfig, layerColor: e.target.value })}
                      placeholder="#4A90E2"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      const parts = editingLayer.split('-');
                      const configId = parts[0];
                      const viewId = parts.slice(1).join('-');
                      handleAddLayer(configId, viewId);
                      setEditingLayer(null);
                    }} 
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Layer
                  </Button>
                  <Button onClick={() => setEditingLayer(null)} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Configuration Preview */}
        {showPreview && (
          <Card className="p-6 mt-8 bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Configuration Preview</h3>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify(configs, null, 2)}</pre>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              <p>💡 Copy this configuration and replace the content in <code className="bg-slate-100 px-2 py-1 rounded">src/config/uniformLayers.ts</code></p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UniformAdmin;
