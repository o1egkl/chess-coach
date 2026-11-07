import React, { useState } from 'react';
import { CHESS_LEVELS } from '../config/levels';
import { LevelConfig, League, BotProgress } from '../types/chess';
import { Trophy, Shield, Swords, ChevronDown, ChevronUp, Lock, CheckCircle2 } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: LevelConfig;
  onSelectLevel: (level: LevelConfig) => void;
  botProgress?: Record<number, BotProgress>;
  disabled?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel,
  botProgress,
  disabled = false,
}) => {
  const [selectedLeague, setSelectedLeague] = useState<League>(currentLevel.league);
  const [expandedLevelId, setExpandedLevelId] = useState<number | null>(currentLevel.id);

  const leagueLabels: Record<League, { title: string; icon: React.ReactNode; color: string; range: string }> = {
    beginner: {
      title: 'Лига начинающих',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/40 text-emerald-400',
      range: 'Уровни 1–5 (400–1000 Эло)',
    },
    club: {
      title: 'Клубная лига',
      icon: <Swords className="w-4 h-4 text-blue-400" />,
      color: 'border-blue-500/40 text-blue-400',
      range: 'Уровни 6–10 (1150–1750 Эло)',
    },
    master: {
      title: 'Мастерская лига',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/40 text-amber-400',
      range: 'Уровни 11–15 (1900–2420+ Эло)',
    },
  };

  const filteredLevels = CHESS_LEVELS.filter((l) => l.league === selectedLeague);

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-xl flex flex-col space-y-3">
      {/* League Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
        {(['beginner', 'club', 'master'] as League[]).map((league) => (
          <button
            key={league}
            onClick={() => setSelectedLeague(league)}
            className={`py-2 px-1 rounded-md flex flex-col items-center justify-center font-semibold transition-all ${
              selectedLeague === league
                ? 'bg-slate-750 text-white shadow bg-slate-800 border border-slate-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-1">
              {leagueLabels[league].icon}
              <span className="hidden sm:inline">{leagueLabels[league].title.split(' ')[0]}</span>
              <span className="sm:hidden">{league.slice(0, 3).toUpperCase()}</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {league === 'beginner' ? '400-1000' : league === 'club' ? '1150-1750' : '1900-2420+'}
            </span>
          </button>
        ))}
      </div>

      {/* Level List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredLevels.map((level) => {
          const isCurrent = level.id === currentLevel.id;
          const isExpanded = expandedLevelId === level.id;
          const stat = botProgress ? botProgress[level.id] : undefined;
          const isUnlocked = stat ? stat.unlocked : true;
          const isBeaten = stat ? stat.wins > 0 : false;

          return (
            <div
              key={level.id}
              className={`border rounded-lg transition-all ${
                isCurrent
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg'
                  : !isUnlocked
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : isBeaten
                  ? 'bg-emerald-950/15 border-emerald-500/30'
                  : 'bg-slate-850/60 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/50'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => {
                  if (!disabled && isUnlocked) {
                    onSelectLevel(level);
                    setExpandedLevelId(isExpanded ? null : level.id);
                  } else if (!isUnlocked) {
                    setExpandedLevelId(isExpanded ? null : level.id);
                  }
                }}
                className={`flex items-center justify-between p-2.5 select-none ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">
                        {level.id}. {level.name}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded">
                          В игре
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-slate-800 text-slate-400 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Закрыт
                        </span>
                      )}
                      {isBeaten && (
                        <span className="text-emerald-400" title={`Пройден (${stat?.wins} побед)`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{level.rank}</span>
                      <span>•</span>
                      <span className="font-mono text-amber-400 font-semibold">{level.elo} Эло</span>
                      {stat && stat.wins > 0 && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          • {stat.wins} {stat.wins === 1 ? 'победа' : 'побед'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedLevelId(isExpanded ? null : level.id);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-700/40 text-xs text-slate-300 space-y-2 bg-slate-900/40">
                  <p className="text-slate-300 italic">{level.description}</p>

                  <div className="grid grid-cols-1 gap-1 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400">Ошибки бота: </span>
                      <span className="text-rose-300">{level.typicalMistakes}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Поддержка тренера: </span>
                      <span className="text-emerald-300">{level.coachSupport}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Условие перехода: </span>
                      <span className="text-amber-300 font-semibold">{level.winRequirement}</span>
                    </div>
                  </div>

                  {!isCurrent && isUnlocked && (
                    <button
                      disabled={disabled}
                      onClick={() => onSelectLevel(level)}
                      className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded text-xs transition shadow"
                    >
                      Играть с этим ботом ({level.elo} Эло)
                    </button>
                  )}

                  {!isUnlocked && (
                    <div className="w-full mt-2 py-1.5 px-2 bg-slate-800/80 border border-slate-700 text-slate-400 rounded text-center text-[11px] flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Победите бота {CHESS_LEVELS[level.id - 2]?.name || 'предыдущего уровня'}, чтобы открыть</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
