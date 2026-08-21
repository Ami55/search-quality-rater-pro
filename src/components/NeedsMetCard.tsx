import React from 'react';
import { NeedsMetAnalysis } from '../types';
import { Target, Compass, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

interface NeedsMetCardProps {
  needsMet: NeedsMetAnalysis;
}

export const NeedsMetCard: React.FC<NeedsMetCardProps> = ({ needsMet }) => {
  const getRatingColor = (rating: string) => {
    if (rating.includes('FullyM')) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (rating.includes('HM')) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (rating.includes('MM')) return 'text-purple-700 bg-purple-50 border-purple-300';
    if (rating.includes('SM')) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-[#141414]/10">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#141414]" />
            <h3 className="text-xl font-bold tracking-tight">Search User Needs & Needs Met Rating</h3>
          </div>
          <p className="text-xs text-[#141414]/60 mt-1 font-mono">
            Guidelines Part 2 & Part 3 (§ 12.0 - § 14.0): Query Intent Matching, User Utility & Failure Flags
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs uppercase tracking-wider ${getRatingColor(needsMet.needsMetRating)}`}>
          {needsMet.needsMetRating}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/50 block mb-1">
            Evaluated Search Query
          </span>
          <span className="font-mono font-bold text-sm text-[#141414] block">
            [{needsMet.targetQuery}]
          </span>
          <span className="text-[11px] text-[#141414]/60 font-mono mt-1 block">
            Locale: {needsMet.locale || 'English (US)'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/50 block mb-1">
            Primary Query Intent (§ 12.7)
          </span>
          <span className="font-bold text-sm text-[#141414] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            {needsMet.queryIntent} Intent
          </span>
          <span className="text-[11px] text-[#141414]/60 font-mono mt-1 block">
            {needsMet.queryIntent === 'Know Simple' ? 'Direct answer seeking' :
             needsMet.queryIntent === 'Know' ? 'Broad topic exploration' :
             needsMet.queryIntent === 'Do' ? 'Action / tool / transaction' :
             needsMet.queryIntent === 'Website' ? 'Navigational URL intent' : 'Local business lookup'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/50 block mb-1">
            Needs Met Fit Score
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-mono text-[#141414]">
              {needsMet.score}/100
            </span>
            <div className="flex-1 h-2 bg-[#141414]/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${needsMet.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div className="mt-6 bg-[#E4E3E0]/40 p-4 rounded-xl">
        <span className="font-mono font-bold text-[#141414]/70 uppercase tracking-wider block mb-1 text-xs">
          Needs Met Evaluator Rationale:
        </span>
        <p className="text-[#141414]/90 leading-relaxed text-sm">{needsMet.explanation}</p>
      </div>

      {/* Specialized Flags (§ 15.0) */}
      <div className="mt-4 pt-4 border-t border-[#141414]/5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#141414]/50 block mb-2">
          Specialized Rating Flags (§ 15.0):
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Foreign Language', active: needsMet.flags.foreignLanguage, ref: '§ 15.4' },
            { label: 'Did Not Load', active: needsMet.flags.didNotLoad, ref: '§ 15.5' },
            { label: 'Upsetting / Offensive', active: needsMet.flags.upsettingOffensive, ref: '§ 15.6' },
            { label: 'Not For Everyone', active: needsMet.flags.notForEveryone, ref: '§ 15.6' },
            { label: 'Porn Flag', active: needsMet.flags.porn, ref: '§ 15.1' },
          ].map((flag) => (
            <span 
              key={flag.label}
              className={`text-xs font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                flag.active 
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 opacity-70'
              }`}
            >
              {flag.active ? <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {flag.label} ({flag.ref}): {flag.active ? 'YES (Triggered)' : 'No'}
            </span>
          ))}
        </div>
      </div>

      {/* Section 14.0 Relationship Note */}
      <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Guideline Section 14.0 Rule:</strong> Needs Met rating is evaluated relative to the user query and intent. High Page Quality does NOT make up for an off-topic result ("Useless is useless" → FailsM), and conversely, high Needs Met cannot salvage untrustworthy/harmful Lowest quality pages.
        </p>
      </div>
    </div>
  );
};
