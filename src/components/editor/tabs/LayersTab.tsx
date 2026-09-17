import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Type,
  Image as ImageIcon,
  Shapes,
  Sparkles,
} from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';

export const LayersTab: React.FC = () => {
  const activeZone = useEditorStore((s) => s.activeZone);
  const layers = useEditorStore((s) => s.layers);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useEditorStore((s) => s.setSelectedLayerId);
  const updateLayer = useEditorStore((s) => s.updateLayer);
  const deleteLayer = useEditorStore((s) => s.deleteLayer);
  const duplicateLayer = useEditorStore((s) => s.duplicateLayer);
  const reorderLayers = useEditorStore((s) => s.reorderLayers);
  const clearZoneLayers = useEditorStore((s) => s.clearZoneLayers);

  const zoneLayers = layers.filter((l) => l.zone === activeZone);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-3.5 h-3.5 text-primary-400" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-success-400" />;
      case 'shape':
        return <Shapes className="w-3.5 h-3.5 text-accent-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-secondary-400" />;
    }
  };

  const moveLayerOrder = (currentId: string, direction: 'up' | 'down') => {
    const globalIndex = layers.findIndex((l) => l.id === currentId);
    if (globalIndex === -1) return;

    const targetIndex = direction === 'up' ? globalIndex + 1 : globalIndex - 1;
    if (targetIndex >= 0 && targetIndex < layers.length) {
      reorderLayers(globalIndex, targetIndex);
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-surface-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary-400" />
          {activeZone.replace('_', ' ')} Layers ({zoneLayers.length})
        </label>
        {zoneLayers.length > 0 && (
          <button
            onClick={() => clearZoneLayers(activeZone)}
            className="text-[11px] text-danger-400 hover:text-danger-300 font-semibold transition"
          >
            Clear Zone
          </button>
        )}
      </div>

      {zoneLayers.length === 0 ? (
        <div className="p-8 text-center bg-surface-900/40 rounded-3xl border border-dashed border-surface-800 text-surface-500 text-xs">
          No layers added to this zone yet. Use the Text, Image, or Clipart tabs to create your
          design!
        </div>
      ) : (
        <div className="space-y-2">
          {[...zoneLayers].reverse().map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-600/20 border-primary-500/60 shadow-lg shadow-primary-600/10'
                    : 'bg-surface-900/70 border-surface-800/80 hover:bg-surface-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="p-1.5 bg-surface-950 rounded-lg border border-surface-800">
                    {getLayerIcon(layer.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-primary-200' : 'text-surface-200'
                      }`}
                    >
                      {layer.name || layer.type}
                    </div>
                    <div className="text-[10px] text-surface-400 capitalize">
                      {layer.type} • {Math.round(layer.scale * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerOrder(layer.id, 'up');
                    }}
                    title="Bring Forward"
                    className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerOrder(layer.id, 'down');
                    }}
                    title="Send Backward"
                    className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { locked: !layer.locked });
                    }}
                    title={layer.locked ? 'Unlock' : 'Lock'}
                    className={`p-1 rounded-lg ${
                      layer.locked
                        ? 'text-warning-400'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800'
                    }`}
                  >
                    {layer.locked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { visible: !layer.visible });
                    }}
                    title={layer.visible ? 'Hide' : 'Show'}
                    className={`p-1 rounded-lg ${
                      !layer.visible
                        ? 'text-danger-400'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800'
                    }`}
                  >
                    {layer.visible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateLayer(layer.id);
                    }}
                    title="Duplicate"
                    className="p-1 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayer(layer.id);
                    }}
                    title="Delete"
                    className="p-1 rounded-lg text-danger-400 hover:text-danger-200 hover:bg-danger-950/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
