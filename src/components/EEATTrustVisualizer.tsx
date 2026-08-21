import React from 'react';
import { EEATDimension, EEATTrustDimension } from '../types';
import { ShieldCheck, UserCheck, Award, Zap, CheckCircle2 } from 'lucide-react';

interface EEATProps {
  breakdown: {
    experience: EEATDimension;
    expertise: EEATDimension;
    authoritativeness: EEATDimension;
    trust: EEATTrustDimension;
  };
}

export const EEATTrustVisualizer: React.FC<EEATProps> = ({ breakdown }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score >= 35) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-6 border-b border-[#141414]/10">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#141414]" />
            <h3 className="text-xl font-bold tracking-tight">E-E-A-T Concentric Trust Evaluation</h3>
          </div>
          <p className="text-xs text-[#141414]/60 mt-1 font-mono">
            Official Guideline Model (§ 3.4): Trust is the central pillar supported by Experience, Expertise & Authority
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* Visual Concentric Diagram */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#E4E3E0]/30 rounded-2xl border border-[#141414]/5 relative">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Ring: Experience */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/40 animate-spin-slow" />
            
            {/* Middle Ring: Expertise & Authority */}
            <div className="absolute inset-6 rounded-full border-2 border-indigo-400/50 bg-indigo-50/20" />
            
            {/* Center Core: Trust */}
            <div className="relative z-10 w-36 h-36 rounded-full bg-[#18181B] text-white shadow-xl flex flex-col items-center justify-center text-center p-3 border-4 border-emerald-400">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
              <span className="font-bold text-xs uppercase tracking-wider">TRUST</span>
              <span className="text-[10px] font-mono text-emerald-300">Central Pillar</span>
              <span className="text-lg font-bold font-mono text-white mt-0.5">
                {breakdown.trust.score}/100
              </span>
            </div>

            {/* Orbiting Satellite Nodes */}
            <div className="absolute top-0 transform -translate-y-1 bg-blue-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow">
              Experience: {breakdown.experience.score}
            </div>
            <div className="absolute bottom-0 transform translate-y-1 bg-purple-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow">
              Expertise: {breakdown.expertise.score}
            </div>
            <div className="absolute right-0 transform translate-x-2 bg-amber-600 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow">
              Authority: {breakdown.authoritativeness.score}
            </div>
          </div>
          <p className="text-[11px] text-center text-[#141414]/60 font-mono mt-4 max-w-xs">
            "Untrustworthy pages have low E-E-A-T no matter how experienced or expert they appear." (§ 3.4)
          </p>
        </div>

        {/* Dimension Breakdown Cards */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Trust Pillar (Highlighted) */}
          <div className="p-4 rounded-xl bg-[#18181B] text-white border border-[#18181B] shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-emerald-400">
                  Trust (Primary Determinant)
                </span>
              </div>
              <span className="font-mono font-bold text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded">
                {breakdown.trust.score}/100
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed mb-3">{breakdown.trust.evaluation}</p>
            <div className="flex flex-wrap gap-1.5">
              {breakdown.trust.keySignals.map((signal, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-white/10 text-white/90 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#141414]">
                  First-Hand Experience (§ 3.4)
                </span>
              </div>
              <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded border ${getScoreColor(breakdown.experience.score)}`}>
                {breakdown.experience.score}/100
              </span>
            </div>
            <p className="text-xs text-[#141414]/80 leading-relaxed mb-2">{breakdown.experience.evaluation}</p>
            <div className="flex flex-wrap gap-1.5">
              {breakdown.experience.keySignals.map((signal, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Expertise */}
          <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#141414]">
                  Subject-Matter Expertise (§ 3.4)
                </span>
              </div>
              <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded border ${getScoreColor(breakdown.expertise.score)}`}>
                {breakdown.expertise.score}/100
              </span>
            </div>
            <p className="text-xs text-[#141414]/80 leading-relaxed mb-2">{breakdown.expertise.evaluation}</p>
            <div className="flex flex-wrap gap-1.5">
              {breakdown.expertise.keySignals.map((signal, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Authoritativeness */}
          <div className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#141414]">
                  Authoritativeness & Go-To Status (§ 3.4)
                </span>
              </div>
              <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded border ${getScoreColor(breakdown.authoritativeness.score)}`}>
                {breakdown.authoritativeness.score}/100
              </span>
            </div>
            <p className="text-xs text-[#141414]/80 leading-relaxed mb-2">{breakdown.authoritativeness.evaluation}</p>
            <div className="flex flex-wrap gap-1.5">
              {breakdown.authoritativeness.keySignals.map((signal, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-100">
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
