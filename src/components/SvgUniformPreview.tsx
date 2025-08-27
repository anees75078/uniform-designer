import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, FabricImage, FabricObject, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, RotateCw, Move, Maximize2, X, Image as ImageIcon, Check, Type, Plus, Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface LogoItem {
  id: string;
  fabricObject: FabricImage;
  name: string;
  url: string;
}

interface TextItem {
  id: string;
  fabricObject: IText;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  lineHeight: number;
}

interface SvgUniformPreviewProps {
  currentView: string;
  colors: Record<string, string>;
  onColorChange: (layerId: string, color: string) => void;
}

// Available fonts for text customization
const AVAILABLE_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Courier New',
  'Lucida Console',
  'Palatino',
  'Garamond',
  'Bookman',
  'Avant Garde'
];

// Font weights
const FONT_WEIGHTS = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

// Font styles
const FONT_STYLES = ['normal', 'italic'];

// Text alignments
const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Right', icon: AlignRight },
  { value: 'justify', label: 'Justify', icon: AlignJustify }
];

export const SvgUniformPreview = ({ currentView, colors, onColorChange }: SvgUniformPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [activeLogoId, setActiveLogoId] = useState<string | null>(null);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [svgElement, setSvgElement] = useState<SVGElement | null>(null);

  // Text input states
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedWeight, setSelectedWeight] = useState('normal');
  const [selectedStyle, setSelectedStyle] = useState('normal');
  const [selectedAlignment, setSelectedAlignment] = useState('left');
  const [selectedLineHeight, setSelectedLineHeight] = useState(1.2);
  const [showTextPanel, setShowTextPanel] = useState(false);

  // Inline text editing states
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingFont, setEditingFont] = useState('Arial');
  const [editingFontSize, setEditingFontSize] = useState(24);
  const [editingColor, setEditingColor] = useState('#000000');
  const [editingWeight, setEditingWeight] = useState('normal');
  const [editingStyle, setEditingStyle] = useState('normal');
  const [editingAlignment, setEditingAlignment] = useState('left');
  const [editingLineHeight, setEditingLineHeight] = useState(1.2);

  // SVG file paths based on current view - using public folder
  const getSvgPath = () => {
    switch (currentView) {
      case 'shirt-front':
        return '/uniform/shirt-front.svg';
      case 'shirt-back':
        return '/uniform/shirt-back.svg';
      case 'pants-front':
        return '/uniform/pants-front.svg';
      case 'pants-back':
        return '/uniform/pants-back.svg';
      default:
        return '/uniform/shirt-front.svg';
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Responsive canvas sizing - much smaller on mobile to prevent cut-off
    let canvasWidth = 800;
    let canvasHeight = 900;
    
    if (window.innerWidth < 640) { // Mobile (sm)
      canvasWidth = 320;
      canvasHeight = 360;
    } else if (window.innerWidth < 1024) { // Tablet (lg)
      canvasWidth = 500;
      canvasHeight = 563;
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#ffffff",
      enableRetinaScaling: true,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    setFabricCanvas(canvas);

    // Add event listeners for object selection and double-click
    canvas.on('selection:created', handleObjectSelection);
    canvas.on('selection:updated', handleObjectSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('mouse:dblclick', handleDoubleClick);

    return () => {
      canvas.off('selection:created', handleObjectSelection);
      canvas.off('selection:updated', handleObjectSelection);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('mouse:dblclick', handleDoubleClick);
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    loadSvgUniform();
  }, [fabricCanvas, currentView, colors]);

  // Update active logo when logos change
  useEffect(() => {
    if (logos.length > 0 && !activeLogoId) {
      setActiveLogoId(logos[0].id);
    }
  }, [logos, activeLogoId]);

  // Update active text when texts change
  useEffect(() => {
    if (texts.length > 0 && !activeTextId) {
      setActiveTextId(texts[0].id);
    }
  }, [texts, activeTextId]);

  const handleObjectSelection = (e: any) => {
    const activeObject = e.selected?.[0];
    if (activeObject && activeObject.type === 'i-text') {
      // Find the text item
      const textItem = texts.find(text => text.fabricObject === activeObject);
      if (textItem) {
        setActiveTextId(textItem.id);
      }
    }
  };

  const handleSelectionCleared = () => {
    // Don't clear editing state here, let user manually close it
  };

  const handleDoubleClick = (e: any) => {
    if (e.target && e.target.type === 'i-text') {
      // Find the text item
      const textItem = texts.find(text => text.fabricObject === e.target);
      if (textItem) {
        // Open inline editor
        setEditingTextId(textItem.id);
        setEditingText(textItem.text);
        setEditingFont(textItem.fontFamily);
        setEditingFontSize(textItem.fontSize);
        setEditingColor(textItem.color);
        setEditingWeight(textItem.fontWeight);
        setEditingStyle(textItem.fontStyle);
        setEditingAlignment(textItem.textAlign);
        setEditingLineHeight(textItem.lineHeight);
        setActiveTextId(textItem.id);
      }
    }
  };

  const loadSvgUniform = async () => {
    if (!fabricCanvas) return;

    try {
      const svgPath = getSvgPath();
      const response = await fetch(svgPath);
      
      if (!response.ok) {
        toast.error(`SVG file not found: ${svgPath}`);
        return;
      }

      const svgText = await response.text();
      console.log('SVG loaded:', svgText.substring(0, 200) + '...');
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;
      console.log('SVG element:', svgElement);
      
      setSvgElement(svgElement as unknown as SVGElement);
      
      // Apply colors to SVG elements based on layer IDs
      console.log('Applying colors:', colors);
      Object.entries(colors).forEach(([layerId, color]) => {
        const element = svgElement.querySelector(`#${layerId}`);
        console.log(`Looking for layer: ${layerId}`, element);
        if (element) {
          // Find all path elements within the layer group and apply color
          const paths = element.querySelectorAll('path, polygon, circle');
          console.log(`Found ${paths.length} paths in ${layerId}`);
          paths.forEach(path => {
            if (path instanceof SVGElement) {
              console.log(`Setting fill to ${color} for element:`, path);
              path.setAttribute('fill', color);
              // Also remove any existing style attributes that might override the fill
              if (path.hasAttribute('style')) {
                const style = path.getAttribute('style') || '';
                const newStyle = style.replace(/fill:[^;]+;?/g, '').replace(/fill:[^;]+;?/g, '');
                if (newStyle.trim()) {
                  path.setAttribute('style', newStyle);
                } else {
                  path.removeAttribute('style');
                }
              }
            }
          });
          
          // Also check if the element itself has a style attribute with fill
          if (element.hasAttribute('style')) {
            const style = element.getAttribute('style') || '';
            const newStyle = style.replace(/fill:[^;]+;?/g, '').replace(/fill:[^;]+;?/g, '');
            if (newStyle.trim()) {
              element.setAttribute('style', newStyle);
            } else {
              element.removeAttribute('style');
            }
          }
        }
      });

      // Convert SVG to fabric object
      const svgString = new XMLSerializer().serializeToString(svgElement);
      
      fabricCanvas.clear();
      
      // Create a temporary container to render the SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = svgString;
      const tempSvg = tempDiv.querySelector('svg');
      
      if (tempSvg) {
        // Convert to canvas for fabric.js with high resolution
        const canvas2d = document.createElement('canvas');
        const ctx = canvas2d.getContext('2d');
        const img = new Image();
        
        // Set high resolution canvas
        const scale = 2; // 2x resolution for crisp rendering
        canvas2d.width = 800 * scale;
        canvas2d.height = 800 * scale;
        
        img.onload = () => {
          // Scale the context for high resolution
          ctx?.scale(scale, scale);
          ctx?.drawImage(img, 0, 0, 800, 800);
        
          FabricImage.fromURL(canvas2d.toDataURL('image/png', 1.0), {}).then((fabricImg) => {
            // Scale the image to fit nicely in the canvas
            const scale = Math.min(
              (fabricCanvas.width! * 0.8) / fabricImg.width!,
              (fabricCanvas.height! * 0.8) / fabricImg.height!
            );
            
            fabricImg.set({
              left: (fabricCanvas.width! - fabricImg.width! * scale) / 2,
              top: (fabricCanvas.height! - fabricImg.height! * scale) / 2,
              scaleX: scale,
              scaleY: scale,
              selectable: false,
              evented: false
            });
            
            fabricCanvas.add(fabricImg);
            
            // Add all logos back to canvas
            logos.forEach(logo => {
              fabricCanvas.add(logo.fabricObject);
            });

            // Add all texts back to canvas
            texts.forEach(text => {
              fabricCanvas.add(text.fabricObject);
            });
            
            fabricCanvas.renderAll();
          });
        };
        
        // Convert SVG to data URL
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
      }
      
    } catch (error) {
      console.error('Error loading SVG:', error);
      toast.error('Error loading uniform design');
    }
  };

  const handleLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !fabricCanvas) return;

    Array.from(files).forEach((file, index) => {
    if (!file.type.startsWith('image/')) {
        toast.error(`Please select a valid image file: ${file.name}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      FabricImage.fromURL(imageUrl, {}).then((img) => {
        // Scale image to reasonable size
        const maxSize = 100;
        const scale = Math.min(maxSize / img.width!, maxSize / img.height!);
        
        img.set({
            left: fabricCanvas.width! / 2 - (img.width! * scale) / 2 + (index * 20),
            top: fabricCanvas.height! / 2 - (img.height! * scale) / 2 + (index * 20),
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          evented: true
        });
        
          const logoId = `logo-${Date.now()}-${index}`;
          const logoItem: LogoItem = {
            id: logoId,
            fabricObject: img,
            name: file.name,
            url: imageUrl
          };
          
          setLogos(prev => [...prev, logoItem]);
        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        
          // Set as active logo if it's the first one
          if (logos.length === 0) {
            setActiveLogoId(logoId);
          }
          
          toast.success(`Logo "${file.name}" uploaded successfully!`);
      });
    };
    
    reader.readAsDataURL(file);
    });

    // Reset file input
    event.target.value = '';
  };

  const deleteLogo = (logoId: string) => {
    const logoToDelete = logos.find(logo => logo.id === logoId);
    if (logoToDelete && fabricCanvas) {
      fabricCanvas.remove(logoToDelete.fabricObject);
      setLogos(prev => prev.filter(logo => logo.id !== logoId));
      
      // Update active logo if needed
      if (activeLogoId === logoId) {
        const remainingLogos = logos.filter(logo => logo.id !== logoId);
        setActiveLogoId(remainingLogos.length > 0 ? remainingLogos[0].id : null);
      }
      
      fabricCanvas.renderAll();
      toast.success('Logo removed');
    }
  };

  const setActiveLogo = (logoId: string) => {
    setActiveLogoId(logoId);
    const logo = logos.find(l => l.id === logoId);
    if (logo && fabricCanvas) {
      fabricCanvas.setActiveObject(logo.fabricObject);
      fabricCanvas.renderAll();
    }
  };

  // Text functions
  const addText = () => {
    if (!textInput.trim() || !fabricCanvas) return;

    // Handle Shift+Enter for line breaks
    const processedText = textInput.replace(/\n/g, '\n');

    const text = new IText(processedText, {
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      fontFamily: selectedFont,
      fontSize: selectedFontSize,
      fill: selectedColor,
      fontWeight: selectedWeight,
      fontStyle: selectedStyle,
      textAlign: selectedAlignment,
      lineHeight: selectedLineHeight,
      selectable: true,
      evented: true,
      originX: 'center',
      originY: 'center'
    });

    const textId = `text-${Date.now()}`;
    const textItem: TextItem = {
      id: textId,
      fabricObject: text,
      text: processedText,
      fontFamily: selectedFont,
      fontSize: selectedFontSize,
      color: selectedColor,
      fontWeight: selectedWeight,
      fontStyle: selectedStyle,
      textAlign: selectedAlignment,
      lineHeight: selectedLineHeight
    };

    setTexts(prev => [...prev, textItem]);
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();

    // Set as active text if it's the first one
    if (texts.length === 0) {
      setActiveTextId(textId);
    }

    // Reset input
    setTextInput('');
    toast.success('Text added successfully!');
  };

  const deleteText = (textId: string) => {
    const textToDelete = texts.find(text => text.id === textId);
    if (textToDelete && fabricCanvas) {
      fabricCanvas.remove(textToDelete.fabricObject);
      setTexts(prev => prev.filter(text => text.id !== textId));
      
      // Update active text if needed
      if (activeTextId === textId) {
        const remainingTexts = texts.filter(text => text.id !== textId);
        setActiveTextId(remainingTexts.length > 0 ? remainingTexts[0].id : null);
      }
      
      fabricCanvas.renderAll();
      toast.success('Text removed');
    }
  };

  const setActiveText = (textId: string) => {
    setActiveTextId(textId);
    const text = texts.find(t => t.id === textId);
    if (text && fabricCanvas) {
      fabricCanvas.setActiveObject(text.fabricObject);
      fabricCanvas.renderAll();
    }
  };

  const updateTextProperties = (textId: string, property: keyof TextItem, value: any) => {
    const textToUpdate = texts.find(text => text.id === textId);
    if (textToUpdate && fabricCanvas) {
      const fabricText = textToUpdate.fabricObject;
      
      switch (property) {
        case 'text':
          fabricText.set('text', value);
          textToUpdate.text = value;
          break;
        case 'fontFamily':
          fabricText.set('fontFamily', value);
          textToUpdate.fontFamily = value;
          break;
        case 'fontSize':
          fabricText.set('fontSize', value);
          textToUpdate.fontSize = value;
          break;
        case 'color':
          fabricText.set('fill', value);
          textToUpdate.color = value;
          break;
        case 'fontWeight':
          fabricText.set('fontWeight', value);
          textToUpdate.fontWeight = value;
          break;
        case 'fontStyle':
          fabricText.set('fontStyle', value);
          textToUpdate.fontStyle = value;
          break;
        case 'textAlign':
          fabricText.set('textAlign', value);
          textToUpdate.textAlign = value;
          break;
        case 'lineHeight':
          fabricText.set('lineHeight', value);
          textToUpdate.lineHeight = value;
          break;
      }
      
      fabricCanvas.renderAll();
      setTexts(prev => prev.map(t => t.id === textId ? textToUpdate : t));
    }
  };

  const applyTextEdits = () => {
    if (!editingTextId) return;

    const textToUpdate = texts.find(text => text.id === editingTextId);
    if (textToUpdate && fabricCanvas) {
      const fabricText = textToUpdate.fabricObject;
      
      console.log('Applying text edits:', {
        text: editingText,
        font: editingFont,
        size: editingFontSize,
        color: editingColor,
        weight: editingWeight,
        style: editingStyle,
        align: editingAlignment,
        lineHeight: editingLineHeight
      });

      // Update all properties at once
      fabricText.set({
        text: editingText,
        fontFamily: editingFont,
        fontSize: editingFontSize,
        fill: editingColor,
        fontWeight: editingWeight,
        fontStyle: editingStyle,
        textAlign: editingAlignment,
        lineHeight: editingLineHeight
      });

      // Update the text item state
      textToUpdate.text = editingText;
      textToUpdate.fontFamily = editingFont;
      textToUpdate.fontSize = editingFontSize;
      textToUpdate.color = editingColor;
      textToUpdate.fontWeight = editingWeight;
      textToUpdate.fontStyle = editingStyle;
      textToUpdate.textAlign = editingAlignment;
      textToUpdate.lineHeight = editingLineHeight;

      // Force the canvas to re-render
      fabricText.setCoords();
      fabricCanvas.requestRenderAll();
      
      // Update the texts state
      setTexts(prev => prev.map(t => t.id === editingTextId ? { ...textToUpdate } : t));

      // Close editing panel
      setEditingTextId(null);
      toast.success('Text updated successfully!');
    }
  };

  const cancelTextEdits = () => {
    setEditingTextId(null);
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // Allow Shift+Enter for line breaks
      return;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addText();
    }
  };

  const downloadImage = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 4 // Higher resolution for download
    });
    
    const link = document.createElement('a');
    link.download = `uniform-${currentView}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast.success('Image downloaded successfully!');
  };

  return (
    <Card className="p-4 sm:p-6 bg-card shadow-medium">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          Live Preview - {currentView.replace('-', ' ').toUpperCase()}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Button onClick={handleLogoUpload} variant="outline" size="sm" className="text-xs sm:text-sm">
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Upload Logos
          </Button>
          <Button 
            onClick={() => setShowTextPanel(!showTextPanel)} 
            variant="outline" 
            size="sm"
            className={`text-xs sm:text-sm ${showTextPanel ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Type className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Add Text
            </Button>
          <Button onClick={downloadImage} variant="premium" size="sm" className="text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Download HD
          </Button>
        </div>
      </div>
      
      {/* Inline Text Editing Panel */}
      {editingTextId && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border-2 border-primary">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-primary">Editing Text</h3>
            <div className="flex gap-2">
              <Button onClick={applyTextEdits} size="sm" className="bg-primary text-primary-foreground">
                <Check className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
              <Button onClick={cancelTextEdits} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Label htmlFor="editing-text-input">Text Content</Label>
              <textarea
                id="editing-text-input"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                placeholder="Edit text content..."
                className="w-full mt-1 px-3 py-2 border border-primary/30 rounded-md bg-background resize-none"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="editing-font-family">Font</Label>
              <select
                id="editing-font-family"
                value={editingFont}
                onChange={(e) => setEditingFont(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-primary/30 rounded-md bg-background"
              >
                {AVAILABLE_FONTS.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="editing-font-size">Size</Label>
              <Input
                id="editing-font-size"
                type="number"
                value={editingFontSize}
                onChange={(e) => setEditingFontSize(Number(e.target.value))}
                min="8"
                max="200"
                className="mt-1 border-primary/30"
              />
            </div>
            <div>
              <Label htmlFor="editing-text-color">Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="editing-text-color"
                  type="color"
                  value={editingColor}
                  onChange={(e) => setEditingColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={editingColor}
                  onChange={(e) => setEditingColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 border-primary/30"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="editing-font-weight">Weight</Label>
              <select
                id="editing-font-weight"
                value={editingWeight}
                onChange={(e) => setEditingWeight(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-primary/30 rounded-md bg-background"
              >
                {FONT_WEIGHTS.map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="editing-font-style">Style</Label>
              <select
                id="editing-font-style"
                value={editingStyle}
                onChange={(e) => setEditingStyle(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-primary/30 rounded-md bg-background"
              >
                {FONT_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="editing-text-alignment">Alignment</Label>
              <div className="flex gap-1 mt-1">
                {TEXT_ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setEditingAlignment(value)}
                    className={`flex-1 p-2 border rounded-md transition-all ${
                      editingAlignment === value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-primary/30 hover:border-primary/50'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="editing-line-height">Line Height</Label>
              <Input
                id="editing-line-height"
                type="number"
                value={editingLineHeight}
                onChange={(e) => setEditingLineHeight(Number(e.target.value))}
                min="0.5"
                max="3"
                step="0.1"
                className="mt-1 border-primary/30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {editingLineHeight}x spacing
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Text Input Panel */}
      {showTextPanel && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-3">Add New Text</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <Label htmlFor="text-input">Text Content</Label>
              <textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleTextInputKeyDown}
                placeholder="Enter text... (Shift+Enter for line breaks)"
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background resize-none"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter to add text • Shift+Enter for line breaks
              </p>
            </div>
            <div>
              <Label htmlFor="font-family">Font</Label>
              <select
                id="font-family"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                {AVAILABLE_FONTS.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="font-size">Size</Label>
              <Input
                id="font-size"
                type="number"
                value={selectedFontSize}
                onChange={(e) => setSelectedFontSize(Number(e.target.value))}
                min="8"
                max="200"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="text-color">Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="text-color"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="font-weight">Weight</Label>
              <select
                id="font-weight"
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                {FONT_WEIGHTS.map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="font-style">Style</Label>
              <select
                id="font-style"
                value={editingStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background"
              >
                {FONT_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="text-alignment">Alignment</Label>
              <div className="flex gap-1 mt-1">
                {TEXT_ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedAlignment(value)}
                    className={`flex-1 p-2 border rounded-md transition-all ${
                      selectedAlignment === value
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="line-height">Line Height</Label>
              <Input
                id="line-height"
                type="number"
                value={selectedLineHeight}
                onChange={(e) => setSelectedLineHeight(Number(e.target.value))}
                min="0.5"
                max="3"
                step="0.1"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {selectedLineHeight}x spacing
              </p>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <Button onClick={addText} disabled={!textInput.trim()} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Text to Canvas
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center items-center bg-muted/30 rounded-lg p-3 sm:p-6 overflow-hidden">
        <div className="w-full max-w-full">
          <canvas 
            ref={canvasRef} 
            className="border border-border rounded-lg shadow-lg w-full h-auto mx-auto" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto'
            }}
          />
        </div>
      </div>

      {/* Logo Gallery */}
      {logos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Logo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                  activeLogoId === logo.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setActiveLogo(logo.id)}
              >
                <div className="aspect-square rounded-md overflow-hidden bg-muted/30">
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                
                {/* Active indicator */}
                {activeLogoId === logo.id && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLogo(logo.id);
                  }}
                  className="absolute top-1 left-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                >
                  <X className="w-3 h-3" />
                </button>
                
                {/* Logo name */}
                <div className="p-2 text-xs text-center text-muted-foreground truncate">
                  {logo.name.length > 15 ? logo.name.substring(0, 15) + '...' : logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Gallery */}
      {texts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Text Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {texts.map((text) => (
              <div
                key={text.id}
                className={`relative group cursor-pointer rounded-lg border-2 transition-all p-3 ${
                  activeTextId === text.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setActiveText(text.id)}
              >
                {/* Active indicator */}
                {activeTextId === text.id && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                
                {/* Edit button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTextId(text.id);
                    setEditingText(text.text);
                    setEditingFont(text.fontFamily);
                    setEditingFontSize(text.fontSize);
                    setEditingColor(text.color);
                    setEditingWeight(text.fontWeight);
                    setEditingStyle(text.fontStyle);
                    setEditingAlignment(text.textAlign);
                    setEditingLineHeight(text.lineHeight);
                  }}
                  className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/80"
                  title="Edit text properties"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteText(text.id);
                  }}
                  className="absolute top-1 left-12 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                >
                  <X className="w-3 h-3" />
                </button>
                
                {/* Text preview */}
                <div 
                  className="text-center mb-2"
                  style={{
                    fontFamily: text.fontFamily,
                    fontSize: Math.min(text.fontSize, 16),
                    fontWeight: text.fontWeight,
                    fontStyle: text.fontStyle,
                    color: text.color,
                    textAlign: text.textAlign as any,
                    lineHeight: text.lineHeight
                  }}
                >
                  {text.text}
                </div>
                
                {/* Text properties */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Font: {text.fontFamily}</div>
                  <div>Size: {text.fontSize}px</div>
                  <div>Color: {text.color}</div>
                  <div>Weight: {text.fontWeight}</div>
                  <div>Style: {text.fontStyle}</div>
                  <div>Align: {text.textAlign}</div>
                  <div>Line Height: {text.lineHeight}x</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Logo Controls Info */}
      {logos.length > 0 && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Logo Controls:</p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3" /> Drag to move
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" /> Corners to resize
            </span>
            <span className="flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Rotate handle to rotate
            </span>
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3" /> Click logo in gallery to select
            </span>
          </div>
        </div>
      )}

      {/* Text Controls Info */}
      {texts.length > 0 && (
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Text Controls:</p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Move className="w-3 h-3" /> Drag to move
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3 h-3" /> Corners to resize
            </span>
            <span className="flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Rotate handle to rotate
            </span>
            <span className="flex items-center gap-1">
              <Type className="w-3 h-3" /> Click text in gallery to select
            </span>
            <span className="flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Hover text in gallery to edit properties
            </span>
            <span className="flex items-center gap-1">
              <Palette className="w-3 h-3" /> Double-click on canvas to edit content & properties
            </span>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </Card>
  );
};