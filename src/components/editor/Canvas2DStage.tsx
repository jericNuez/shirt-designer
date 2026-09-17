import React, { useRef, useEffect, useState } from 'react';
import { 
  Move, 
  RotateCw, 
  Trash2, 
  Copy, 
  Maximize2, 
  AlignCenterHorizontal, 
  AlignCenterVertical 
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { renderLayersToCanvas } from '../../utils/canvasRenderer';
import { DesignLayer, ImageLayer, TextLayer, ShapeLayer } from '../../types/editor';

export const Canvas2DStage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeZone = useEditorStore((s) => s.activeZone);
  const layers = useEditorStore((s) => s.layers);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useEditorStore((s) => s.setSelectedLayerId);
  const updateLayer = useEditorStore((s) => s.updateLayer);
  const deleteLayer = useEditorStore((s) => s.deleteLayer);
  const duplicateLayer = useEditorStore((s) => s.duplicateLayer);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const colors = useEditorStore((s) => s.colors);

  const zoneLayers = layers.filter((l) => l.zone === activeZone);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId && l.zone === activeZone);

  // Render 2D Canvas preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderLayersToCanvas(ctx, zoneLayers, canvas.width, canvas.height);
  }, [layers, activeZone, colors]);

  // Start Move Dragging with direct 1:1 mouse tracking
  const handleStartMove = (layer: DesignLayer, e: React.PointerEvent) => {
    if (layer.locked) return;
    e.preventDefault();
    e.stopPropagation();

    setSelectedLayerId(layer.id);
    if (layer.type === 'text') setActiveTab('text');
    else if (layer.type === 'image') setActiveTab('upload');
    else if (layer.type === 'shape') setActiveTab('clipart');

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialX = layer.x;
    const initialY = layer.y;

    const onPointerMove = (moveEv: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const deltaX = (moveEv.clientX - startClientX) / rect.width;
      const deltaY = (moveEv.clientY - startClientY) / rect.height;

      let newX = Math.max(0.05, Math.min(0.95, initialX + deltaX));
      let newY = Math.max(0.05, Math.min(0.95, initialY + deltaY));

      // Snap to center horizontal & vertical
      if (Math.abs(newX - 0.5) < 0.02) newX = 0.5;
      if (Math.abs(newY - 0.5) < 0.02) newY = 0.5;

      updateLayer(layer.id, { x: newX, y: newY });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Start Scaling with corner handle
  const handleStartScale = (layer: DesignLayer, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialScale = layer.scale;

    const onPointerMove = (moveEv: PointerEvent) => {
      const delta = ((moveEv.clientX - startClientX) + (moveEv.clientY - startClientY)) / 180;
      const newScale = Math.max(0.15, Math.min(3.0, initialScale + delta));
      updateLayer(layer.id, { scale: Number(newScale.toFixed(2)) });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Start Rotating with top handle
  const handleStartRotate = (layer: DesignLayer, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + layer.x * rect.width;
    const centerY = rect.top + layer.y * rect.height;

    const onPointerMove = (moveEv: PointerEvent) => {
      const angleRad = Math.atan2(moveEv.clientY - centerY, moveEv.clientX - centerX);
      let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
      if (angleDeg > 180) angleDeg -= 360;
      if (angleDeg < -180) angleDeg += 360;
      updateLayer(layer.id, { rotation: angleDeg });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const centerLayerH = () => {
    if (selectedLayer) updateLayer(selectedLayer.id, { x: 0.5 });
  };

  const centerLayerV = () => {
    if (selectedLayer) updateLayer(selectedLayer.id, { y: 0.5 });
  };

  const getLayerBoxSize = (layer: DesignLayer) => {
    if (layer.type === 'text') {
      const textLayer = layer as TextLayer;
      const charWidth = (textLayer.fontSize || 30) * 0.6;
      const lines = (textLayer.text || '').split('\n');
      const maxLineLen = Math.max(...lines.map((l) => l.length), 4);
      const width = Math.max(80, maxLineLen * charWidth * layer.scale);
      const height = Math.max(40, lines.length * (textLayer.fontSize || 30) * 1.3 * layer.scale);
      return { width, height };
    } else if (layer.type === 'image') {
      const imgLayer = layer as ImageLayer;
      const base = 160 * layer.scale;
      const aspect = imgLayer.aspectRatio || 1;
      return { width: Math.max(60, base), height: Math.max(60, base / aspect) };
    } else {
      const size = Math.max(70, 140 * layer.scale);
      return { width: size, height: size };
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 w-full h-full select-none">
      {/* 2D Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-72 h-88 sm:w-96 sm:h-[440px] rounded-3xl border border-surface-700/60 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: colors.body,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => {
          if (e.target === containerRef.current) {
            setSelectedLayerId(null);
          }
        }}
      >
        {/* Printable Safety Margin Guide */}
        <div className="absolute inset-8 border border-dashed border-primary-400/30 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
          <span className="text-[10px] font-semibold text-primary-400/60 tracking-wider uppercase">
            {activeZone.replace('_', ' ')} Printable Area
          </span>
          <span className="text-[10px] font-semibold text-primary-400/30 self-end">
            12" × 16"
          </span>
        </div>

        {/* Center alignment guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
          <div className="w-full h-px bg-primary-300" />
          <div className="absolute h-full w-px bg-primary-300" />
        </div>

        {/* 2D Canvas Background */}
        <canvas
          ref={canvasRef}
          width={800}
          height={1000}
          className="w-full h-full object-contain pointer-events-none z-0"
        />

        {/* --- Interactive Layers Overlay --- */}
        {zoneLayers.map((layer) => {
          if (!layer.visible) return null;
          const isSelected = layer.id === selectedLayerId;
          const box = getLayerBoxSize(layer);

          return (
            <div
              key={layer.id}
              className={`absolute z-10 select-none ${
                isSelected ? 'cursor-move ring-0' : 'cursor-pointer hover:border hover:border-primary-400/50 rounded-lg'
              }`}
              style={{
                left: `${layer.x * 100}%`,
                top: `${layer.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                width: `${box.width}px`,
                height: `${box.height}px`,
              }}
              onPointerDown={(e) => handleStartMove(layer, e)}
              title={`Click or drag to move ${layer.name || layer.type}`}
            >
              {isSelected ? (
                /* Selected Layer Gizmo Bounding Box */
                <div className="w-full h-full border-2 border-primary-500 rounded-xl bg-primary-500/10 backdrop-blur-[0.5px] relative">
                  {/* Rotation Handle (Top Center Knob) */}
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary-600 border-2 border-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto hover:scale-110 transition-transform"
                    onPointerDown={(e) => handleStartRotate(layer, e)}
                    title="Rotate Object (Drag left or right)"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-white" />
                  </div>

                  {/* Corner Resize Handles */}
                  <div
                    className="absolute -bottom-2.5 -right-2.5 w-6 h-6 rounded-lg bg-primary-600 border-2 border-white shadow-md cursor-nwse-resize pointer-events-auto flex items-center justify-center hover:scale-110 transition-transform"
                    onPointerDown={(e) => handleStartScale(layer, e)}
                    title="Resize Object (Drag out or in)"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>

                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-primary-500 border border-white" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary-500 border border-white" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full bg-primary-500 border border-white" />
                </div>
              ) : (
                <div className="w-full h-full opacity-0 hover:opacity-100 border border-dashed border-primary-400/60 rounded-xl bg-primary-500/5 transition-opacity" />
              )}
            </div>
          );
        })}
      </div>

      {/* Layer Quick Action Pill Bar */}
      {selectedLayer && (
        <div className="mt-3 flex items-center gap-1.5 p-1.5 bg-surface-900/90 backdrop-blur-md rounded-2xl border border-surface-800 shadow-xl z-10 animate-fade-in">
          <button
            onClick={centerLayerH}
            title="Align Center Horizontal"
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <AlignCenterHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={centerLayerV}
            title="Align Center Vertical"
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <AlignCenterVertical className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-surface-700" />
          <button
            onClick={() => duplicateLayer(selectedLayer.id)}
            title="Duplicate Layer"
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteLayer(selectedLayer.id)}
            title="Delete Layer"
            className="p-2 rounded-xl text-danger-400 hover:text-danger-200 hover:bg-danger-950/60 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
