import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../engine/soundService';
import { LevelConfig, Color } from '../types/chess';
import { Trophy, Frown, Handshake, RotateCcw, ArrowRight, BarChart2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  level: LevelConfig;
  playerColor: Color;
  eloDelta?: number;
  newElo?: number;
  unlockedLevelName?: string;
  onRematch: () => void;
  onNextLevel?: () => void;
  onAnalyze?: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  reason,
  level,
  playerColor,
  eloDelta,
  newElo,
  unlockedLevelName,
  onRematch,
  onNextLevel,
  onAnalyze,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (result === 'win') {
        sounds.playVictory();
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl text-center space-y-4">
        {/* Result Icon */}
        <div className="flex justify-center">
          {result === 'win' ? (
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <Trophy className="w-8 h-8" />
            </div>
          ) : result === 'loss' ? (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-400">
              <Frown className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400">
              <Handshake className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-white">
            {result === 'win' ? 'Блестящая победа!' : result === 'loss' ? 'Поражение' : 'Ничья!'}
          </h2>
          <p className="text-sm text-slate-300 mt-1 font-medium">{reason}</p>
        </div>

        {/* Rating Change Badge */}
        {typeof eloDelta === 'number' && typeof newElo === 'number' && (
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl flex items-center justify-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Изменение рейтинга:</span>
            <span
              className={`font-bold flex items-center gap-1 ${
                eloDelta > 0 ? 'text-emerald-400' : eloDelta < 0 ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {eloDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {eloDelta > 0 ? `+${eloDelta}` : eloDelta}
            </span>
            <span className="text-slate-200">
              (Новый Эло: <strong className="text-amber-400">{newElo}</strong>)
            </span>
          </div>
        )}

        {/* Unlocked Level Banner */}
        {unlockedLevelName && (
          <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 p-2.5 rounded-xl text-center space-y-0.5 animate-pulse">
            <div className="text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Разблокирован новый бот!</span>
            </div>
            <div className="text-white text-xs font-semibold">{unlockedLevelName}</div>
          </div>
        )}

        {/* Opponent Info */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-center gap-3">
          <span className="text-2xl">{level.avatar}</span>
          <div className="text-left">
            <div className="text-xs text-slate-400">Соперник:</div>
            <div className="text-sm font-bold text-slate-100">
              Уровень {level.id}: {level.name} ({level.elo} Эло)
            </div>
          </div>
        </div>

        {/* Analysis Button */}
        {onAnalyze && (
          <button
            onClick={onAnalyze}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            <BarChart2 className="w-4 h-4 text-slate-950" />
            <span>Разбор партии и анализ ошибок</span>
          </button>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onRematch}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Реванш</span>
          </button>

          {result === 'win' && onNextLevel && level.id < 15 ? (
            <button
              onClick={onNextLevel}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
            >
              <span>След. уровень</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition shadow"
            >
              Закрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
