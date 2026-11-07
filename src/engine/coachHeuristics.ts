import { Chess, Square, PieceSymbol, Color as ChessColor } from 'chess.js';

export interface ThreatAnalysis {
  hangingPieces: Square[]; // Opponent or player undefended attacked squares
  threatenedSquares: Square[]; // Squares under enemy attack
  nudgeMessage: string;
  solutionMove?: { from: string; to: string; san: string };
}

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: 'пешка',
  n: 'конь',
  b: 'слон',
  r: 'ладья',
  q: 'ферзь',
  k: 'король',
};

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 100,
};

export function analyzeThreatsAndHints(
  chess: Chess,
  playerColor: 'white' | 'black',
  bestMoveUci?: string
): ThreatAnalysis {
  const hangingPieces: Square[] = [];
  const threatenedSquares: Square[] = [];

  const turn = chess.turn(); // 'w' or 'b'
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

  // Generate Nudge message
  let nudgeMessage = 'Контролируйте центр и развивайте фигуры в гармонии.';

  if (hangingPieces.length > 0) {
    const targetSq = hangingPieces[0];
    const piece = chess.get(targetSq);
    if (piece) {
      if (piece.color === playerChessColor) {
        nudgeMessage = `Осторожно! Ваша ${PIECE_NAMES[piece.type]} на поле ${targetSq} находится под боем без надежной защиты!`;
      } else {
        nudgeMessage = `Тактический шанс! Фигура соперника (${PIECE_NAMES[piece.type]} на ${targetSq}) осталась без защиты!`;
      }
    }
  } else if (bestMoveUci && bestMoveUci.length >= 4) {
    const from = bestMoveUci.substring(0, 2) as Square;
    const piece = chess.get(from);
    if (piece) {
      nudgeMessage = `Тренер рекомендует обратить внимание на ${PIECE_NAMES[piece.type]} на ${from}. Найдите для нее активное продолжение.`;
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
