import React, { useState } from 'react';
import { PlayerProfile, BotProgress } from '../types/chess';
import { CHESS_LEVELS } from '../config/levels';
import { RatingChart } from './RatingChart';
import { storage } from '../services/storageService';
import { User, Trophy, Flame, Target, Lock, CheckCircle, Edit2, Check, X, ShieldAlert, Award } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(profile.name);

  if (!isOpen) return null;

  // Calculate aggregate stats
  const totalGames = profile.games.length;
  const wins = profile.games.filter((g) => g.result === 'win').length;
  const losses = profile.games.filter((g) => g.result === 'loss').length;
  const draws = profile.games.filter((g) => g.result === 'draw').length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const accuracies = profile.games.map((g) => g.playerAccuracy).filter((a) => a > 0);
  const avgAccuracy = accuracies.length > 0 ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length) : 0;
  const bestAccuracy = accuracies.length > 0 ? Math.max(...accuracies) : 0;

  // Determine League
  const getLeague = (elo: number) => {
    if (elo < 1100) return { name: 'Лига Новичков', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (elo < 1800) return { name: 'Клубная Лига', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    return { name: 'Мастерская Лига', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  };

  const league = getLeague(profile.elo);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      const updated = storage.updatePlayerName(nameInput);
      onUpdateProfile(updated);
    }
    setIsEditingName(false);
  };

  const handleUnlockAll = () => {
    const updated = storage.unlockAllLevels();
    onUpdateProfile(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 max-w-3xl w-full p-4 sm:p-6 rounded-2xl shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="bg-slate-800 border border-slate-600 rounded px-2 py-0.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400"
                      maxLength={20}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{profile.name}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-white"
                      title="Изменить имя"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${league.color}`}>
                  {league.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                <span>Рейтинг Эло: <strong className="text-emerald-400 text-sm">{profile.elo}</strong></span>
                <span>• Пик: <strong className="text-slate-200">{profile.highestElo}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Партии / Винрейт</span>
              <div className="text-xl font-mono font-bold text-white mt-1">
                {totalGames}{' '}
                <span className="text-xs text-emerald-400">({winRate}%)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {wins}В / {losses}П / {draws}Н
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Точность ходов</span>
              <div className="text-xl font-mono font-bold text-teal-300 mt-1">
                {avgAccuracy}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Лучшая: {bestAccuracy}%
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Рейтинг тактики</span>
              <div className="text-xl font-mono font-bold text-amber-400 mt-1">
                {profile.tacticsRating}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Решено задач: {profile.solvedPuzzleIds.length}
              </span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Серия решений</span>
              <div className="text-xl font-mono font-bold text-orange-400 mt-1 flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {profile.tacticsStreak}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Рекорд: {profile.tacticsHighestStreak}
              </span>
            </div>
          </div>

          {/* Rating History Chart */}
          <RatingChart history={profile.ratingHistory} />

          {/* 15 Bots Progression Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Прогресс прохождения 15 уровней ботов
              </span>
              <button
                onClick={handleUnlockAll}
                className="text-[10px] text-slate-400 hover:text-emerald-400 underline"
              >
                Разблокировать все уровни (Свободный режим)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CHESS_LEVELS.map((bot) => {
                const stat = profile.botProgress[bot.id] || {
                  levelId: bot.id,
                  unlocked: bot.id === 1,
                  gamesPlayed: 0,
                  wins: 0,
                  losses: 0,
                  draws: 0,
                  bestAccuracy: 0,
                };

                const isUnlocked = stat.unlocked;
                const isBeaten = stat.wins > 0;

                return (
                  <div
                    key={bot.id}
                    className={`p-2 rounded-xl border text-center transition ${
                      !isUnlocked
                        ? 'bg-slate-950/30 border-slate-850 opacity-50'
                        : isBeaten
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-mono text-slate-400">#{bot.id}</span>
                      {!isUnlocked ? (
                        <Lock className="w-3 h-3 text-slate-600" />
                      ) : isBeaten ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                      )}
                    </div>

                    <div className="text-xl mb-0.5">{bot.avatar}</div>
                    <div className="font-bold text-white text-[11px] truncate">{bot.name}</div>
                    <div className="text-[9px] text-amber-400 font-mono">{bot.elo} Эло</div>

                    {isUnlocked && (
                      <div className="mt-1.5 pt-1 border-t border-slate-800 text-[9px] text-slate-400 font-mono">
                        {isBeaten ? (
                          <span className="text-emerald-300 font-semibold">{stat.wins} побед</span>
                        ) : (
                          <span>{stat.gamesPlayed} игр</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Games Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 block">
              История последних партий ({profile.games.length}):
            </span>

            {profile.games.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                Вы ещё не завершили ни одной партии. Сыграйте с первым ботом «Дебютант»!
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-2 sm:px-3">Соперник</th>
                      <th className="p-2 sm:px-3">Результат</th>
                      <th className="p-2 sm:px-3">Эло</th>
                      <th className="p-2 sm:px-3 hidden sm:table-cell">Точность</th>
                      <th className="p-2 sm:px-3 hidden sm:table-cell">Ходов</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {profile.games.slice(0, 10).map((game) => (
                      <tr key={game.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-2 sm:px-3 flex items-center gap-2">
                          <span>{game.botAvatar}</span>
                          <div>
                            <span className="font-semibold text-slate-200">{game.botName}</span>
                            <span className="block text-[9px] text-slate-500 font-mono">
                              {game.botElo} Эло
                            </span>
                          </div>
                        </td>
                        <td className="p-2 sm:px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              game.result === 'win'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : game.result === 'loss'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {game.result === 'win' ? 'Победа' : game.result === 'loss' ? 'Поражение' : 'Ничья'}
                          </span>
                        </td>
                        <td className="p-2 sm:px-3 font-mono text-[11px]">
                          <span
                            className={
                              game.eloDelta > 0
                                ? 'text-emerald-400 font-bold'
                                : game.eloDelta < 0
                                ? 'text-rose-400 font-bold'
                                : 'text-slate-400'
                            }
                          >
                            {game.eloDelta > 0 ? `+${game.eloDelta}` : game.eloDelta}
                          </span>
                          <span className="text-[9px] text-slate-500 block">
                            (стало {game.eloAfter})
                          </span>
                        </td>
                        <td className="p-2 sm:px-3 font-mono hidden sm:table-cell text-slate-300">
                          {game.playerAccuracy > 0 ? `${game.playerAccuracy}%` : '—'}
                        </td>
                        <td className="p-2 sm:px-3 font-mono text-slate-400 hidden sm:table-cell">
                          {game.movesCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
