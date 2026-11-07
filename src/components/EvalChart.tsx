import React, { useState } from 'react';
import { MoveAnalysis } from '../types/chess';

interface EvalChartProps {
  moves: MoveAnalysis[];
  currentPlyIndex?: number;
  onSelectPly: (plyIndex: number) => void;
}

export const EvalChart: React.FC<EvalChartProps> = ({
  moves,
  currentPlyIndex,
  onSelectPly,
}) => {
  const [hoveredPly, setHoveredPly] = useState<number | null>(null);

  if (moves.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-xs text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800">
        Нет данных для графика
      </div>
    );
  }

  const width = 600;
  const height = 140;
  const paddingX = 20;
  const paddingY = 15;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;
  const midY = paddingY + plotHeight / 2;

  // Map cp (-1000 to +1000) to Y (height to 0)
  const getY = (cp: number) => {
    const clamped = Math.max(-1000, Math.min(1000, cp));
    // cp = +1000 -> top (paddingY)
    // cp = -1000 -> bottom (paddingY + plotHeight)
    const normalized = (clamped + 1000) / 2000;
    return paddingY + plotHeight * (1 - normalized);
  };

  const points = moves.map((m, idx) => {
    const x = paddingX + (idx / Math.max(1, moves.length - 1)) * plotWidth;
    const y = getY(m.evalAfterCp);
    return { x, y, move: m, idx };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Fill area between path and mid line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${midY} L ${points[0].x} ${midY} Z`;

  const getBadgeColor = (cls: string) => {
    switch (cls) {
      case '!!':
        return '#06b6d4'; // cyan
      case '!':
        return '#10b981'; // green
      case 'book':
        return '#8b5cf6'; // purple
      case '?!':
        return '#f59e0b'; // amber
      case '?':
        return '#f97316'; // orange
      case '??':
        return '#ef4444'; // red
      default:
        return '#64748b';
    }
  };

  const activePly = hoveredPly !== null ? hoveredPly : currentPlyIndex;
  const activePoint = activePly !== undefined && points[activePly] ? points[activePly] : null;

  return (
    <div className="relative w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-inner">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
        <span className="flex items-center gap-1.5 font-bold text-slate-200">
          📈 График преимущества (+Белые / -Черные)
        </span>
        {activePoint && (
          <span className="text-[11px] text-amber-300">
            Ход {activePoint.move.moveNumber}. {activePoint.move.color === 'white' ? 'w: ' : 'b: '}
            <strong className="text-white">{activePoint.move.san}</strong> (
            {activePoint.move.evalAfterCp > 0 ? `+${(activePoint.move.evalAfterCp / 100).toFixed(1)}` : (activePoint.move.evalAfterCp / 100).toFixed(1)})
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-28 sm:h-32 overflow-visible select-none cursor-crosshair"
      >
        <defs>
          <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#64748b" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Center line (0.0 advantage) */}
        <line
          x1={paddingX}
          y1={midY}
          x2={width - paddingX}
          y2={midY}
          stroke="#475569"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {/* Top/Bottom guide markers */}
        <text x={paddingX - 14} y={paddingY + 8} fill="#94a3b8" fontSize="9" fontFamily="monospace">
          +10
        </text>
        <text x={paddingX - 14} y={midY + 3} fill="#64748b" fontSize="9" fontFamily="monospace">
          0.0
        </text>
        <text x={paddingX - 14} y={height - paddingY} fill="#94a3b8" fontSize="9" fontFamily="monospace">
          -10
        </text>

        {/* Shaded Area */}
        <path d={areaD} fill="url(#evalGrad)" />

        {/* Line Curve */}
        <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinejoin="round" />

        {/* Key Moment Dots */}
        {points.map((pt) => {
          const isKey = pt.move.classification !== '!' && pt.move.classification !== 'book';
          const isSelected = pt.idx === activePly;
          const radius = isSelected ? 5.5 : isKey ? 3.5 : 2;
          const color = getBadgeColor(pt.move.classification);

          return (
            <g
              key={pt.idx}
              className="cursor-pointer transition-transform duration-150 hover:scale-125"
              onClick={() => onSelectPly(pt.idx)}
              onMouseEnter={() => setHoveredPly(pt.idx)}
              onMouseLeave={() => setHoveredPly(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={radius}
                fill={color}
                stroke="#0f172a"
                strokeWidth={isSelected ? 2 : 1}
              />
            </g>
          );
        })}

        {/* Selected Vertical Marker */}
        {activePoint && (
          <line
            x1={activePoint.x}
            y1={paddingY}
            x2={activePoint.x}
            y2={height - paddingY}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            pointerEvents="none"
          />
        )}
      </svg>
    </div>
  );
};
