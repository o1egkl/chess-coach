import React, { useEffect, useRef } from 'react';
import { MoveRecord } from '../types/chess';
import { useLanguage } from '../context/LanguageContext';
import { ScrollText } from 'lucide-react';

interface MoveHistoryProps {
  moves: MoveRecord[];
  currentMoveIndex: number;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, currentMoveIndex }) => {
  const { language } = useLanguage();
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

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-xl flex flex-col h-[200px] md:h-[260px]">
      <div className="flex items-center gap-1.5 pb-2 border-b border-slate-700/60 text-xs font-bold text-slate-300">
        <ScrollText className="w-4 h-4 text-emerald-400" />
        <span>{language === 'en' ? 'Move History (PGN)' : 'Нотация партии (PGN)'}</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto mt-2 space-y-0.5 text-xs font-mono pr-1 custom-scrollbar"
      >
        {turns.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-[11px]">
            {language === 'en' ? 'Game has not started yet' : 'Партия еще не началась'}
          </div>
        ) : (
          turns.map((turn) => {
            const whiteIdx = (turn.turnNumber - 1) * 2;
            const blackIdx = whiteIdx + 1;

            return (
              <div
                key={turn.turnNumber}
                className="grid grid-cols-[36px_1fr_1fr] items-center py-1 px-1.5 rounded hover:bg-slate-700/30 text-slate-300"
              >
                {/* Turn number */}
                <span className="text-slate-500 font-semibold select-none text-[11px]">
                  {turn.turnNumber}.
                </span>

                {/* White move */}
                <div
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                    currentMoveIndex === whiteIdx
                      ? 'bg-emerald-500/30 text-emerald-300 font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  <span>{turn.white?.san}</span>
                  {turn.white?.annotation && (
                    <span className="ml-1 text-[10px] text-amber-400 font-bold">
                      {turn.white.annotation}
                    </span>
                  )}
                </div>

                {/* Black move */}
                <div
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                    currentMoveIndex === blackIdx
                      ? 'bg-emerald-500/30 text-emerald-300 font-bold'
                      : 'hover:text-white'
                  }`}
                >
                  <span>{turn.black?.san || ''}</span>
                  {turn.black?.annotation && (
                    <span className="ml-1 text-[10px] text-amber-400 font-bold">
                      {turn.black.annotation}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
