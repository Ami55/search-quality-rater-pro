import React from 'react';
import { RatingLevel } from '../types';

interface RatingSliderProps {
  score: number;
  rating: RatingLevel;
  type?: 'PQ' | 'NeedsMet';
  needsMetRating?: string;
}

const PQ_LEVELS: { label: RatingLevel; min: number; max: number; pos: number }[] = [
  { label: 'Lowest', min: 0, max: 34, pos: 6 },
  { label: 'Lowest+', min: 25, max: 39, pos: 17 },
  { label: 'Low', min: 35, max: 49, pos: 28 },
  { label: 'Low+', min: 45, max: 54, pos: 39 },
  { label: 'Medium', min: 55, max: 64, pos: 50 },
  { label: 'Medium+', min: 65, max: 69, pos: 61 },
  { label: 'High', min: 70, max: 84, pos: 72 },
  { label: 'High+', min: 80, max: 89, pos: 83 },
  { label: 'Highest', min: 90, max: 100, pos: 94 },
];

export const RatingSlider: React.FC<RatingSliderProps> = ({ score, rating, type = 'PQ' }) => {
  // Normalize position 0 to 100%
  const clampedScore = Math.max(0, Math.min(100, score));

  const getSliderColor = () => {
    if (clampedScore >= 85) return 'from-emerald-500 to-teal-400';
    if (clampedScore >= 70) return 'from-blue-500 to-cyan-400';
    if (clampedScore >= 55) return 'from-amber-500 to-yellow-400';
    if (clampedScore >= 35) return 'from-orange-500 to-amber-600';
    return 'from-rose-600 to-red-500';
  };

  return (
    <div className="w-full bg-[#18181B] text-white p-5 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-widest uppercase text-white/50">
            {type === 'PQ' ? 'Official Page Quality Slider (§ 3.0 & § 10.0)' : 'Needs Met Rating Slider (§ 13.0)'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/40">Score:</span>
          <span className="font-mono font-bold text-sm bg-white/10 px-2 py-0.5 rounded text-emerald-400">
            {score}/100
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-white/20 text-white">
            {rating}
          </span>
        </div>
      </div>

      {/* Track & Indicator */}
      <div className="relative py-4">
        {/* Baseline Bar */}
        <div className="h-2 w-full bg-white/10 rounded-full relative overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getSliderColor()} transition-all duration-700 rounded-full`}
            style={{ width: `${clampedScore}%` }}
          />
        </div>

        {/* Sliding Pointer */}
        <div 
          className="absolute top-1.5 -ml-3 flex flex-col items-center transition-all duration-700"
          style={{ left: `${clampedScore}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-white border-2 border-[#18181B] shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="w-0.5 h-2 bg-white/60" />
        </div>

        {/* Guideline Scale Ticks */}
        <div className="flex justify-between mt-3 px-1">
          {PQ_LEVELS.filter((_, idx) => idx % 2 === 0).map((lvl) => (
            <div key={lvl.label} className="flex flex-col items-center">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${rating.startsWith(lvl.label) ? 'text-emerald-400 font-bold' : 'text-white/40'}`}>
                {lvl.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
