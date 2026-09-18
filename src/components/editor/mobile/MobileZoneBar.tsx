import React from 'react';
import { useEditorStore } from '../../../store/editorStore';
import { useSceneStore, CameraPreset } from '../../../store/sceneStore';
import { DesignZone } from '../../../types/shirt';

export const MobileZoneBar: React.FC = () => {
  const activeZone = useEditorStore((s) => s.activeZone);
  const setActiveZone = useEditorStore((s) => s.setActiveZone);
  const layers = useEditorStore((s) => s.layers);
  const setCameraPreset = useSceneStore((s) => s.setCameraPreset);

  const zones: { id: DesignZone; label: string; camera: CameraPreset }[] = [
    { id: 'front', label: 'Front', camera: 'front' },
    { id: 'back', label: 'Back', camera: 'back' },
    { id: 'sleeve_left', label: 'Left', camera: 'sleeve_left' },
    { id: 'sleeve_right', label: 'Right', camera: 'sleeve_right' },
  ];

  const handleZoneChange = (zone: DesignZone, camera: CameraPreset) => {
    setActiveZone(zone);
    setCameraPreset(camera);
  };

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 lg:hidden pointer-events-auto select-none">
      <div className="flex items-center gap-1 p-1 bg-surface-950/85 backdrop-blur-xl border border-surface-700/80 rounded-2xl shadow-2xl">
        {zones.map((z) => {
          const count = layers.filter((l) => l.zone === z.id).length;
          const isActive = activeZone === z.id;
          return (
            <button
              key={z.id}
              onClick={() => handleZoneChange(z.id, z.camera)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-600/30 scale-105'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800/80'
              }`}
            >
              <span>{z.label}</span>
              {count > 0 && (
                <span
                  className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-extrabold ${
                    isActive ? 'bg-white text-primary-600' : 'bg-surface-700 text-surface-200'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
