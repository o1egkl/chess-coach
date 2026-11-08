import React, { useState } from 'react';
import { CHESS_LEVELS, getLevelName, getLevelRank, getLevelDescription, getLevelMistakes, getLevelSupport, getLevelRequirement } from '../config/levels';
import { LevelConfig, League, BotProgress } from '../types/chess';
import { useLanguage } from '../context/LanguageContext';
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
  const { language, t } = useLanguage();
  const [selectedLeague, setSelectedLeague] = useState<League>(currentLevel.league);
  const [expandedLevelId, setExpandedLevelId] = useState<number | null>(currentLevel.id);

  const leagueLabels: Record<League, { title: string; icon: React.ReactNode; range: string }> = {
    beginner: {
      title: language === 'ru' ? 'Лига начинающих' : language === 'tr' ? 'Başlangıç Ligi' : 'Beginners',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      range:
        language === 'ru'
          ? 'Уровни 1–5 (400–1000 Эло)'
          : language === 'tr'
          ? 'Seviyeler 1–5 (400–1000 Elo)'
          : 'Levels 1–5 (400–1000 Elo)',
    },
    club: {
      title: language === 'ru' ? 'Клубная лига' : language === 'tr' ? 'Kulüp Ligi' : 'Club League',
      icon: <Swords className="w-4 h-4 text-blue-400" />,
      range:
        language === 'ru'
          ? 'Уровни 6–10 (1150–1750 Эло)'
          : language === 'tr'
          ? 'Seviyeler 6–10 (1150–1750 Elo)'
          : 'Levels 6–10 (1150–1750 Elo)',
    },
    master: {
      title: language === 'ru' ? 'Мастерская лига' : language === 'tr' ? 'Usta Ligi' : 'Master League',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      range:
        language === 'ru'
          ? 'Уровни 11–15 (1900–2420+ Эло)'
          : language === 'tr'
          ? 'Seviyeler 11–15 (1900–2420+ Elo)'
          : 'Levels 11–15 (1900–2420+ Elo)',
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
              <span className="hidden sm:inline">{leagueLabels[league].title}</span>
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
        {filteredLevels.map((lvl) => {
          const isCurrent = lvl.id === currentLevel.id;
          const isExpanded = expandedLevelId === lvl.id;
          const stat = botProgress ? botProgress[lvl.id] : undefined;
          const isUnlocked = stat ? stat.unlocked : true;
          const isBeaten = stat ? stat.wins > 0 : false;
          const botName = getLevelName(lvl, language);
          const botRank = getLevelRank(lvl, language);

          return (
            <div
              key={lvl.id}
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
                    onSelectLevel(lvl);
                    setExpandedLevelId(isExpanded ? null : lvl.id);
                  } else if (!isUnlocked) {
                    setExpandedLevelId(isExpanded ? null : lvl.id);
                  }
                }}
                className={`flex items-center justify-between p-2.5 select-none ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">
                        {lvl.id}. {botName}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded">
                          {language === 'ru' ? 'В игре' : language === 'tr' ? 'Aktif' : 'Active'}
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-slate-800 text-slate-400 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> {t('locked')}
                        </span>
                      )}
                      {isBeaten && (
                        <span
                          className="text-emerald-400"
                          title={
                            language === 'ru'
                              ? `Пройден (${stat?.wins} побед)`
                              : language === 'tr'
                              ? `Geçildi (${stat?.wins} galibiyet)`
                              : `Beaten (${stat?.wins} wins)`
                          }
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{botRank}</span>
                      <span>•</span>
                      <span className="font-mono text-amber-400 font-semibold">
                        {lvl.elo} {language === 'ru' ? 'Эло' : 'Elo'}
                      </span>
                      {stat && stat.wins > 0 && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          • {stat.wins}{' '}
                          {language === 'ru'
                            ? stat.wins === 1
                              ? 'победа'
                              : 'побед'
                            : language === 'tr'
                            ? 'galibiyet'
                            : stat.wins === 1
                            ? 'win'
                            : 'wins'}
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
                      setExpandedLevelId(isExpanded ? null : lvl.id);
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
                  <p className="text-slate-300 italic">{getLevelDescription(lvl, language)}</p>

                  <div className="grid grid-cols-1 gap-1 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400">{t('typicalMistakes')}: </span>
                      <span className="text-rose-300">{getLevelMistakes(lvl, language)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">{t('coachSupport')}: </span>
                      <span className="text-emerald-300">{getLevelSupport(lvl, language)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">{t('winRequirement')}: </span>
                      <span className="text-amber-300 font-semibold">{getLevelRequirement(lvl, language)}</span>
                    </div>
                  </div>

                  {!isCurrent && isUnlocked && (
                    <button
                      disabled={disabled}
                      onClick={() => onSelectLevel(lvl)}
                      className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded text-xs transition shadow"
                    >
                      {language === 'ru'
                        ? `Играть с этим ботом (${lvl.elo} Эло)`
                        : language === 'tr'
                        ? `Bu botla oyna (${lvl.elo} Elo)`
                        : `Play against ${botName} (${lvl.elo} Elo)`}
                    </button>
                  )}

                  {!isUnlocked && (
                    <div className="w-full mt-2 py-1.5 px-2 bg-slate-800/80 border border-slate-700 text-slate-400 rounded text-center text-[11px] flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {language === 'ru'
                          ? `Победите бота ${getLevelName(CHESS_LEVELS[lvl.id - 2] || CHESS_LEVELS[0], language)}, чтобы открыть`
                          : language === 'tr'
                          ? `Kilidi açmak için ${getLevelName(CHESS_LEVELS[lvl.id - 2] || CHESS_LEVELS[0], language)} botunu yenin`
                          : `Defeat ${getLevelName(CHESS_LEVELS[lvl.id - 2] || CHESS_LEVELS[0], language)} to unlock`}
                      </span>
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
