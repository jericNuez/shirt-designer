import React from 'react';
import {
  Shirt,
  Undo2,
  Redo2,
  FolderOpen,
  Download,
  SplitSquareVertical,
  Box,
  LayoutTemplate,
  Coffee,
  MessageSquareHeart,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface NavbarProps {
  viewMode: '3d' | 'split' | '2d';
  setViewMode: (mode: '3d' | 'split' | '2d') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode }) => {
  const activePage = useEditorStore((s) => s.activePage);
  const setActivePage = useEditorStore((s) => s.setActivePage);

  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const pastLength = useEditorStore((s) => s.history.past.length);
  const futureLength = useEditorStore((s) => s.history.future.length);
  const setExportModalOpen = useEditorStore((s) => s.setExportModalOpen);
  const setProjectModalOpen = useEditorStore((s) => s.setProjectModalOpen);
  const setFeedbackModalOpen = useEditorStore((s) => s.setFeedbackModalOpen);

  return (
    <header className="h-16 px-3 sm:px-5 lg:px-6 bg-surface-950/90 border-b border-surface-800/80 backdrop-blur-xl flex items-center justify-between z-30 select-none">
      {/* Brand Logo & App Page Switcher */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Logo */}
        <button
          onClick={() => setActivePage('landing')}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 via-primary-500 to-secondary-500 p-0.5 shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-surface-950 rounded-[14px] flex items-center justify-center text-primary-400">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-black tracking-tight text-white uppercase">
                3D T-Shirt Customizer Studio
              </h1>
            </div>
            <p className="text-[10px] text-surface-400 font-medium">Custom Apparel</p>
          </div>
        </button>
      </div>

      {/* Center Studio Viewport Mode (when on studio page) */}
      {activePage === 'studio' && (
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center p-1 bg-surface-900 rounded-2xl border border-surface-800">
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === '3d'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D View</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'split'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>

            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === '2d'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>2D Canvas</span>
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-900 rounded-xl border border-surface-800">
            <button
              onClick={undo}
              disabled={pastLength === 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 disabled:opacity-30 transition"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={futureLength === 0}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 disabled:opacity-30 transition"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Right Actions: Feedback, Buy Me a Coffee, Save & Export */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Feedback Button */}
        <button
          onClick={() => setFeedbackModalOpen(true)}
          title="Give Feedback"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-surface-300 bg-surface-900 hover:bg-surface-800 border border-surface-800 hover:border-surface-700 transition"
        >
          <MessageSquareHeart className="w-3.5 h-3.5 text-primary-400" />
          <span className="hidden xl:inline">Feedback</span>
        </button>

        {/* Buy Me a Coffee */}
        <a
          href="https://buymeacoffee.com/jerictolibq"
          target="_blank"
          rel="noopener noreferrer"
          title="Support the developer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-surface-950 bg-gradient-to-r from-accent-400 to-amber-400 hover:from-amber-400 hover:to-accent-300 shadow-md shadow-accent-400/20 transition hover:scale-105"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Coffee</span>
        </a>

        {/* Project & Export (visible in studio) */}
        {activePage === 'studio' && (
          <>
            <button
              onClick={() => setProjectModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-surface-300 bg-surface-900 hover:bg-surface-800 border border-surface-800 transition"
            >
              <FolderOpen className="w-3.5 h-3.5 text-primary-400" />
              <span>Project</span>
            </button>

            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/30 transition hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
