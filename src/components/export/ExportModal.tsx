import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Camera, 
  Printer, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEditorStore } from '../../store/editorStore';
import { ExportOptions, ExportFormat, ExportTarget, MockupBackground, ExportResolution } from '../../types/export';
import { capture3DMockup, generatePrintArtwork, downloadFile } from '../../utils/imageExporter';

interface ExportModalProps {
  canvas3DRef?: React.RefObject<HTMLCanvasElement>;
}

export const ExportModal: React.FC<ExportModalProps> = ({ canvas3DRef }) => {
  const isOpen = useEditorStore((s) => s.isExportModalOpen);
  const setOpen = useEditorStore((s) => s.setExportModalOpen);
  const setFeedbackModalOpen = useEditorStore((s) => s.setFeedbackModalOpen);
  const layers = useEditorStore((s) => s.layers);
  const colors = useEditorStore((s) => s.colors);
  const activeZone = useEditorStore((s) => s.activeZone);

  const [target, setTarget] = useState<ExportTarget>('3d_mockup');
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<ExportResolution>('2x');
  const [background, setBackground] = useState<MockupBackground>('studio');
  const [includeMeasurements, setIncludeMeasurements] = useState(true);
  const [fileName, setFileName] = useState('custom-tshirt-design');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const options: ExportOptions = {
        target,
        format,
        resolution,
        background,
        includeMeasurements,
        fileName,
      };

      if (target === '3d_mockup') {
        const canvas = canvas3DRef?.current || (document.querySelector('canvas') as HTMLCanvasElement);
        if (!canvas) {
          throw new Error('3D Canvas viewport not found');
        }

        const result = await capture3DMockup(canvas, options);
        downloadFile(result, `${fileName}-3d-mockup.${format}`);
      } else {
        const result = await generatePrintArtwork(layers, colors, activeZone, options);
        downloadFile(result, `${fileName}-print-${activeZone}.${format}`);
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setOpen(false);

      // Automatically trigger feedback modal after export to collect impressions!
      setTimeout(() => {
        setFeedbackModalOpen(true);
      }, 1000);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-surface-900 border border-surface-800 rounded-3xl p-6 shadow-2xl space-y-6 text-surface-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Export Design & Production Files</h2>
              <p className="text-xs text-surface-400">Download high-res 3D mockups or print-ready layered artwork</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTarget('3d_mockup')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              target === '3d_mockup'
                ? 'bg-primary-600/15 border-primary-500 text-white shadow-lg'
                : 'bg-surface-800/50 border-surface-700/60 text-surface-400 hover:bg-surface-800'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-surface-100">
              <Camera className="w-4 h-4 text-primary-400" />
              3D Mockup Snapshot
            </div>
            <p className="text-xs text-surface-400 mt-1">
              Photorealistic render from your current 3D camera angle
            </p>
          </button>

          <button
            onClick={() => setTarget('print_template')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              target === 'print_template'
                ? 'bg-primary-600/15 border-primary-500 text-white shadow-lg'
                : 'bg-surface-800/50 border-surface-700/60 text-surface-400 hover:bg-surface-800'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm text-surface-100">
              <Printer className="w-4 h-4 text-success-400" />
              Print-Ready Flat Artwork
            </div>
            <p className="text-xs text-surface-400 mt-1">
              High-DPI manufacturing layout with layer preservation
            </p>
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-surface-300 uppercase tracking-wider">
            File Format
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'png', label: 'PNG Image', desc: 'Lossless & transparent support' },
              { id: 'jpg', label: 'JPEG / JPG', desc: 'Standard compressed format' },
              { id: 'psd', label: 'Adobe PSD', desc: 'Layered Photoshop file' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as any)}
                className={`p-3 rounded-xl border text-left transition ${
                  format === f.id
                    ? 'bg-primary-600 text-white border-primary-400 shadow-md'
                    : 'bg-surface-800/60 border-surface-700 text-surface-300 hover:bg-surface-800'
                }`}
              >
                <div className="text-xs font-bold">{f.label}</div>
                <div className={`text-[10px] truncate ${format === f.id ? 'text-primary-100' : 'text-surface-400'}`}>
                  {f.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Background Options (if 3D Mockup) */}
        {target === '3d_mockup' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-surface-300 uppercase tracking-wider">
              Background Style
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'transparent', label: 'Transparent' },
                { id: 'studio', label: 'Studio Dark' },
                { id: 'white', label: 'Pure White' },
                { id: 'gradient', label: 'Spotlight' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                    background === bg.id
                      ? 'bg-primary-600/30 border-primary-500 text-primary-200 shadow'
                      : 'bg-surface-800/50 border-surface-700/60 text-surface-400 hover:text-white'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Print template extra options */}
        {target === 'print_template' && (
          <div className="p-3 bg-surface-800/60 rounded-xl flex items-center justify-between border border-surface-700">
            <div className="text-xs text-surface-300 font-medium">
              Include Print Boundary Guides & 300 DPI Dimensions
            </div>
            <button
              onClick={() => setIncludeMeasurements(!includeMeasurements)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                includeMeasurements ? 'bg-primary-600 text-white' : 'bg-surface-700 text-surface-400'
              }`}
            >
              {includeMeasurements ? 'Included' : 'None'}
            </button>
          </div>
        )}

        {/* Filename input */}
        <div className="space-y-1.5">
          <label className="text-xs text-surface-400">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-3 py-2 text-xs text-surface-100 outline-none focus:border-primary-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-surface-400 hover:text-white hover:bg-surface-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download {format.toUpperCase()} File
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
