import React from 'react';
import { Palette, Type, UploadCloud, Shapes, Layers, ChevronDown, X } from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';
import { GarmentColorTab } from '../tabs/GarmentColorTab';
import { ImageUploadTab } from '../tabs/ImageUploadTab';
import { TextEditorTab } from '../tabs/TextEditorTab';
import { ClipartTab } from '../tabs/ClipartTab';
import { LayersTab } from '../tabs/LayersTab';
import { ZoneSelector } from '../ZoneSelector';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({ isOpen, onClose }) => {
  const activeTab = useEditorStore((s) => s.activeTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const layers = useEditorStore((s) => s.layers);

  if (!isOpen) return null;

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'colors', label: 'Garment', icon: <Palette className="w-4 h-4" /> },
    { id: 'text', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'upload', label: 'Graphics', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'clipart', label: 'Cliparts', icon: <Shapes className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" />, badge: layers.length },
  ];

  return (
    <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-end select-none">
      {/* Semi-transparent Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-Up Sheet Container */}
      <div className="relative z-10 w-full bg-surface-950/98 border-t border-surface-700/90 rounded-t-3xl shadow-2xl flex flex-col max-h-[78vh] sm:max-h-[68vh] overflow-hidden animate-slide-up">
        {/* Grab Handle & Header */}
        <div className="flex flex-col items-center pt-2.5 pb-2 px-4 border-b border-surface-800/80 bg-surface-900/60 shrink-0">
          <div
            onClick={onClose}
            className="w-12 h-1.5 rounded-full bg-surface-700 cursor-pointer hover:bg-surface-500 transition mb-2"
          />

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {tabs.find((t) => t.id === activeTab)?.label || 'Tools'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-surface-400 hover:text-white bg-surface-800/70 border border-surface-700/60 transition"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-surface-400 hover:text-white bg-surface-800/70 border border-surface-700/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Zone Selector Bar */}
        <div className="p-2.5 border-b border-surface-800/80 bg-surface-900/30 shrink-0">
          <ZoneSelector />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-between p-1.5 border-b border-surface-800/80 bg-surface-900/40 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-semibold transition-all relative ${
                  isActive
                    ? 'text-primary-400 bg-primary-500/15 border border-primary-500/30 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-900/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute top-1 right-1.5 w-3.5 h-3.5 rounded-full bg-primary-600 text-white text-[8px] flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Tool Panel Content Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
          {activeTab === 'colors' && <GarmentColorTab />}
          {activeTab === 'text' && <TextEditorTab />}
          {activeTab === 'upload' && <ImageUploadTab />}
          {activeTab === 'clipart' && <ClipartTab />}
          {activeTab === 'layers' && <LayersTab />}
        </div>
      </div>
    </div>
  );
};
