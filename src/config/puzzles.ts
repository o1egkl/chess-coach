import { Puzzle } from '../types/chess';
import { Language } from '../i18n/types';

export const CHESS_PUZZLES: Puzzle[] = [
  {
    id: 'p1',
    title: 'Мат по последней горизонтали',
    titleEn: 'Back-Rank Mate',
    theme: 'Линейный мат',
    themeEn: 'Back-rank mate',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    rating: 500,
    playerColor: 'white',
    fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    solutionUci: ['d1d8'],
    description: 'У чёрных форточка закрыта своими пешками на 8-й горизонтали. Поставьте мат в 1 ход.',
    descriptionEn: 'The black king is trapped behind its own pawns on the 8th rank. Deliver checkmate in 1 move.',
    hint: 'Атакуйте беззащитную последнюю горизонталь ладьёй.',
    hintEn: 'Attack the undefended back rank with your rook.'
  },
  {
    id: 'p2',
    title: 'Удар по пункту f7',
    titleEn: 'Strike on f7',
    theme: 'Мат в 1 ход',
    themeEn: 'Mate in 1',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    rating: 550,
    playerColor: 'white',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5',
    solutionUci: ['f3f7'],
    description: 'Ферзь и слон создали смертельную батарею против слабого пункта f7.',
    descriptionEn: 'Queen and bishop form a lethal battery against the vulnerable f7 square.',
    hint: 'Атакуйте пешку f7 ферзём под защитой слона c4.',
    hintEn: 'Capture the f7 pawn with your queen under cover of bishop c4.'
  },
  {
    id: 'p3',
    title: 'Коробочка для короля в углу',
    titleEn: 'Corner King Trap',
    theme: 'Мат в 1 ход',
    themeEn: 'Mate in 1',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    rating: 650,
    playerColor: 'white',
    fen: '7k/R7/5N2/8/8/8/8/6K1 w - - 0 1',
    solutionUci: ['a7h7'],
    description: 'Конь на f6 отбирает поля отступления g8 и h7. Ладья наносит решающий удар.',
    descriptionEn: 'Knight on f6 controls escape squares g8 and h7. Deliver the finishing blow with the rook.',
    hint: 'Переведите ладью на h7 для матового финала.',
    hintEn: 'Move the rook to h7 for the checkmate finish.'
  },
  {
    id: 'p4',
    title: 'Двойной удар конем',
    titleEn: 'Knight Fork',
    theme: 'Вилка',
    themeEn: 'Fork',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    rating: 800,
    playerColor: 'white',
    fen: 'r1bqk2r/pppp1ppp/2n5/4p3/1b2n3/2NP1N2/PPP1BPPP/R1BQK2R w KQkq - 0 6',
    solutionUci: ['d3e4'],
    description: 'Чёрные опрометчиво оставили коня под боем пешки d3.',
    descriptionEn: 'Black carelessly left their knight hanging on e4 under attack by the d3 pawn.',
    hint: 'Заберите фигуру пешкой.',
    hintEn: 'Capture the hanging piece with your pawn.'
  },
  {
    id: 'p5',
    title: 'Абсолютная связка',
    titleEn: 'Absolute Pin',
    theme: 'Связка',
    themeEn: 'Pin',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    rating: 1050,
    playerColor: 'white',
    fen: 'r1b1k2r/pppp1ppp/2n5/4p3/1b2P3/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 1 7',
    solutionUci: ['c1d2'],
    description: 'Связанный конь на c3 нуждается в поддержке. Защитите фигуру слоном.',
    descriptionEn: 'The pinned knight on c3 needs protection. Shield it with your bishop.',
    hint: 'Нейтрализуйте связку слоном d2.',
    hintEn: 'Neutralize the pin with bishop d2.'
  },
  {
    id: 'p6',
    title: 'Спёртый мат',
    titleEn: 'Smothered Mate',
    theme: 'Спёртый мат',
    themeEn: 'Smothered Mate',
    difficulty: 'Сложно',
    difficultyEn: 'Hard',
    rating: 1350,
    playerColor: 'white',
    fen: '6k1/5ppp/8/8/8/5N2/5PPP/4R1K1 w - - 0 1',
    solutionUci: ['e1e8'],
    description: 'Используйте запертость вражеского короля на 8-й горизонтали.',
    descriptionEn: 'Take advantage of the trapped enemy king on the 8th rank.',
    hint: 'Ладья наносит сокрушительный удар на e8.',
    hintEn: 'The rook delivers a crushing strike on e8.'
  },
  {
    id: 'p7',
    title: 'Отвлечение защитника',
    titleEn: 'Deflection of Defender',
    theme: 'Отвлечение',
    themeEn: 'Deflection',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    rating: 1150,
    playerColor: 'black',
    fen: '4r1k1/5ppp/8/8/8/8/4qPPP/5RK1 b - - 0 1',
    solutionUci: ['e2f1'],
    description: 'Жертва ферзя на f1 ради неотвратимого мата ладьёй e8.',
    descriptionEn: 'Sacrifice the queen on f1 to force a back-rank mate with rook e8.',
    hint: 'Сбейте ладью на f1, чтобы завлечь короля под ладью.',
    hintEn: 'Take the rook on f1 to lure the king into a rook mate.'
  },
  {
    id: 'p8',
    title: 'Вскрытый шах',
    titleEn: 'Discovered Check',
    theme: 'Вскрытое нападение',
    themeEn: 'Discovered Attack',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    rating: 1250,
    playerColor: 'white',
    fen: '3r2k1/5ppp/8/8/8/8/1B3PPP/3R2K1 w - - 0 1',
    solutionUci: ['d1d8'],
    description: 'Ладья забирает незащищенную ладью с матом по 8-й горизонтали.',
    descriptionEn: 'Rook captures undefended rook with back-rank mate.',
    hint: 'Заберите ладью d8.',
    hintEn: 'Capture the rook on d8.'
  },
  {
    id: 'p9',
    title: 'Сквозной удар (Линейный удар)',
    titleEn: 'Skewer Attack',
    theme: 'Сквозной удар',
    themeEn: 'Skewer',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    rating: 1100,
    playerColor: 'white',
    fen: '4k3/8/8/8/8/8/R7/4K2r w - - 0 1',
    solutionUci: ['a2h2'],
    description: 'Король чёрных на e8, ладья на h1. Отразите угрозу взятием ладьи.',
    descriptionEn: 'Black king on e8, rook on h1. Remove the checking piece.',
    hint: 'Заберите атакующую ладью h1.',
    hintEn: 'Capture the checking rook on h1.'
  },
  {
    id: 'p10',
    title: 'Мат Легаля',
    titleEn: "Legall's Mate",
    theme: 'Ловушка Легаля',
    themeEn: "Legall Trap",
    difficulty: 'Сложно',
    difficultyEn: 'Hard',
    rating: 1400,
    playerColor: 'white',
    fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5',
    solutionUci: ['c4f7'],
    description: 'Слон наносит неожиданный удар по пункту f7 с шахом.',
    descriptionEn: 'Bishop delivers a surprise check on the f7 square.',
    hint: 'Пожертвуйте слона на f7.',
    hintEn: 'Sacrifice the bishop on f7.'
  }
];

export function getPuzzleTitle(puzzle: Puzzle, lang: Language): string {
  return lang === 'en' && puzzle.titleEn ? puzzle.titleEn : puzzle.title;
}

export function getPuzzleTheme(puzzle: Puzzle, lang: Language): string {
  return lang === 'en' && puzzle.themeEn ? puzzle.themeEn : puzzle.theme;
}

export function getPuzzleDescription(puzzle: Puzzle, lang: Language): string {
  return lang === 'en' && puzzle.descriptionEn ? puzzle.descriptionEn : puzzle.description;
}

export function getPuzzleHint(puzzle: Puzzle, lang: Language): string {
  return lang === 'en' && puzzle.hintEn ? puzzle.hintEn : puzzle.hint;
}
