# 🎨 Uniform Designer - Interactive SVG Customization App

A modern, responsive web application for designing and customizing uniforms with real-time color changes, logo uploads, and text customization.

## ✨ Features

### 🎨 **Uniform Customization**
- **Real-time color changes** for individual uniform parts
- **Multiple uniform views** (shirt front/back, pants front/back)
- **SVG-based design** for crisp, scalable graphics
- **Layer-based customization** with Adobe Illustrator compatibility

### 🖼️ **Logo Management**
- **Multiple logo uploads** with drag & drop support
- **Interactive logo manipulation** (move, scale, rotate)
- **Logo gallery** with individual controls
- **High-quality rendering** with Fabric.js

### 📝 **Text Customization**
- **Rich text editing** with multiple fonts and styles
- **Real-time text manipulation** (move, scale, rotate)
- **Advanced typography** (weight, style, alignment, line height)
- **Inline editing** with double-click functionality
- **Multi-line support** with Shift+Enter

### 📱 **Responsive Design**
- **Mobile-first approach** with touch-friendly controls
- **Responsive canvas sizing** that adapts to screen size
- **Cross-device compatibility** (mobile, tablet, desktop)
- **Optimized layouts** for all screen sizes

### 🛠️ **Admin Interface**
- **Visual configuration management** at `/admin`
- **CRUD operations** for uniforms, views, and layers
- **Real-time configuration updates**
- **No-code uniform management**

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uniform-designer.git
   cd uniform-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 📁 Project Structure

```
uniform-designer/
├── src/
│   ├── components/          # React components
│   │   ├── SvgUniformPreview.tsx    # Main canvas component
│   │   ├── SvgColorCustomizer.tsx   # Color customization
│   │   ├── ViewSelector.tsx         # Uniform view selection
│   │   └── UniformDesigner.tsx      # Main app component
│   ├── pages/               # Page components
│   │   ├── UniformAdmin.tsx # Admin interface
│   │   └── AdminAccess.tsx  # Admin access control
│   ├── config/              # Configuration files
│   │   └── uniformLayers.ts # Uniform structure config
│   └── ui/                  # UI components (shadcn/ui)
├── public/
│   └── uniform/             # SVG uniform files
├── package.json
└── README.md
```

## 🎯 Usage

### **Basic Customization**
1. Select a uniform view (shirt front, pants back, etc.)
2. Choose a part to customize from the color picker
3. Select colors from presets or use custom color input
4. See real-time changes on the canvas

### **Adding Logos**
1. Click "Upload Logos" button
2. Select one or multiple image files
3. Drag logos on the canvas to position them
4. Use handles to resize and rotate logos
5. Manage logos from the logo gallery

### **Adding Text**
1. Click "Add Text" button
2. Enter text content in the input panel
3. Customize font, size, color, weight, and style
4. Use alignment and line height controls
5. Double-click text on canvas for inline editing

### **Admin Configuration**
1. Navigate to `/admin` in your browser
2. Add/edit/delete uniforms, views, and layers
3. Copy generated configuration to `uniformLayers.ts`
4. Changes apply immediately

## 🎨 SVG Setup

### **File Placement**
Place your SVG files in `public/uniform/`:
- `shirt-front.svg` - Front view of shirt
- `shirt-back.svg` - Back view of shirt  
- `pants-front.svg` - Front view of pants
- `pants-back.svg` - Back view of pants

### **Adobe Illustrator Layer Structure**
Create layers with specific IDs for automatic color customization:

**Shirt Front Layers:**
- `shirt-body-front`
- `shirt-collar-front`
- `shirt-sleeves-front`
- `shirt-cuffs-front`
- `shirt-buttons-front`

**Shirt Back Layers:**
- `shirt-body-back`
- `shirt-collar-back`
- `shirt-sleeves-back`
- `shirt-cuffs-back`
- `shirt-yoke-back`

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Canvas Library:** Fabric.js
- **State Management:** React Hooks
- **Routing:** React Router
- **Icons:** Lucide React

## 📱 Responsive Breakpoints

- **Mobile:** 320px - 640px (canvas: 320x360)
- **Tablet:** 640px - 1024px (canvas: 500x563)
- **Desktop:** 1024px+ (canvas: 800x900)

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### **Environment Variables**
Create `.env.local` for local development:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Uniform Designer
```

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Vercel/Netlify**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fabric.js** for powerful canvas manipulation
- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Vite** for fast development experience

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/uniform-designer/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/uniform-designer/discussions)
- **Email:** your.email@example.com

---

**Made with ❤️ for uniform designers everywhere!**
