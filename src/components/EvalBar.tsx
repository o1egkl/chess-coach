import React from 'react';
import { EngineEvaluation } from '../types/chess';

interface EvalBarProps {
  evaluation: EngineEvaluation | null;
  orientation: 'white' | 'black';
}

export const EvalBar: React.FC<EvalBarProps> = ({ evaluation, orientation }) => {
  // Calculate percentage for White (0% = completely winning for Black, 100% = completely winning for White)
  let whitePercent = 50;
  let label = '0.0';

  if (evaluation) {
    if (evaluation.scoreMate !== null) {
      if (evaluation.scoreMate > 0) {
        whitePercent = 100;
        label = `M${evaluation.scoreMate}`;
      } else {
        whitePercent = 0;
        label = `-M${Math.abs(evaluation.scoreMate)}`;
      }
    } else if (evaluation.scoreCp !== null) {
      const cp = evaluation.scoreCp;
      const evalValue = cp / 100;
      label = (evalValue > 0 ? `+${evalValue.toFixed(1)}` : evalValue.toFixed(1));
      
      const clamped = Math.max(-1000, Math.min(1000, cp));
      whitePercent = 50 + (clamped / 1000) * 45;
    }
  }

  const topPercent = orientation === 'white' ? 100 - whitePercent : whitePercent;

  return (
    <div className="h-full flex flex-col items-center select-none py-1 flex-shrink-0" title={`Оценка позиции: ${label}`}>
      {/* Vertical Eval Bar strictly matching board height */}
      <div className="relative w-3.5 sm:w-4 h-full bg-slate-900 border border-slate-700/80 rounded-full overflow-hidden shadow-inner flex flex-col justify-between">
        {/* Black side */}
        <div 
          className="w-full bg-slate-800 transition-all duration-300 ease-out"
          style={{ height: `${topPercent}%` }}
        />
        {/* White side */}
        <div 
          className="w-full bg-slate-100 transition-all duration-300 ease-out"
          style={{ height: `${100 - topPercent}%` }}
        />

        {/* Floating badge score indicator */}
        <div 
          className="absolute inset-x-0 mx-auto flex items-center justify-center pointer-events-none"
          style={{ 
            top: `${Math.max(10, Math.min(90, topPercent))}%`,
            transform: 'translateY(-50%)'
          }}
        >
          <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded shadow-md bg-slate-950/95 text-amber-300 border border-slate-700 whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
