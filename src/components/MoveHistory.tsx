import React, { useEffect, useRef } from 'react';
import { MoveClassification, MoveRecord } from '../types/chess';
import { useLanguage } from '../context/LanguageContext';
import { ScrollText } from 'lucide-react';

interface MoveHistoryProps {
  moves: MoveRecord[];
  currentMoveIndex: number;
}

interface BadgeConfig {
  label: string;
  textColor: string;
  badgeBg: string;
  titleKey: string;
  defaultTitle: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, currentMoveIndex }) => {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (turns)
  const turns: { turnNumber: number; white?: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    turns.push({
      turnNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  // Auto-scroll to bottom on new move
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moves.length]);

  const getAnnotationBadge = (classification?: MoveClassification): BadgeConfig | null => {
    if (!classification) return null;

    switch (classification) {
      case '!!':
        return {
          label: '!!',
          textColor: 'text-cyan-300 font-bold',
          badgeBg: 'bg-cyan-500/25 border-cyan-400/60 text-cyan-200 shadow-sm shadow-cyan-500/25',
          titleKey: 'classificationBrilliant',
          defaultTitle: 'Блестящий ход (!!)',
        };
      case '!':
        return {
          label: '!',
          textColor: 'text-emerald-300 font-semibold',
          badgeBg: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200',
          titleKey: 'classificationBest',
          defaultTitle: 'Сильный ход (!)',
        };
      case 'book':
        return {
          label: '📖',
          textColor: 'text-purple-300',
          badgeBg: 'bg-purple-500/20 border-purple-400/50 text-purple-200',
          titleKey: 'classificationBook',
          defaultTitle: 'Дебютная теория',
        };
      case '?!':
        return {
          label: '?!',
          textColor: 'text-amber-300',
          badgeBg: 'bg-amber-500/20 border-amber-400/50 text-amber-200',
          titleKey: 'classificationInaccuracy',
          defaultTitle: 'Слабый ход / неточность (?!)',
        };
      case '?':
        return {
          label: '?',
          textColor: 'text-orange-300 font-semibold',
          badgeBg: 'bg-orange-500/25 border-orange-400/60 text-orange-200',
          titleKey: 'classificationMistake',
          defaultTitle: 'Опасный ход / ошибка (?)',
        };
      case '??':
        return {
          label: '??',
          textColor: 'text-rose-300 font-extrabold',
          badgeBg: 'bg-rose-500/30 border-rose-500/70 text-rose-200 shadow-sm shadow-rose-500/25 animate-pulse font-black',
          titleKey: 'classificationBlunder',
          defaultTitle: 'Глупый ход / зевок (??)',
        };
      default:
        return null;
    }
  };

  const renderMoveCell = (move: MoveRecord | undefined, moveIdx: number) => {
    if (!move) return <div className="px-1.5 py-0.5" />;

    const badge = getAnnotationBadge(move.annotation);
    const isSelected = currentMoveIndex === moveIdx;

    return (
      <div
        title={badge ? t(badge.titleKey) || badge.defaultTitle : move.san}
        className={`px-1.5 py-0.5 rounded transition flex items-center justify-between gap-1 group ${
          isSelected
            ? 'bg-slate-700/80 ring-1 ring-emerald-400/70 font-bold'
            : 'hover:bg-slate-700/40'
        }`}
      >
        <span className={`truncate ${badge ? badge.textColor : 'text-slate-200 group-hover:text-white'}`}>
          {move.san}
        </span>
        {badge && (
          <span
            className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded border leading-none shrink-0 ${badge.badgeBg}`}
          >
            {badge.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-xl flex flex-col h-[200px] md:h-[260px]">
      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-700/60 text-xs font-bold text-slate-300 shrink-0">
        <ScrollText className="w-4 h-4 text-emerald-400" />
        <span>
          {t('pgnNotation')}
        </span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto my-2 space-y-0.5 text-xs font-mono pr-1 custom-scrollbar"
      >
        {turns.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-[11px]">
            {t('gameNotStartedYet')}
          </div>
        ) : (
          turns.map((turn) => {
            const whiteIdx = (turn.turnNumber - 1) * 2;
            const blackIdx = whiteIdx + 1;

            return (
              <div
                key={turn.turnNumber}
                className="grid grid-cols-[32px_1fr_1fr] items-center py-0.5 px-1 rounded hover:bg-slate-700/20 text-slate-300"
              >
                {/* Turn number */}
                <span className="text-slate-500 font-semibold select-none text-[11px]">
                  {turn.turnNumber}.
                </span>

                {/* White move */}
                {renderMoveCell(turn.white, whiteIdx)}

                {/* Black move */}
                {renderMoveCell(turn.black, blackIdx)}
              </div>
            );
          })
        )}
      </div>

      {/* Move Quality Legend */}
      <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[9px] text-slate-400 font-mono px-0.5 shrink-0 select-none">
        <span className="flex items-center gap-0.5 text-cyan-300" title={t('classificationBrilliant') || 'Блестящий (!!)'}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />!!
        </span>
        <span className="flex items-center gap-0.5 text-emerald-300" title={t('classificationBest') || 'Лучший (!)'}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />!
        </span>
        <span className="flex items-center gap-0.5 text-purple-300" title={t('classificationBook') || 'Теория'}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />📖
        </span>
        <span className="flex items-center gap-0.5 text-amber-300" title={t('classificationInaccuracy') || 'Неточность (?!)'}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />?!
        </span>
        <span className="flex items-center gap-0.5 text-orange-300" title={t('classificationMistake') || 'Ошибка (?)'}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />?
        </span>
        <span className="flex items-center gap-0.5 text-rose-300" title={t('classificationBlunder') || 'Грубая ошибка (??)'}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />??
        </span>
      </div>
    </div>
  );
};
