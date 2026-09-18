import React from 'react';
import { Palette, Type, UploadCloud, Shapes, Layers } from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';

interface MobileBottomDockProps {
  isSheetOpen: boolean;
  onOpenSheet: (tab?: 'colors' | 'text' | 'upload' | 'clipart' | 'layers') => void;
  onToggleSheet: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  isSheetOpen,
  onOpenSheet,
  onToggleSheet,
}) => {
  const activeTab = useEditorStore((s) => s.activeTab);
  const layers = useEditorStore((s) => s.layers);

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'colors', label: 'Garment', icon: <Palette className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'clipart', label: 'Clipart', icon: <Shapes className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" />, badge: layers.length },
  ];

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-sm mx-auto z-30 lg:hidden pointer-events-auto select-none">
      <div className="bg-surface-950/90 backdrop-blur-2xl border border-surface-700/90 rounded-2xl shadow-2xl p-1.5 flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = isSheetOpen && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (isSheetOpen && activeTab === tab.id) {
                  onToggleSheet();
                } else {
                  onOpenSheet(tab.id);
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/40 font-bold scale-105'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-900/60 active:scale-95'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`absolute -top-1 right-1 sm:right-2 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold ${
                    isActive ? 'bg-white text-primary-600' : 'bg-primary-600 text-white shadow'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
