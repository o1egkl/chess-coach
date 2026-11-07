import React, { useState } from 'react';
import { RatingHistoryPoint } from '../types/chess';

interface RatingChartProps {
  history: RatingHistoryPoint[];
}

export const RatingChart: React.FC<RatingChartProps> = ({ history }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (history.length < 2) {
    return (
      <div className="h-28 flex items-center justify-center text-xs text-slate-500 bg-slate-900/60 rounded-xl border border-slate-800">
        Сыграйте больше партий, чтобы увидеть динамику рейтинга
      </div>
    );
  }

  const width = 500;
  const height = 120;
  const paddingX = 25;
  const paddingY = 18;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const ratings = history.map((h) => h.elo);
  const minRating = Math.max(0, Math.min(...ratings) - 40);
  const maxRating = Math.max(...ratings) + 40;
  const range = Math.max(50, maxRating - minRating);

  const points = history.map((item, idx) => {
    const x = paddingX + (idx / Math.max(1, history.length - 1)) * plotWidth;
    const y = paddingY + plotHeight * (1 - (item.elo - minRating) / range);
    return { x, y, item, idx };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="relative w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-inner">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
        <span className="font-bold text-slate-200">📈 Динамика Эло игрока</span>
        {activePoint && (
          <span className="text-[11px] text-emerald-400">
            Рейтинг: <strong className="text-white text-xs">{activePoint.item.elo}</strong>{' '}
            {activePoint.item.delta !== 0 && (
              <span className={activePoint.item.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                ({activePoint.item.delta > 0 ? `+${activePoint.item.delta}` : activePoint.item.delta})
              </span>
            )}
          </span>
        )}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible select-none">
        <defs>
          <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Min / Max lines */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke="#334155"
          strokeDasharray="2 4"
          strokeWidth="1"
        />
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#334155"
          strokeDasharray="2 4"
          strokeWidth="1"
        />

        <text x={paddingX - 18} y={paddingY + 3} fill="#64748b" fontSize="8" fontFamily="monospace">
          {maxRating}
        </text>
        <text x={paddingX - 18} y={height - paddingY + 3} fill="#64748b" fontSize="8" fontFamily="monospace">
          {minRating}
        </text>

        {/* Gradient fill */}
        <path d={areaD} fill="url(#ratingGrad)" />

        {/* Rating Line */}
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((pt) => {
          const isSelected = pt.idx === (hoveredIndex !== null ? hoveredIndex : points.length - 1);
          return (
            <circle
              key={pt.idx}
              cx={pt.x}
              cy={pt.y}
              r={isSelected ? 4.5 : 2.5}
              fill={isSelected ? '#34d399' : '#10b981'}
              stroke="#0f172a"
              strokeWidth={1.5}
              className="cursor-pointer transition-transform duration-100 hover:scale-150"
              onMouseEnter={() => setHoveredIndex(pt.idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
        })}
      </svg>
    </div>
  );
};
