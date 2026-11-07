export type Color = 'white' | 'black';

export type League = 'beginner' | 'club' | 'master';

export interface LevelConfig {
  id: number;
  name: string;
  nameEn?: string;
  rank: string;
  rankEn?: string;
  elo: number;
  league: League;
  avatar: string;
  depth: number;
  skillLevel?: number;
  multiPv?: number;
  probSuboptimal?: number; // e.g. 0.45 for level 1
  uciLimitStrength: boolean;
  uciElo?: number;
  description: string;
  descriptionEn?: string;
  typicalMistakes: string;
  typicalMistakesEn?: string;
  coachSupport: string;
  coachSupportEn?: string;
  winRequirement: string;
  winRequirementEn?: string;
  takebacksAllowed: number; // -1 for infinite
  hasBlunderShield: boolean;
  hasHeatmap: boolean;
}

export interface EngineEvaluation {
  depth: number;
  scoreCp: number | null; // Centipawns from White's perspective
  scoreMate: number | null; // Mate in N moves
  bestMove?: string;
  pvLines?: string[];
  isThinking: boolean;
}

export type MoveClassification = '!!' | '!' | 'book' | '?!' | '?' | '??';

export interface MoveRecord {
  san: string;
  from: string;
  to: string;
  color: Color;
  fen: string;
  timeTakenMs?: number;
  evalScore?: number | null;
  annotation?: MoveClassification;
}

export type BoardTheme = 'wood' | 'green' | 'blue' | 'graphite';

export interface MoveAnalysis {
  plyIndex: number;
  moveNumber: number;
  color: Color;
  san: string;
  from: string;
  to: string;
  fenBefore: string;
  fenAfter: string;
  evalBeforeCp: number; // White perspective centipawns
  evalAfterCp: number;  // White perspective centipawns
  lossCp: number;       // Centipawn loss for current player
  bestMoveSan?: string;
  bestMoveUci?: string;
  classification: MoveClassification;
  explanation: string;
}

export interface GameReport {
  whiteAccuracy: number; // 0-100%
  blackAccuracy: number;
  counts: {
    white: Record<MoveClassification, number>;
    black: Record<MoveClassification, number>;
  };
  moves: MoveAnalysis[];
  mistakesToRetry: MoveAnalysis[]; // Player's ?, ?? moves
}

export interface Puzzle {
  id: string;
  title: string;
  titleEn?: string;
  theme: string;
  themeEn?: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  difficultyEn?: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  playerColor: Color;
  fen: string;
  solutionUci: string[]; // sequence of moves in UCI: e.g. ["e7e8q", "a8e8", "d1e8"]
  description: string;
  descriptionEn?: string;
  hint: string;
  hintEn?: string;
}

export interface RatingHistoryPoint {
  timestamp: number;
  elo: number;
  delta: number;
  reason: string;
}

export interface BotProgress {
  levelId: number;
  unlocked: boolean;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  bestAccuracy: number;
}

export interface SavedGame {
  id: string;
  timestamp: number;
  levelId: number;
  botName: string;
  botElo: number;
  botAvatar: string;
  playerColor: Color;
  result: 'win' | 'loss' | 'draw';
  reason: string;
  eloBefore: number;
  eloDelta: number;
  eloAfter: number;
  playerAccuracy: number;
  botAccuracy: number;
  movesCount: number;
  openingName?: string;
  moves: MoveRecord[];
}

export interface PlayerProfile {
  name: string;
  elo: number;
  highestElo: number;
  lowestElo: number;
  ratingHistory: RatingHistoryPoint[];
  botProgress: Record<number, BotProgress>; // key: levelId 1..15
  games: SavedGame[];
  tacticsRating: number;
  tacticsStreak: number;
  tacticsHighestStreak: number;
  solvedPuzzleIds: string[];
}
