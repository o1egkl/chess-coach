import { Chess } from 'chess.js';
import { Color, GameReport, MoveAnalysis, MoveClassification, MoveRecord } from '../types/chess';
import { COMMON_OPENINGS } from '../config/openings';

interface EvalResult {
  cp: number;
  mate: number | null;
  bestMove: string;
}

// Check if move matches opening book
function isBookMove(plyIndex: number, currentSan: string, moveHistory: MoveRecord[]): boolean {
  if (plyIndex >= 14) return false;
  const currentSanMoves = moveHistory.slice(0, plyIndex + 1).map((m) => m.san);

  for (const op of COMMON_OPENINGS) {
    let match = true;
    for (let i = 0; i <= plyIndex; i++) {
      if (i >= op.moves.length || op.moves[i] !== currentSanMoves[i]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

// Evaluate a single FEN using a dedicated Web Worker instance
function evaluateFen(
  worker: Worker,
  fen: string,
  depth: number = 8
): Promise<EvalResult> {
  return new Promise((resolve) => {
    let bestMove = '';
    let latestCp = 0;
    let latestMate: number | null = null;
    let hasResolved = false;

    // Timeout safety
    const timer = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        resolve({ cp: latestCp, mate: latestMate, bestMove: bestMove || 'e2e4' });
      }
    }, 2500);

    const messageHandler = (e: MessageEvent) => {
      const line: string = typeof e.data === 'string' ? e.data : '';

      if (line.startsWith('info') && line.includes('score')) {
        const cpMatch = line.match(/score\s+cp\s+(-?\d+)/);
        if (cpMatch) {
          latestCp = parseInt(cpMatch[1], 10);
        }
        const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
        if (mateMatch) {
          latestMate = parseInt(mateMatch[1], 10);
        }

        const pvIndex = line.indexOf(' pv ');
        if (pvIndex !== -1) {
          const pv = line.substring(pvIndex + 4).trim().split(' ')[0];
          if (pv) bestMove = pv;
        }
      }

      if (line.startsWith('bestmove')) {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timer);
          worker.removeEventListener('message', messageHandler);

          const parts = line.split(' ');
          const move = parts[1];
          if (move && move !== '(none)') bestMove = move;

          // Normalize score to White's perspective
          // Stockfish score is from side to move's perspective
          const sideToMove = fen.split(' ')[1];
          let normalizedCp = latestCp;
          if (sideToMove === 'b') {
            normalizedCp = -latestCp;
            if (latestMate !== null) latestMate = -latestMate;
          }

          resolve({
            cp: normalizedCp,
            mate: latestMate,
            bestMove: bestMove || 'e2e4',
          });
        }
      }
    };

    worker.addEventListener('message', messageHandler);
    worker.postMessage(`position fen ${fen}`);
    worker.postMessage(`go depth ${depth}`);
  });
}

