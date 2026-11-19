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


const PUZZLE_TRANSLATIONS: Record<string | number, Partial<Record<Language, { title: string; theme: string; difficulty: string; description: string; hint: string }>>> = {
  1: {
    he: { title: 'מט בשורה האחרונה', theme: 'מט שורה אחרונה', difficulty: 'קל', description: 'לשחור אין חלון מילוט בשורה השמינית. הנחת מט במסע אחד.', hint: 'תקוף את השורה האחרונה הבלתי מוגנת באמצעות הצריח.' },
    uk: { title: 'Мат по останній горизонталі', theme: 'Лінійний мат', difficulty: 'Легко', description: 'У чорних немає кватирки на 8-й горизонталі. Поставте мат в 1 хід.', hint: 'Атакуйте беззахисну останню горизонталь турою.' },
    es: { title: 'Mate del pasillo', theme: 'Mate en última fila', difficulty: 'Fácil', description: 'Las negras no tienen casilla de escape en la octava fila. Da jaque mate en 1 jugada.', hint: 'Ataca la última fila indefensa con la torre.' },
    de: { title: 'Grundreihenmatt', theme: 'Matt auf der Grundreihe', difficulty: 'Leicht', description: 'Schwarz hat kein Fluchtfeld auf der 8. Reihe. Setze in 1 Zug matt.', hint: 'Greife die ungedeckte Grundreihe mit dem Turm an.' },
    fr: { title: 'Mat du couloir', theme: 'Mat de la dernière rangée', difficulty: 'Facile', description: 'Les Noirs n’ont pas de case de fuite sur la 8e rangée. Faites échec et mat en 1 coup.', hint: 'Attaquez la dernière rangée sans défense avec la tour.' },
  },
  2: {
    he: { title: 'מכה על נקודת f7', theme: 'מט במסע 1', difficulty: 'קל', description: 'המלכה והרץ יצרו סוללה קטלנית מול משבצת f7 החלשה.', hint: 'תקוף את רגלי f7 עם המלכה בחסות הרץ ב-c4.' },
    uk: { title: 'Удар по пункту f7', theme: 'Мат в 1 хід', difficulty: 'Легко', description: 'Ферзь і слон створили батарею проти слабкого пункту f7.', hint: 'Атакуйте пішака f7 ферзем під захистом слона c4.' },
    es: { title: 'Golpe en f7', theme: 'Mate en 1', difficulty: 'Fácil', description: 'Dama y alfil crean una batería letal sobre el punto débil f7.', hint: 'Ataca el peón f7 con la dama protegida por el alfil en c4.' },
    de: { title: 'Schlag auf f7', theme: 'Matt in 1 Zug', difficulty: 'Leicht', description: 'Dame und Läufer bilden eine tödliche Batterie gegen das schwache Feld f7.', hint: 'Greife den Bauern f7 mit der Dame an, geschützt durch den Läufer c4.' },
    fr: { title: 'Frappe sur f7', theme: 'Mat en 1 coup', difficulty: 'Facile', description: 'La dame et le fou forment une batterie mortelle contre la case f7.', hint: 'Attaquez le pion f7 avec la dame protégée par le fou c4.' },
  },
  3: {
    he: { title: 'מלכודת למלך בפינה', theme: 'מט במסע 1', difficulty: 'קל', description: 'הפרש ב-f6 שולט על משבצות המילוט g8 ו-h7. הצריח מנחית מכת מחץ.', hint: 'העבר את הצריח ל-h7 לסיום המשחק במט.' },
    uk: { title: 'Пастка для короля в кутку', theme: 'Мат в 1 хід', difficulty: 'Легко', description: 'Кінь на f6 відбирає поля відступу g8 та h7. Тура завдає вирішального удару.', hint: 'Переведіть туру на h7 для матового фіналу.' },
    es: { title: 'Rey atrapado en la esquina', theme: 'Mate en 1', difficulty: 'Fácil', description: 'El caballo en f6 quita las casillas g8 y h7. La torre asesta el golpe decisivo.', hint: 'Lleva la torre a h7 para el mate.' },
    de: { title: 'Königsfalle in der Ecke', theme: 'Matt in 1 Zug', difficulty: 'Leicht', description: 'Der Springer auf f6 nimmt die Fluchtfelder g8 und h7. Der Turm setzt matt.', hint: 'Ziehe den Turm nach h7 zum Matt.' },
    fr: { title: 'Roi piégé dans le coin', theme: 'Mat en 1 coup', difficulty: 'Facile', description: 'Le cavalier en f6 contrôle g8 et h7. La tour porte le coup fatal.', hint: 'Jouez la tour en h7 pour mater.' },
  },
  4: {
    he: { title: 'מזלג פרש קלאסי', theme: 'מזלג טקטי', difficulty: 'קל', description: 'המלך והמלכה של השחור ניצבים על משבצות מאותו הצבע. הנחת מזלג כפול עם הפרש.', hint: 'קפוץ עם הפרש ל-c7 כדי לאיים בו-זמנית על המלך והמלכה.' },
    uk: { title: 'Вилка конем', theme: 'Вилка', difficulty: 'Легко', description: 'Король і ферзь чорних стоять на полях одного кольору. Поставте подвійний удар конем.', hint: 'Стрибніть конем на c7 з вилкою на короля і ферзя.' },
    es: { title: 'Horquilla de caballo', theme: 'Horquilla', difficulty: 'Fácil', description: 'El rey y la dama negra están en casillas del mismo color. Aplica un ataque doble.', hint: 'Salta con el caballo a c7 atacando simultáneamente al rey y a la dama.' },
    de: { title: 'Springergabel', theme: 'Gabel', difficulty: 'Leicht', description: 'König und Dame von Schwarz stehen ungünstig. Setze eine Springergabel.', hint: 'Springe mit dem Springer auf c7 mit Doppelangriff auf König und Dame.' },
    fr: { title: 'Fourchette de cavalier', theme: 'Fourchette', difficulty: 'Facile', description: 'Le roi et la dame noirs sont sur des cases de même couleur. Placez une fourchette.', hint: 'Sautez avec le cavalier en c7 pour attaquer simultanément roi et dame.' },
  },
  5: {
    he: { title: 'ריתוק מוחלט', theme: 'ריתוק', difficulty: 'בינוני', description: 'המלכה השחורה נמצאת על אותו האלכסון עם מלכה. ריתוק הרץ יכריע את המשחק.', hint: 'הצב את הרץ הלבן ב-b5 כדי לרתק את המלכה למלך.' },
    uk: { title: "Абсолютна зв'язка", theme: "Зв'язка", difficulty: 'Середньо', description: "Чорний ферзь на одній діагоналі з королем. Використайте зв'язку слоном.", hint: "Поставте слона на b5, зв'язуючи ферзя з королем." },
    es: { title: 'Clavada absoluta', theme: 'Clavada', difficulty: 'Medio', description: 'La dama negra está en la misma diagonal que su rey. Clávala con el alfil.', hint: 'Mueve el alfil a b5 clavando la dama contra el rey.' },
    de: { title: 'Absolute Fesselung', theme: 'Fesselung', difficulty: 'Mittel', description: 'Die schwarze Dame steht auf derselben Diagonale wie ihr König. Fessele sie.', hint: 'Bringe den Läufer nach b5 und fessele die Dame an den König.' },
    fr: { title: 'Clouage absolu', theme: 'Clouage', difficulty: 'Moyen', description: 'La dame noire est sur la même diagonale que son roi. Clouez-la avec le fou.', hint: 'Placez le fou en b5 pour clouer la dame contre le roi.' },
  },
  6: {
    he: { title: 'מט חנק (פילודור)', theme: 'מט חנק', difficulty: 'קשה', description: 'המלך השחור חנוק על ידי כליו שלו. בצע הקרבת מלכה ומט עם הפרש.', hint: 'הקרב את המלכה ב-g8 ולאחר מכן הנחת מט עם הפרש ב-f7.' },
    uk: { title: 'Спертий мат (Філідор)', theme: 'Спертий мат', difficulty: 'Складно', description: 'Король чорних оточений власними фігурами. Здійсніть жертву ферзя та мат конем.', hint: 'Пожертвуйте ферзя на g8 і поставте мат конем на f7.' },
    es: { title: 'Mate de la coz (Filidor)', theme: 'Mate de la coz', difficulty: 'Difícil', description: 'El rey negro está asfixiado por sus propias piezas. Sacrifica la dama y remata con caballo.', hint: 'Sacrifica la dama en g8 y da mate con el caballo en f7.' },
    de: { title: 'Ersticktes Matt (Philidor)', theme: 'Ersticktes Matt', difficulty: 'Schwer', description: 'Der schwarze König ist von eigenen Figuren eingesperrt. Opfere die Dame und setze mit Springer matt.', hint: 'Opfere die Dame auf g8 und setze matt mit dem Springer auf f7.' },
    fr: { title: 'Mat étouffé (Philidor)', theme: 'Mat étouffé', difficulty: 'Difficile', description: 'Le roi noir est étouffé par ses propres pièces. Sacrifiez la dame et matez au cavalier.', hint: 'Sacrifiez la dame en g8 puis matez avec le cavalier en f7.' },
  },
  7: {
    he: { title: 'הסחת מגן ומט', theme: 'הסחה', difficulty: 'בינוני', description: 'הצריח השחור מגן על השורה השמינית. הסח אותו מהגנת המלך.', hint: 'הקרב את הצריח בשורה האחרונה ולאחר מכן הנחת מט עם המלכה.' } ,
    uk: { title: 'Відволікання та мат', theme: 'Відволікання', difficulty: 'Середньо', description: 'Чорна тура захищає останню горизонталь. Відволічіть її від захисту.', hint: 'Пожертвуйте туру на 8-й горизонталі, а потім ставте мат ферзем.' },
    es: { title: 'Atracción y desvío', theme: 'Desvío', difficulty: 'Medio', description: 'La torre negra defiende la última fila. Desvíala de su defensa.', hint: 'Sacrifica la torre en la última fila y luego da mate con la dama.' },
    de: { title: 'Ablenkungsmatt', theme: 'Ablenkung', difficulty: 'Mittel', description: 'Der schwarze Turm deckt die Grundreihe. Lenke ihn von der Verteidigung ab.', hint: 'Opfere den Turm auf der 8. Reihe und setze dann mit der Dame matt.' },
    fr: { title: 'Mat par déviation', theme: 'Déviation', difficulty: 'Moyen', description: 'La tour noire défend la 8e rangée. Déviez-la de sa défense.', hint: 'Sacrifiez la tour sur la dernière rangée puis matez avec la dame.' },
  },
  8: {
    he: { title: 'שח נגלה והכאת מלכה', theme: 'שח נגלה', difficulty: 'בינוני', description: 'הרץ חוסם את טור הצריח מול המלך. שח נגלה יזכה במלכה.', hint: 'הזז את הרץ עם שח כדי לחשוף את איום הצריח ולזכות במלכה.' },
    uk: { title: 'Відкритий шах', theme: 'Відкритий напад', difficulty: 'Середньо', description: 'Слон перекриває лінію тури проти короля. Відкритий шах виграє ферзя.', hint: 'Зробіть хід слоном із шахом, відкриваючи атаку тури на ферзя.' },
    es: { title: 'Jaque a la descubierta', theme: 'Ataque descubierto', difficulty: 'Medio', description: 'El alfil bloquea la columna de la torre hacia el rey. El jaque gana la dama.', hint: 'Mueve el alfil con jaque y captura la dama desprotegida.' },
    de: { title: 'Abzugsschach', theme: 'Abzugsangriff', difficulty: 'Mittel', description: 'Der Läufer verstellt die Linie des Turms zum König. Gewinne die Dame mit Abzugsschach.', hint: 'Ziehe den Läufer mit Schachgebot ab und gewinne die Dame.' },
    fr: { title: 'Échec à la découverte', theme: 'Attaque à la découverte', difficulty: 'Moyen', description: 'Le fou bloque la colonne de la tour vers le roi. L’échec à la découverte gagne la dame.', hint: 'Déplacez le fou avec échec pour attaquer et capturer la dame.' },
  },
  9: {
    he: { title: 'שיפוד ליניארי', theme: 'שיפוד', difficulty: 'בינוני', description: 'המלך והמלכה של היריב נמצאים על אותו הטור. התקף עם הצריח.', hint: 'שחק בצריח לאורך הטור הפתוח כדי לשפד את המלך והמלכה.' },
    uk: { title: "Лінійний рентген (Ск'юер)", theme: 'Лінійний удар', difficulty: 'Середньо', description: 'Король і ферзь суперника стоять на одній лінії. Атакуйте турою.', hint: 'Поставте туру на відкриту лінію з лінійним ударом по королю та ферзю.' },
    es: { title: 'Ataque de enfilada (Pincho)', theme: 'Enfilada', difficulty: 'Medio', description: 'El rey y la dama rivales están en la misma columna. Atácalos con la torre.', hint: 'Juega la torre a la columna abierta dando jaque y ganando la dama.' },
    de: { title: 'Spießangriff', theme: 'Spieß', difficulty: 'Mittel', description: 'Der gegnerische König und die Dame stehen auf derselben Linie. Greife mit dem Turm an.', hint: 'Bringe den Turm auf die offene Linie mit Spießangriff.' },
    fr: { title: 'Attaque en enfilade', theme: 'Enfilade', difficulty: 'Moyen', description: 'Le roi et la dame adverses sont sur la même colonne. Attaquez avec la tour.', hint: 'Placez la tour sur la colonne ouverte pour enfiler roi et dame.' },
  },
  10: {
    he: { title: 'מלכודת לגאל', theme: 'מלכודת לגאל', difficulty: 'קשה', description: 'הלבן הקריב את המלכה ב-d1! השלם את קומבינציית לגאל המפורסמת במט ב-2 מסעים.', hint: 'קודם שח עם הרץ ב-f7, ולאחר מכן מט עם הפרש ב-d5.' },
    uk: { title: 'Мат Легаля', theme: 'Пастка Легаля', difficulty: 'Складно', description: 'Білі пожертвували ферзя на d1! Завершіть комбінацію Легаля матом у 2 ходи.', hint: 'Спочатку слон на f7 із шахом, потім кінь на d5 з матом.' },
    es: { title: 'Mate de Legall', theme: 'Celada de Legall', difficulty: 'Difícil', description: '¡Las blancas sacrificaron la dama en d1! Remata la famosa combinación de Legall en 2 jugadas.', hint: 'Primero jaque con el alfil en f7, luego mate con el caballo en d5.' },
    de: { title: 'Legalls Matt', theme: 'Legall-Falle', difficulty: 'Schwer', description: 'Weiß hat die Dame auf d1 geopfert! Vollende die berühmte Legall-Kombination in 2 Zügen.', hint: 'Zuerst Schach mit Läufer f7, dann Matt mit Springer d5.' },
    fr: { title: 'Mat de Legall', theme: 'Piège de Legall', difficulty: 'Difficile', description: 'Les Blancs ont sacrifié la dame en d1 ! Concluez la célèbre combinaison de Legall en 2 coups.', hint: 'D’abord échec du fou en f7, puis mat avec le cavalier en d5.' },
  },
};


