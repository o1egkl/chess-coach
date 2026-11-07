import React from 'react';
import { LevelConfig } from '../types/chess';
import { OpeningInfo } from '../config/openings';
import { Lightbulb, AlertTriangle, Eye, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface CoachCardProps {
  level: LevelConfig;
  gamePhase: 'Дебют' | 'Миттельшпиль' | 'Эндшпиль';
  openingInfo: OpeningInfo | null;
  coachMessage: string;
  blunderWarning: string | null;
  hintStage: 0 | 1 | 2; // 0: none, 1: nudge shown, 2: solution shown
  onRequestNudge: () => void;
  onRequestSolution: () => void;
  threatRadarActive: boolean;
  onToggleThreatRadar: () => void;
  isBotThinking: boolean;
  isPlayerTurn: boolean;
  takebacksRemaining: number;
  onTakeback: () => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({
  level,
  gamePhase,
  openingInfo,
  coachMessage,
  blunderWarning,
  hintStage,
  onRequestNudge,
  onRequestSolution,
  threatRadarActive,
  onToggleThreatRadar,
  isBotThinking,
  isPlayerTurn,
  takebacksRemaining,
  onTakeback,
}) => {
  return (
    <div className="bg-slate-800/90 backdrop-blur border border-slate-700/80 rounded-xl p-4 shadow-xl flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold">
            🎓
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              Интерактивный тренер
            </h3>
            <span className="text-[11px] text-slate-400">
              Фаза: <strong className="text-amber-400">{gamePhase}</strong>
            </span>
          </div>
        </div>

        {/* Threat Radar Toggle (if level allows) */}
        {level.hasHeatmap && (
          <button
            onClick={onToggleThreatRadar}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
              threatRadarActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 border border-slate-600'
            }`}
            title="Подсветить поля под боем и незащищенные фигуры"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Радар угроз</span>
          </button>
        )}
      </div>

      {/* Blunder Shield Alert Banner */}
      {blunderWarning && (
        <div className="bg-rose-950/70 border border-rose-500/80 p-3 rounded-lg text-xs text-rose-200 flex items-start gap-2.5 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-rose-300 uppercase tracking-wide">
              Предотвращение зевка (Blunder Shield)
            </strong>
            <p>{blunderWarning}</p>
            {takebacksRemaining !== 0 && (
              <button
                onClick={onTakeback}
                className="mt-1 px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold transition text-[11px]"
              >
                Вернуть ход
              </button>
            )}
          </div>
        </div>
      )}

      {/* Opening info if early in the game */}
      {openingInfo && (
        <div className="bg-slate-900/60 border border-slate-700/50 p-2.5 rounded-lg space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>{openingInfo.name} ({openingInfo.eco})</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {openingInfo.goal}
          </p>
        </div>
      )}

      {/* Coach Commentary & Advice */}
      <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/30 text-xs text-slate-200 leading-relaxed min-h-[50px] flex items-center">
        <p>
          {isBotThinking ? (
            <span className="text-amber-400 italic flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Бот {level.name} обдумывает ответ...
            </span>
          ) : (
            coachMessage
          )}
        </p>
      </div>

      {/* Two-Stage Hint Controls */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          disabled={!isPlayerTurn || isBotThinking || hintStage >= 1}
          onClick={onRequestNudge}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow ${
            hintStage >= 1
              ? 'bg-slate-700/50 text-slate-400 border border-slate-700 cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border border-indigo-400/40'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
          <span>{hintStage >= 1 ? 'Намек получен' : '1. Намек (Nudge)'}</span>
        </button>

        <button
          disabled={!isPlayerTurn || isBotThinking || hintStage === 2}
          onClick={onRequestSolution}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow ${
            hintStage === 2
              ? 'bg-slate-700/50 text-slate-400 border border-slate-700 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400/40'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{hintStage === 2 ? 'Ход показан' : '2. Показать ход'}</span>
        </button>
      </div>

      {/* Takeback info */}
      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
        <span>Возврат ходов:</span>
        <span className="font-semibold text-slate-200">
          {takebacksRemaining === -1 ? 'Неограниченно' : `${takebacksRemaining} ост.`}
        </span>
      </div>
    </div>
  );
};
