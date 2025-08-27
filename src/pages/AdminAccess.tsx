import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, Settings, Code, FileText, Palette } from "lucide-react";

const AdminAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            🔧 Admin Access
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Access the Uniform Configuration Admin interface to manage your uniform designs visually.
          </p>
        </div>

        {/* Admin Interface Card */}
        <Card className="p-8 bg-white shadow-lg mb-8">
          <div className="text-center">
            <Settings className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Uniform Configuration Admin
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              A powerful visual interface to manage all your uniform configurations. Add, edit, and organize 
              uniforms, views, and layers without touching any code.
            </p>
            <Link to="/admin">
              <Button size="lg" className="px-8">
                <ExternalLink className="w-5 h-5 mr-2" />
                Open Admin Interface
              </Button>
            </Link>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Palette className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Visual Configuration
                </h3>
                <p className="text-slate-600 text-sm">
                  Manage uniforms through an intuitive interface. No more editing configuration files manually.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Export/Import
                </h3>
                <p className="text-slate-600 text-sm">
                  Export your configurations as JSON files and import them back. Perfect for backups and sharing.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Live Preview
                </h3>
                <p className="text-slate-600 text-sm">
                  See your configuration changes in real-time. Copy the generated code directly to your config file.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Easy Management
                </h3>
                <p className="text-slate-600 text-sm">
                  Add, edit, and delete uniforms, views, and layers with simple forms and confirmation dialogs.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* How to Use */}
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">How to Use</h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-slate-700">Access the Admin Interface</p>
                <p>Click the button above or navigate to <code className="bg-slate-100 px-2 py-1 rounded">/admin</code> in your browser.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-slate-700">Configure Your Uniforms</p>
                <p>Add new uniforms, create views (front/back), and define layers with colors using the visual interface.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-slate-700">Copy the Configuration</p>
                <p>Use the "Configuration Preview" section to copy the generated code and replace it in your <code className="bg-slate-100 px-2 py-1 rounded">src/config/uniformLayers.ts</code> file.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium text-slate-700">Add Your SVG Files</p>
                <p>Place your SVG files in the <code className="bg-slate-100 px-2 py-1 rounded">public/uniform/</code> folder with matching filenames.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Back to Main App */}
        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline">
              ← Back to Uniform Designer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
