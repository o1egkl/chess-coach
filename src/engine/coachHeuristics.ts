import { Chess, Square, PieceSymbol, Color as ChessColor } from 'chess.js';
import { Language } from '../i18n/types';

export interface ThreatAnalysis {
  hangingPieces: Square[]; // Opponent or player undefended attacked squares
  threatenedSquares: Square[]; // Squares under enemy attack
  nudgeMessage: string;
  solutionMove?: { from: string; to: string; san: string };
}

// Nominative piece names
const PIECE_NAMES: Record<Language, Record<PieceSymbol, string>> = {
  ru: {
    p: 'пешка',
    n: 'конь',
    b: 'слон',
    r: 'ладья',
    q: 'ферзь',
    k: 'король',
  },
  en: {
    p: 'pawn',
    n: 'knight',
    b: 'bishop',
    r: 'rook',
    q: 'queen',
    k: 'king',
  },
  tr: {
    p: 'piyon',
    n: 'at',
    b: 'fil',
    r: 'kale',
    q: 'vezir',
    k: 'şah',
  },
};

// Russian Accusative for "обратить внимание на ..."
const RU_ACCUSATIVE_PIECES: Record<PieceSymbol, string> = {
  p: 'пешку',
  n: 'коня',
  b: 'слона',
  r: 'ладью',
  q: 'ферзя',
  k: 'короля',
};

// Russian "Ваш / Ваша"
const RU_YOUR_PIECE: Record<PieceSymbol, string> = {
  p: 'Ваша пешка',
  n: 'Ваш конь',
  b: 'Ваш слон',
  r: 'Ваша ладья',
  q: 'Ваш ферзь',
  k: 'Ваш король',
};

export function analyzeThreatsAndHints(
  chess: Chess,
  playerColor: 'white' | 'black',
  bestMoveUci?: string,
  lang: Language = 'ru'
): ThreatAnalysis {
  const hangingPieces: Square[] = [];
  const threatenedSquares: Square[] = [];

  const opponentColor: ChessColor = playerColor === 'white' ? 'b' : 'w';
  const playerChessColor: ChessColor = playerColor === 'white' ? 'w' : 'b';

  // Scan board
  const board = chess.board();

  // Find pieces under attack
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const file = String.fromCharCode('a'.charCodeAt(0) + c);
      const rank = (8 - r).toString();
      const sq = (file + rank) as Square;

      // Check if square is attacked by opponent
      const isAttackedByOpponent = chess.isAttacked(sq, opponentColor);

      if (piece.color === playerChessColor && isAttackedByOpponent) {
        threatenedSquares.push(sq);
        // Check if undefended
        const isDefendedByPlayer = chess.isAttacked(sq, playerChessColor);
        if (!isDefendedByPlayer) {
          hangingPieces.push(sq);
        }
      }

      // Also check if opponent has hanging pieces that player can capture
      if (piece.color === opponentColor) {
        const isAttackedByPlayer = chess.isAttacked(sq, playerChessColor);
        const isDefendedByOpponent = chess.isAttacked(sq, opponentColor);
        if (isAttackedByPlayer && !isDefendedByOpponent) {
          hangingPieces.push(sq);
        }
      }
    }
  }

  // Generate localized Nudge message
  let nudgeMessage =
    lang === 'ru'
      ? 'Контролируйте центр и гармонично развивайте свои фигуры.'
      : lang === 'tr'
      ? 'Merkezi kontrol edin ve taşlarınızı uyum içinde geliştirin.'
      : 'Control the center and develop your pieces harmoniously.';

  if (hangingPieces.length > 0) {
    const targetSq = hangingPieces[0];
    const piece = chess.get(targetSq);
    if (piece) {
      const sqLabel = targetSq.toUpperCase();
      if (piece.color === playerChessColor) {
        if (lang === 'ru') {
          nudgeMessage = `Осторожно! ${RU_YOUR_PIECE[piece.type]} на поле ${sqLabel} находится под боем без надёжной защиты!`;
        } else if (lang === 'tr') {
          nudgeMessage = `Dikkat! ${sqLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} savunmasız ve tehdit altında!`;
        } else {
          nudgeMessage = `Caution! Your ${PIECE_NAMES.en[piece.type]} on ${sqLabel} is undefended and under attack!`;
        }
      } else {
        if (lang === 'ru') {
          nudgeMessage = `Тактический шанс! Фигура соперника (${PIECE_NAMES.ru[piece.type]} на ${sqLabel}) осталась без защиты!`;
        } else if (lang === 'tr') {
          nudgeMessage = `Taktik fırsat! Rakibin ${sqLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} savunmasız kaldı!`;
        } else {
          nudgeMessage = `Tactical opportunity! The opponent's ${PIECE_NAMES.en[piece.type]} on ${sqLabel} is left undefended!`;
        }
      }
    }
  } else if (bestMoveUci && bestMoveUci.length >= 4) {
    const from = bestMoveUci.substring(0, 2) as Square;
    const piece = chess.get(from);
    if (piece) {
      const fromLabel = from.toUpperCase();
      if (lang === 'ru') {
        nudgeMessage = `Тренер рекомендует обратить внимание на ${RU_ACCUSATIVE_PIECES[piece.type]} на ${fromLabel}. Найдите сильное продолжение для этой фигуры.`;
      } else if (lang === 'tr') {
        nudgeMessage = `Koç, ${fromLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} odaklanmanızı öneriyor. Bu taş için aktif bir devam yolu bulun.`;
      } else {
        nudgeMessage = `The coach recommends focusing on the ${PIECE_NAMES.en[piece.type]} on ${fromLabel}. Find an active continuation for this piece.`;
      }
    }
  }

  // Parse solution move if bestMoveUci provided
  let solutionMove: { from: string; to: string; san: string } | undefined = undefined;
  if (bestMoveUci && bestMoveUci.length >= 4) {
    const from = bestMoveUci.substring(0, 2);
    const to = bestMoveUci.substring(2, 4);
    const promotion = bestMoveUci.length > 4 ? bestMoveUci[4] : undefined;

    try {
      // Clone chess instance to get SAN
      const clone = new Chess(chess.fen());
      const moveResult = clone.move({ from, to, promotion });
      if (moveResult) {
        solutionMove = { from, to, san: moveResult.san };
      }
    } catch {
      // Ignored if invalid
    }
  }

  return {
    hangingPieces,
    threatenedSquares,
    nudgeMessage,
    solutionMove,
  };
}
