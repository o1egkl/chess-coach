import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { DrawShape } from 'chessground/draw';
import { CHESS_LEVELS, getLevelName, getLevelRank, getLevelDescription } from './config/levels';
import { identifyOpening, OpeningInfo } from './config/openings';
import { LevelConfig, Color, MoveRecord, BoardTheme, EngineEvaluation, GameReport, PlayerProfile } from './types/chess';
import { engine } from './engine/engineController';
import { sounds } from './engine/soundService';
import { analyzeThreatsAndHints } from './engine/coachHeuristics';
import { analyzeGame } from './engine/postGameAnalysis';
import { storage } from './services/storageService';
import { useLanguage } from './context/LanguageContext';
import { ChessBoard } from './components/ChessBoard';
import { EvalBar } from './components/EvalBar';
import { LevelSelector } from './components/LevelSelector';
import { CoachCard } from './components/CoachCard';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { GameOverModal } from './components/GameOverModal';
import { PostGameModal } from './components/PostGameModal';
import { MistakeDrill } from './components/MistakeDrill';
import { PuzzleTrainer } from './components/PuzzleTrainer';
import { ProfileModal } from './components/ProfileModal';
import { LanguageModal } from './components/LanguageModal';
import { BookOpen, Target, BarChart2, Swords, Globe } from 'lucide-react';

