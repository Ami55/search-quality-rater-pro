import React from 'react';
import { SpamAbuseCheck } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SpamAbuseProps {
  checks: {
    scaledContentAbuse: SpamAbuseCheck;
    siteReputationAbuse: SpamAbuseCheck;
    expiredDomainAbuse: SpamAbuseCheck;
    fillerAndUxObstruction: SpamAbuseCheck;
    deceptiveDesign: SpamAbuseCheck;
  };
}

export const SpamAbuseBadgeBar: React.FC<SpamAbuseProps> = ({ checks }) => {
  const items = [
    { name: 'Scaled Content Abuse', data: checks.scaledContentAbuse, key: 'scaled' },
    { name: 'Site Reputation Abuse (Parasite SEO)', data: checks.siteReputationAbuse, key: 'reputation' },
    { name: 'Expired Domain Abuse', data: checks.expiredDomainAbuse, key: 'expired' },
    { name: 'Filler Content & UX Obstruction', data: checks.fillerAndUxObstruction, key: 'filler' },
    { name: 'Deceptive Design & Fake Personas', data: checks.deceptiveDesign, key: 'deceptive' },
  ];

  return (
    <div className="bg-[#18181B] text-white rounded-2xl border border-white/10 p-6 md:p-8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold tracking-tight text-white">2025 Web Spam & Policy Abuse Screener</h3>
          </div>
          <p className="text-xs text-white/60 mt-1 font-mono">
            Automatic screening against Google Search Web Spam Policies (§ 4.0 - § 4.6 & § 5.2.2)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.map((item) => {
          const isViolation = item.data.detected || item.data.severity === 'Flagged Violation';
          const isWarning = item.data.severity === 'Low Risk';

          return (
            <div 
              key={item.key}
              className={`p-4 rounded-xl border transition-all ${
                isViolation 
                  ? 'bg-rose-950/40 border-rose-500/60 text-rose-200' 
                  : isWarning 
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200' 
                  : 'bg-white/5 border-white/10 text-white/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-xs">{item.name}</span>
                <span className="text-[10px] font-mono opacity-60">{item.data.clause}</span>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                {isViolation ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                    <ShieldAlert className="w-3 h-3" /> Violation Flagged
                  </span>
                ) : isWarning ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    <AlertTriangle className="w-3 h-3" /> Potential Risk
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3" /> Clear / Clean
                  </span>
                )}
              </div>

              <p className="text-[11px] leading-relaxed opacity-80">{item.data.details}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
