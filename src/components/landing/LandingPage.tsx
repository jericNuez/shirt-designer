import React, { useRef } from 'react';
import {
  Shirt,
  Sparkles,
  ArrowRight,
  Layers,
  Download,
  RotateCw,
  Smartphone,
  Palette,
  Type,
  Coffee,
  Github,
  Heart,
  MessageSquareHeart,
  GitCommit,
  CheckCircle2,
  ExternalLink,
  MousePointer2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { HeroAnimatedShirt } from './HeroAnimatedShirt';

export const LandingPage: React.FC = () => {
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const setFeedbackModalOpen = useEditorStore((s) => s.setFeedbackModalOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <RotateCw className="w-6 h-6 text-primary-400" />,
      title: '360° Real-Time 3D Studio',
      description:
        'Interact with a photorealistic 3D garment model in any angle with smooth orbit damping and studio lighting presets.',
    },
    {
      icon: <Layers className="w-6 h-6 text-success-400" />,
      title: 'Multi-Zone Artwork Placement',
      description:
        'Design freely across Front Chest, Back Print, Left Sleeve, and Right Sleeve with live dynamic decal synchronization.',
    },
    {
      icon: <Type className="w-6 h-6 text-accent-400" />,
      title: 'Rich Typography & Curved Text',
      description:
        'Curated Google Fonts with arched/curved text engine, customizable stroke outlines, and soft drop shadows.',
    },
    {
      icon: <Download className="w-6 h-6 text-secondary-400" />,
      title: 'Layered PSD & 300 DPI Export',
      description:
        'Download manufacturing-ready layered Adobe Photoshop (.psd) files and 4K photorealistic 3D mockup snapshots.',
    },
    {
      icon: <Palette className="w-6 h-6 text-primary-400" />,
      title: 'Curated Color & Fabric Palettes',
      description:
        'Experiment with curated apparel palettes and custom hex codes with photorealistic cotton weave shading.',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-success-400" />,
      title: 'Fully Mobile Optimized',
      description:
        'Seamless touch controls and an expandable bottom tool drawer for effortless designing on phones and tablets.',
    },
  ];

  return (
    <div
      ref={scrollContainerRef}
      className="w-full h-full overflow-y-auto bg-surface-950 text-surface-100 custom-scrollbar select-none"
    >
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden border-b border-surface-800/80">
        {/* Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[650px] h-96 sm:h-[650px] bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 left-10 w-60 h-60 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          {/* Hero Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent-400 animate-pulse" />
              <span>Next-Gen 3D T-Shirt Customizer</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Design Custom Apparel in{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent">
                Photorealistic 3D
              </span>
            </h1>

            <p className="text-sm sm:text-base text-surface-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Rotate in 360°, import your graphics, customize typography with curved text, and
              export layered Adobe PSD files & high-DPI snapshots ready for manufacturing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setActivePage('studio')}
                className="px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-sm rounded-2xl shadow-xl shadow-primary-600/30 flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span>Launch 3D Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://buymeacoffee.com/jerictolibq"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-surface-900 hover:bg-surface-800 border border-surface-700/80 hover:border-accent-500/50 text-surface-200 font-semibold text-sm rounded-2xl flex items-center gap-2 transition-all hover:scale-105 group"
              >
                <Coffee className="w-4 h-4 text-accent-400 group-hover:scale-110 transition-transform" />
                <span>Buy Me a Coffee</span>
              </a>
            </div>

            {/* Feature Check Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-surface-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success-400" />
                100% Free & Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success-400" />
                Layered PSD Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success-400" />
                WebGL High-DPI Renders
              </span>
            </div>
          </div>

          {/* Hero 3D Animated Showcase Canvas */}
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[520px] rounded-3xl overflow-hidden border border-surface-800/90 shadow-2xl bg-gradient-to-b from-surface-900/80 to-surface-950/90 backdrop-blur-md group">
            {/* 3D Animated Garment Canvas */}
            <HeroAnimatedShirt />

            {/* Interactive hint pills */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-surface-950/80 backdrop-blur-md rounded-full border border-surface-800 text-[11px] font-semibold text-surface-300 pointer-events-none">
              <MousePointer2 className="w-3.5 h-3.5 text-primary-400 animate-bounce" />
              <span>Move mouse & scroll to interact</span>
            </div>

            {/* Bottom Quick Launch Bar */}
            <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-surface-950/80 backdrop-blur-md rounded-2xl border border-surface-800/90 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                <span className="text-xs font-bold text-surface-200">Interactive 3D Preview</span>
              </div>
              <button
                onClick={() => setActivePage('studio')}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 text-white text-xs font-bold rounded-xl shadow-md shadow-primary-600/30 transition hover:scale-105 flex items-center gap-1.5"
              >
                <span>Customize in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Everything You Need
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Creators, Brands & Designers
          </h2>
          <p className="text-xs sm:text-sm text-surface-400">
            A comprehensive design suite powered by modern WebGL and 2D canvas technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-surface-900/60 hover:bg-surface-900 border border-surface-800 hover:border-primary-500/40 rounded-3xl space-y-3.5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-950 border border-surface-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-surface-100 group-hover:text-primary-300 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Author & Buy Me a Coffee Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-900/40 border-t border-b border-surface-800/80">
        <div className="max-w-4xl mx-auto bg-gradient-to-tr from-surface-900 to-surface-950 border border-surface-800 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-400 uppercase tracking-wider">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-white">Created by Jeric Nuez</h3>
            <p className="text-xs sm:text-sm text-surface-400 max-w-md">
              If you enjoy using this tool, consider supporting the project with a coffee!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="https://github.com/jericnuez"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-surface-800 hover:bg-surface-700 text-white text-xs font-bold rounded-2xl border border-surface-700 flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile</span>
              <ExternalLink className="w-3 h-3 text-surface-400" />
            </a>

            <a
              href="https://buymeacoffee.com/jerictolibq"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-accent-500 to-amber-500 hover:from-amber-500 hover:to-accent-400 text-surface-950 text-xs font-extrabold rounded-2xl shadow-lg shadow-accent-500/20 flex items-center justify-center gap-2 transition hover:scale-105"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy Me a Coffee</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-surface-800/80 bg-surface-950 text-xs text-surface-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-surface-200">3D T-Shirt Customizer Studio</span>
              <p className="text-[11px] text-surface-500">© 2026 Jeric Nuez. Open Source.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-surface-400">
            <button
              onClick={() => setActivePage('studio')}
              className="hover:text-primary-400 transition"
            >
              3D Studio
            </button>
            <button
              onClick={() => setActivePage('changelog')}
              className="hover:text-primary-400 transition flex items-center gap-1"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Changelog</span>
            </button>
            <button
              onClick={() => setActivePage('terms')}
              className="hover:text-primary-400 transition flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms</span>
            </button>
            <button
              onClick={() => setActivePage('privacy')}
              className="hover:text-primary-400 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy</span>
            </button>
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="hover:text-primary-400 transition flex items-center gap-1"
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>Feedback</span>
            </button>
            <a
              href="https://github.com/jericnuez"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://buymeacoffee.com/jerictolibq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-300 transition flex items-center gap-1"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Buy Me a Coffee</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
