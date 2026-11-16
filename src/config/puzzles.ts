import { Puzzle } from '../types/chess';
import { Language } from '../i18n/types';

export const CHESS_PUZZLES: Puzzle[] = [
  {
    id: 'p1',
    title: 'Мат по последней горизонтали',
    titleEn: 'Back-Rank Mate',
    titleTr: 'Son Yatay Matı',
    theme: 'Линейный мат',
    themeEn: 'Back-rank mate',
    themeTr: 'Koridor matı',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    difficultyTr: 'Kolay',
    rating: 500,
    playerColor: 'white',
    fen: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    solutionUci: ['d1d8'],
    description: 'У чёрных форточка закрыта своими пешками на 8-й горизонтали. Поставьте мат в 1 ход.',
    descriptionEn: 'The black king is trapped behind its own pawns on the 8th rank. Deliver checkmate in 1 move.',
    descriptionTr: 'Siyah şah 8. yatayda kendi piyonları arkasında sıkışmış durumda. 1 hamlede mat yapın.',
    hint: 'Атакуйте беззащитную последнюю горизонталь ладьёй.',
    hintEn: 'Attack the undefended back rank with your rook.',
    hintTr: 'Savunmasız son yataya kalenizle saldırın.'
  },
  {
    id: 'p2',
    title: 'Удар по пункту f7',
    titleEn: 'Strike on f7',
    titleTr: 'f7 Karesine Darbe',
    theme: 'Мат в 1 ход',
    themeEn: 'Mate in 1',
    themeTr: '1 Hamlede Mat',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    difficultyTr: 'Kolay',
    rating: 550,
    playerColor: 'white',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5',
    solutionUci: ['f3f7'],
    description: 'Ферзь и слон создали смертельную батарею против слабого пункта f7.',
    descriptionEn: 'Queen and bishop form a lethal battery against the vulnerable f7 square.',
    descriptionTr: 'Vezir ve fil, zayıf f7 karesine karşı ölümcül bir batarya oluşturdu.',
    hint: 'Атакуйте пешку f7 ферзём под защитой слона c4.',
    hintEn: 'Capture the f7 pawn with your queen under cover of bishop c4.',
    hintTr: 'c4 filinin koruması altındaki vezirle f7 piyonunu alın.'
  },
  {
    id: 'p3',
    title: 'Коробочка для короля в углу',
    titleEn: 'Corner King Trap',
    titleTr: 'Köşedeki Şah Kapanı',
    theme: 'Мат в 1 ход',
    themeEn: 'Mate in 1',
    themeTr: '1 Hamlede Mat',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    difficultyTr: 'Kolay',
    rating: 650,
    playerColor: 'white',
    fen: '7k/R7/5N2/8/8/8/8/6K1 w - - 0 1',
    solutionUci: ['a7h7'],
    description: 'Конь на f6 отбирает поля отступления g8 и h7. Ладья наносит решающий удар.',
    descriptionEn: 'Knight on f6 controls escape squares g8 and h7. Deliver the finishing blow with the rook.',
    descriptionTr: 'f6 atı g8 ve h7 kaçış karelerini kontrol ediyor. Kaleyle bitirici darbeyi vurun.',
    hint: 'Переведите ладью на h7 для матового финала.',
    hintEn: 'Move the rook to h7 for the checkmate finish.',
    hintTr: 'Matı tamamlamak için kaleyi h7 karesine getirin.'
  },
  {
    id: 'p4',
    title: 'Двойной удар конём (Вилка)',
    titleEn: 'Knight Fork',
    titleTr: 'At Çatalı',
    theme: 'Вилка',
    themeEn: 'Fork',
    themeTr: 'Çatal',
    difficulty: 'Легко',
    difficultyEn: 'Easy',
    difficultyTr: 'Kolay',
    rating: 800,
    playerColor: 'white',
    fen: 'r3k3/4bppp/8/3N4/8/8/PPPP1PPP/R1B1K2R w KQ - 0 1',
    solutionUci: ['d5c7', 'e8f8', 'c7a8'],
    description: 'Конь на d5 готов нанести сокрушительную вилку на короля e8 и ладью a8.',
    descriptionEn: 'The knight on d5 is ready to deliver a crushing fork on king e8 and rook a8.',
    descriptionTr: 'd5 atı, e8 şahı ve a8 kalesine karşı yıkıcı bir çatal atmaya hazır.',
    hint: 'Прыгните конём на c7 с шахом и заберите ладью.',
    hintEn: 'Jump with the knight to c7 with check and capture the rook.',
    hintTr: 'c7 karesine atla şah çekerek zıplayın ve kaleyi kazanın.'
  },
  {
    id: 'p5',
    title: 'Абсолютная связка по вертикали',
    titleEn: 'Absolute Pin',
    titleTr: 'Mutlak Açmaz',
    theme: 'Связка',
    themeEn: 'Pin',
    themeTr: 'Açmaz',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    difficultyTr: 'Orta',
    rating: 1050,
    playerColor: 'white',
    fen: '4k3/4q3/8/8/8/8/8/R5K1 w - - 0 1',
    solutionUci: ['a1e1', 'e8f7', 'e1e7'],
    description: 'Чёрный ферзь на e7 стоит на одной вертикали со своим королём. Свяжите его ладьёй!',
    descriptionEn: 'The black queen on e7 is on the same file as its king. Pin and win it with your rook!',
    descriptionTr: 'e7 karesindeki siyah vezir kendi şahıyla aynı dikeyde. Kalenizle açmaza alın ve kazanın!',
    hint: 'Переведите ладью на открытую вертикаль e.',
    hintEn: 'Move the rook to the open e-file to pin the queen.',
    hintTr: 'Veziri açmaza almak için kaleyi açık e dikeyine getirin.'
  },
  {
    id: 'p6',
    title: 'Классический спёртый мат',
    titleEn: 'Smothered Mate',
    titleTr: 'Boğmaca Matı',
    theme: 'Спёртый мат',
    themeEn: 'Smothered Mate',
    themeTr: 'Boğmaca Matı',
    difficulty: 'Сложно',
    difficultyEn: 'Hard',
    difficultyTr: 'Zor',
    rating: 1350,
    playerColor: 'white',
    fen: '6rk/6pp/7N/8/8/8/6PP/4Q1K1 w - - 0 1',
    solutionUci: ['h6f7'],
    description: 'Вражеский король на h8 намертво заблокирован собственными пешками и ладьёй.',
    descriptionEn: 'The enemy king on h8 is completely smothered by its own pawns and rook.',
    descriptionTr: 'h8 karesindeki düşman şah kendi piyonları ve kalesi tarafından tamamen boğulmuş durumda.',
    hint: 'Конь наносит смертельный прыжок на f7.',
    hintEn: 'The knight delivers the lethal strike on f7.',
    hintTr: 'At, f7 karesine ölümcül darbeyi indirir.'
  },
  {
    id: 'p7',
    title: 'Отвлечение защитника (Мат)',
    titleEn: 'Deflection Mate',
    titleTr: 'Saptırma Matı',
    theme: 'Отвлечение',
    themeEn: 'Deflection',
    themeTr: 'Saptırma',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    difficultyTr: 'Orta',
    rating: 1150,
    playerColor: 'black',
    fen: '4r1k1/5ppp/8/8/8/8/4q1PP/5R1K b - - 0 1',
    solutionUci: ['e2e1', 'f1e1', 'e8e1'],
    description: 'Ладья белых на f1 защищает последнюю горизонталь. Отвлеките её жертвой ферзя!',
    descriptionEn: "White's rook on f1 guards the back rank. Deflect it with a decisive queen sacrifice!",
    descriptionTr: "Beyazın f1 kalesi son yatayı koruyor. Kararlı bir vezir fedasıyla onu saptırın!",
    hint: 'Вторгнитесь ферзём на e1, чтобы открыть дорогу ладье e8.',
    hintEn: 'Invade with your queen on e1 to clear the way for rook e8.',
    hintTr: 'e8 kalesine yol açmak için vezirinizle e1 karesine girin.'
  },
  {
    id: 'p8',
    title: 'Вскрытый шах с выигрышем ферзя',
    titleEn: 'Discovered Check',
    titleTr: 'Açarak Şah',
    theme: 'Вскрытое нападение',
    themeEn: 'Discovered Attack',
    themeTr: 'Açarak Saldırı',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    difficultyTr: 'Orta',
    rating: 1250,
    playerColor: 'white',
    fen: '3k4/7p/8/8/q7/3B4/PPP2PPP/3R2K1 w - - 0 1',
    solutionUci: ['d3b5', 'd8e7', 'b5a4'],
    description: 'Белая ладья d1 нацелена на короля d8. Сделайте ход слоном с шахом и нападением на ферзя a4!',
    descriptionEn: 'The d1 rook targets the d8 king. Unmask the rook check with your bishop while attacking queen a4!',
    descriptionTr: 'd1 beyaz kalesi d8 şahını hedefliyor. Filinizle açarak şah çekin ve a4 vezirine saldırın!',
    hint: 'Слон идёт на b5 с вскрытым шахом, затем забирает ферзя.',
    hintEn: 'Move bishop to b5 for a discovered check, then capture the queen.',
    hintTr: 'Fil b5 karesine açarak şah çeker, ardından veziri alır.'
  },
  {
    id: 'p9',
    title: 'Сквозной удар (Линейный удар)',
    titleEn: 'Skewer Attack',
    titleTr: 'Şiş Saldırısı',
    theme: 'Сквозной удар',
    themeEn: 'Skewer',
    themeTr: 'Şiş',
    difficulty: 'Средне',
    difficultyEn: 'Medium',
    difficultyTr: 'Orta',
    rating: 1100,
    playerColor: 'white',
    fen: '4q3/4k3/8/8/8/8/8/R5K1 w - - 0 1',
    solutionUci: ['a1e1', 'e7d7', 'e1e8'],
    description: 'Король e7 и ферзь e8 стоят на одной вертикали. Нанесите сквозной удар ладьёй!',
    descriptionEn: 'King e7 and queen e8 align on the e-file. Deliver a skewer attack with your rook!',
    descriptionTr: 'e7 şahı ve e8 veziri e dikeyinde hizalanmış. Kalenizle şiş saldırısı yapın!',
    hint: 'Ладья на e1 объявляет шах королю, заставляя его уйти и открыть ферзя.',
    hintEn: 'Rook to e1 checks the king, forcing it to step aside and expose the queen.',
    hintTr: 'e1 kalesindeki şah çeker ve veziri arkasında savunmasız bırakır.'
  },
  {
    id: 'p10',
    title: 'Мат Легаля',
    titleEn: "Legall's Mate",
    titleTr: 'Legall Matı',
    theme: 'Ловушка Легаля',
    themeEn: 'Legall Trap',
    themeTr: 'Legall Tuzağı',
    difficulty: 'Сложно',
    difficultyEn: 'Hard',
    difficultyTr: 'Zor',
    rating: 1400,
    playerColor: 'white',
    fen: 'r2qkb1r/ppp2ppp/2np4/4N3/2B1P3/2N5/PPPP1PPP/R1BbK2R w KQkq - 0 6',
    solutionUci: ['c4f7', 'e8e7', 'c3d5'],
    description: 'Белые пожертвовали ферзя на d1! Завершите знаменитую комбинацию Легаля матом в 2 хода.',
    descriptionEn: 'White sacrificed the queen on d1! Finish the famous Legall combination with checkmate in 2 moves.',
    descriptionTr: 'Beyazlar d1 karesinde vezir feda etti! Ünlü Legall kombinezonunu 2 hamlede matla tamamlayın.',
    hint: 'Сначала слон на f7 с шахом, затем конь прыгает на d5 с матом.',
    hintEn: 'First bishop checks on f7, then knight jumps to d5 with checkmate.',
    hintTr: 'Önce fil f7 karesinde şah çeker, ardından at d5 karesinde mat yapar.'
  }
];

