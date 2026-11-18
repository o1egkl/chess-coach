import { Language } from './types';

export interface BotTranslation {
  name: string;
  rank: string;
  description: string;
}

export const BOT_TRANSLATIONS: Record<number, Partial<Record<Language, BotTranslation>>> = {
  1: {
    he: { name: 'מתחיל', rank: 'תלמיד I', description: 'רק מתחיל ללמוד שחמט. לעיתים קרובות מבצע מסעי רגלים אקראיים.' },
    uk: { name: 'Новачок', rank: 'Учень I', description: 'Тільки знайомиться з шахами. Часто робить випадкові ходи пішаками.' },
    es: { name: 'Novato', rank: 'Estudiante I', description: 'Recién comienza a aprender ajedrez. A menudo realiza movimientos aleatorios de peones.' },
    de: { name: 'Neuling', rank: 'Schüler I', description: 'Beginnt gerade, Schach zu lernen. Macht oft zufällige Bauernzüge.' },
  },
  2: {
    he: { name: 'לומד', rank: 'תלמיד II', description: 'מכיר את חוקי הכאת כלים, אך עדיין משאיר כלים תלויים ללא הגנה.' },
    uk: { name: 'Учень', rank: 'Учень II', description: 'Знає правила взяття фігур, але все ще часто залишає фігури під боєм.' },
    es: { name: 'Aprendiz', rank: 'Estudiante II', description: 'Conoce las reglas de captura, pero aún deja piezas indefensas.' },
    de: { name: 'Lernender', rank: 'Schüler II', description: 'Kennt die Schlagregeln, lässt aber noch häufig Figuren ungedeckt stehen.' },
  },
  3: {
    he: { name: 'חובב', rank: 'מתחיל III', description: 'מפתח כלים ומנסה להנחית מט מהיר עם המלכה.' },
    uk: { name: 'Любитель', rank: 'Учень III', description: 'Розвиває фігури та намагається поставити швидкий мат ферзем.' },
    es: { name: 'Aficionado', rank: 'Estudiante III', description: 'Desarrolla piezas e intenta dar jaque mate rápido con la dama.' },
    de: { name: 'Amateur', rank: 'Schüler III', description: 'Entwickelt Figuren und versucht ein schnelles Damematt.' },
  },
  4: {
    he: { name: 'נלהב', rank: 'שחקן IV', description: 'יודע להצריח ומגן על רגלי המרכז, אך נופל למלכודות טקטיות.' },
    uk: { name: 'Ентузіаст', rank: 'Гравець IV', description: 'Вміє робити рокіровку, але потрапляє в тактичні пастки.' },
    es: { name: 'Entusiasta', rank: 'Jugador IV', description: 'Sabe enrocarse, pero cae en celadas tácticas básicas.' },
    de: { name: 'Enthusiast', rank: 'Spieler IV', description: 'Rochiert verlässlich, tappt aber noch in taktische Fallen.' },
  },
  5: {
    he: { name: 'מתקדם', rank: 'שחקן V', description: 'מנצל טעויות של היריב ורואה איומים בסיסיים של מהלך אחד.' },
    uk: { name: 'Тямущий', rank: 'Гравець V', description: 'Помічає позіхання в один хід і карає за відкриті фігури.' },
    es: { name: 'Avanzado', rank: 'Jugador V', description: 'Aprovecha errores en un solo movimiento y castiga piezas colgadas.' },
    de: { name: 'Fortgeschrittener', rank: 'Spieler V', description: 'Nutzt einfache Einsteller aus und sieht 1-zügige Drohungen.' },
  },
  6: {
    he: { name: 'טקטיקן מועדון', rank: 'מועדון I', description: 'רואה מזלגות, ריתוקים ומלכודות טקטיות של 2-3 מהלכים.' },
    uk: { name: 'Клубний тактик', rank: 'Клубний I', description: 'Бачить зв\'язки, виделки та проводить комбінації у 2-3 ходи.' },
    es: { name: 'Táctico de Club', rank: 'Club I', description: 'Encuentra clavadas, horquillas y combinaciones de 2 o 3 jugadas.' },
    de: { name: 'Vereinstaktiker', rank: 'Vereinsspieler I', description: 'Findet Gabeln, Fesseln und 2-3-zügige Kombinationen.' },
  },
  7: {
    he: { name: 'אסטרטג', rank: 'מועדון II', description: 'משחק על טורים פתוחים, מבנים של רגלים ומשבצות חלשות.' },
    uk: { name: 'Стратег', rank: 'Клубний II', description: 'Грає позиційно: захоплює відкриті лінії та тисне на слабкості.' },
    es: { name: 'Estratega', rank: 'Club II', description: 'Juega por líneas abiertas, casillas débiles y mejor estructura de peones.' },
    de: { name: 'Stratege', rank: 'Vereinsspieler II', description: 'Spielt um offene Linien, schwache Felder und Bauernstrukturen.' },
  },
  8: {
    he: { name: 'קפטן', rank: 'מועדון III', description: 'שחקן עמדה קשוח, מוצא הגנות יצירתיות במצבים קשים.' },
    uk: { name: 'Капітан', rank: 'Клубний III', description: 'Досвідчений позиційний боєць із чітким розрахунком.' },
    es: { name: 'Capitán', rank: 'Club III', description: 'Luchador posicional sólido con cálculo preciso y buena defensa.' },
    de: { name: 'Kapitän', rank: 'Vereinsspieler III', description: 'Solider Positionskämpfer mit genauer Variantenberechnung.' },
  },
  9: {
    he: { name: 'מומחה', rank: 'מומחה I', description: 'ידע תאורטי עמוק בפתיחות ומעברים מתוכננים לסיומי משחק.' },
    uk: { name: 'Експерт', rank: 'Експерт I', description: 'Глибокі дебютні знання та вмілий перехід в ендшпіль.' },
    es: { name: 'Experto', rank: 'Experto I', description: 'Conocimiento profundo de aperturas y transiciones impecables al final.' },
    de: { name: 'Experte', rank: 'Experte I', description: 'Fundiertes Eröffnungswissen und starkes Endspielverständnis.' },
  },
  10: {
    he: { name: 'אמן מועדון', rank: 'מומחה II', description: 'רמת משחק גבוהה, ענישה מיידית על כל חוסר דיוק טקטי.' },
    uk: { name: 'Майстер клубу', rank: 'Експерт II', description: 'Потужний шахіст кандидатського рівня. Не прощає неточностей.' },
    es: { name: 'Maestro de Club', rank: 'Experto II', description: 'Fuerza de candidato a maestro. No perdona ninguna imprecisión.' },
    de: { name: 'Klubmeister', rank: 'Experte II', description: 'Stärke eines Meisterkandidaten. Bestraft jede Ungenauigkeit.' },
  },
  11: {
    he: { name: 'אמן פיד"ה', rank: 'אמן FM', description: 'משחק ברמת אמן בינלאומי עם דיוק טקטי ואינטואיציה עמוקה.' },
    uk: { name: 'Майстер ФІДЕ', rank: 'Майстер FM', description: 'Рівень майстра ФІДЕ з бездоганною технікою реалізації переваги.' },
    es: { name: 'Maestro FIDE', rank: 'Maestro FM', description: 'Nivel FM oficial. Gran técnica para convertir ventajas y calcular.' },
    de: { name: 'FIDE-Meister', rank: 'Meister FM', description: 'Offizielles FM-Niveau mit exzellenter Vorteilsverwertung.' },
  },
  12: {
    he: { name: 'אמן בינלאומי', rank: 'אמן בכיר IM', description: 'עומק חישוב יוצא דופן וראייה אסטרטגית עילאית.' },
    uk: { name: 'Міжнародний майстер', rank: 'Майстер IM', description: 'Глибокий динамічний розрахунок і висока шахова ерудиція.' },
    es: { name: 'Maestro Internacional', rank: 'Maestro IM', description: 'Cálculo dinámico profundo y gran comprensión estratégica.' },
    de: { name: 'Internationaler Meister', rank: 'Meister IM', description: 'Tiefe Variantenberechnung und strategische Reife.' },
  },
  13: {
    he: { name: 'רב-אמן', rank: 'רב-אמן GM', description: 'עוצמת חישוב של רב-אמן בינלאומי, משחק נטול פגמים.' },
    uk: { name: 'Гросмейстер', rank: 'Гросмейстер GM', description: 'Гросмейстерський рівень розрахунку та розуміння шахів.' },
    es: { name: 'Gran Maestro', rank: 'Gran Maestro GM', description: 'Fuerza de Gran Maestro. Comprensión superior y precisión letal.' },
    de: { name: 'Großmeister', rank: 'Großmeister GM', description: 'Großmeister-Klasse mit kompromissloser Präzision.' },
  },
  14: {
    he: { name: 'סופר רב-אמן', rank: 'עילית GM 2700+', description: 'רמת צמרת עולמית, ראייה טקטית עילאית וטכניקה עילאית.' },
    uk: { name: 'Супергросмейстер', rank: 'Еліта 2700+', description: 'Елітна світова шахова сила (2700+). Безжальний тиск.' },
    es: { name: 'Súper Gran Maestro', rank: 'Élite 2700+', description: 'Fuerza de élite mundial (2700+). Presión constante sin fisuras.' },
    de: { name: 'Super-Großmeister', rank: 'Elite 2700+', description: 'Weltklasse-Niveau (2700+). Gnadenlose Präzision in jeder Phase.' },
  },
  15: {
    he: { name: 'סטוקפיש מאסטר', rank: 'מנוע בלתי מנוצח', description: 'עוצמת חישוב מלאה של מנוע Stockfish ברמה העליונה.' },
    uk: { name: 'Stockfish Master', rank: 'Непереможний рушій', description: 'Повна обчислювальна міць рушія Stockfish. Абсолютна точність.' },
    es: { name: 'Stockfish Master', rank: 'Motor Supremo', description: 'Poder de cálculo total de Stockfish. Precisión inhumana absoluta.' },
    de: { name: 'Stockfish Master', rank: 'Unbesiegbar', description: 'Volle Rechenkraft der Stockfish-Engine. Absolute Perfektion.' },
  },
};
