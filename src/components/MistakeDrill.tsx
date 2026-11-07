import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { DrawShape } from 'chessground/draw';
import { BoardTheme, Color, MoveAnalysis } from '../types/chess';
import { ChessBoard } from './ChessBoard';
import { sounds } from '../engine/soundService';
import { CheckCircle2, AlertTriangle, ArrowRight, HelpCircle, Eye, RotateCcw, Award } from 'lucide-react';

interface MistakeDrillProps {
  mistakes: MoveAnalysis[];
  playerColor: Color;
  theme: BoardTheme;
  onClose: () => void;
}

export const MistakeDrill: React.FC<MistakeDrillProps> = ({
  mistakes,
  playerColor,
  theme,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [drillChess, setDrillChess] = useState<Chess>(() => new Chess());
  const [status, setStatus] = useState<'trying' | 'success' | 'failed'>('trying');
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [customShapes, setCustomShapes] = useState<DrawShape[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const currentMistake = mistakes[currentIndex];

  // Initialize board for current mistake
  useEffect(() => {
    if (!currentMistake) return;
    const c = new Chess(currentMistake.fenBefore);
    setDrillChess(c);
    setStatus('trying');
    setHintLevel(0);
    setCustomShapes([]);
    setFeedback(`В этой позиции вы сыграли ${currentMistake.san}. Это был ${currentMistake.classification === '??' ? 'зевок' : 'ошибочный ход'}. Найдите сильнейшее продолжение!`);
  }, [currentIndex, currentMistake]);

  if (!currentMistake) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 max-w-md w-full p-6 rounded-2xl shadow-2xl text-center space-y-4">
          <Award className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-white">Все ошибки разобраны!</h3>
          <p className="text-sm text-slate-300">
            Вы успешно исправили {solvedCount} {solvedCount === 1 ? 'ошибку' : 'ошибок'}. Отличная работа над тактикой!
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
          >
            Вернуться к разбору
          </button>
        </div>
      </div>
    );
  }

  // Handle user move in drill
  const handleDrillMove = (orig: string, dest: string, promotion?: string) => {
    if (status === 'success') return;

    const moveUci = `${orig}${dest}${promotion || ''}`;
    const targetUci = currentMistake.bestMoveUci || '';

    const testChess = new Chess(drillChess.fen());
    const result = testChess.move({ from: orig, to: dest, promotion });

    if (!result) return; // Illegal move

    // Check if move matches best move
    const isCorrect =
      moveUci === targetUci ||
      result.san === currentMistake.bestMoveSan ||
      (orig === targetUci.slice(0, 2) && dest === targetUci.slice(2, 4));

    if (isCorrect) {
      sounds.playVictory();
      setDrillChess(testChess);
      setStatus('success');
      setSolvedCount((prev) => prev + 1);
      setCustomShapes([{ orig: orig as any, dest: dest as any, brush: 'green' }]);
      setFeedback(`🎉 Верно! Ход ${result.san} — сильнейшее решение. ${currentMistake.explanation}`);
    } else {
      sounds.playMove();
      setStatus('failed');
      setFeedback(`Ход ${result.san} уступает лучшему решению. Попробуйте ещё раз!`);
      // Reset position after short delay
      setTimeout(() => {
        setDrillChess(new Chess(currentMistake.fenBefore));
      }, 700);
    }
  };

  const handleShowHint = () => {
    if (!currentMistake.bestMoveUci) return;
    const from = currentMistake.bestMoveUci.substring(0, 2);
    setHintLevel(1);
    setCustomShapes([{ orig: from as any, brush: 'yellow' }]);
    setFeedback(`💡 Подсказка: обратите внимание на фигуру на поле ${from.toUpperCase()}.`);
  };

  const handleShowSolution = () => {
    if (!currentMistake.bestMoveUci) return;
    const from = currentMistake.bestMoveUci.substring(0, 2);
    const to = currentMistake.bestMoveUci.substring(2, 4);
    setHintLevel(2);
    setCustomShapes([{ orig: from as any, dest: to as any, brush: 'green' }]);
    setFeedback(`Решение: ход ${currentMistake.bestMoveSan || currentMistake.bestMoveUci}.`);
  };

  const handleNext = () => {
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all
      setCurrentIndex(mistakes.length);
    }
  };

  const handleReset = () => {
    setDrillChess(new Chess(currentMistake.fenBefore));
    setStatus('trying');
    setHintLevel(0);
    setCustomShapes([]);
    setFeedback(`Найдите сильнейшее продолжение вместо ${currentMistake.san}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 max-w-4xl w-full p-4 sm:p-6 rounded-2xl shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                <RotateCcw className="w-4 h-4" />
              </span>
              Режим: «Исправь свои ошибки»
            </h3>
            <p className="text-xs text-slate-400">
              Ошибка {currentIndex + 1} из {mistakes.length} (Ход {currentMistake.moveNumber}. {currentMistake.san})
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
          >
            Закрыть
          </button>
        </div>

        {/* Content: Board + Coaching feedback */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 items-center">
          {/* Board Area */}
          <div className="flex justify-center items-center h-[340px] sm:h-[400px]">
            <ChessBoard
              chess={drillChess}
              orientation={playerColor}
              playerColor={playerColor}
              isBotThinking={false}
              onUserMove={handleDrillMove}
              customShapes={customShapes}
              theme={theme}
            />
          </div>

          {/* Drill Sidebar & Actions */}
          <div className="space-y-3.5 bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-xs">
            {/* Classification Badge */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Тип ошибки:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  currentMistake.classification === '??'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}
              >
                {currentMistake.classification === '??' ? '?? Зевок' : '? Ошибка'}
              </span>
            </div>

            {/* In-Game Played Move vs Best Move */}
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>В партии сыграно:</span>
                <span className="text-red-400 font-bold">{currentMistake.san}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Потеря оценки:</span>
                <span className="text-amber-400">~{(currentMistake.lossCp / 100).toFixed(1)} пешки</span>
              </div>
            </div>

            {/* Feedback box */}
            <div
              className={`p-3 rounded-lg border leading-relaxed text-xs ${
                status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : status === 'failed'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-slate-850 border-slate-750 text-slate-200'
              }`}
            >
              {feedback}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {status === 'success' ? (
                <button
                  onClick={handleNext}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2"
                >
                  <span>{currentIndex < mistakes.length - 1 ? 'Следующая ошибка' : 'Завершить'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShowHint}
                    disabled={hintLevel >= 1}
                    className="py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-400 font-medium rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Подсказка</span>
                  </button>

                  <button
                    onClick={handleShowSolution}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Показать ход</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="col-span-2 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Сбросить позицию</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