// Main game review function
export async function analyzeGame(
  moves: MoveRecord[],
  onProgress?: (progressPercent: number) => void
): Promise<GameReport> {
  if (moves.length === 0) {
    return {
      whiteAccuracy: 100,
      blackAccuracy: 100,
      counts: {
        white: { '!!': 0, '!': 0, book: 0, '?!': 0, '?': 0, '??': 0 },
        black: { '!!': 0, '!': 0, book: 0, '?!': 0, '?': 0, '??': 0 },
      },
      moves: [],
      mistakesToRetry: [],
    };
  }

  // Spin up dedicated worker for fast batch evaluation
  const worker = new Worker('/stockfish/stockfish.js');
  worker.postMessage('uci');
  worker.postMessage('setoption name MultiPV value 1');
  worker.postMessage('isready');

  // Let worker initialize
  await new Promise((r) => setTimeout(r, 200));

  const moveAnalyses: MoveAnalysis[] = [];
  const whiteLosses: number[] = [];
  const blackLosses: number[] = [];

  const counts = {
    white: { '!!': 0, '!': 0, book: 0, '?!': 0, '?': 0, '??': 0 } as Record<MoveClassification, number>,
    black: { '!!': 0, '!': 0, book: 0, '?!': 0, '?': 0, '??': 0 } as Record<MoveClassification, number>,
  };

  const initialChess = new Chess();
  let prevFen = initialChess.fen();

  // Evaluate initial position
  const initialEval = await evaluateFen(worker, prevFen, 6);
  let currentEval = initialEval.cp;

  const totalMoves = moves.length;

  for (let i = 0; i < totalMoves; i++) {
    const record = moves[i];
    const fenBefore = prevFen;
    const fenAfter = record.fen;
    const color: Color = record.color;
    const moveNumber = Math.floor(i / 2) + 1;

    // Evaluate position before move to get best engine move
    const beforeResult = await evaluateFen(worker, fenBefore, 8);
    const afterResult = await evaluateFen(worker, fenAfter, 8);

    const evalBeforeCp = beforeResult.cp;
    const evalAfterCp = afterResult.cp;

    // Calculate loss from player's perspective
    let lossCp = 0;
    if (color === 'white') {
      lossCp = Math.max(0, evalBeforeCp - evalAfterCp);
    } else {
      lossCp = Math.max(0, evalAfterCp - evalBeforeCp);
    }

    if (color === 'white') whiteLosses.push(lossCp);
    else blackLosses.push(lossCp);

    // Convert best move UCI to SAN for friendly display
    let bestMoveSan = '';
    try {
      const tempChess = new Chess(fenBefore);
      const from = beforeResult.bestMove.substring(0, 2);
      const to = beforeResult.bestMove.substring(2, 4);
      const promotion = beforeResult.bestMove.length > 4 ? beforeResult.bestMove[4] : undefined;
      const m = tempChess.move({ from, to, promotion });
      if (m) bestMoveSan = m.san;
    } catch {}

    // Check classification
    let classification: MoveClassification = '!';
    let explanation = 'Хороший ход';

    const userUci = `${record.from}${record.to}`;
    const playedBest = userUci === beforeResult.bestMove || record.san === bestMoveSan;
    const inBook = isBookMove(i, record.san, moves);

    if (inBook) {
      classification = 'book';
      explanation = 'Теоретический дебютный ход.';
    } else if (playedBest) {
      if (lossCp <= 10 && evalAfterCp * (color === 'white' ? 1 : -1) > 250 && record.san.includes('x')) {
        classification = '!!';
        explanation = 'Блестящее тактическое решение!';
      } else {
        classification = '!';
        explanation = 'Лучший ход в позиции.';
      }
    } else if (lossCp >= 250) {
      classification = '??';
      const lossPawns = (lossCp / 100).toFixed(1);
      explanation = `Грубая ошибка (потеря ~${lossPawns} пешек). Лучше было сыграть ${bestMoveSan || beforeResult.bestMove}.`;
    } else if (lossCp >= 110) {
      classification = '?';
      const lossPawns = (lossCp / 100).toFixed(1);
      explanation = `Ошибка (потеря ~${lossPawns} пешек). Сильнее ход ${bestMoveSan || beforeResult.bestMove}.`;
    } else if (lossCp >= 45) {
      classification = '?!';
      explanation = `Неточность. Лучшей альтернативой был ход ${bestMoveSan || beforeResult.bestMove}.`;
    } else {
      classification = '!';
      explanation = 'Качественный ход.';
    }

    counts[color][classification]++;

    moveAnalyses.push({
      plyIndex: i,
      moveNumber,
      color,
      san: record.san,
      from: record.from,
      to: record.to,
      fenBefore,
      fenAfter,
      evalBeforeCp,
      evalAfterCp,
      lossCp,
      bestMoveSan: bestMoveSan || beforeResult.bestMove,
      bestMoveUci: beforeResult.bestMove,
      classification,
      explanation,
    });

    prevFen = fenAfter;

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalMoves) * 100));
    }
  }

  worker.terminate();

  // Calculate Accuracy (0-100%)
  const calculateAccuracy = (losses: number[]): number => {
    if (losses.length === 0) return 100;
    // Harmonic accuracy function: 100 * exp(-0.0035 * loss)
    const accuracies = losses.map((loss) => Math.max(0, Math.min(100, 100 * Math.exp(-0.0035 * loss))));
    const sum = accuracies.reduce((a, b) => a + b, 0);
    return Math.round(sum / accuracies.length);
  };

  const whiteAccuracy = calculateAccuracy(whiteLosses);
  const blackAccuracy = calculateAccuracy(blackLosses);

  // Mistakes to retry: filter player's ? and ??
  const mistakesToRetry = moveAnalyses.filter(
    (m) => m.classification === '??' || m.classification === '?'
  );

  return {
    whiteAccuracy,
    blackAccuracy,
    counts,
    moves: moveAnalyses,
    mistakesToRetry,
  };
}
