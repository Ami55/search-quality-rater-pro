import React, { useState } from 'react';
import { CriteriaScore, CriteriaStatus } from '../types';
import { ShieldCheck, AlertTriangle, XCircle, Award, CheckCircle2, ChevronDown, Filter } from 'lucide-react';

interface CriteriaGridProps {
  criteria: CriteriaScore[];
}

export const CriteriaGrid: React.FC<CriteriaGridProps> = ({ criteria }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Array.from(new Set(criteria.map(c => c.category)));

  const filteredCriteria = criteria.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: CriteriaStatus) => {
    switch (status) {
      case 'exemplary':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
            <Award className="w-3 h-3" /> Exemplary
          </span>
        );
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
            <CheckCircle2 className="w-3 h-3" /> Pass
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case 'fail':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold border border-rose-300">
            <XCircle className="w-3 h-3" /> Violation / Fail
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (score >= 35) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#141414]/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#141414]" />
            <h3 className="text-xl font-bold tracking-tight">The 21-Criteria Evaluation Grid (PQ Grid)</h3>
          </div>
          <p className="text-xs text-[#141414]/60 mt-1 font-mono">
            Calibrated directly against Google Evaluator Guidelines § 2.0 to § 8.0 (Sept 2025 Release)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-mono text-[#141414]/50">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-mono bg-[#E4E3E0]/50 border border-[#141414]/10 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#141414]"
          >
            <option value="all">All 7 Categories ({criteria.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-mono bg-[#E4E3E0]/50 border border-[#141414]/10 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#141414]"
          >
            <option value="all">All Statuses</option>
            <option value="exemplary">Exemplary</option>
            <option value="pass">Pass</option>
            <option value="warning">Warning</option>
            <option value="fail">Fail</option>
          </select>
        </div>
      </div>

      {/* Criteria Cards List */}
      <div className="divide-y divide-[#141414]/5 mt-4">
        {filteredCriteria.map((item, index) => {
          const isExpanded = expandedId === item.id;
          return (
            <div 
              key={item.id} 
              className="py-4 hover:bg-[#E4E3E0]/20 rounded-xl px-3 transition-colors"
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono font-bold text-[#141414]/40 w-6 pt-0.5">
                    #{index + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#141414]">{item.name}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#141414]/5 text-[#141414]/70 font-semibold">
                        {item.clause}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <span className="text-xs text-[#141414]/50 font-mono mt-0.5 block">
                      Category: {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className={`px-3 py-1 rounded-lg border font-mono font-bold text-xs ${getScoreColor(item.score)}`}>
                    {item.score}/100 ({item.rating})
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#141414]/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="mt-4 pl-9 pr-2 pt-3 border-t border-[#141414]/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#E4E3E0]/40 p-3.5 rounded-xl">
                    <span className="font-mono font-bold text-[#141414]/70 uppercase tracking-wider block mb-1.5">
                      Evaluator Audit Finding:
                    </span>
                    <p className="text-[#141414]/90 leading-relaxed">{item.finding}</p>
                  </div>
                  <div className="bg-[#141414]/5 p-3.5 rounded-xl">
                    <span className="font-mono font-bold text-[#141414]/70 uppercase tracking-wider block mb-1.5">
                      Guideline Clause Insight ({item.clause}):
                    </span>
                    <p className="text-[#141414]/80 leading-relaxed italic">{item.guidelineInsight}</p>
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