export const App: React.FC = () => {
  const { language, t, setIsLanguageModalOpen } = useLanguage();

  // Navigation & Mode
  const [appMode, setAppMode] = useState<'play' | 'puzzles'>('play');

  // Stage 3: Profile & Persistence
  const [profile, setProfile] = useState<PlayerProfile>(() => storage.getProfile());
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [lastGameResultInfo, setLastGameResultInfo] = useState<{
    eloDelta: number;
    newElo: number;
    unlockedLevelName?: string;
  } | null>(null);

  // Stage 2: Post-Game Review & Mistake Drill
  const [gameReport, setGameReport] = useState<GameReport | null>(null);
  const [isAnalyzingGame, setIsAnalyzingGame] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [isPostGameModalOpen, setIsPostGameModalOpen] = useState<boolean>(false);
  const [isMistakeDrillOpen, setIsMistakeDrillOpen] = useState<boolean>(false);

  // Game instance & stable ref
  const [chess, setChess] = useState<Chess>(() => new Chess());
  const chessRef = useRef(chess);
  chessRef.current = chess;

  const [level, setLevel] = useState<LevelConfig>(CHESS_LEVELS[0]);
  const [playerColor, setPlayerColor] = useState<Color>('white');
  const [boardOrientation, setBoardOrientation] = useState<Color>('white');
  const [theme, setTheme] = useState<BoardTheme>('green');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Moves & Eval
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [evaluation, setEvaluation] = useState<EngineEvaluation | null>(null);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);

  // Coach & Learning
  const [takebacksRemaining, setTakebacksRemaining] = useState<number>(CHESS_LEVELS[0].takebacksAllowed);
  const [threatRadarActive, setThreatRadarActive] = useState<boolean>(false);
  const [hintStage, setHintStage] = useState<0 | 1 | 2>(0);
  const [coachMessage, setCoachMessage] = useState<string>(() => t('coachWelcome'));
  const [blunderWarning, setBlunderWarning] = useState<string | null>(null);
  const [customShapes, setCustomShapes] = useState<DrawShape[]>([]);

  // Opening classifier
  const [openingInfo, setOpeningInfo] = useState<OpeningInfo | null>(null);

  // Game over state
  const [gameOver, setGameOver] = useState<{
    isOpen: boolean;
    result: 'win' | 'loss' | 'draw';
    reason: string;
  } | null>(null);

  // Update coach welcome on language change if no moves made yet
  useEffect(() => {
    if (moveHistory.length === 0) {
      setCoachMessage(t('coachWelcome'));
    }
  }, [language, t, moveHistory.length]);

  // Determine game phase
  const getGamePhase = (): 'Дебют' | 'Миттельшпиль' | 'Эндшпиль' => {
    const moveCount = Math.floor(moveHistory.length / 2);
    if (moveCount < 10) return 'Дебют';
    const fen = chessRef.current.fen().split(' ')[0];
    const pieces = fen.replace(/[^qrbnpQRBNP]/g, '').length;
    if (pieces <= 10) return 'Эндшпиль';
    return 'Миттельшпиль';
  };

  // Re-calculate custom shapes on the board (threat radar, hint arrows)
  const updateBoardShapes = useCallback(
    (stage: 0 | 1 | 2, radar: boolean, bestMove?: string) => {
      const shapes: DrawShape[] = [];
      const currentChess = chessRef.current;

      if (radar) {
        const analysis = analyzeThreatsAndHints(currentChess, playerColor, bestMove);
        analysis.threatenedSquares.forEach((sq) => {
          shapes.push({ orig: sq as any, brush: 'red' });
        });
        analysis.hangingPieces.forEach((sq) => {
          shapes.push({ orig: sq as any, brush: 'yellow' });
        });
      }

      if (bestMove && bestMove.length >= 4) {
        const from = bestMove.substring(0, 2);
        const to = bestMove.substring(2, 4);

        if (stage === 1) {
          shapes.push({ orig: from as any, brush: 'green' });
        } else if (stage === 2) {
          shapes.push({ orig: from as any, dest: to as any, brush: 'green' });
        }
      }

      setCustomShapes(shapes);
    },
    [playerColor]
  );

  // Check Game Over conditions
  const checkGameStatus = (currentChess: Chess): boolean => {
    if (currentChess.isGameOver()) {
      let result: 'win' | 'loss' | 'draw' = 'draw';
      let reason = t('draw');

      if (currentChess.isCheckmate()) {
        const winner = currentChess.turn() === 'w' ? 'black' : 'white';
        result = winner === playerColor ? 'win' : 'loss';
        reason = result === 'win' ? t('reasonCheckmateWin') : t('reasonCheckmateLoss');
      } else if (currentChess.isDraw()) {
        if (currentChess.isStalemate()) reason = t('reasonStalemate');
        else if (currentChess.isThreefoldRepetition()) reason = t('reasonDrawRepetition');
        else if (currentChess.isInsufficientMaterial()) reason = t('reasonDrawMaterial');
        else reason = t('reasonDraw50Moves');
      }

      // Record completed game in storage
      const record = storage.recordCompletedGame({
        levelId: level.id,
        botName: getLevelName(level, language),
        botElo: level.elo,
        botAvatar: level.avatar,
        playerColor,
        result,
        reason,
        playerAccuracy: 0,
        botAccuracy: 0,
        movesCount: moveHistory.length,
        openingName: openingInfo?.name,
        moves: moveHistory,
      });

      setProfile(record.updatedProfile);

      const unlockedLvl = record.newLevelUnlocked
        ? CHESS_LEVELS.find((l) => l.id === record.newLevelUnlocked)
        : undefined;

      const botDisplayName = unlockedLvl ? getLevelName(unlockedLvl, language) : '';

      setLastGameResultInfo({
        eloDelta: record.eloDelta,
        newElo: record.updatedProfile.elo,
        unlockedLevelName: unlockedLvl
          ? `${unlockedLvl.id}. ${botDisplayName} (${unlockedLvl.elo} ${language === 'en' ? 'Elo' : 'Эло'})`
          : undefined,
      });

      setGameOver({ isOpen: true, result, reason });
      return true;
    }
    return false;
  };

  // Trigger Bot Move
  const triggerBotMove = useCallback((chessSnapshot: Chess) => {
    setIsBotThinking(true);
    const artificialDelay = 450 + Math.random() * 350;

    setTimeout(() => {
      engine.evaluateAndPlay(
        chessSnapshot.fen(),
        level,
        (bestMoveUci) => {
          if (!bestMoveUci || bestMoveUci === '(none)') {
            setIsBotThinking(false);
            return;
          }

          const from = bestMoveUci.substring(0, 2);
          const to = bestMoveUci.substring(2, 4);
          const promotion = bestMoveUci.length > 4 ? bestMoveUci[4] : undefined;

          try {
            const currentChess = chessRef.current;
            const nextChess = new Chess(currentChess.fen());
            const moveResult = nextChess.move({ from, to, promotion });

            if (moveResult) {
              chessRef.current = nextChess;
              setChess(nextChess);

              if (moveResult.captured) sounds.playCapture();
              else sounds.playMove();
              if (nextChess.inCheck()) sounds.playCheck();

              const newRecord: MoveRecord = {
                san: moveResult.san,
                from: moveResult.from,
                to: moveResult.to,
                color: moveResult.color === 'w' ? 'white' : 'black',
                fen: nextChess.fen(),
              };
              setMoveHistory((prev) => [...prev, newRecord]);

              const isOver = checkGameStatus(nextChess);
              if (!isOver) {
                const threats = analyzeThreatsAndHints(nextChess, playerColor);
                setCoachMessage(threats.nudgeMessage);
                setHintStage(0);
                setBlunderWarning(null);
                updateBoardShapes(0, threatRadarActive);

                engine.evaluatePositionOnly(nextChess.fen(), 10, (evalData) => {
                  setEvaluation(evalData);
                });
              }
            }
          } catch (err) {
            console.error('Error executing bot move:', err);
          } finally {
            setIsBotThinking(false);
          }
        },
        (evalData) => {
          setEvaluation(evalData);
        }
      );
    }, artificialDelay);
  }, [level, playerColor, threatRadarActive, updateBoardShapes, language]);

  // User Move Handler (never uses stale closures)
  const handleUserMove = useCallback((orig: string, dest: string, promotion: string = 'q') => {
    if (isBotThinking) return;
    const currentChess = chessRef.current;
    if (currentChess.isGameOver()) return;

    try {
      const nextChess = new Chess(currentChess.fen());
      const moveResult = nextChess.move({ from: orig, to: dest, promotion });

      if (moveResult) {
        // Blunder Shield check
        if (level.hasBlunderShield) {
          const evalDiff = evaluation?.scoreCp;
          if (typeof evalDiff === 'number') {
            const isWhite = playerColor === 'white';
            const beforeAdvantage = isWhite ? evalDiff : -evalDiff;

            if (beforeAdvantage >= -100) {
              const testFen = nextChess.fen();
              engine.evaluatePositionOnly(testFen, 6, (fastEval) => {
                if (typeof fastEval.scoreCp === 'number') {
                  const afterAdvantage = isWhite ? fastEval.scoreCp : -fastEval.scoreCp;
                  const loss = beforeAdvantage - afterAdvantage;

                  if (loss >= 220) {
                    sounds.playBlunderAlert();
                    setBlunderWarning(t('blunderAlert'));
                  }
                }
              });
            }
          }
        }

        chessRef.current = nextChess;
        setChess(nextChess);

        if (moveResult.captured) sounds.playCapture();
        else sounds.playMove();
        if (nextChess.inCheck()) sounds.playCheck();

        const newRecord: MoveRecord = {
          san: moveResult.san,
          from: moveResult.from,
          to: moveResult.to,
          color: moveResult.color === 'w' ? 'white' : 'black',
          fen: nextChess.fen(),
        };
        const updatedHistory = [...moveHistory, newRecord];
        setMoveHistory(updatedHistory);

        // Opening detection
        const detectedOpening = identifyOpening(updatedHistory.map((m) => m.san));
        if (detectedOpening) {
          setOpeningInfo(detectedOpening);
        }

        setHintStage(0);
        setBlunderWarning(null);
        updateBoardShapes(0, threatRadarActive);

        const isOver = checkGameStatus(nextChess);
        if (!isOver) {
          triggerBotMove(nextChess);
        }
      }
    } catch (err) {
      console.warn('Illegal move attempted:', err);
    }
  }, [evaluation, isBotThinking, level, moveHistory, playerColor, threatRadarActive, triggerBotMove, updateBoardShapes, t]);

  // Two-Stage Hint Requests
  const handleRequestNudge = () => {
    if (hintStage >= 1 || isBotThinking) return;
    setHintStage(1);

    const currentChess = chessRef.current;
    engine.evaluatePositionOnly(currentChess.fen(), 8, (evalData) => {
      setEvaluation(evalData);
      const threats = analyzeThreatsAndHints(currentChess, playerColor, evalData.bestMove);
      setCoachMessage(threats.nudgeMessage);
      updateBoardShapes(1, threatRadarActive, evalData.bestMove);
    });
  };

  const handleRequestSolution = () => {
    if (isBotThinking) return;
    setHintStage(2);

    const currentChess = chessRef.current;
    engine.evaluatePositionOnly(currentChess.fen(), 10, (evalData) => {
      setEvaluation(evalData);
      if (evalData.bestMove) {
        const threats = analyzeThreatsAndHints(currentChess, playerColor, evalData.bestMove);
        if (threats.solutionMove) {
          setCoachMessage(
            t('recommendedMove', {
              move: threats.solutionMove.san,
              from: threats.solutionMove.from,
              to: threats.solutionMove.to,
            })
          );
        }
        updateBoardShapes(2, threatRadarActive, evalData.bestMove);
      }
    });
  };

  // Toggle Threat Radar
  const handleToggleThreatRadar = () => {
    const next = !threatRadarActive;
    setThreatRadarActive(next);
    updateBoardShapes(hintStage, next, evaluation?.bestMove);
  };

  // Reset / New Game
  const handleNewGame = () => {
    engine.stop();
    const freshChess = new Chess();
    chessRef.current = freshChess;
    setChess(freshChess);
    setMoveHistory([]);
    setEvaluation(null);
    setIsBotThinking(false);
    setGameOver(null);
    setHintStage(0);
    setBlunderWarning(null);
    setCustomShapes([]);
    setOpeningInfo(null);
    setTakebacksRemaining(level.takebacksAllowed);
    setGameReport(null);
    setIsPostGameModalOpen(false);
    setIsMistakeDrillOpen(false);
    const botName = getLevelName(level, language);
    setCoachMessage(
      language === 'en'
        ? `New game against bot "${botName}" (${level.elo} Elo). Good luck!`
        : `Новая партия против бота "${botName}" (${level.elo} Эло). Удачной игры!`
    );

    if (playerColor === 'black') {
      triggerBotMove(freshChess);
    }
  };

  // Trigger Post-Game Analysis
  const handleTriggerAnalysis = useCallback(async () => {
    if (moveHistory.length === 0) return;
    setIsPostGameModalOpen(true);
    setIsAnalyzingGame(true);
    setAnalysisProgress(0);

    try {
      const report = await analyzeGame(moveHistory, (pct) => {
        setAnalysisProgress(pct);
      });
      setGameReport(report);

      // Update recent game accuracy in storage
      const updated = storage.getProfile();
      if (updated.games.length > 0 && updated.games[0].levelId === level.id) {
        updated.games[0].playerAccuracy =
          playerColor === 'white' ? report.whiteAccuracy : report.blackAccuracy;
        updated.games[0].botAccuracy =
          playerColor === 'white' ? report.blackAccuracy : report.whiteAccuracy;
        storage.saveProfile(updated);
        setProfile({ ...updated });
      }
    } catch (err) {
      console.error('Failed to analyze game:', err);
    } finally {
      setIsAnalyzingGame(false);
    }
  }, [moveHistory, level.id, playerColor]);

  const handleOpenMistakeDrill = () => {
    setIsPostGameModalOpen(false);
    setIsMistakeDrillOpen(true);
  };

  // Level Selection
  const handleSelectLevel = (newLevel: LevelConfig) => {
    setLevel(newLevel);
    setTakebacksRemaining(newLevel.takebacksAllowed);
    engine.setLevel(newLevel);
    const botName = getLevelName(newLevel, language);
    const botDesc = getLevelDescription(newLevel, language);
    setCoachMessage(
      language === 'en'
        ? `Selected Level ${newLevel.id}: ${botName} (${newLevel.elo} Elo). ${botDesc}`
        : `Выбран уровень ${newLevel.id}: ${botName} (${newLevel.elo} Эло). ${botDesc}`
    );
  };

  // Takeback (Undo)
  const handleTakeback = () => {
    if (isBotThinking || moveHistory.length === 0) return;
    if (takebacksRemaining === 0) return;

    engine.stop();

    const movesToRevert = moveHistory.length >= 2 ? 2 : 1;
    const newHistory = moveHistory.slice(0, moveHistory.length - movesToRevert);

    const freshChess = new Chess();
    for (const record of newHistory) {
      freshChess.move({ from: record.from, to: record.to });
    }

    chessRef.current = freshChess;
    setChess(freshChess);
    setMoveHistory(newHistory);
    setHintStage(0);
    setBlunderWarning(null);
    setCustomShapes([]);
    setGameOver(null);

    if (takebacksRemaining > 0) {
      setTakebacksRemaining((prev) => prev - 1);
    }

    setCoachMessage(
      language === 'en'
        ? 'Move taken back. Find a stronger continuation!'
        : 'Ход возвращен. Найдите более сильное продолжение!'
    );
  };

  // Flip Board
  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  // Player Color Selection
  const handleSelectColor = (color: Color) => {
    if (moveHistory.length > 0 && !chess.isGameOver()) {
      if (
        !window.confirm(
          language === 'en'
            ? 'Starting a new game with the chosen color. Continue?'
            : 'Начать новую партию выбранным цветом?'
        )
      ) {
        return;
      }
    }
    setPlayerColor(color);
    setBoardOrientation(color);

    engine.stop();
    const freshChess = new Chess();
    chessRef.current = freshChess;
    setChess(freshChess);
    setMoveHistory([]);
    setEvaluation(null);
    setIsBotThinking(false);
    setGameOver(null);
    setHintStage(0);
    setBlunderWarning(null);
    setCustomShapes([]);
    setOpeningInfo(null);
    setTakebacksRemaining(level.takebacksAllowed);
    setGameReport(null);

    if (color === 'black') {
      triggerBotMove(freshChess);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  const handleNextLevel = () => {
    if (level.id < 15) {
      const nextLvl = CHESS_LEVELS[level.id];
      handleSelectLevel(nextLvl);
      handleNewGame();
    }
  };

  const isPlayerTurn =
    (chess.turn() === 'w' && playerColor === 'white') ||
    (chess.turn() === 'b' && playerColor === 'black');

  const botName = getLevelName(level, language);
  const botRank = getLevelRank(level, language);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Compact Top Navbar */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40 px-3 py-2 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">♟️</span>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                Chess Coach
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full hidden sm:inline">
                  {t('appSubtitle')}
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setAppMode('play')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                appMode === 'play'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{t('navPlay')}</span>
            </button>

            <button
              onClick={() => setAppMode('puzzles')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                appMode === 'puzzles'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{t('navPuzzles')}</span>
            </button>

            {moveHistory.length > 0 && (
              <button
                onClick={handleTriggerAnalysis}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-amber-300 hover:text-white hover:bg-slate-750 transition"
                title={language === 'en' ? 'Review played game' : 'Разобрать сыгранную партию'}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>{t('navReview')}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Pill */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 px-2 py-1 rounded-lg border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition shadow-sm font-semibold"
              title={language === 'en' ? 'Change Language' : 'Сменить язык'}
            >
              <span className="text-sm">{language === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
              <span className="font-mono text-[11px] uppercase font-bold">{language}</span>
            </button>

            {/* Player Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-500/50 text-xs transition shadow-sm"
              title={language === 'en' ? 'Open Player Profile' : 'Открыть профиль и статистику игрока'}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">
                👤
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-slate-200 text-[11px] leading-tight">
                  {profile.name}
                </div>
                <div className="text-[9px] text-emerald-400 font-mono">
                  {profile.elo} {language === 'en' ? 'Elo' : 'Эло'}
                </div>
              </div>
            </button>

            {/* Current Bot Info */}
            <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs hidden sm:flex">
              <span className="text-base">{level.avatar}</span>
              <div className="text-left">
                <div className="font-bold text-slate-200 text-[11px] leading-tight">
                  {botName}
                </div>
                <div className="text-[9px] text-amber-400 font-mono">
                  {level.elo} {language === 'en' ? 'Elo' : 'Эло'} • {botRank}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Layout or Puzzle Trainer */}
      {appMode === 'puzzles' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
          <PuzzleTrainer theme={theme} onExit={() => setAppMode('play')} />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-[250px_1fr_270px] xl:grid-cols-[270px_1fr_290px] gap-3 md:gap-4 items-start">
          {/* Left Column: Coach & Level Roadmap */}
          <section className="space-y-3 order-2 lg:order-1 min-w-0">
            <CoachCard
              level={level}
              gamePhase={getGamePhase()}
              openingInfo={openingInfo}
              coachMessage={coachMessage}
              blunderWarning={blunderWarning}
              hintStage={hintStage}
              onRequestNudge={handleRequestNudge}
              onRequestSolution={handleRequestSolution}
              threatRadarActive={threatRadarActive}
              onToggleThreatRadar={handleToggleThreatRadar}
              isBotThinking={isBotThinking}
              isPlayerTurn={isPlayerTurn}
              takebacksRemaining={takebacksRemaining}
              onTakeback={handleTakeback}
            />

            <LevelSelector
              currentLevel={level}
              onSelectLevel={handleSelectLevel}
              botProgress={profile.botProgress}
              disabled={isBotThinking}
            />
          </section>

          {/* Center Column: Chessboard & Opponent/Player Cards */}
          <section className="flex flex-col items-center justify-center space-y-2 order-1 lg:order-2 w-full min-w-0">
            {/* Opponent Card (Top) */}
            <div className="w-full max-w-[480px] bg-slate-850 border border-slate-750 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">{level.avatar}</span>
                <div>
                  <span className="font-bold text-slate-100 text-[12px] flex items-center gap-1.5">
                    {language === 'en' ? `Bot ${botName}` : `Бот ${botName}`}
                    {isBotThinking && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-normal animate-pulse">
                        {language === 'en' ? 'thinking...' : 'думает...'}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {botRank} ({level.elo} {language === 'en' ? 'Elo' : 'Эло'})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                <span>
                  {playerColor === 'white'
                    ? language === 'en'
                      ? 'Black'
                      : 'Черные'
                    : language === 'en'
                    ? 'White'
                    : 'Белые'}
                </span>
                <span className="text-sm">{playerColor === 'white' ? '♚' : '♔'}</span>
              </div>
            </div>

            {/* Board with Eval Bar Locked Together */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full h-[min(480px,58vh)] min-h-[300px] max-h-[500px]">
              {/* Eval Bar strictly matching board height */}
              <EvalBar evaluation={evaluation} orientation={boardOrientation} />

              {/* Interactive Square Board */}
              <ChessBoard
                chess={chess}
                orientation={boardOrientation}
                playerColor={playerColor}
                isBotThinking={isBotThinking}
                onUserMove={handleUserMove}
                customShapes={customShapes}
                theme={theme}
              />
            </div>

            {/* Player Card (Bottom) */}
            <div className="w-full max-w-[480px] bg-slate-850 border border-slate-750 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center font-bold text-emerald-400 text-xs">
                  👤
                </div>
                <div>
                  <span className="font-bold text-slate-100 text-[12px]">
                    {language === 'en' ? 'You (Player)' : 'Вы (Игрок)'}
                  </span>
                  <span className="block text-[10px] text-emerald-400 font-mono">
                    {isPlayerTurn && !isBotThinking
                      ? t('yourTurn')
                      : language === 'en'
                      ? 'Waiting for opponent'
                      : 'Ожидание соперника'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                <span>
                  {playerColor === 'white'
                    ? language === 'en'
                      ? 'White'
                      : 'Белые'
                    : language === 'en'
                      ? 'Black'
                      : 'Черные'}
                </span>
                <span className="text-sm">{playerColor === 'white' ? '♔' : '♚'}</span>
              </div>
            </div>
          </section>

          {/* Right Column: Game Controls & PGN History */}
          <section className="space-y-3 order-3 min-w-0">
            <GameControls
              playerColor={playerColor}
              onSelectColor={handleSelectColor}
              onNewGame={handleNewGame}
              onTakeback={handleTakeback}
              canTakeback={takebacksRemaining !== 0 && moveHistory.length > 0}
              onFlipBoard={handleFlipBoard}
              theme={theme}
              onSelectTheme={setTheme}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              isBotThinking={isBotThinking}
            />

            <MoveHistory moves={moveHistory} currentMoveIndex={moveHistory.length - 1} />

            {/* Principles Tips box */}
            <div className="bg-slate-850/60 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-200 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'en' ? 'Key Chess Principles:' : 'Главные правила шахматиста:'}</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[10px] leading-relaxed">
                <li>
                  {language === 'en'
                    ? 'Develop minor pieces (knights & bishops) before attacking.'
                    : 'Развивайте коней и слонов перед атакой.'}
                </li>
                <li>
                  {language === 'en'
                    ? 'Castle early to keep your king safe.'
                    : 'Сделайте рокировку до 10-го хода.'}
                </li>
                <li>
                  {language === 'en'
                    ? 'Check opponent checks and captures before each move.'
                    : 'Проверяйте шахи и взятия соперника перед ходом.'}
                </li>
              </ul>
            </div>
          </section>
        </main>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          isOpen={gameOver.isOpen}
          result={gameOver.result}
          reason={gameOver.reason}
          level={level}
          playerColor={playerColor}
          eloDelta={lastGameResultInfo?.eloDelta}
          newElo={lastGameResultInfo?.newElo}
          unlockedLevelName={lastGameResultInfo?.unlockedLevelName}
          onRematch={handleNewGame}
          onNextLevel={handleNextLevel}
          onAnalyze={handleTriggerAnalysis}
          onClose={() => setGameOver(null)}
        />
      )}

      {/* Post-Game Analysis Modal */}
      <PostGameModal
        isOpen={isPostGameModalOpen}
        result={gameOver?.result || 'draw'}
        reason={gameOver?.reason || (language === 'en' ? 'Game in progress or finished' : 'Партия в процессе или завершена')}
        report={gameReport}
        isAnalyzing={isAnalyzingGame}
        analysisProgress={analysisProgress}
        playerColor={playerColor}
        level={level}
        theme={theme}
        onRetryMistakes={handleOpenMistakeDrill}
        onRematch={handleNewGame}
        onNewGame={handleNewGame}
        onClose={() => setIsPostGameModalOpen(false)}
      />

      {/* Retry Mistakes Drill Modal */}
      {isMistakeDrillOpen && gameReport && (
        <MistakeDrill
          mistakes={gameReport.mistakesToRetry}
          playerColor={playerColor}
          theme={theme}
          onClose={() => setIsMistakeDrillOpen(false)}
        />
      )}

      {/* Player Profile & Stats Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onUpdateProfile={setProfile}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Language Selection Modal (Shown at first launch or via Header flag button) */}
      <LanguageModal />
    </div>
  );
};
