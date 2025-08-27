# Uniform Configuration Guide

This guide explains how to add new uniforms to your Uniform Designer app without touching any code!

## 🎯 How It Works

The app now uses a **configuration-based system** that automatically detects and manages uniform layers. When you add a new uniform SVG file, you just need to:

1. **Place your SVG file** in the `public/uniform/` folder
2. **Update the configuration** in `src/config/uniformLayers.ts`
3. **That's it!** The app will automatically work with your new uniform

## 📁 File Structure

```
public/uniform/
├── shirt-front.svg      # Your shirt front SVG
├── shirt-back.svg       # Your shirt back SVG
├── pants-front.svg      # Your pants front SVG
├── pants-back.svg       # Your pants back SVG
└── [your-new-uniform].svg  # Add new uniforms here!

src/config/
└── uniformLayers.ts     # Configuration file (edit this!)
```

## 🎨 Adding a New Uniform

### Step 1: Create Your SVG in Adobe Illustrator

1. **Design your uniform** in Adobe Illustrator
2. **Create layers** for each part you want to customize
3. **Name your layers** with descriptive IDs (e.g., `jacket-body`, `jacket-zipper`, `jacket-pockets`)
4. **Export as SVG**

### Step 2: Add SVG File

Place your SVG file in `public/uniform/` folder:
```
public/uniform/jacket-front.svg
```

### Step 3: Update Configuration

Open `src/config/uniformLayers.ts` and add your new uniform:

```typescript
export const uniformConfigs: UniformConfig[] = [
  // ... existing uniforms ...
  {
    id: 'jacket',                    // Unique ID for your uniform
    name: 'Jacket',                  // Display name
    views: {
      'jacket-front': {              // View ID (must match SVG filename)
        id: 'jacket-front',
        label: 'Jacket Front',       // Display label
        layers: [
          { 
            id: 'jacket-body',       // Must match layer ID in SVG
            label: 'Jacket Body',    // Display name
            defaultColor: '#4A90E2'  // Default color
          },
          { 
            id: 'jacket-zipper',     // Must match layer ID in SVG
            label: 'Zipper',         // Display name
            defaultColor: '#2C3E50'  // Default color
          },
          // Add more layers as needed...
        ]
      },
      'jacket-back': {               // Add back view if you have one
        id: 'jacket-back',
        label: 'Jacket Back',
        layers: [
          { 
            id: 'jacket-body-back',
            label: 'Jacket Body',
            defaultColor: '#4A90E2'
          },
          // ... more layers
        ]
      }
    }
  }
];
```

## 🔧 Configuration Options

### Layer Properties

Each layer can have these properties:

```typescript
{
  id: 'unique-layer-id',           // Required: Must match SVG layer ID
  label: 'Human Readable Name',    // Required: Display name in UI
  defaultColor: '#4A90E2',         // Required: Default color
  description: 'Optional help text' // Optional: Additional info
}
```

### Color Format

Colors can be:
- **Hex codes**: `#4A90E2`
- **RGB**: `rgb(74, 144, 226)`
- **Named colors**: `blue`, `red`, etc.

## 📋 Example: Adding a Baseball Cap

Here's how to add a baseball cap uniform:

### 1. SVG File: `public/uniform/cap.svg`

### 2. Configuration Update:

```typescript
{
  id: 'cap',
  name: 'Baseball Cap',
  views: {
    'cap': {
      id: 'cap',
      label: 'Cap View',
      layers: [
        { id: 'cap-body', label: 'Cap Body', defaultColor: '#2C3E50' },
        { id: 'cap-brim', label: 'Brim', defaultColor: '#34495E' },
        { id: 'cap-logo', label: 'Logo Area', defaultColor: '#E74C3C' },
        { id: 'cap-button', label: 'Button', defaultColor: '#F39C12' }
      ]
    }
  }
}
```

## 🚀 Advanced Features

### Multiple Views
You can have multiple views for the same uniform:
- Front/Back views
- Different angles
- Seasonal variations

### Dynamic Layer Detection
The app automatically:
- ✅ Loads layers from your configuration
- ✅ Applies colors to SVG elements
- ✅ Updates the UI dynamically
- ✅ Handles missing layers gracefully

### Easy Maintenance
- **No code changes** needed for new uniforms
- **Centralized configuration** in one file
- **Type-safe** with TypeScript interfaces
- **Easy to backup** and version control

## 🐛 Troubleshooting

### Common Issues

1. **Colors not changing?**
   - Check that layer IDs in config match SVG layer IDs exactly
   - Ensure SVG layers have proper `id` attributes

2. **Uniform not showing?**
   - Verify SVG file is in `public/uniform/` folder
   - Check that view ID matches SVG filename

3. **Type errors?**
   - Make sure all required properties are defined
   - Check that IDs are unique across all uniforms

### Debug Tips

- Open browser console to see layer detection logs
- Check SVG file structure in browser dev tools
- Verify configuration syntax in `uniformLayers.ts`

## 🎉 Benefits

✅ **Scalable**: Add unlimited uniforms  
✅ **Maintainable**: One config file to rule them all  
✅ **Flexible**: Support any layer structure  
✅ **Professional**: Easy to hand off to clients  
✅ **Future-proof**: No code changes needed  

---

**Happy designing! 🎨** Your Uniform Designer app is now infinitely scalable!
