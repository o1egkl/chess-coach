import { Puzzle } from '../types/chess';

export const CHESS_PUZZLES: Puzzle[] = [
  {
    id: 'p1',
    title: 'Мат на последней горизонтали',
    theme: 'Линейный мат',
    difficulty: 'Легко',
    rating: 500,
    playerColor: 'white',
    fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    solutionUci: ['d1d8'],
    description: 'Король соперника заперт пешками на 8-й горизонтали. Поставьте мат в 1 ход.',
    hint: 'Атакуйте незащищённую последнюю горизонталь ладьёй.'
  },
  {
    id: 'p2',
    title: 'Удар по пункту f7',
    theme: 'Мат в 1 ход',
    difficulty: 'Легко',
    rating: 550,
    playerColor: 'white',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5',
    solutionUci: ['f3f7'],
    description: 'Слон и ферзь создают смертельную угрозу слабому пункту f7.',
    hint: 'Заберите пешку f7 ферзём с матом под защитой слона c4.'
  },
  {
    id: 'p3',
    title: 'Арабский мат ладьёй и конём',
    theme: 'Мат в 1 ход',
    difficulty: 'Легко',
    rating: 650,
    playerColor: 'white',
    fen: '7k/R7/5N2/8/8/8/8/6K1 w - - 0 1',
    solutionUci: ['a7h7'],
    description: 'Конь на f6 отрезает поля отступления g8 и h7. Ладья наносит решающий удар.',
    hint: 'Поставьте мат ладьёй на h7 под защиту коня.'
  },
  {
    id: 'p4',
    title: 'Королевская вилка конём',
    theme: 'Вилка',
    difficulty: 'Легко',
    rating: 700,
    playerColor: 'white',
    fen: 'r3k2r/ppp2ppp/2n5/3N4/8/8/PPP2PPP/R3K2R w KQkq - 0 1',
    solutionUci: ['d5c7', 'e8e7', 'c7a8'],
    description: 'Конь на d5 готов прыгнуть на поле c7, нанося двойной удар на короля и ладью.',
    hint: 'Сделайте шах конём с поля c7.'
  },
  {
    id: 'p5',
    title: 'Пешечная вилка по центру',
    theme: 'Вилка',
    difficulty: 'Легко',
    rating: 750,
    playerColor: 'white',
    fen: 'r1bqk2r/pppp1ppp/8/4n3/4b3/8/PPPPPPPP/RNBQKB1R w KQkq - 0 7',
    solutionUci: ['d2d4'],
    description: 'Чёрные вывели коня и слона в центр, не защитив их. Пешка может напасть сразу на обе фигуры.',
    hint: 'Продвиньте центральную пешку d2 на два поля вперёд.'
  },
  {
    id: 'p6',
    title: 'Абсолютная связка ферзя ладьёй',
    theme: 'Связка',
    difficulty: 'Средне',
    rating: 900,
    playerColor: 'white',
    fen: '4k3/4q3/8/8/8/8/4R3/4K3 w - - 0 1',
    solutionUci: ['e2e7', 'e8e7'],
    description: 'Чёрный ферзь связан по вертикали "e" своим королём. Заберите ценнейшую фигуру.',
    hint: 'Ладья забирает связанного ферзя на e7.'
  },
  {
    id: 'p7',
    title: 'Линейный сквозной удар (Рентген)',
    theme: 'Сквозной удар',
    difficulty: 'Средне',
    rating: 1050,
    playerColor: 'white',
    fen: '8/8/8/4k3/8/8/r7/4K2R w K - 0 1',
    solutionUci: ['h1h5', 'e5d6', 'h5a5'],
    description: 'Ладья объявляет шах королю по 5-й горизонтали. Король отходит, открывая ладью на a2.',
    hint: 'Дайте шах на h5, а затем заберите беззащитную ладью на a2.'
  },
  {
    id: 'p8',
    title: 'Вскрытый шах с выигрышем ферзя',
    theme: 'Вскрытый шах',
    difficulty: 'Средне',
    rating: 1200,
    playerColor: 'white',
    fen: '4k3/4q3/8/8/4B3/8/8/4R1K1 w - - 0 1',
    solutionUci: ['e4c6', 'e8f8', 'e1e7'],
    description: 'Отскок слона объявляет вскрытый шах от ладьи e1, после чего чёрный ферзь теряется.',
    hint: 'Сделайте шах слоном на c6, открывая нападение ладьи на короля.'
  },
  {
    id: 'p9',
    title: 'Защищённый мат на 8-й горизонтали',
    theme: 'Отвлечение',
    difficulty: 'Сложно',
    rating: 1350,
    playerColor: 'white',
    fen: '3r2k1/5ppp/8/8/8/8/5PPP/1Q1R2K1 w - - 0 1',
    solutionUci: ['d1d8'],
    description: 'Ладья на d1 забирает ладью на d8 под надёжной защитой ферзя b1, объявляя мат.',
    hint: 'Заберите ладью d8 с неизбежным матом.'
  },
  {
    id: 'p10',
    title: 'Спёртый мат конём',
    theme: 'Спёртый мат',
    difficulty: 'Сложно',
    rating: 1500,
    playerColor: 'white',
    fen: '6rk/6pp/7N/8/8/8/8/6K1 w - - 0 1',
    solutionUci: ['h6f7'],
    description: 'Король чёрных заперт собственной ладьёй и пешками на h8. Прыжок коня ставит мат.',
    hint: 'Сделайте шах конём на f7 — королю некуда бежать.'
  }
];
