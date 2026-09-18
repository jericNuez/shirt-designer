import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCw,
  Trash2,
  Copy,
  Maximize2,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Move,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { renderLayersToCanvasSync, measureTextLayer } from '../../utils/canvasRenderer';
import { DesignLayer, ImageLayer, TextLayer } from '../../types/editor';

interface ActiveTransform {
  id: string;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
}

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

  const [activeTransform, setActiveTransform] = useState<ActiveTransform | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [snapGuides, setSnapGuides] = useState<{ x: boolean; y: boolean }>({ x: false, y: false });
  const [containerWidth, setContainerWidth] = useState(360);

  const zoneLayers = layers.filter((l) => l.zone === activeZone);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId && l.zone === activeZone);

  // Measure container dimensions continuously for pixel-perfect gizmo sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setContainerWidth(w);
      }
    };

    updateSize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Helper to re-render 2D canvas with current/temporary layers synchronously
  const redrawCanvas = useCallback(
    (customLayers?: DesignLayer[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const layersToRender = (customLayers || layers).filter((l) => l.zone === activeZone);
      renderLayersToCanvasSync(ctx, layersToRender, canvas.width, canvas.height, () => {
        // Callback if an image just finished async loading
        if (canvasRef.current) {
          const context = canvasRef.current.getContext('2d');
          if (context) {
            renderLayersToCanvasSync(context, layersToRender, canvas.width, canvas.height);
          }
        }
      });
    },
    [layers, activeZone]
  );

  // Initial & store sync render
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, colors, activeZone]);

  // 100% Synchronized Move Dragging with Zero-Latency Real-Time Canvas Redraw
  const handleStartMove = (layer: DesignLayer, e: React.PointerEvent<HTMLDivElement>) => {
    if (layer.locked) return;
    e.preventDefault();
    e.stopPropagation();

    setSelectedLayerId(layer.id);
    if (layer.type === 'text') setActiveTab('text');
    else if (layer.type === 'image') setActiveTab('upload');
    else if (layer.type === 'shape') setActiveTab('clipart');

    setIsDragging(true);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialX = layer.x;
    const initialY = layer.y;

    let latestX = initialX;
    let latestY = initialY;

    const onPointerMove = (moveEv: PointerEvent) => {
      moveEv.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;

      const deltaX = (moveEv.clientX - startClientX) / rect.width;
      const deltaY = (moveEv.clientY - startClientY) / rect.height;

      let newX = Math.max(0.04, Math.min(0.96, initialX + deltaX));
      let newY = Math.max(0.04, Math.min(0.96, initialY + deltaY));

      const snapX = Math.abs(newX - 0.5) < 0.025;
      const snapY = Math.abs(newY - 0.5) < 0.025;

      setSnapGuides({ x: snapX, y: snapY });

      if (snapX) newX = 0.5;
      if (snapY) newY = 0.5;

      latestX = newX;
      latestY = newY;

      // 1. Move bounding box gizmo
      setActiveTransform({ id: layer.id, x: newX, y: newY });

      // 2. Synchronously redraw 2D canvas in the exact same frame (0ms latency)
      const tempLayers = layers.map((l) => (l.id === layer.id ? { ...l, x: newX, y: newY } : l));
      redrawCanvas(tempLayers);
    };

    const onPointerUp = (upEv: PointerEvent) => {
      upEv.preventDefault();
      setIsDragging(false);
      setSnapGuides({ x: false, y: false });

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      // Commit to store & clear local transform
      setActiveTransform(null);
      updateLayer(layer.id, { x: latestX, y: latestY });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // 100% Synchronized Scaling with Real-Time Canvas Redraw
  const handleStartScale = (layer: DesignLayer, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsScaling(true);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const initialScale = layer.scale;

    let latestScale = initialScale;

    const onPointerMove = (moveEv: PointerEvent) => {
      moveEv.preventDefault();
      const delta = (moveEv.clientX - startClientX + (moveEv.clientY - startClientY)) / 160;
      const newScale = Math.max(0.15, Math.min(3.5, initialScale + delta));
      latestScale = Number(newScale.toFixed(2));

      setActiveTransform({ id: layer.id, scale: latestScale });

      const tempLayers = layers.map((l) => (l.id === layer.id ? { ...l, scale: latestScale } : l));
      redrawCanvas(tempLayers);
    };

    const onPointerUp = (upEv: PointerEvent) => {
      upEv.preventDefault();
      setIsScaling(false);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setActiveTransform(null);
      updateLayer(layer.id, { scale: latestScale });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // 100% Synchronized Rotating with Real-Time Canvas Redraw
  const handleStartRotate = (layer: DesignLayer, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + layer.x * rect.width;
    const centerY = rect.top + layer.y * rect.height;

    setIsRotating(true);
    let latestRotation = layer.rotation;

    const onPointerMove = (moveEv: PointerEvent) => {
      moveEv.preventDefault();
      const angleRad = Math.atan2(moveEv.clientY - centerY, moveEv.clientX - centerX);
      let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
      if (angleDeg > 180) angleDeg -= 360;
      if (angleDeg < -180) angleDeg += 360;

      // Snap to cardinal angles
      if (Math.abs(angleDeg) < 4) angleDeg = 0;
      else if (Math.abs(angleDeg - 90) < 4) angleDeg = 90;
      else if (Math.abs(angleDeg + 90) < 4) angleDeg = -90;
      else if (Math.abs(Math.abs(angleDeg) - 180) < 4) angleDeg = 180;

      latestRotation = angleDeg;
      setActiveTransform({ id: layer.id, rotation: latestRotation });

      const tempLayers = layers.map((l) =>
        l.id === layer.id ? { ...l, rotation: latestRotation } : l
      );
      redrawCanvas(tempLayers);
    };

    const onPointerUp = (upEv: PointerEvent) => {
      upEv.preventDefault();
      setIsRotating(false);

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      setActiveTransform(null);
      updateLayer(layer.id, { rotation: latestRotation });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const centerLayerH = useCallback(() => {
    if (selectedLayer) updateLayer(selectedLayer.id, { x: 0.5 });
  }, [selectedLayer, updateLayer]);

  const centerLayerV = useCallback(() => {
    if (selectedLayer) updateLayer(selectedLayer.id, { y: 0.5 });
  }, [selectedLayer, updateLayer]);

  // Accurate pixel dimensions matching canvas coordinate ratios
  const getLayerBoxSize = (layer: DesignLayer, scaleOverride?: number) => {
    const scale = scaleOverride !== undefined ? scaleOverride : layer.scale;
    const cWidth = containerWidth || 360;
    const scaleFactor = cWidth / 800;

    if (layer.type === 'text') {
      const textDim = measureTextLayer(layer as TextLayer, 800);
      return {
        width: Math.max(48, textDim.width * scaleFactor * scale),
        height: Math.max(32, textDim.height * scaleFactor * scale),
      };
    } else if (layer.type === 'image') {
      const imgLayer = layer as ImageLayer;
      const baseWidth = 350 * scaleFactor * scale;
      const aspect = imgLayer.aspectRatio || 1;
      return {
        width: Math.max(48, baseWidth),
        height: Math.max(48, baseWidth / aspect),
      };
    } else {
      const baseSize = 250 * scaleFactor * scale;
      return {
        width: Math.max(48, baseSize),
        height: Math.max(48, baseSize),
      };
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-6 pt-16 lg:pt-4 w-full h-full overflow-hidden select-none touch-none">
      {/* 2D Full-Screen Garment Board Container (Guaranteed exact 4:5 Aspect Ratio) */}
      <div
        ref={containerRef}
        className={`relative aspect-[4/5] rounded-3xl border border-surface-700/70 shadow-2xl overflow-hidden flex items-center justify-center select-none touch-none ${
          isDragging
            ? 'cursor-grabbing'
            : isRotating
              ? 'cursor-grabbing'
              : isScaling
                ? 'cursor-nwse-resize'
                : ''
        }`}
        style={{
          backgroundColor: colors.body,
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
          width: '100%',
          maxWidth: 'min(92vw, calc((100dvh - 160px) * 0.8), 540px)',
          height: 'auto',
        }}
        onClick={(e) => {
          if (e.target === containerRef.current || e.target === canvasRef.current) {
            setSelectedLayerId(null);
          }
        }}
      >
        {/* Printable Safety Margin Guide */}
        <div className="absolute inset-5 sm:inset-8 border border-dashed border-primary-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-2.5 z-10">
          <span className="text-[10px] font-bold text-primary-400/80 tracking-wider uppercase">
            {activeZone.replace('_', ' ')} Printable Area
          </span>
          <span className="text-[10px] font-semibold text-primary-400/50 self-end">12" × 16"</span>
        </div>

        {/* Center alignment guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 z-10">
          <div
            className={`w-full h-px transition-colors duration-150 ${
              snapGuides.y ? 'bg-accent-400 h-0.5 opacity-100' : 'bg-primary-300'
            }`}
          />
          <div
            className={`absolute h-full w-px transition-colors duration-150 ${
              snapGuides.x ? 'bg-accent-400 w-0.5 opacity-100' : 'bg-primary-300'
            }`}
          />
        </div>

        {/* 2D Canvas Background (Fills 100% of the 4:5 board with zero letterboxing) */}
        <canvas
          ref={canvasRef}
          width={800}
          height={1000}
          className="absolute inset-0 w-full h-full block pointer-events-none z-0"
        />

        {/* --- Interactive Layers Overlay --- */}
        {zoneLayers.map((layer) => {
          if (!layer.visible) return null;
          const isSelected = layer.id === selectedLayerId;
          const isCurrentActive = activeTransform?.id === layer.id;

          const currentX =
            isCurrentActive && activeTransform.x !== undefined ? activeTransform.x : layer.x;
          const currentY =
            isCurrentActive && activeTransform.y !== undefined ? activeTransform.y : layer.y;
          const currentRotation =
            isCurrentActive && activeTransform.rotation !== undefined
              ? activeTransform.rotation
              : layer.rotation;
          const currentScale =
            isCurrentActive && activeTransform.scale !== undefined
              ? activeTransform.scale
              : layer.scale;

          const box = getLayerBoxSize(layer, currentScale);

          return (
            <div
              key={layer.id}
              className={`absolute z-20 select-none touch-none ${
                isSelected
                  ? 'cursor-move ring-0'
                  : 'cursor-pointer hover:border hover:border-primary-400/50 rounded-xl'
              }`}
              style={{
                left: `${currentX * 100}%`,
                top: `${currentY * 100}%`,
                transform: `translate(-50%, -50%) rotate(${currentRotation}deg)`,
                width: `${box.width}px`,
                height: `${box.height}px`,
                willChange: isDragging || isRotating || isScaling ? 'transform, left, top' : 'auto',
              }}
              onPointerDown={(e) => handleStartMove(layer, e)}
              title={`Drag to move ${layer.name || layer.type}`}
            >
              {isSelected ? (
                /* Selected Layer Gizmo Bounding Box */
                <div className="w-full h-full border-2 border-primary-400 rounded-xl bg-primary-500/10 backdrop-blur-[0.5px] relative">
                  {/* Rotation Handle (Top Center Knob with Stem) */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                    <div
                      className="w-8 h-8 rounded-full bg-primary-600 border-2 border-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform touch-none"
                      onPointerDown={(e) => handleStartRotate(layer, e)}
                      title="Rotate Layer"
                    >
                      <RotateCw className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-0.5 h-2 bg-primary-400" />
                  </div>

                  {/* Corner Resize Handle (Bottom-Right) */}
                  <div
                    className="absolute -bottom-3.5 -right-3.5 w-8 h-8 rounded-xl bg-primary-600 border-2 border-white shadow-xl cursor-nwse-resize pointer-events-auto flex items-center justify-center hover:scale-110 active:scale-95 transition-transform touch-none"
                    onPointerDown={(e) => handleStartScale(layer, e)}
                    title="Resize Layer"
                  >
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>

                  {/* Corner Visual Indicator Dots */}
                  <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary-500 border-2 border-white shadow-sm" />
                  <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-primary-500 border-2 border-white shadow-sm" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary-500 border-2 border-white shadow-sm" />
                </div>
              ) : (
                <div className="w-full h-full opacity-0 hover:opacity-100 border border-dashed border-primary-400/60 rounded-xl bg-primary-500/5 transition-opacity" />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Layer Quick Action Floating Pill Bar */}
      {selectedLayer && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:mt-3 flex items-center gap-1.5 p-1.5 bg-surface-950/95 backdrop-blur-xl rounded-2xl border border-surface-700/80 shadow-2xl z-30 animate-fade-in pointer-events-auto">
          <div className="px-2 py-1 flex items-center gap-1 text-[11px] font-bold text-surface-300">
            <Move className="w-3 h-3 text-primary-400" />
            <span className="hidden sm:inline">Layer:</span>
            <span className="max-w-[80px] truncate">{selectedLayer.name}</span>
          </div>
          <div className="w-px h-4 bg-surface-700" />
          <button
            onClick={centerLayerH}
            title="Center Horizontal"
            className="p-1.5 sm:p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition active:scale-95"
          >
            <AlignCenterHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={centerLayerV}
            title="Center Vertical"
            className="p-1.5 sm:p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition active:scale-95"
          >
            <AlignCenterVertical className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-surface-700" />
          <button
            onClick={() => duplicateLayer(selectedLayer.id)}
            title="Duplicate Layer"
            className="p-1.5 sm:p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition active:scale-95"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteLayer(selectedLayer.id)}
            title="Delete Layer"
            className="p-1.5 sm:p-2 rounded-xl text-danger-400 hover:text-danger-200 hover:bg-danger-950/60 transition active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