export function getPuzzleTitle(puzzle: Puzzle, lang: Language): string {
  if (lang === 'tr' && puzzle.titleTr) return puzzle.titleTr;
  if (lang === 'en' && puzzle.titleEn) return puzzle.titleEn;
  return puzzle.title;
}

export function getPuzzleTheme(puzzle: Puzzle, lang: Language): string {
  if (lang === 'tr' && puzzle.themeTr) return puzzle.themeTr;
  if (lang === 'en' && puzzle.themeEn) return puzzle.themeEn;
  return puzzle.theme;
}

export function getPuzzleDifficulty(puzzle: Puzzle, lang: Language): string {
  if (lang === 'tr' && puzzle.difficultyTr) return puzzle.difficultyTr;
  if (lang === 'en' && puzzle.difficultyEn) return puzzle.difficultyEn;
  return puzzle.difficulty;
}

export function getPuzzleDescription(puzzle: Puzzle, lang: Language): string {
  if (lang === 'tr' && puzzle.descriptionTr) return puzzle.descriptionTr;
  if (lang === 'en' && puzzle.descriptionEn) return puzzle.descriptionEn;
  return puzzle.description;
}

export function getPuzzleHint(puzzle: Puzzle, lang: Language): string {
  if (lang === 'tr' && puzzle.hintTr) return puzzle.hintTr;
  if (lang === 'en' && puzzle.hintEn) return puzzle.hintEn;
  return puzzle.hint;
}
