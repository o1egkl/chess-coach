import React, { useState } from 'react';
import { GameReport, MoveAnalysis, BoardTheme, Color, LevelConfig } from '../types/chess';
import { EvalChart } from './EvalChart';
import { Award, RotateCcw, Play, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, BookOpen, ChevronRight, X } from 'lucide-react';

interface PostGameModalProps {
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  report: GameReport | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  playerColor: Color;
  level: LevelConfig;
  theme: BoardTheme;
  onRetryMistakes: () => void;
  onRematch: () => void;
  onNewGame: () => void;
  onClose: () => void;
}

export const PostGameModal: React.FC<PostGameModalProps> = ({
  isOpen,
  result,
  reason,
  report,
  isAnalyzing,
  analysisProgress,
  playerColor,
  level,
  theme,
  onRetryMistakes,
  onRematch,
  onNewGame,
  onClose,
}) => {
  const [selectedPly, setSelectedPly] = useState<number | null>(null);

  if (!isOpen) return null;

  const playerAcc = report ? (playerColor === 'white' ? report.whiteAccuracy : report.blackAccuracy) : 0;
  const botAcc = report ? (playerColor === 'white' ? report.blackAccuracy : report.whiteAccuracy) : 0;

  const playerCounts = report ? report.counts[playerColor] : null;
  const botCounts = report ? report.counts[playerColor === 'white' ? 'black' : 'white'] : null;

  const hasMistakes = report && report.mistakesToRetry.length > 0;

  const selectedMove: MoveAnalysis | null =
    report && selectedPly !== null && report.moves[selectedPly]
      ? report.moves[selectedPly]
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 max-w-3xl w-full p-4 sm:p-6 rounded-2xl shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">
              {result === 'win' ? '🏆' : result === 'loss' ? '💔' : '🤝'}
            </span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                {result === 'win' ? 'Победа!' : result === 'loss' ? 'Поражение' : 'Ничья'}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {reason}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Партия против бота {level.name} ({level.elo} Эло)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Analysis Progress Banner */}
          {isAnalyzing && (
            <div className="bg-slate-850 border border-emerald-500/30 rounded-xl p-3 text-center space-y-2 animate-pulse">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Stockfish анализирует качество ходов...</span>
                <span className="font-mono">{analysisProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Accuracy Gauges */}
          {report && !isAnalyzing && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Player Accuracy Card */}
              <div className="bg-slate-950/70 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Вы (Игрок)</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-0.5">
                    {playerAcc}%
                  </div>
                  <span className="text-[10px] text-slate-400">Точность ходов</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-300">
                  👤
                </div>
              </div>

              {/* Bot Accuracy Card */}
              <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Бот ({level.name})</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono mt-0.5">
                    {botAcc}%
                  </div>
                  <span className="text-[10px] text-slate-400">Точность ходов</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-slate-400 flex items-center justify-center font-bold text-xs text-slate-300">
                  {level.avatar}
                </div>
              </div>
            </div>
          )}

          {/* Move Classification Badges Breakdown */}
          {report && !isAnalyzing && playerCounts && botCounts && (
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Статистика качества ходов:
              </span>
              <div className="grid grid-cols-6 gap-1.5 text-center text-xs">
                {/* Brilliant */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 p-1.5 rounded-lg">
                  <div className="text-[10px] font-bold text-cyan-400">!! Блест.</div>
                  <div className="font-mono font-extrabold text-white text-sm">{playerCounts['!!']}</div>
                  <div className="text-[9px] text-slate-500 font-mono">бот: {botCounts['!!']}</div>
                </div>

                {/* Best */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-1.5 rounded-lg">
                  <div className="text-[10px] font-bold text-emerald-400">! Лучшие</div>
                  <div className="font-mono font-extrabold text-white text-sm">{playerCounts['!']}</div>
                  <div className="text-[9px] text-slate-500 font-mono">бот: {botCounts['!']}</div>
                </div>

                {/* Book */}
                <div className="bg-purple-500/10 border border-purple-500/30 p-1.5 rounded-lg">
                  <div className="text-[10px] font-bold text-purple-400">Книга</div>
                  <div className="font-mono font-extrabold text-white text-sm">{playerCounts['book']}</div>
                  <div className="text-[9px] text-slate-500 font-mono">бот: {botCounts['book']}</div>
                </div>

                {/* Inaccuracies */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-1.5 rounded-lg">
                  <div className="text-[10px] font-bold text-amber-400">?! Неточн.</div>
                  <div className="font-mono font-extrabold text-white text-sm">{playerCounts['?!']}</div>
                  <div className="text-[9px] text-slate-500 font-mono">бот: {botCounts['?!']}</div>
                </div>

                {/* Mistakes */}
                <div className="bg-orange-500/10 border border-orange-500/30 p-1.5 rounded-lg">
                  <div className="text-[10px] font-bold text-orange-400">? Ошибки</div>
                  <div className="font-mono font-extrabold text-white text-sm">{playerCounts['?']}</div>
                  <div className="text-[9px] text-slate-500 font-mono">бот: {botCounts['?']}</div>
                </div>

                {/* Blunders */}
                <div className="bg-red-500/10 border border-red-500/30 p-1.5 rounded-lg">
                  <div className="text-[10px] font-bold text-red-400">?? Зевки</div>
                  <div className="font-mono font-extrabold text-white text-sm">{playerCounts['??']}</div>
                  <div className="text-[9px] text-slate-500 font-mono">бот: {botCounts['??']}</div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Advantage Curve */}
          {report && !isAnalyzing && (
            <div className="space-y-2">
              <EvalChart
                moves={report.moves}
                currentPlyIndex={selectedPly !== null ? selectedPly : undefined}
                onSelectPly={setSelectedPly}
              />

              {/* Selected Move Detail Card */}
              {selectedMove && (
                <div className="bg-slate-850 border border-slate-750 p-2.5 rounded-xl text-xs space-y-1 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">
                      Ход {selectedMove.moveNumber}. {selectedMove.color === 'white' ? 'Белые' : 'Черные'}: {selectedMove.san}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                        selectedMove.classification === '??'
                          ? 'bg-red-500/20 text-red-400'
                          : selectedMove.classification === '?'
                          ? 'bg-orange-500/20 text-orange-400'
                          : selectedMove.classification === '?!'
                          ? 'bg-amber-500/20 text-amber-400'
                          : selectedMove.classification === '!!'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {selectedMove.classification}
                    </span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                    {selectedMove.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={onRematch}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Реванш</span>
            </button>
            <button
              onClick={onNewGame}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Новая партия</span>
            </button>
          </div>

          {/* Retry Mistakes Mode Button */}
          {hasMistakes && (
            <button
              onClick={onRetryMistakes}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-amber-500/25 flex items-center gap-2 transform hover:scale-102 active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-slate-950" />
              <span>Исправь свои ошибки ({report?.mistakesToRetry.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
