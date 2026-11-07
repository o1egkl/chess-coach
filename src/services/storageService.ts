import { PlayerProfile, BotProgress, SavedGame, Color, MoveRecord } from '../types/chess';
import { CHESS_LEVELS } from '../config/levels';

const STORAGE_KEY = 'chess_coach_player_profile_v1';

// Initial bot progress for all 15 levels
function createInitialBotProgress(): Record<number, BotProgress> {
  const map: Record<number, BotProgress> = {};
  for (const lvl of CHESS_LEVELS) {
    map[lvl.id] = {
      levelId: lvl.id,
      unlocked: lvl.id === 1, // Level 1 unlocked by default
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      bestAccuracy: 0,
    };
  }
  return map;
}

// Default starting profile
function createDefaultProfile(): PlayerProfile {
  const now = Date.now();
  const initialElo = 600;
  return {
    name: 'Игрок',
    elo: initialElo,
    highestElo: initialElo,
    lowestElo: initialElo,
    ratingHistory: [
      {
        timestamp: now,
        elo: initialElo,
        delta: 0,
        reason: 'Начало обучения',
      },
    ],
    botProgress: createInitialBotProgress(),
    games: [],
    tacticsRating: 1000,
    tacticsStreak: 0,
    tacticsHighestStreak: 0,
    solvedPuzzleIds: [],
  };
}

class StorageService {
  private profile: PlayerProfile | null = null;

  public getProfile(): PlayerProfile {
    if (this.profile) return this.profile;

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as PlayerProfile;
        // Ensure all 15 bot levels exist in loaded profile
        for (const lvl of CHESS_LEVELS) {
          if (!parsed.botProgress[lvl.id]) {
            parsed.botProgress[lvl.id] = {
              levelId: lvl.id,
              unlocked: lvl.id === 1,
              gamesPlayed: 0,
              wins: 0,
              losses: 0,
              draws: 0,
              bestAccuracy: 0,
            };
          }
        }
        this.profile = parsed;
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to read profile from localStorage:', err);
    }

    const defaultProfile = createDefaultProfile();
    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  public saveProfile(profile: PlayerProfile): void {
    this.profile = profile;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Failed to save profile to localStorage:', err);
    }
  }

  public updatePlayerName(name: string): PlayerProfile {
    const profile = this.getProfile();
    profile.name = name.trim() || 'Игрок';
    this.saveProfile(profile);
    return profile;
  }

  // Calculate Elo change according to standard FIDE / chess rating formula
  public calculateEloChange(
    playerElo: number,
    botElo: number,
    result: 'win' | 'loss' | 'draw'
  ): number {
    const expected = 1 / (1 + Math.pow(10, (botElo - playerElo) / 400));
    const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
    const k = 32;

    let delta = Math.round(k * (score - expected));

    if (result === 'win' && delta <= 0) delta = 5;
    if (result === 'loss' && delta >= 0) delta = -5;

    return delta;
  }

  // Record completed match and update progression
  public recordCompletedGame(params: {
    levelId: number;
    botName: string;
    botElo: number;
    botAvatar: string;
    playerColor: Color;
    result: 'win' | 'loss' | 'draw';
    reason: string;
    playerAccuracy: number;
    botAccuracy: number;
    movesCount: number;
    openingName?: string;
    moves: MoveRecord[];
  }): {
    updatedProfile: PlayerProfile;
    eloDelta: number;
    newLevelUnlocked: number | null;
  } {
    const profile = this.getProfile();
    const eloBefore = profile.elo;
    const eloDelta = this.calculateEloChange(eloBefore, params.botElo, params.result);
    const eloAfter = Math.max(100, eloBefore + eloDelta);

    profile.elo = eloAfter;
    if (eloAfter > profile.highestElo) profile.highestElo = eloAfter;
    if (eloAfter < profile.lowestElo) profile.lowestElo = eloAfter;

    const now = Date.now();

    // Add to rating history
    profile.ratingHistory.push({
      timestamp: now,
      elo: eloAfter,
      delta: eloDelta,
      reason: `${params.result === 'win' ? 'Победа' : params.result === 'loss' ? 'Поражение' : 'Ничья'} против ${params.botName}`,
    });

    // Update bot specific record
    let newLevelUnlocked: number | null = null;
    const botStat = profile.botProgress[params.levelId] || {
      levelId: params.levelId,
      unlocked: true,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      bestAccuracy: 0,
    };

    botStat.gamesPlayed++;
    if (params.result === 'win') botStat.wins++;
    else if (params.result === 'loss') botStat.losses++;
    else botStat.draws++;

    if (params.playerAccuracy > botStat.bestAccuracy) {
      botStat.bestAccuracy = params.playerAccuracy;
    }

    profile.botProgress[params.levelId] = botStat;

    // Check unlocking next level
    if (params.result === 'win' && params.levelId < 15) {
      const nextLevelId = params.levelId + 1;
      const nextBotStat = profile.botProgress[nextLevelId];
      if (nextBotStat && !nextBotStat.unlocked) {
        nextBotStat.unlocked = true;
        newLevelUnlocked = nextLevelId;
      }
    }

    // Save game record
    const savedGame: SavedGame = {
      id: `game_${now}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now,
      levelId: params.levelId,
      botName: params.botName,
      botElo: params.botElo,
      botAvatar: params.botAvatar,
      playerColor: params.playerColor,
      result: params.result,
      reason: params.reason,
      eloBefore,
      eloDelta,
      eloAfter,
      playerAccuracy: params.playerAccuracy,
      botAccuracy: params.botAccuracy,
      movesCount: params.movesCount,
      openingName: params.openingName,
      moves: params.moves,
    };

    profile.games.unshift(savedGame);
    if (profile.games.length > 50) {
      profile.games = profile.games.slice(0, 50);
    }

    this.saveProfile(profile);

    return {
      updatedProfile: profile,
      eloDelta,
      newLevelUnlocked,
    };
  }

  // Update tactics puzzle result
  public recordTacticsResult(
    puzzleId: string,
    puzzleRating: number,
    solved: boolean
  ): {
    newRating: number;
    newStreak: number;
    ratingDelta: number;
  } {
    const profile = this.getProfile();
    let ratingDelta = 0;

    if (solved) {
      profile.tacticsStreak++;
      if (profile.tacticsStreak > profile.tacticsHighestStreak) {
        profile.tacticsHighestStreak = profile.tacticsStreak;
      }
      if (!profile.solvedPuzzleIds.includes(puzzleId)) {
        profile.solvedPuzzleIds.push(puzzleId);
      }
      ratingDelta = Math.max(10, Math.round((puzzleRating - profile.tacticsRating) / 20) + 15);
    } else {
      profile.tacticsStreak = 0;
      ratingDelta = -10;
    }

    profile.tacticsRating = Math.max(200, profile.tacticsRating + ratingDelta);
    this.saveProfile(profile);

    return {
      newRating: profile.tacticsRating,
      newStreak: profile.tacticsStreak,
      ratingDelta,
    };
  }

  // Unlock all levels toggle for practice sandbox
  public unlockAllLevels(): PlayerProfile {
    const profile = this.getProfile();
    for (const lvl of CHESS_LEVELS) {
      if (profile.botProgress[lvl.id]) {
        profile.botProgress[lvl.id].unlocked = true;
      }
    }
    this.saveProfile(profile);
    return profile;
  }
}

export const storage = new StorageService();