export function getPuzzleTitle(puzzle: Puzzle, lang: Language): string {
  if (lang === 'ru') return puzzle.title;
  if (PUZZLE_TRANSLATIONS[puzzle.id]?.[lang]?.title) return PUZZLE_TRANSLATIONS[puzzle.id]![lang]!.title;
  if (lang === 'tr' && puzzle.titleTr) return puzzle.titleTr;
  if (lang === 'en' && puzzle.titleEn) return puzzle.titleEn;
  return puzzle.titleEn || puzzle.title;
}

export function getPuzzleTheme(puzzle: Puzzle, lang: Language): string {
  if (lang === 'ru') return puzzle.theme;
  if (PUZZLE_TRANSLATIONS[puzzle.id]?.[lang]?.theme) return PUZZLE_TRANSLATIONS[puzzle.id]![lang]!.theme;
  if (lang === 'tr' && puzzle.themeTr) return puzzle.themeTr;
  if (lang === 'en' && puzzle.themeEn) return puzzle.themeEn;
  return puzzle.themeEn || puzzle.theme;
}

export function getPuzzleDifficulty(puzzle: Puzzle, lang: Language): string {
  if (lang === 'ru') return puzzle.difficulty;
  if (PUZZLE_TRANSLATIONS[puzzle.id]?.[lang]?.difficulty) return PUZZLE_TRANSLATIONS[puzzle.id]![lang]!.difficulty;
  if (lang === 'tr' && puzzle.difficultyTr) return puzzle.difficultyTr;
  if (lang === 'en' && puzzle.difficultyEn) return puzzle.difficultyEn;
  return puzzle.difficultyEn || puzzle.difficulty;
}

export function getPuzzleDescription(puzzle: Puzzle, lang: Language): string {
  if (lang === 'ru') return puzzle.description;
  if (PUZZLE_TRANSLATIONS[puzzle.id]?.[lang]?.description) return PUZZLE_TRANSLATIONS[puzzle.id]![lang]!.description;
  if (lang === 'tr' && puzzle.descriptionTr) return puzzle.descriptionTr;
  if (lang === 'en' && puzzle.descriptionEn) return puzzle.descriptionEn;
  return puzzle.descriptionEn || puzzle.description;
}

export function getPuzzleHint(puzzle: Puzzle, lang: Language): string {
  if (lang === 'ru') return puzzle.hint;
  if (PUZZLE_TRANSLATIONS[puzzle.id]?.[lang]?.hint) return PUZZLE_TRANSLATIONS[puzzle.id]![lang]!.hint;
  if (lang === 'tr' && puzzle.hintTr) return puzzle.hintTr;
  if (lang === 'en' && puzzle.hintEn) return puzzle.hintEn;
  return puzzle.hintEn || puzzle.hint;
}
