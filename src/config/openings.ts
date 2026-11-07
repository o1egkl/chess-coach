export interface OpeningInfo {
  eco: string;
  name: string;
  moves: string[]; // List of SAN moves e.g. ["e4", "e5", "Nf3", "Nc6", "Bc4"]
  goal: string;
  keySquares: string[];
}

export const COMMON_OPENINGS: OpeningInfo[] = [
  {
    eco: 'C50',
    name: 'Итальянская партия (Giuoco Piano)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    goal: 'Борьба за центр (d4), давление белопольного слона на слабый пункт f7, быстрая рокировка.',
    keySquares: ['d4', 'f7', 'e4', 'c4'],
  },
  {
    eco: 'C60',
    name: 'Испанская партия (Ruy Lopez)',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    goal: 'Косвенное давление на центр через связку коня c6, подготовка продвижения c3 и d4.',
    keySquares: ['e4', 'e5', 'd4', 'c3'],
  },
  {
    eco: 'B20',
    name: 'Сицилианская защита',
    moves: ['e4', 'c5'],
    goal: 'Асимметричная контригра на ферзевом фланге по полуоткрытой вертикали "c" и контроль пункта d4.',
    keySquares: ['c5', 'd4', 'c1', 'd5'],
  },
  {
    eco: 'C00',
    name: 'Французская защита',
    moves: ['e4', 'e6', 'd4', 'd5'],
    goal: 'Контрудар по центру пешкой d5, подготовка подрыва c7-c5, борьба в замкнутом центре.',
    keySquares: ['d5', 'e4', 'c5', 'f6'],
  },
  {
    eco: 'B10',
    name: 'Защита Каро-Канн',
    moves: ['e4', 'c6', 'd4', 'd5'],
    goal: 'Прочная пешечная цепь, подрыв центра через d5 с сохранением открытой диагонали для белопольного слона c8.',
    keySquares: ['c6', 'd5', 'e4', 'f5'],
  },
  {
    eco: 'D06',
    name: 'Ферзевый гамбит',
    moves: ['d4', 'd5', 'c4'],
    goal: 'Жертва фланговой пешки c4 ради захвата полного пешечного центра (e4) и вскрытия линий.',
    keySquares: ['d4', 'c4', 'd5', 'e4'],
  },
  {
    eco: 'E60',
    name: 'Староиндийская защита',
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    goal: 'Фианкетто слона на g7, контроль полей d4 и e5, подготовка фигурного подрыва e7-e5.',
    keySquares: ['g7', 'e5', 'd4', 'f5'],
  },
  {
    eco: 'B01',
    name: 'Скандинавская защита',
    moves: ['e4', 'd5'],
    goal: 'Немедленный вызов в центре на 1-м ходу. Быстрое развитие фигур после exd5 Qxd5.',
    keySquares: ['d5', 'e4', 'a5', 'f5'],
  },
  {
    eco: 'A00',
    name: 'Дебют Рети / Английское начало',
    moves: ['c4'],
    goal: 'Фланговый контроль центральных полей d5 и e4 без раннего продвижения центральных пешек.',
    keySquares: ['c4', 'd5', 'g2', 'c3'],
  },
];

export function identifyOpening(moveHistorySans: string[]): OpeningInfo | null {
  if (moveHistorySans.length === 0) return null;

  let bestMatch: OpeningInfo | null = null;
  let maxMatched = 0;

  for (const opening of COMMON_OPENINGS) {
    let matched = 0;
    for (let i = 0; i < opening.moves.length && i < moveHistorySans.length; i++) {
      if (opening.moves[i] === moveHistorySans[i]) {
        matched++;
      } else {
        break;
      }
    }
    if (matched === opening.moves.length && matched > maxMatched) {
      bestMatch = opening;
      maxMatched = matched;
    }
  }

  return bestMatch;
}
