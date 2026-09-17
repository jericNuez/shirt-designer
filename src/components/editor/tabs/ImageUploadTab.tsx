import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FlipHorizontal, 
  FlipVertical, 
  Sliders, 
  Sparkles 
} from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';
import { ImageLayer } from '../../../types/editor';

const SAMPLE_GRAPHICS = [
  {
    name: 'Cyber Skull',
    category: 'Streetwear',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%2318181b" stroke="%23f43f5e" stroke-width="4"/><path d="M30 40c0-11 9-20 20-20s20 9 20 20v14H30V40z" fill="%23f43f5e"/><circle cx="42" cy="45" r="5" fill="%2318181b"/><circle cx="58" cy="45" r="5" fill="%2318181b"/><path d="M42 62h16v8H42z" fill="%23f43f5e"/><path d="M46 62v8M50 62v8M54 62v8" stroke="%2318181b" stroke-width="2"/><path d="M22 50l-8 10h12zM78 50l8 10H74z" fill="%23f43f5e"/></svg>',
  },
  {
    name: 'Mountain Peak',
    category: 'Outdoor',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><polygon points="50,15 15,80 85,80" fill="%230ea5e9"/><polygon points="50,15 62,38 56,40 50,30 44,40 38,38" fill="%23ffffff"/><circle cx="50" cy="50" r="46" stroke="%23f8fafc" stroke-width="3" stroke-dasharray="6,6"/><path d="M30 80l20-30 20 30z" fill="%230284c7"/></svg>',
  },
  {
    name: 'Golden Tiger',
    category: 'Vintage',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="48" fill="%23f59e0b" stroke="%23000000" stroke-width="4"/><path d="M35 30L20 20v25zM65 30L80 20v25z" fill="%23000000"/><circle cx="38" cy="46" r="6" fill="%23000000"/><circle cx="62" cy="46" r="6" fill="%23000000"/><polygon points="50,56 42,66 58,66" fill="%23000000"/><path d="M30 68q20 15 40 0" stroke="%23000000" stroke-width="4" stroke-linecap="round"/></svg>',
  },
  {
    name: 'Space Explorer',
    category: 'Sci-Fi',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="45" fill="%236366f1"/><path d="M50 20c15 0 26 12 26 28 0 20-26 36-26 36S24 68 24 48c0-16 11-28 26-28z" fill="%23ffffff"/><circle cx="50" cy="45" r="14" fill="%230f172a"/><circle cx="46" cy="42" r="4" fill="%2338bdf8"/></svg>',
  },
];

export const ImageUploadTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const activeZone = useEditorStore((s) => s.activeZone);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const layers = useEditorStore((s) => s.layers);
  const addLayer = useEditorStore((s) => s.addLayer);
  const updateLayer = useEditorStore((s) => s.updateLayer);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId && l.type === 'image') as ImageLayer | undefined;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        addLayer({
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'image',
          zone: activeZone,
          src,
          aspectRatio: img.width / img.height,
          originalWidth: img.width,
          originalHeight: img.height,
          x: 0.5,
          y: 0.5,
          scale: 1.0,
          rotation: 0,
          opacity: 1.0,
          flipX: false,
          flipY: false,
          locked: false,
          visible: true,
          blendMode: 'source-over',
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const addPresetGraphic = (graphic: typeof SAMPLE_GRAPHICS[0]) => {
    addLayer({
      name: graphic.name,
      type: 'image',
      zone: activeZone,
      src: graphic.src,
      aspectRatio: 1,
      originalWidth: 200,
      originalHeight: 200,
      x: 0.5,
      y: 0.5,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      flipX: false,
      flipY: false,
      locked: false,
      visible: true,
      blendMode: 'source-over',
    });
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
            : 'border-surface-700 bg-surface-900/50 hover:bg-surface-900/80 hover:border-surface-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mb-3 text-primary-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="text-xs font-bold text-surface-200">Click to Upload Artwork</div>
        <div className="text-[11px] text-surface-400 mt-1">PNG, JPG, SVG, WebP (up to 20MB)</div>
      </div>

      {/* Selected Image Layer Controls */}
      {selectedLayer && (
        <div className="p-4 bg-surface-900/80 rounded-2xl border border-primary-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Adjust Image ({selectedLayer.name})
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateLayer(selectedLayer.id, { flipX: !selectedLayer.flipX })}
                title="Flip Horizontal"
                className={`p-1.5 rounded-lg border text-xs ${
                  selectedLayer.flipX ? 'bg-primary-600 border-primary-500 text-white' : 'bg-surface-800 border-surface-700 text-surface-300'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateLayer(selectedLayer.id, { flipY: !selectedLayer.flipY })}
                title="Flip Vertical"
                className={`p-1.5 rounded-lg border text-xs ${
                  selectedLayer.flipY ? 'bg-primary-600 border-primary-500 text-white' : 'bg-surface-800 border-surface-700 text-surface-300'
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-surface-400">
              <span>Size Scale</span>
              <span>{Math.round(selectedLayer.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={selectedLayer.scale}
              onChange={(e) => updateLayer(selectedLayer.id, { scale: parseFloat(e.target.value) })}
              className="w-full accent-primary-500 cursor-pointer h-1.5 bg-surface-800 rounded-lg"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-surface-400">
              <span>Opacity</span>
              <span>{Math.round(selectedLayer.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={selectedLayer.opacity}
              onChange={(e) => updateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })}
              className="w-full accent-primary-500 cursor-pointer h-1.5 bg-surface-800 rounded-lg"
            />
          </div>

          {/* Rotation Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-surface-400">
              <span>Rotation</span>
              <span>{selectedLayer.rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={selectedLayer.rotation}
              onChange={(e) => updateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })}
              className="w-full accent-primary-500 cursor-pointer h-1.5 bg-surface-800 rounded-lg"
            />
          </div>

          {/* Blend Mode */}
          <div className="space-y-1.5">
            <label className="text-xs text-surface-400">Blend Mode</label>
            <select
              value={selectedLayer.blendMode || 'source-over'}
              onChange={(e) => updateLayer(selectedLayer.id, { blendMode: e.target.value as any })}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-1.5 text-xs text-surface-200 outline-none focus:border-primary-500"
            >
              <option value="source-over">Normal</option>
              <option value="multiply">Multiply (Vintage ink / fabric embed)</option>
              <option value="screen">Screen (Light glow)</option>
              <option value="overlay">Overlay (Textured)</option>
            </select>
          </div>
        </div>
      )}

      {/* Preset Sample Graphics */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          Sample Graphic Assets
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {SAMPLE_GRAPHICS.map((g) => (
            <button
              key={g.name}
              onClick={() => addPresetGraphic(g)}
              className="flex items-center gap-2.5 p-2.5 bg-surface-900/60 rounded-2xl border border-surface-800 hover:border-primary-500/60 hover:bg-surface-800/60 transition group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-950 p-1.5 border border-surface-800 flex items-center justify-center shrink-0">
                <img src={g.src} alt={g.name} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-surface-200 truncate group-hover:text-primary-400">
                  {g.name}
                </div>
                <div className="text-[10px] text-surface-500">{g.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
