import React from 'react';
import { 
  Shapes, 
  Sparkles, 
  Shield, 
  Heart, 
  Star, 
  Circle, 
  Square, 
  Award,
  Sliders
} from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';
import { ShapeLayer } from '../../../types/editor';

const SHAPES: { type: ShapeLayer['shapeType']; label: string; icon: React.ReactNode }[] = [
  { type: 'star', label: 'Star', icon: <Star className="w-5 h-5 fill-current" /> },
  { type: 'shield', label: 'Shield', icon: <Shield className="w-5 h-5" /> },
  { type: 'heart', label: 'Heart', icon: <Heart className="w-5 h-5 fill-current" /> },
  { type: 'circle', label: 'Circle', icon: <Circle className="w-5 h-5" /> },
  { type: 'square', label: 'Square', icon: <Square className="w-5 h-5" /> },
  { type: 'banner', label: 'Ribbon Banner', icon: <Award className="w-5 h-5" /> },
];

const VECTOR_ICONS = [
  {
    name: 'Lightning Bolt',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  },
  {
    name: 'Flame Fire',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444"><path d="M12 2c1.5 3 4 5 4 9 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-4 2.5-6 4-9 1 2 2 3 4 0z"/></svg>',
  },
  {
    name: 'Royal Crown',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fbbf24"><path d="M2 19h20v2H2v-2zm1-8l4.5 4 4.5-8 4.5 8 4.5-4 1 7H2l1-7z"/></svg>',
  },
  {
    name: 'Diamond Crest',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><path d="M12 2L2 9l10 13 10-13-10-7zm0 3.5l6.5 4.5H5.5L12 5.5z"/></svg>',
  },
  {
    name: 'Vintage Compass',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"><circle cx="12" cy="12" r="10" stroke="%2310b981" stroke-width="2" fill="none"/><polygon points="12,4 15,12 12,20 9,12"/></svg>',
  },
  {
    name: 'Peace Emblem',
    svg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="12" y1="12" x2="5" y2="19"/><line x1="12" y1="12" x2="19" y2="19"/></svg>',
  },
];

export const ClipartTab: React.FC = () => {
  const activeZone = useEditorStore((s) => s.activeZone);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const layers = useEditorStore((s) => s.layers);
  const addLayer = useEditorStore((s) => s.addLayer);
  const updateLayer = useEditorStore((s) => s.updateLayer);

  const selectedShape = layers.find((l) => l.id === selectedLayerId && l.type === 'shape') as ShapeLayer | undefined;

  const handleAddShape = (shapeType: ShapeLayer['shapeType']) => {
    addLayer({
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Badge`,
      type: 'shape',
      shapeType,
      zone: activeZone,
      fillColor: '#6366F1',
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      x: 0.5,
      y: 0.5,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      flipX: false,
      flipY: false,
      locked: false,
      visible: true,
    });
  };

  const handleAddVectorIcon = (icon: typeof VECTOR_ICONS[0]) => {
    addLayer({
      name: icon.name,
      type: 'image',
      zone: activeZone,
      src: icon.svg,
      aspectRatio: 1,
      originalWidth: 200,
      originalHeight: 200,
      x: 0.5,
      y: 0.5,
      scale: 0.8,
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
      {/* Selected Shape Modifier */}
      {selectedShape && (
        <div className="p-4 bg-surface-900/80 rounded-2xl border border-primary-500/30 space-y-4 shadow-xl">
          <span className="text-xs font-bold text-primary-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Customize Shape ({selectedShape.name})
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-surface-400">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedShape.fillColor}
                  onChange={(e) => updateLayer(selectedShape.id, { fillColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-[11px] font-mono text-surface-300 uppercase">{selectedShape.fillColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-surface-400">Border / Stroke</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedShape.strokeColor || '#000000'}
                  onChange={(e) => updateLayer(selectedShape.id, { strokeColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={selectedShape.strokeWidth}
                  onChange={(e) => updateLayer(selectedShape.id, { strokeWidth: parseInt(e.target.value) })}
                  className="w-16 accent-primary-500 cursor-pointer h-1.5 bg-surface-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Geometric Badges & Shapes */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
          <Shapes className="w-3.5 h-3.5 text-primary-400" />
          Badges & Geometric Shapes
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {SHAPES.map((s) => (
            <button
              key={s.type}
              onClick={() => handleAddShape(s.type)}
              className="p-3 bg-surface-900/60 rounded-2xl border border-surface-800 hover:border-primary-500/60 hover:bg-surface-800/60 transition group flex flex-col items-center justify-center gap-2 text-surface-300 hover:text-primary-400"
            >
              <div className="p-2 bg-surface-950 rounded-xl group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <span className="text-xs font-semibold">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vector Icon Stamps */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          Vector Stamps & Crests
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {VECTOR_ICONS.map((v) => (
            <button
              key={v.name}
              onClick={() => handleAddVectorIcon(v)}
              className="flex items-center gap-2.5 p-2.5 bg-surface-900/60 rounded-2xl border border-surface-800 hover:border-primary-500/60 hover:bg-surface-800/60 transition group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-950 p-1.5 border border-surface-800 flex items-center justify-center shrink-0">
                <img src={v.svg} alt={v.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-semibold text-surface-200 truncate group-hover:text-primary-400">
                {v.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
