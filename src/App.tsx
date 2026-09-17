import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/common/Navbar';
import { EditorSidebar } from './components/editor/EditorSidebar';
import { StudioScene } from './components/3d/StudioScene';
import { Canvas2DStage } from './components/editor/Canvas2DStage';
import { ExportModal } from './components/export/ExportModal';
import { ProjectSaveModal } from './components/export/ProjectSaveModal';
import { FeedbackModal } from './components/feedback/FeedbackModal';
import { LandingPage } from './components/landing/LandingPage';
import { ChangelogPage } from './components/changelog/ChangelogPage';
import { useEditorStore } from './store/editorStore';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'split' | '2d'>('split');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(true);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);

  const activePage = useEditorStore((s) => s.activePage);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const deleteLayer = useEditorStore((s) => s.deleteLayer);
  const setExportModalOpen = useEditorStore((s) => s.setExportModalOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && viewMode === 'split') {
        setViewMode('3d');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        e.preventDefault();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        redo();
        e.preventDefault();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        setExportModalOpen(true);
        e.preventDefault();
      } else if ((e.key === 'Backspace' || e.key === 'Delete') && selectedLayerId) {
        deleteLayer(selectedLayerId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedLayerId, deleteLayer, setExportModalOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-950 font-sans text-surface-100 select-none">
      {/* Top Navigation Bar */}
      <Navbar viewMode={viewMode} setViewMode={setViewMode} />

      {/* Main Content Router */}
      <div className="flex-1 overflow-hidden relative">
        {activePage === 'landing' && <LandingPage />}

        {activePage === 'changelog' && <ChangelogPage />}

        {activePage === 'studio' && (
          <div className="w-full h-full flex flex-col-reverse lg:flex-row overflow-hidden relative">
            <EditorSidebar
              isMobileOpen={isMobileDrawerOpen}
              onToggleMobile={() => setIsMobileDrawerOpen((prev) => !prev)}
            />

            <main className="flex-1 h-full min-h-0 flex overflow-hidden relative bg-surface-950">
              {(viewMode === '3d' || viewMode === 'split') && (
                <div
                  className={`h-full relative transition-all duration-300 ${
                    viewMode === 'split'
                      ? 'w-full lg:w-1/2 border-r border-surface-800/80'
                      : 'w-full'
                  }`}
                >
                  <StudioScene canvasRef={canvas3DRef} />
                </div>
              )}

              {(viewMode === '2d' || viewMode === 'split') && (
                <div
                  className={`h-full relative transition-all duration-300 bg-surface-950/60 ${
                    viewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full'
                  }`}
                >
                  <Canvas2DStage />
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Modals */}
      <ExportModal canvas3DRef={canvas3DRef} />
      <ProjectSaveModal />
      <FeedbackModal />
    </div>
  );
};

export default App;
