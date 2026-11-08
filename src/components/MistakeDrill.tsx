import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { DrawShape } from 'chessground/draw';
import { BoardTheme, Color, MoveAnalysis } from '../types/chess';
import { ChessBoard } from './ChessBoard';
import { sounds } from '../engine/soundService';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, HelpCircle, Eye, RotateCcw, Award } from 'lucide-react';

interface MistakeDrillProps {
  mistakes: MoveAnalysis[];
  playerColor: Color;
  theme: BoardTheme;
  onClose: () => void;
}

export const MistakeDrill: React.FC<MistakeDrillProps> = ({
  mistakes,
  theme,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [drillChess, setDrillChess] = useState<Chess>(() => new Chess());
  const [status, setStatus] = useState<'trying' | 'success' | 'failed'>('trying');
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [customShapes, setCustomShapes] = useState<DrawShape[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const currentMistake = mistakes && mistakes.length > 0 ? mistakes[currentIndex] : undefined;

  // Initialize board whenever current mistake changes
  useEffect(() => {
    if (!currentMistake) return;
    const c = new Chess(currentMistake.fenBefore);
    setDrillChess(c);
    setStatus('trying');
    setHintLevel(0);
    setCustomShapes([]);

    const blunderLabel =
      language === 'en'
        ? currentMistake.classification === '??'
          ? 'a blunder'
          : currentMistake.classification === '?'
          ? 'a mistake'
          : 'an inaccuracy'
        : language === 'tr'
        ? currentMistake.classification === '??'
          ? 'büyük bir hata'
          : currentMistake.classification === '?'
          ? 'bir hata'
          : 'hassasiyetsiz bir hamle'
        : currentMistake.classification === '??'
        ? 'грубый зевок'
        : currentMistake.classification === '?'
        ? 'ошибочный ход'
        : 'неточность';

    const sideName =
      currentMistake.color === 'white'
        ? language === 'ru'
          ? 'Белых'
          : language === 'tr'
          ? 'Beyaz'
          : 'White'
        : language === 'ru'
        ? 'Чёрных'
        : language === 'tr'
        ? 'Siyah'
        : 'Black';

    setFeedback(
      language === 'ru'
        ? `В этой позиции за ${sideName} было сыграно ${currentMistake.san} (${blunderLabel}). Найдите сильнейшее продолжение!`
        : language === 'tr'
        ? `Bu pozisyonda ${sideName} için ${currentMistake.san} oynandı (${blunderLabel}). En güçlü hamleyi bulun!`
        : `In this position you played ${currentMistake.san} for ${sideName}. This was ${blunderLabel}. Find the strongest move!`
    );
  }, [currentIndex, currentMistake, language]);

  // Handle all completed or no mistakes
  if (!currentMistake) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 max-w-md w-full p-6 rounded-2xl shadow-2xl text-center space-y-4 animate-fadeIn">
          <Award className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-white">{t('drillAllDone')}</h3>
          <p className="text-sm text-slate-300">
            {solvedCount > 0
              ? language === 'ru'
                ? `Вы успешно исправили ${solvedCount} ${solvedCount === 1 ? 'ошибку' : 'ошибок'}. Отличная работа над тактикой!`
                : language === 'tr'
                ? `Toplam ${solvedCount} hatayı başarıyla düzelttiniz. Harika taktiksel çalışma!`
                : `You successfully solved and corrected ${solvedCount} ${solvedCount === 1 ? 'mistake' : 'mistakes'}. Great tactical workout!`
              : language === 'ru'
              ? 'В этой партии не обнаружено критических ошибок. Отличная точность игры!'
              : language === 'tr'
              ? 'Bu oyunda düzeltilecek kritik bir hata bulunamadı! Mükemmel doğruluk.'
              : 'No critical mistakes to fix in this game! Excellent precision.'}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30"
          >
            {language === 'ru' ? 'Вернуться к разбору' : language === 'tr' ? 'Analize Dön' : 'Back to Review'}
          </button>
        </div>
      </div>
    );
  }

  // Handle user move in drill
  const handleDrillMove = (orig: string, dest: string, promotion?: string) => {
    if (status === 'success') return;

    const moveUci = `${orig}${dest}${promotion || ''}`.toLowerCase();
    const targetUci = (currentMistake.bestMoveUci || '').toLowerCase().trim();

    const testChess = new Chess(drillChess.fen());
    let moveResult;
    try {
      moveResult = testChess.move({ from: orig, to: dest, promotion: promotion || 'q' });
    } catch {
      return;
    }

    if (!moveResult) return; // Illegal move

    // Check if move matches best move by UCI coordinates, exact SAN, or destination
    const isCorrect =
      moveUci === targetUci ||
      (targetUci.length >= 4 && orig === targetUci.slice(0, 2) && dest === targetUci.slice(2, 4)) ||
      (currentMistake.bestMoveSan && moveResult.san === currentMistake.bestMoveSan);

    if (isCorrect) {
      sounds.playVictory();
      setDrillChess(testChess);
      setStatus('success');
      setSolvedCount((prev) => prev + 1);
      setCustomShapes([{ orig: orig as any, dest: dest as any, brush: 'green' }]);
      setFeedback(
        language === 'ru'
          ? `🎉 Верно! Ход ${moveResult.san} — сильнейшее решение. ${currentMistake.explanation}`
          : language === 'tr'
          ? `🎉 Doğru! ${moveResult.san} hamlesi en güçlü devam yoludur. ${currentMistake.explanation}`
          : `🎉 Correct! Move ${moveResult.san} is the strongest continuation. ${currentMistake.explanation}`
      );
    } else {
      sounds.playMove();
      setDrillChess(testChess);
      setStatus('failed');
      setCustomShapes([{ orig: orig as any, dest: dest as any, brush: 'red' }]);
      setFeedback(
        language === 'ru'
          ? `Ход ${moveResult.san} уступает лучшему решению. Попробуйте ещё раз!`
          : language === 'tr'
          ? `${moveResult.san} hamlesi en iyi hamle değil. Tekrar deneyin!`
          : `Move ${moveResult.san} is suboptimal. Try again!`
      );

      // Revert after 850ms so user can try again
      setTimeout(() => {
        setDrillChess(new Chess(currentMistake.fenBefore));
        setStatus('trying');
        setCustomShapes([]);
      }, 850);
    }
  };

  const handleShowHint = () => {
    if (!currentMistake.bestMoveUci) return;
    const from = currentMistake.bestMoveUci.substring(0, 2).toLowerCase();
    setHintLevel(1);
    setCustomShapes([{ orig: from as any, brush: 'yellow' }]);
    setFeedback(
      language === 'ru'
        ? `💡 Подсказка: обратите внимание на фигуру на поле ${from.toUpperCase()}.`
        : language === 'tr'
        ? `💡 İpucu: ${from.toUpperCase()} karesindeki taşa dikkat edin.`
        : `💡 Hint: Pay attention to the piece on ${from.toUpperCase()}.`
    );
  };

  const handleShowSolution = () => {
    if (!currentMistake.bestMoveUci) return;
    const from = currentMistake.bestMoveUci.substring(0, 2).toLowerCase();
    const to = currentMistake.bestMoveUci.substring(2, 4).toLowerCase();
    const promotion = currentMistake.bestMoveUci.length > 4 ? currentMistake.bestMoveUci[4] : undefined;

    setHintLevel(2);
    setCustomShapes([{ orig: from as any, dest: to as any, brush: 'green' }]);

    try {
      const solutionChess = new Chess(currentMistake.fenBefore);
      const res = solutionChess.move({ from, to, promotion: promotion || 'q' });
      if (res) {
        setDrillChess(solutionChess);
        setStatus('success');
        sounds.playVictory();
        setFeedback(
          language === 'ru'
            ? `Решение: ${currentMistake.bestMoveSan || res.san}. ${currentMistake.explanation}`
            : language === 'tr'
            ? `Çözüm: ${currentMistake.bestMoveSan || res.san}. ${currentMistake.explanation}`
            : `Solution: ${currentMistake.bestMoveSan || res.san}. ${currentMistake.explanation}`
        );
        return;
      }
    } catch {}

    setFeedback(
      language === 'ru'
        ? `Решение: ${currentMistake.bestMoveSan || currentMistake.bestMoveUci}.`
        : language === 'tr'
        ? `Çözüm: ${currentMistake.bestMoveSan || currentMistake.bestMoveUci}.`
        : `Solution: ${currentMistake.bestMoveSan || currentMistake.bestMoveUci}.`
    );
  };

  const handleNext = () => {
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(mistakes.length);
    }
  };

  const handleReset = () => {
    setDrillChess(new Chess(currentMistake.fenBefore));
    setStatus('trying');
    setHintLevel(0);
    setCustomShapes([]);
    setFeedback(
      language === 'ru'
        ? `Найдите сильнейшее продолжение вместо ${currentMistake.san}!`
        : language === 'tr'
        ? `${currentMistake.san} yerine en güçlü devam hamlesini bulun!`
        : `Find the strongest continuation instead of ${currentMistake.san}!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 max-w-4xl w-full p-4 sm:p-5 rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                <RotateCcw className="w-4 h-4" />
              </span>
              {t('drillTitle')}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'ru'
                ? `Ошибка ${currentIndex + 1} из ${mistakes.length} (Ход ${currentMistake.moveNumber}. ${currentMistake.color === 'white' ? 'Белые' : 'Чёрные'}: ${currentMistake.san})`
                : language === 'tr'
                ? `Hata ${currentIndex + 1} / ${mistakes.length} (Hamle ${currentMistake.moveNumber}. ${currentMistake.color === 'white' ? 'Beyaz' : 'Siyah'}: ${currentMistake.san})`
                : `Mistake ${currentIndex + 1} of ${mistakes.length} (Move ${currentMistake.moveNumber}. ${currentMistake.color === 'white' ? 'White' : 'Black'}: ${currentMistake.san})`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
          >
            {t('close')}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 py-2 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4 items-center">
            {/* Board Area - perfectly centered and dynamically sized to fit completely */}
            <div className="flex justify-center items-center w-full">
              <ChessBoard
                key={`drill-${currentIndex}-${currentMistake.fenBefore}`}
                chess={drillChess}
                orientation={currentMistake.color}
                playerColor={currentMistake.color}
                isBotThinking={false}
                onUserMove={handleDrillMove}
                customShapes={customShapes}
                theme={theme}
                boardSize="min(380px, calc(100vw - 36px), 46vh)"
              />
            </div>

            {/* Drill Sidebar & Actions */}
            <div className="space-y-3 bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-xs">
              {/* Classification Badge */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  {language === 'ru' ? 'Тип ошибки:' : language === 'tr' ? 'Hata türü:' : 'Mistake type:'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    currentMistake.classification === '??'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : currentMistake.classification === '?'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {currentMistake.classification === '??'
                    ? language === 'ru'
                      ? '?? Зевок'
                      : language === 'tr'
                      ? '?? Büyük Hata'
                      : '?? Blunder'
                    : currentMistake.classification === '?'
                    ? language === 'ru'
                      ? '? Ошибка'
                      : language === 'tr'
                      ? '? Hata'
                      : '? Mistake'
                    : language === 'ru'
                    ? '?! Неточность'
                    : language === 'tr'
                    ? '?! Hassasiyetsiz'
                    : '?! Inaccuracy'}
                </span>
              </div>

              {/* In-Game Played Move vs Best Move */}
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'ru' ? 'В партии сыграно:' : language === 'tr' ? 'Oyunda oynanan:' : 'Played in game:'}</span>
                  <span className="text-red-400 font-bold">{currentMistake.san}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'ru' ? 'Потеря оценки:' : language === 'tr' ? 'Değerlendirme kaybı:' : 'Eval loss:'}</span>
                  <span className="text-amber-400">
                    ~{(currentMistake.lossCp / 100).toFixed(1)} {language === 'ru' ? 'пешки' : language === 'tr' ? 'piyon' : 'pawns'}
                  </span>
                </div>
              </div>

              {/* Feedback box */}
              <div
                className={`p-3 rounded-lg border leading-relaxed text-xs transition-colors duration-200 ${
                  status === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : status === 'failed'
                    ? 'bg-red-500/15 border-red-500/40 text-red-200'
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
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-md flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>
                      {currentIndex < mistakes.length - 1
                        ? t('drillNext')
                        : t('drillFinish')}
                    </span>
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
                      <span>{t('drillNudge')}</span>
                    </button>

                    <button
                      onClick={handleShowSolution}
                      className="py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('drillSolution')}</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="col-span-2 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{language === 'ru' ? 'Сбросить позицию' : language === 'tr' ? 'Pozisyonu Sıfırla' : 'Reset position'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
