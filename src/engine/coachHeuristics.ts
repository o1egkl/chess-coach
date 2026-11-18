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
  he: {
    p: 'רגלי',
    n: 'פרש',
    b: 'רץ',
    r: 'צריח',
    q: 'מלכה',
    k: 'מלך',
  },
  uk: {
    p: 'пішак',
    n: 'кінь',
    b: 'слон',
    r: 'тура',
    q: 'ферзь',
    k: 'король',
  },
  es: {
    p: 'peón',
    n: 'caballo',
    b: 'alfil',
    r: 'torre',
    q: 'dama',
    k: 'rey',
  },
  de: {
    p: 'Bauer',
    n: 'Springer',
    b: 'Läufer',
    r: 'Turm',
    q: 'Dame',
    k: 'König',
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

// Ukrainian Accusative
const UK_ACCUSATIVE_PIECES: Record<PieceSymbol, string> = {
  p: 'пішака',
  n: 'коня',
  b: 'слона',
  r: 'туру',
  q: 'ферзя',
  k: 'короля',
};

// Your piece helpers
const YOUR_PIECE: Record<Language, Record<PieceSymbol, string>> = {
  ru: {
    p: 'Ваша пешка',
    n: 'Ваш конь',
    b: 'Ваш слон',
    r: 'Ваша ладья',
    q: 'Ваш ферзь',
    k: 'Ваш король',
  },
  uk: {
    p: 'Ваш пішак',
    n: 'Ваш кінь',
    b: 'Ваш слон',
    r: 'Ваша тура',
    q: 'Ваш ферзь',
    k: 'Ваш король',
  },
  en: {
    p: 'Your pawn',
    n: 'Your knight',
    b: 'Your bishop',
    r: 'Your rook',
    q: 'Your queen',
    k: 'Your king',
  },
  tr: {
    p: 'Piyonunuz',
    n: 'Atınız',
    b: 'Filiniz',
    r: 'Kaleniz',
    q: 'Veziriniz',
    k: 'Şahınız',
  },
  es: {
    p: 'Tu peón',
    n: 'Tu caballo',
    b: 'Tu alfil',
    r: 'Tu torre',
    q: 'Tu dama',
    k: 'Tu rey',
  },
  de: {
    p: 'Dein Bauer',
    n: 'Dein Springer',
    b: 'Dein Läufer',
    r: 'Dein Turm',
    q: 'Deine Dame',
    k: 'Dein König',
  },
  he: {
    p: 'הרגלי שלך',
    n: 'הפרש שלך',
    b: 'הרץ שלך',
    r: 'הצריח שלך',
    q: 'המלכה שלך',
    k: 'המלך שלך',
  },
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
      : lang === 'uk'
      ? 'Контролюйте центр та гармонійно розвивайте свої фігури.'
      : lang === 'tr'
      ? 'Merkezi kontrol edin ve taşlarınızı uyum içinde geliştirin.'
      : lang === 'es'
      ? 'Controla el centro y desarrolla tus piezas armónicamente.'
      : lang === 'de'
      ? 'Kontrolliere das Zentrum und entwickle deine Figuren harmonisch.'
      : lang === 'he'
      ? 'שלוט במרכז ופתח את הכלים בהרמוניה.'
      : 'Control the center and develop your pieces harmoniously.';

  if (bestMoveUci && bestMoveUci.length >= 4) {
    const from = bestMoveUci.substring(0, 2) as Square;
    const piece = chess.get(from);
    if (piece) {
      const fromLabel = from.toUpperCase();
      const isUnderAttack = threatenedSquares.includes(from);
      if (isUnderAttack) {
        if (lang === 'ru') {
          nudgeMessage = `Осторожно, фигура под боем! Тренер рекомендует ход: ${RU_ACCUSATIVE_PIECES[piece.type]} на ${fromLabel}. Найдите для неё сильное поле.`;
        } else if (lang === 'uk') {
          nudgeMessage = `Обережно, фігура під боєм! Тренер рекомендує хід: ${UK_ACCUSATIVE_PIECES[piece.type]} на ${fromLabel}. Знайдіть для неї сильне поле.`;
        } else if (lang === 'tr') {
          nudgeMessage = `Dikkat, taş tehdit altında! Koç, ${fromLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} oynamanızı öneriyor.`;
        } else if (lang === 'es') {
          nudgeMessage = `¡Cuidado, pieza bajo ataque! El entrenador recomienda mover el ${PIECE_NAMES.es[piece.type]} en ${fromLabel}.`;
        } else if (lang === 'de') {
          nudgeMessage = `Vorsicht, Figur wird angegriffen! Der Trainer empfiehlt, den ${PIECE_NAMES.de[piece.type]} auf ${fromLabel} zu ziehen.`;
        } else if (lang === 'he') {
          nudgeMessage = `זהירות, כלי מותקף! המאמן ממליץ להזיז את ה${PIECE_NAMES.he[piece.type]} ב-${fromLabel}.`;
        } else {
          nudgeMessage = `Caution, piece under attack! The coach recommends moving the ${PIECE_NAMES.en[piece.type]} on ${fromLabel}.`;
        }
      } else {
        if (lang === 'ru') {
          nudgeMessage = `Тренер рекомендует обратить внимание на ${RU_ACCUSATIVE_PIECES[piece.type]} на ${fromLabel}. Найдите сильное продолжение для этой фигуры.`;
        } else if (lang === 'uk') {
          nudgeMessage = `Тренер рекомендує звернути увагу на ${UK_ACCUSATIVE_PIECES[piece.type]} на ${fromLabel}. Знайдіть активне продовження для цієї фігури.`;
        } else if (lang === 'tr') {
          nudgeMessage = `Koç, ${fromLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} odaklanmanızı öneriyor. Bu taş için aktif bir devam yolu bulun.`;
        } else if (lang === 'es') {
          nudgeMessage = `El entrenador recomienda prestar atención al ${PIECE_NAMES.es[piece.type]} en ${fromLabel}. Encuentra una buena continuación para esta pieza.`;
        } else if (lang === 'de') {
          nudgeMessage = `Der Trainer empfiehlt, den Fokus auf den ${PIECE_NAMES.de[piece.type]} auf ${fromLabel} zu richten.`;
        } else if (lang === 'he') {
          nudgeMessage = `המאמן ממליץ לשים לב ל${PIECE_NAMES.he[piece.type]} ב-${fromLabel}. מצא המשך חזק עבורו.`;
        } else {
          nudgeMessage = `The coach recommends focusing on the ${PIECE_NAMES.en[piece.type]} on ${fromLabel}. Find an active continuation for this piece.`;
        }
      }
    }
  } else if (hangingPieces.length > 0) {
    const targetSq = hangingPieces[0];
    const piece = chess.get(targetSq);
    if (piece) {
      const sqLabel = targetSq.toUpperCase();
      if (piece.color === playerChessColor) {
        if (lang === 'ru') {
          nudgeMessage = `Осторожно! ${YOUR_PIECE.ru[piece.type]} на поле ${sqLabel} находится под боем без надёжной защиты!`;
        } else if (lang === 'uk') {
          nudgeMessage = `Обережно! ${YOUR_PIECE.uk[piece.type]} на полі ${sqLabel} під боєм без надійного захисту!`;
        } else if (lang === 'tr') {
          nudgeMessage = `Dikkat! ${sqLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} savunmasız ve tehdit altında!`;
        } else if (lang === 'es') {
          nudgeMessage = `¡Cuidado! ¡${YOUR_PIECE.es[piece.type]} en la casilla ${sqLabel} está bajo ataque y sin defensa!`;
        } else if (lang === 'de') {
          nudgeMessage = `Vorsicht! ${YOUR_PIECE.de[piece.type]} auf Feld ${sqLabel} wird ungedeckt angegriffen!`;
        } else if (lang === 'he') {
          nudgeMessage = `זהירות! ${YOUR_PIECE.he[piece.type]} במשבצת ${sqLabel} מותקף ללא הגנה!`;
        } else {
          nudgeMessage = `Caution! Your ${PIECE_NAMES.en[piece.type]} on ${sqLabel} is undefended and under attack!`;
        }
      } else {
        if (lang === 'ru') {
          nudgeMessage = `Тактический шанс! Фигура соперника (${PIECE_NAMES.ru[piece.type]} на ${sqLabel}) осталась без защиты!`;
        } else if (lang === 'uk') {
          nudgeMessage = `Тактичний шанс! Фігура суперника (${PIECE_NAMES.uk[piece.type]} на ${sqLabel}) залишилася без захисту!`;
        } else if (lang === 'tr') {
          nudgeMessage = `Taktik fırsat! Rakibin ${sqLabel} karesindeki ${PIECE_NAMES.tr[piece.type]} savunmasız kaldı!`;
        } else if (lang === 'es') {
          nudgeMessage = `¡Oportunidad táctica! ¡La pieza rival (${PIECE_NAMES.es[piece.type]} en ${sqLabel}) quedó indefensa!`;
        } else if (lang === 'de') {
          nudgeMessage = `Taktische Chance! Die gegnerische Figur (${PIECE_NAMES.de[piece.type]} auf ${sqLabel}) ist ungedeckt!`;
        } else if (lang === 'he') {
          nudgeMessage = `הזדמנות טקטית! כלי היריב (${PIECE_NAMES.he[piece.type]} ב-${sqLabel}) נותר ללא הגנה!`;
        } else {
          nudgeMessage = `Tactical opportunity! The opponent's ${PIECE_NAMES.en[piece.type]} on ${sqLabel} is left undefended!`;
        }
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
