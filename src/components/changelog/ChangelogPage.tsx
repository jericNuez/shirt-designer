import React from 'react';
import {
  GitCommit,
  Sparkles,
  ArrowLeft,
  Tag,
  Bug,
  Zap,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { CHANGELOG_DATA, ChangelogEntry } from '../../data/changelog';

export const ChangelogPage: React.FC = () => {
  const setActivePage = useEditorStore((s) => s.setActivePage);

  const getTagBadge = (tag: ChangelogEntry['tag']) => {
    switch (tag) {
      case 'major':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30">
            Major Release
          </span>
        );
      case 'feature':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-500/20 text-success-300 border border-success-500/30">
            New Features
          </span>
        );
      case 'improvement':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-500/20 text-accent-300 border border-accent-500/30">
            Improvements
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-500/20 text-secondary-300 border border-secondary-500/30">
            Bug Fixes
          </span>
        );
    }
  };

  const getHighlightIcon = (type: 'feature' | 'improvement' | 'fix') => {
    switch (type) {
      case 'feature':
        return <Zap className="w-4 h-4 text-success-400 shrink-0 mt-0.5" />;
      case 'improvement':
        return <Sparkles className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />;
      case 'fix':
        return <Bug className="w-4 h-4 text-danger-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-surface-950 text-surface-100 custom-scrollbar">
      {/* Top Banner Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActivePage('studio')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-surface-400 hover:text-white bg-surface-900 border border-surface-800 hover:border-surface-700 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to 3D Studio</span>
          </button>

          <button
            onClick={() => setActivePage('studio')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/30 transition hover:scale-105"
          >
            <span>Launch Studio</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-600/20 border border-primary-500/30 rounded-xl text-primary-400">
              <GitCommit className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-primary-400 uppercase">
              Changelog & Release Notes
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What's New in Studio 3D
          </h1>
          <p className="text-sm text-surface-400 max-w-2xl">
            Keep track of all feature additions, 3D engine upgrades, workflow optimizations, and bug
            fixes for the 3D T-Shirt Designer.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-8">
        <div className="relative border-l-2 border-surface-800 pl-6 sm:pl-8 space-y-12">
          {CHANGELOG_DATA.map((entry) => (
            <div key={entry.version} className="relative group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[33px] sm:-left-[41px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  entry.isLatest
                    ? 'bg-primary-600 border-white text-white shadow-lg shadow-primary-600/40'
                    : 'bg-surface-900 border-surface-700 text-surface-400'
                }`}
              >
                <Tag className="w-3 h-3" />
              </div>

              {/* Version Card */}
              <div className="bg-surface-900/80 backdrop-blur-md rounded-3xl border border-surface-800 p-6 sm:p-8 space-y-5 hover:border-surface-700/80 transition-all shadow-xl">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black text-white font-mono">
                      {entry.version}
                    </span>
                    {entry.isLatest && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow">
                        Latest
                      </span>
                    )}
                    {getTagBadge(entry.tag)}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-surface-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-surface-100">{entry.title}</h3>
                  <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">
                    {entry.summary}
                  </p>
                </div>

                {/* Highlights list */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-bold text-surface-300 uppercase tracking-wider">
                    Release Highlights
                  </span>
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {entry.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 bg-surface-950/60 rounded-2xl border border-surface-800/60"
                      >
                        {getHighlightIcon(h.type)}
                        <span className="text-xs sm:text-sm text-surface-300 leading-snug">
                          {h.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
