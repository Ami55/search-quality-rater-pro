import React from 'react';
import { ActionableItem } from '../types';
import { ListChecks, AlertCircle, ArrowUpRight, CheckSquare } from 'lucide-react';

interface ActionableRoadmapProps {
  items: ActionableItem[];
}

export const ActionableRoadmap: React.FC<ActionableRoadmapProps> = ({ items }) => {
  const getPriorityBadge = (priority: ActionableItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return (
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
            Critical Priority
          </span>
        );
      case 'High':
        return (
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
            Medium Priority
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between pb-6 border-b border-[#141414]/10">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#141414]" />
            <h3 className="text-xl font-bold tracking-tight">Evaluator Actionable Remediation Roadmap</h3>
          </div>
          <p className="text-xs text-[#141414]/60 mt-1 font-mono">
            Specific optimizations required to advance this page to High / Highest Quality standards
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className="p-4 rounded-xl bg-[#E4E3E0]/30 border border-[#141414]/5 hover:bg-[#E4E3E0]/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#141414] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="font-bold text-sm text-[#141414]">{item.action}</span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#141414]/5 text-[#141414]/70 font-semibold">
                  {item.guidelineRef}
                </span>
                {getPriorityBadge(item.priority)}
              </div>
            </div>

            <div className="pl-7 text-xs text-[#141414]/80 flex items-start gap-1.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Expected Evaluator Impact:</strong> {item.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
