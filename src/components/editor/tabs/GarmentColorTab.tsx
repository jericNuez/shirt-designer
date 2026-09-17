import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';
import { PRESET_COLORS } from '../../../types/shirt';

export const GarmentColorTab: React.FC = () => {
  const colors = useEditorStore((s) => s.colors);
  const setColor = useEditorStore((s) => s.setColor);

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'neutrals' | 'vibrant' | 'earth' | 'pastel'
  >('all');

  const filteredPresets =
    activeCategory === 'all'
      ? PRESET_COLORS
      : PRESET_COLORS.filter((c) => c.category === activeCategory);

  const currentColor = colors.body;

  return (
    <div className="space-y-6 pb-6">
      {/* Garment Color Swatch & Custom Hex Picker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-primary-400" />
            Garment Base Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setColor('all', e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <span className="font-mono text-xs text-surface-300 uppercase bg-surface-850 px-2 py-1 rounded-md border border-surface-700">
              {currentColor}
            </span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['all', 'neutrals', 'vibrant', 'earth', 'pastel'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition text-xs font-medium ${
                activeCategory === cat
                  ? 'bg-primary-600/30 text-primary-300 border border-primary-500/40'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Preset Palette Grid */}
        <div className="grid grid-cols-5 gap-2.5 pt-1">
          {filteredPresets.map((preset) => {
            const isSelected = currentColor.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.name}
                onClick={() => setColor('all', preset.hex)}
                title={`${preset.name} (${preset.hex})`}
                className={`group relative aspect-square rounded-xl transition-all duration-200 shadow-md flex items-center justify-center border ${
                  isSelected
                    ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-surface-900 scale-105 border-white'
                    : 'border-surface-700/60 hover:scale-105 hover:border-surface-500'
                }`}
                style={{ backgroundColor: preset.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 drop-shadow ${
                      [
                        '#ffffff',
                        '#f3e8dc',
                        '#d1d5db',
                        '#ccfbf1',
                        '#fef3c7',
                        '#fce7f3',
                        '#e9d5ff',
                        '#d4b996',
                      ].includes(preset.hex.toLowerCase())
                        ? 'text-surface-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
