import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { DrawShape } from 'chessground/draw';
import confetti from 'canvas-confetti';
import { CHESS_PUZZLES, getPuzzleTitle, getPuzzleTheme, getPuzzleDescription, getPuzzleHint } from '../config/puzzles';
import { BoardTheme, Puzzle } from '../types/chess';
import { ChessBoard } from './ChessBoard';
import { sounds } from '../engine/soundService';
import { storage } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { HelpCircle, Eye, RotateCcw, ArrowRight, Flame, Target, CheckCircle2 } from 'lucide-react';

interface PuzzleTrainerProps {
  theme: BoardTheme;
  onExit: () => void;
}

export const PuzzleTrainer: React.FC<PuzzleTrainerProps> = ({ theme, onExit }) => {
  const { language, t } = useLanguage();
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [chess, setChess] = useState<Chess>(() => new Chess());
  const [solutionStep, setSolutionStep] = useState<number>(0);
  const [solved, setSolved] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(() => storage.getProfile().tacticsStreak);
  const [userRating, setUserRating] = useState<number>(() => storage.getProfile().tacticsRating);
  const [customShapes, setCustomShapes] = useState<DrawShape[]>([]);
  const [feedback, setFeedback] = useState<string>('');

  const currentPuzzle: Puzzle = CHESS_PUZZLES[puzzleIndex % CHESS_PUZZLES.length];

  // Initialize current puzzle
  useEffect(() => {
    const c = new Chess(currentPuzzle.fen);
    setChess(c);
    setSolutionStep(0);
    setSolved(false);
    setFailed(false);
    setCustomShapes([]);
    setFeedback(getPuzzleDescription(currentPuzzle, language));
  }, [puzzleIndex, language]);

  // Handle user's move
  const handleUserMove = (orig: string, dest: string, promotion?: string) => {
    if (solved) return;

    const moveUci = `${orig}${dest}${promotion || ''}`;
    const expectedMoveUci = currentPuzzle.solutionUci[solutionStep];

    const testChess = new Chess(chess.fen());
    const moveResult = testChess.move({ from: orig, to: dest, promotion });

    if (!moveResult) return; // Illegal move

    if (moveUci === expectedMoveUci) {
      // User made the correct move!
      sounds.playCapture();
      setChess(testChess);
      setFailed(false);

      const nextStep = solutionStep + 1;

      // Check if puzzle is fully completed
      if (nextStep >= currentPuzzle.solutionUci.length) {
        sounds.playVictory();
        setSolved(true);
        const res = storage.recordTacticsResult(currentPuzzle.id, currentPuzzle.rating, true);
        setStreak(res.newStreak);
        setUserRating(res.newRating);
        const hintText = getPuzzleHint(currentPuzzle, language);
        setFeedback(
          language === 'en'
            ? `🎉 Excellent! Puzzle solved (+${res.ratingDelta} to rating). ${hintText}`
            : `🎉 Отлично! Задача решена (+${res.ratingDelta} к рейтингу). ${hintText}`
        );

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        // Opponent makes next automated reply move after 400ms
        setSolutionStep(nextStep);
        const opponentMoveUci = currentPuzzle.solutionUci[nextStep];

        setTimeout(() => {
          const oppChess = new Chess(testChess.fen());
          const from = opponentMoveUci.substring(0, 2);
          const to = opponentMoveUci.substring(2, 4);
          const oppProm = opponentMoveUci.length > 4 ? opponentMoveUci[4] : undefined;
          oppChess.move({ from, to, promotion: oppProm });
          sounds.playMove();
          setChess(oppChess);
          setSolutionStep(nextStep + 1);
          setFeedback(
            language === 'en'
              ? 'Great move! Continue the tactical combination.'
              : 'Отличный ход! Продолжайте комбинацию.'
          );
        }, 400);
      }
    } else {
      // Wrong move
      sounds.playBlunderAlert();
      setFailed(true);
      const res = storage.recordTacticsResult(currentPuzzle.id, currentPuzzle.rating, false);
      setStreak(res.newStreak);
      setUserRating(res.newRating);
      setFeedback(
        language === 'en'
          ? 'Incorrect move (-10 to rating). Try again or request a hint!'
          : 'Неверный ход (-10 к рейтингу). Попробуйте еще раз или возьмите подсказку!'
      );
      // Revert after brief moment
      setTimeout(() => {
        setChess(new Chess(currentPuzzle.fen));
        setSolutionStep(0);
      }, 700);
    }
  };

  const handleShowHint = () => {
    const nextUci = currentPuzzle.solutionUci[solutionStep];
    if (nextUci) {
      const from = nextUci.substring(0, 2);
      setCustomShapes([{ orig: from as any, brush: 'yellow' }]);
      setFeedback(
        language === 'en'
          ? `💡 Hint: pay attention to the piece on ${from.toUpperCase()}.`
          : `💡 Подсказка: обратите внимание на фигуру на поле ${from.toUpperCase()}.`
      );
    }
  };

  const handleShowSolution = () => {
    const nextUci = currentPuzzle.solutionUci[solutionStep];
    if (nextUci) {
      const from = nextUci.substring(0, 2);
      const to = nextUci.substring(2, 4);
      setCustomShapes([{ orig: from as any, dest: to as any, brush: 'green' }]);
      setFeedback(
        language === 'en'
          ? `Solution move: ${from} → ${to}`
          : `Решение хода: ${from} → ${to}`
      );
    }
  };

  const handleNextPuzzle = () => {
    setPuzzleIndex((prev) => (prev + 1) % CHESS_PUZZLES.length);
  };

  const handleResetPuzzle = () => {
    setChess(new Chess(currentPuzzle.fen));
    setSolutionStep(0);
    setSolved(false);
    setFailed(false);
    setCustomShapes([]);
    setFeedback(getPuzzleDescription(currentPuzzle, language));
  };

  const puzzleTitle = getPuzzleTitle(currentPuzzle, language);
  const puzzleTheme = getPuzzleTheme(currentPuzzle, language);

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
      {/* Center Column: Chessboard */}
      <div className="flex flex-col items-center justify-center space-y-3 bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl">
        {/* Header bar */}
        <div className="w-full flex items-center justify-between text-xs px-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              {puzzleTitle}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {puzzleTheme}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-slate-300">
            <span className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              {language === 'en' ? 'Streak: ' : 'Серия: '}
              {streak}
            </span>
            <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-200">
              {language === 'en' ? 'Rating: ' : 'Рейтинг: '}
              {userRating}
            </span>
          </div>
        </div>

        {/* Board Component */}
        <div className="flex items-center justify-center w-full max-w-[480px]">
          <ChessBoard
            chess={chess}
            orientation={currentPuzzle.playerColor}
            playerColor={currentPuzzle.playerColor}
            isBotThinking={false}
            onUserMove={handleUserMove}
            customShapes={customShapes}
            theme={theme}
          />
        </div>

        {/* Turn Indicator */}
        <div className="w-full max-w-[480px] bg-slate-850 border border-slate-750 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
          <span className="text-slate-300">
            {language === 'en'
              ? `${currentPuzzle.playerColor === 'white' ? 'White' : 'Black'} to move`
              : `Ваш ход (${currentPuzzle.playerColor === 'white' ? 'Белые' : 'Черные'})`}
          </span>
          <span className="font-mono text-amber-400">
            {language === 'en' ? 'Difficulty: ' : 'Сложность: '}
            {language === 'en'
              ? currentPuzzle.difficultyEn || currentPuzzle.difficulty
              : currentPuzzle.difficulty}{' '}
            ({currentPuzzle.rating})
          </span>
        </div>
      </div>

      {/* Right Column: Instructions, Hint & Controls */}
      <div className="space-y-3 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-xl text-xs">
        {/* Feedback / Instructions Box */}
        <div
          className={`p-3.5 rounded-xl border leading-relaxed ${
            solved
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
              : failed
              ? 'bg-red-500/15 border-red-500/40 text-red-200'
              : 'bg-slate-850 border-slate-750 text-slate-200'
          }`}
        >
          <div className="font-semibold text-xs mb-1 flex items-center gap-1.5">
            {solved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <HelpCircle className="w-4 h-4 text-amber-400" />
            )}
            <span>
              {solved
                ? language === 'en'
                  ? 'Solved!'
                  : 'Решено!'
                : language === 'en'
                ? 'Objective:'
                : 'Цель тактики:'}
            </span>
          </div>
          <p className="text-[12px]">{feedback}</p>
        </div>

        {/* Controls */}
        <div className="space-y-2 pt-2">
          {solved ? (
            <button
              onClick={handleNextPuzzle}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <span>{t('puzzleNextBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShowHint}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t('puzzleHintBtn')}</span>
              </button>

              <button
                onClick={handleShowSolution}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Solution' : 'Показать ход'}</span>
              </button>

              <button
                onClick={handleResetPuzzle}
                className="py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'en' ? 'Retry' : 'Заново'}</span>
              </button>

              <button
                onClick={handleNextPuzzle}
                className="py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <span>{language === 'en' ? 'Skip' : 'Пропустить'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="border-t border-slate-800 pt-3">
            <button
              onClick={onExit}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition font-medium"
            >
              {language === 'en' ? '← Back to Game vs Bot' : '← Вернуться к игре против бота'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
