import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface YMYLProps {
  ymyl: {
    isYMYL: boolean;
    spectrum: 'Clear YMYL' | 'May be YMYL' | 'Not or Unlikely YMYL';
    topicCategory: 'Health or Safety' | 'Financial Security' | 'Government, Civics & Society' | 'Other' | 'None';
    harmRiskLevel: 'High' | 'Moderate' | 'Low' | 'None';
    explanation: string;
    experienceVsExpertiseRule: string;
    meetsHighStandard: boolean;
  };
}

export const YMYLCard: React.FC<YMYLProps> = ({ ymyl }) => {
  const getSpectrumBadge = () => {
    switch (ymyl.spectrum) {
      case 'Clear YMYL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <ShieldAlert className="w-3.5 h-3.5" /> Clear YMYL Topic (Highest Scrutiny)
          </span>
        );
      case 'May be YMYL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> May Be YMYL (Moderate Risk)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Standard Non-YMYL Topic
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-[#141414]/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#141414]" />
            <h3 className="text-xl font-bold tracking-tight">YMYL Standards & Risk Assessment</h3>
          </div>
          <p className="text-xs text-[#141414]/60 mt-1 font-mono">
            Updated September 2025 Definitions (§ 2.3 & § 3.4.1): Health, Financial, Civic, and Social Harm Criteria
          </p>
        </div>
        <div>
          {getSpectrumBadge()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/50 block mb-1">
            YMYL Category Domain
          </span>
          <span className="font-bold text-sm text-[#141414] block">
            {ymyl.topicCategory}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/50 block mb-1">
            Harm Potential Level
          </span>
          <span className="font-bold text-sm text-[#141414] block">
            {ymyl.harmRiskLevel} Potential for Real-World Harm
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#141414]/50 block mb-1">
            High Accuracy Benchmark
          </span>
          <span className={`font-bold text-sm flex items-center gap-1.5 ${ymyl.meetsHighStandard ? 'text-emerald-700' : 'text-rose-700'}`}>
            {ymyl.meetsHighStandard ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Meets Higher Standard
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" /> Fails High Standard
              </>
            )}
          </span>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="mt-6 space-y-4 text-xs">
        <div className="bg-[#E4E3E0]/40 p-4 rounded-xl">
          <span className="font-mono font-bold text-[#141414]/70 uppercase tracking-wider block mb-1">
            YMYL Classification Rationale:
          </span>
          <p className="text-[#141414]/90 leading-relaxed text-sm">{ymyl.explanation}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <span className="font-mono font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 mb-1 text-xs">
            <HelpCircle className="w-4 h-4 text-blue-700" />
            Experience vs. Expertise Standard (§ 3.4.1):
          </span>
          <p className="text-blue-950 leading-relaxed text-xs">{ymyl.experienceVsExpertiseRule}</p>
        </div>
      </div>
    </div>
  );
};
