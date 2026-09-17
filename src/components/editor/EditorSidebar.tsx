import React from 'react';
import { 
  Palette, 
  UploadCloud, 
  Type, 
  Shapes, 
  Layers, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { GarmentColorTab } from './tabs/GarmentColorTab';
import { ImageUploadTab } from './tabs/ImageUploadTab';
import { TextEditorTab } from './tabs/TextEditorTab';
import { ClipartTab } from './tabs/ClipartTab';
import { LayersTab } from './tabs/LayersTab';
import { ZoneSelector } from './ZoneSelector';

interface EditorSidebarProps {
  isMobileOpen?: boolean;
  onToggleMobile?: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ 
  isMobileOpen = true, 
  onToggleMobile 
}) => {
  const activeTab = useEditorStore((s) => s.activeTab);
  const setActiveTab = useEditorStore((s) => s.setActiveTab);
  const layers = useEditorStore((s) => s.layers);

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'colors', label: 'Garment', icon: <Palette className="w-4 h-4" /> },
    { id: 'text', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'upload', label: 'Graphics', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'clipart', label: 'Cliparts', icon: <Shapes className="w-4 h-4" /> },
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4" />, badge: layers.length },
  ];

  return (
    <aside
      className={`w-full lg:w-[420px] bg-surface-950/95 border-t lg:border-t-0 lg:border-r border-surface-800/80 z-20 backdrop-blur-xl flex flex-col transition-all duration-300 ${
        isMobileOpen
          ? 'h-[55vh] lg:h-full max-h-[75vh] lg:max-h-none'
          : 'h-14 lg:h-full overflow-hidden'
      }`}
    >
      {/* Mobile Drawer Toggle Header */}
      <div 
        onClick={onToggleMobile}
        className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-surface-900 border-b border-surface-800 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-xs font-bold text-surface-200">
            Design Studio Controls & Tools
          </span>
          <span className="text-[10px] bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full capitalize">
            {activeTab}
          </span>
        </div>
        <button className="p-1 rounded-lg text-surface-400 hover:text-white">
          {isMobileOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Top Zone Selection Bar */}
      <div className="p-2.5 sm:p-3.5 border-b border-surface-800/80 flex items-center justify-between bg-surface-900/40 shrink-0">
        <ZoneSelector />
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center justify-between p-1.5 sm:p-2 border-b border-surface-800/80 bg-surface-900/20 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (!isMobileOpen && onToggleMobile) {
                  onToggleMobile();
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all duration-200 relative ${
                isActive
                  ? 'text-primary-400 bg-primary-500/10 shadow-sm border border-primary-500/20'
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

      {/* Tab Panel Content Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
        {activeTab === 'colors' && <GarmentColorTab />}
        {activeTab === 'text' && <TextEditorTab />}
        {activeTab === 'upload' && <ImageUploadTab />}
        {activeTab === 'clipart' && <ClipartTab />}
        {activeTab === 'layers' && <LayersTab />}
      </div>
    </aside>
  );
};
