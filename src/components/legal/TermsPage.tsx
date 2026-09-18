import React from 'react';
import {
  FileText,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { TERMS_OF_SERVICE_DATA } from '../../data/legalData';

export const TermsPage: React.FC = () => {
  const setActivePage = useEditorStore((s) => s.setActivePage);

  return (
    <div className="w-full h-full overflow-y-auto bg-surface-950 text-surface-100 custom-scrollbar select-none">
      {/* Top Banner Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-surface-400 hover:text-white bg-surface-900 border border-surface-800 hover:border-surface-700 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => setActivePage('studio')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary-600/30 transition hover:scale-105"
          >
            <span>Launch 3D Studio</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-600/20 border border-primary-500/30 rounded-xl text-primary-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold tracking-wider text-primary-400 uppercase">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {TERMS_OF_SERVICE_DATA.title}
          </h1>
          <p className="text-sm text-surface-400 max-w-2xl">{TERMS_OF_SERVICE_DATA.subtitle}</p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-surface-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-surface-400" />
              <span>Last updated: {TERMS_OF_SERVICE_DATA.lastUpdated}</span>
            </div>
            <span>•</span>
            <span className="font-mono text-surface-400">
              Version {TERMS_OF_SERVICE_DATA.version}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-primary-950/40 via-surface-900 to-surface-900 border border-primary-500/20 flex items-start gap-3.5 shadow-xl">
          <ShieldCheck className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-300">
              Summary Overview
            </h3>
            <p className="text-xs sm:text-sm text-surface-300 leading-relaxed">
              {TERMS_OF_SERVICE_DATA.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-6">
        {TERMS_OF_SERVICE_DATA.sections.map((section) => (
          <div
            key={section.id}
            className="p-6 sm:p-8 bg-surface-900/70 border border-surface-800 rounded-3xl space-y-4 hover:border-surface-700/80 transition-all shadow-lg"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{section.title}</span>
            </h2>

            <div className="space-y-3">
              {section.content.map((paragraph, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-surface-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {section.subsections && (
              <div className="space-y-4 pt-2">
                {section.subsections.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 bg-surface-950/60 rounded-2xl border border-surface-800/80 space-y-2.5"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-surface-200">
                      {sub.subtitle}
                    </h4>
                    <ul className="space-y-2">
                      {sub.points.map((point, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-surface-400 leading-relaxed"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer Navigation Switcher */}
        <div className="p-6 rounded-3xl bg-surface-900 border border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-semibold text-surface-400">
              Looking for our data practices?
            </span>
            <p className="text-xs text-surface-300">
              Read how we protect your information in our Privacy Policy.
            </p>
          </div>
          <button
            onClick={() => setActivePage('privacy')}
            className="px-4 py-2.5 bg-surface-800 hover:bg-surface-700 text-white text-xs font-semibold rounded-xl border border-surface-700 transition hover:scale-105"
          >
            View Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};
