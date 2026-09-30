import React from 'react';
import { Compass, Radio, Database, Search, BookOpen, Share2, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Compass,
    title: 'EXPEDITION',
    subtitle: 'Field Operations',
    desc: 'Deep field deployments in Antarctica, Arctic, and Himalaya.',
    accent: '#38BDF8'
  },
  {
    icon: Radio,
    title: 'OBSERVATION',
    subtitle: 'Continuous Telemetry',
    desc: 'Real-time automatic weather stations, CTD casts, and ice cores.',
    accent: '#22C7A8'
  },
  {
    icon: Database,
    title: 'DATASET',
    subtitle: 'NPDC Archival',
    desc: 'Open-access verified scientific datasets with full provenance.',
    accent: '#6EC5E9'
  },
  {
    icon: Search,
    title: 'RESEARCH',
    subtitle: 'Analytical Modeling',
    desc: 'Multi-institutional climate simulations & teleconnection analysis.',
    accent: '#E7A93B'
  },
  {
    icon: BookOpen,
    title: 'PUBLICATION',
    subtitle: 'Peer-Reviewed Science',
    desc: 'Global journal literature, technical reports, and DOI indices.',
    accent: '#38BDF8'
  },
  {
    icon: Share2,
    title: 'PUBLIC OUTREACH',
    subtitle: 'Media Dissemination',
    desc: 'Grounded AI editorial studio & public scientific literacy.',
    accent: '#22C7A8'
  }
];

export const PipelineFlow: React.FC = () => {
  return (
    <div className="w-full py-8">
      <div className="text-center mb-6">
        <span className="text-xs uppercase font-mono tracking-widest text-[#38BDF8] font-bold">
          INTEGRATED RESEARCH PIPELINE
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
          From Field to Knowledge
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto mt-1">
          How raw polar observations transform into validated datasets, peer-reviewed discoveries, and accessible public knowledge.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="relative polar-panel p-4 flex flex-col justify-between border border-[#6EC5E9]/15 hover:border-[#38BDF8]/40 transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                    style={{ backgroundColor: `${step.accent}15`, color: step.accent }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-[#647887] font-semibold">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white tracking-wider">{step.title}</h3>
                <p className="text-[11px] font-medium text-[#38BDF8] mt-0.5">{step.subtitle}</p>
                <p className="text-[11px] text-[#94A3B8] mt-2 line-clamp-3 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-[#071A2B] border border-[#6EC5E9]/30 flex items-center justify-center text-[#6EC5E9]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
