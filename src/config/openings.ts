import { Language } from '../i18n/types';

export interface OpeningInfo {
  eco: string;
  name: string;
  moves: string[]; // List of SAN moves e.g. ["e4", "e5", "Nf3", "Nc6", "Bc4"]
  goal: string;
  keySquares: string[];
}

const OPENING_TRANSLATIONS: Record<string, Partial<Record<Language, { name: string; goal: string }>>> = {
  C50: {
    en: { name: 'Italian Game (Giuoco Piano)', goal: 'Fight for the center (d4), light-square bishop pressure on f7, rapid kingside castling.' },
    he: { name: 'פתיחה איטלקית (Giuoco Piano)', goal: 'שליטה במרכז (d4), לחץ של הרץ על נקודת f7, והצרחה מהירה.' },
    uk: { name: 'Італійська партія (Giuoco Piano)', goal: 'Боротьба за центр (d4), тиск білопільного слона на пункт f7, швидка рокіровка.' },
    es: { name: 'Apertura Italiana (Giuoco Piano)', goal: 'Lucha por el centro (d4), presión del alfil sobre f7 y enroque rápido.' },
    de: { name: 'Italienische Partie (Giuoco Piano)', goal: 'Kampf um das Zentrum (d4), Druck des Läufers auf f7, schnelle Rochade.' },
    fr: { name: 'Partie Italienne (Giuoco Piano)', goal: 'Contrôle du centre (d4), pression du fou sur f7 et roque rapide.' },
    tr: { name: 'İtalyan Açılışı (Giuoco Piano)', goal: 'Merkez mücadelesi (d4), f7 karesine fil baskısı ve hızlı rok.' },
  },
  C60: {
    en: { name: 'Ruy Lopez (Spanish Opening)', goal: 'Indirect central pressure by pinning the c6 knight, preparing c3 and d4.' },
    he: { name: 'פתיחה ספרדית (רוי לופז)', goal: 'לחץ עקיף על המרכז דרך ריתוק הפרש ב-c6 והכנת c3 ו-d4.' },
    uk: { name: 'Іспанська партія (Ruy Lopez)', goal: 'Непрямий тиск на центр через зв\'язку коня c6, підготовка c3 та d4.' },
    es: { name: 'Apertura Española (Ruy López)', goal: 'Presión indirecta al centro clavando el caballo c6, preparando c3 y d4.' },
    de: { name: 'Spanische Partie (Ruy Lopez)', goal: 'Indirekter Druck auf das Zentrum durch Fesselung des Springers c6, Vorbereitung von c3 und d4.' },
    fr: { name: 'Partie Espagnole (Ruy Lopez)', goal: 'Pression indirecte sur le centre en clouant le cavalier c6, préparation de c3 et d4.' },
    tr: { name: 'İspanyol Açılışı (Ruy Lopez)', goal: 'c6 atını açmaza alarak merkeze baskı kurma, c3 ve d4 hazırlığı.' },
  },
  B20: {
    en: { name: 'Sicilian Defense', goal: 'Asymmetric counterplay on the queenside along the half-open c-file and control of d4.' },
    he: { name: 'הגנה סיציליאנית', goal: 'משחק נגדי א-סימטרי באגף המלכה לאורך טור c הפתוח בחלקו ושליטה ב-d4.' },
    uk: { name: 'Сицилійський захист', goal: 'Асиметрична контрагра на ферзевому фланзі по піввідкритій вертикалі c і контроль d4.' },
    es: { name: 'Defensa Siciliana', goal: 'Contrajuego asimétrico en el flanco de dama por la columna c y control de d4.' },
    de: { name: 'Sizilianische Verteidigung', goal: 'Asymmetrisches Gegenspiel am Damenflügel auf der halboffenen c-Linie und Kontrolle von d4.' },
    fr: { name: 'Défense Sicilienne', goal: 'Contre-jeu asymétrique sur l’aile dame le long de la colonne c et contrôle de d4.' },
    tr: { name: 'Sicilya Savunması', goal: 'Vezir kanadında yarı açık c dikeyinde asimetrik karşı oyun ve d4 kontrolü.' },
  },
  C00: {
    en: { name: 'French Defense', goal: 'Counter-strike in the center with d5, preparing c7-c5, battling in a closed center.' },
    he: { name: 'הגנה צרפתית', goal: 'מכת נגד במרכז עם d5, הכנת פריצה c7-c5 ומאבק במרכז סגור.' },
    uk: { name: 'Французький захист', goal: 'Контрудар по центру пішаком d5, підготовка підриву c7-c5, гра у закритому центрі.' },
    es: { name: 'Defensa Francesa', goal: 'Contragolpe central con d5, preparación de c7-c5 y lucha en centro cerrado.' },
    de: { name: 'Französische Verteidigung', goal: 'Gegenschlag im Zentrum mit d5, Vorbereitung von c7-c5, Kampf im geschlossenen Zentrum.' },
    fr: { name: 'Défense Française', goal: 'Contre-attaque centrale avec d5, préparation de c7-c5 et bataille en centre fermé.' },
    tr: { name: 'Fransız Savunması', goal: 'd5 ile merkeze karşı vuruş, c7-c5 hazırlığı ve kapalı merkez savaşı.' },
  },
  B10: {
    en: { name: 'Caro-Kann Defense', goal: 'Solid pawn chain, striking at the center with d5 while keeping the c8 bishop free.' },
    he: { name: 'הגנת קארו-קאן', goal: 'שרשרת רגלים יציבה, פגיעה במרכז באמצעות d5 ושמירה על אלכסון חופשי לרץ c8.' },
    uk: { name: 'Захист Каро-Канн', goal: 'Міцний пішаковий ланцюг, підрив центру через d5 зі збереженням діагоналі слона c8.' },
    es: { name: 'Defensa Caro-Kann', goal: 'Cadena de peones sólida, contraataque con d5 manteniendo libre el alfil c8.' },
    de: { name: 'Caro-Kann-Verteidigung', goal: 'Solide Bauernkette, Gegenschlag im Zentrum mit d5 bei freier Diagonale für Läufer c8.' },
    fr: { name: 'Défense Caro-Kann', goal: 'Chaîne de pions solide, attaque centrale avec d5 en gardant le fou c8 libre.' },
    tr: { name: 'Caro-Kann Savunması', goal: 'Sağlam piyon zinciri, c8 filinin önü açık kalarak d5 ile merkez vuruşu.' },
  },
  D06: {
    en: { name: 'Queen\'s Gambit', goal: 'Sacrificing the c4 wing pawn to establish a dominant pawn center (e4) and open lines.' },
    he: { name: 'גמביט המלכה', goal: 'הקרבת רגלי כנף c4 לשליטה מלאה במרכז (e4) ופתיחת טורים.' },
    uk: { name: 'Ферзевий гамбіт', goal: 'Жертва флангового пішака c4 заради повного центру (e4) та розкриття ліній.' },
    es: { name: 'Gambito de Dama', goal: 'Sacrificio del peón lateral c4 para dominar el centro con e4 y abrir líneas.' },
    de: { name: 'Damengambit', goal: 'Opfer des Flügelbauern c4 für ein volles Bauernzentrum (e4) und offene Linien.' },
    fr: { name: 'Gambit Dame', goal: 'Sacrifice du pion d’aile c4 pour dominer le centre avec e4 et ouvrir les lignes.' },
    tr: { name: 'Vezir Gambiti', goal: 'Merkezi tamamen ele geçirmek (e4) ve hatları açmak için kanat c4 piyonunu feda etme.' },
  },
  E60: {
    en: { name: 'King\'s Indian Defense', goal: 'Kingside fianchetto with Bg7, controlling d4 and e5, preparing pawn thrusts.' },
    he: { name: 'הגנה הודית של המלך', goal: 'פיאנקטו של הרץ ב-g7, שליטה ב-d4 ו-e5 והכנת פריצה באגף.' },
    uk: { name: 'Староіндійський захист', goal: 'Фіанкетто слона на g7, контроль полів d4 та e5, підготовка підриву e7-e5.' },
    es: { name: 'Defensa India de Rey', goal: 'Fianchetto de rey con Ag7, control de d4 y e5, preparando rupturas.' },
    de: { name: 'Königsindische Verteidigung', goal: 'Fianchetto des Läufers auf g7, Kontrolle von d4 und e5, Vorbereitung von e7-e5.' },
    fr: { name: 'Défense Est-Indienne', goal: 'Fianchetto du fou en g7, contrôle de d4 et e5, préparation des poussées de pions.' },
    tr: { name: 'Şah-Hint Savunması', goal: 'g7 filiyle fianchetto, d4 ve e5 kontrolü, e7-e5 yarmasına hazırlık.' },
  },
  B01: {
    en: { name: 'Scandinavian Defense', goal: 'Immediate central challenge on move 1. Rapid piece activation after exd5 Qxd5.' },
    he: { name: 'הגנה סקנדינבית', goal: 'אתגור מיידי של המרכז כבר במהלך הראשון ופיתוח מהיר לאחר exd5 Qxd5.' },
    uk: { name: 'Скандинавський захист', goal: 'Негайний виклик у центрі на 1-му ході. Швидкий розвиток фігур після exd5 Qxd5.' },
    es: { name: 'Defensa Escandinava', goal: 'Desafío central inmediato en la jugada 1. Rápido desarrollo tras exd5 Dxd5.' },
    de: { name: 'Skandinavische Verteidigung', goal: 'Sofortiger Angriff auf das Zentrum im 1. Zug. Schnelle Figurenaktivierung nach exd5 Dxd5.' },
    fr: { name: 'Défense Scandinave', goal: 'Défi immédiat au centre dès le 1er coup. Développement rapide après exd5 Dxd5.' },
    tr: { name: 'İskandinav Savunması', goal: '1. hamlede hemen merkeze meydan okuma. exd5 Qxd5 sonrası hızlı taş gelişimi.' },
  },
  A00: {
    en: { name: 'English Opening / Réti Opening', goal: 'Flank pressure on central squares d5 and e4 without early central pawn thrusts.' },
    he: { name: 'פתיחה אנגלית / פתיחת רטי', goal: 'שליטה באגף על המשבצות המרכזיות d5 ו-e4 ללא התקדמות מוקדמת של רגלי המרכז.' },
    uk: { name: 'Англійський початок / Дебют Реті', goal: 'Фланговий контроль центральних полів d5 та e4 без раннього просування центральних пішаків.' },
    es: { name: 'Apertura Inglesa / Apertura Réti', goal: 'Control de flanco sobre d5 y e4 sin avance prematuro de peones centrales.' },
    de: { name: 'Englische Eröffnung / Réti-Eröffnung', goal: 'Flankenkontrolle der Zentralfelder d5 und e4 ohne frühe Bauernvorstöße.' },
    fr: { name: 'Ouverture Anglaise / Début Réti', goal: 'Contrôle latéral des cases centrales d5 et e4 sans avance prématurée des pions centraux.' },
    tr: { name: 'İngiliz Açılışı / Réti Açılışı', goal: 'Erken merkez piyon sürüşleri yapmadan kanattan d5 ve e4 kontrolü.' },
  },
};

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

export function getOpeningName(opening: OpeningInfo, lang: Language): string {
  if (lang === 'ru') return opening.name;
  const tr = OPENING_TRANSLATIONS[opening.eco];
  if (tr && tr[lang]?.name) return tr[lang]!.name;
  if (tr && tr.en?.name) return tr.en.name;
  return opening.name;
}

export function getOpeningGoal(opening: OpeningInfo, lang: Language): string {
  if (lang === 'ru') return opening.goal;
  const tr = OPENING_TRANSLATIONS[opening.eco];
  if (tr && tr[lang]?.goal) return tr[lang]!.goal;
  if (tr && tr.en?.goal) return tr.en.goal;
  return opening.goal;
}

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
