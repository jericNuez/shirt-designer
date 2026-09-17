import React, { useRef } from 'react';
import { 
  X, 
  Save, 
  Upload, 
  FolderOpen, 
  Download, 
  RotateCcw, 
  HardDrive, 
  FileCode 
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { downloadFile } from '../../utils/imageExporter';
import { ProjectData } from '../../types/editor';

export const ProjectSaveModal: React.FC = () => {
  const isOpen = useEditorStore((s) => s.isProjectModalOpen);
  const setOpen = useEditorStore((s) => s.setProjectModalOpen);
  const colors = useEditorStore((s) => s.colors);
  const layers = useEditorStore((s) => s.layers);
  const loadProject = useEditorStore((s) => s.loadProject);
  const resetProject = useEditorStore((s) => s.resetProject);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const project: ProjectData = {
      version: '1.0.0',
      timestamp: Date.now(),
      title: 'Custom T-Shirt Design',
      colors,
      layers,
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    downloadFile(blob, `shirt-design-project-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const project = JSON.parse(content) as ProjectData;
        if (project.colors && project.layers) {
          loadProject(project);
          alert('Project loaded successfully!');
          setOpen(false);
        } else {
          alert('Invalid project file format.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse project file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveToLocalStorage = () => {
    const project: ProjectData = {
      version: '1.0.0',
      timestamp: Date.now(),
      title: 'Auto-Saved Design',
      colors,
      layers,
    };
    localStorage.setItem('shirt_designer_project', JSON.stringify(project));
    alert('Project saved to browser storage!');
  };

  const handleLoadFromLocalStorage = () => {
    const saved = localStorage.getItem('shirt_designer_project');
    if (!saved) {
      alert('No saved project found in browser storage.');
      return;
    }
    try {
      const project = JSON.parse(saved) as ProjectData;
      loadProject(project);
      alert('Loaded saved design from browser storage!');
      setOpen(false);
    } catch {
      alert('Failed to load project from storage.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-surface-900 border border-surface-800 rounded-3xl p-6 shadow-2xl space-y-6 text-surface-100">
        <div className="flex items-center justify-between border-b border-surface-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Project Save & Load</h2>
              <p className="text-xs text-surface-400">Save your work as a file or sync with local storage</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportJSON}
        />

        <div className="space-y-3">
          {/* Export JSON Project */}
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3.5 bg-surface-800/80 hover:bg-surface-800 border border-surface-700/80 hover:border-primary-500/60 rounded-2xl transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600/20 text-primary-400 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-surface-200">Export Project File (.JSON)</div>
                <div className="text-[11px] text-surface-400">Download portable project file to keep or share</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-surface-500 group-hover:text-primary-400" />
          </button>

          {/* Import JSON Project */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3.5 bg-surface-800/80 hover:bg-surface-800 border border-surface-700/80 hover:border-primary-500/60 rounded-2xl transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success-600/20 text-success-400 rounded-xl group-hover:bg-success-600 group-hover:text-white transition">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-surface-200">Open Project File (.JSON)</div>
                <div className="text-[11px] text-surface-400">Resume a previously exported design</div>
              </div>
            </div>
            <FolderOpen className="w-4 h-4 text-surface-500 group-hover:text-success-400" />
          </button>

          {/* Save to Browser Storage */}
          <button
            onClick={handleSaveToLocalStorage}
            className="w-full flex items-center justify-between p-3.5 bg-surface-800/80 hover:bg-surface-800 border border-surface-700/80 hover:border-primary-500/60 rounded-2xl transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-600/20 text-accent-400 rounded-xl group-hover:bg-accent-600 group-hover:text-white transition">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-surface-200">Save to Browser Storage</div>
                <div className="text-[11px] text-surface-400">Quickly save state in this browser session</div>
              </div>
            </div>
            <Save className="w-4 h-4 text-surface-500 group-hover:text-accent-400" />
          </button>

          {/* Load from Browser Storage */}
          <button
            onClick={handleLoadFromLocalStorage}
            className="w-full flex items-center justify-between p-3.5 bg-surface-800/80 hover:bg-surface-800 border border-surface-700/80 hover:border-primary-500/60 rounded-2xl transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary-600/20 text-secondary-400 rounded-xl group-hover:bg-secondary-600 group-hover:text-white transition">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-surface-200">Restore Browser Save</div>
                <div className="text-[11px] text-surface-400">Restore the last auto-saved state</div>
              </div>
            </div>
            <FolderOpen className="w-4 h-4 text-surface-500 group-hover:text-secondary-400" />
          </button>

          {/* Reset Project */}
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all designs?')) {
                resetProject();
                setOpen(false);
              }
            }}
            className="w-full flex items-center justify-between p-3 bg-danger-950/20 hover:bg-danger-950/40 border border-danger-900/40 rounded-2xl transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-danger-500/20 text-danger-400 rounded-xl">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-danger-300">Reset Design Canvas</div>
                <div className="text-[10px] text-danger-400/80">Clear all layers & start fresh</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
