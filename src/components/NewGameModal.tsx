import React from 'react';
import { ColorChoice } from '../types/chess';
import { useLanguage } from '../context/LanguageContext';
import { X, Dices } from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (choice: ColorChoice) => void;
  botName: string;
  botElo: number;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  onSelectColor,
  botName,
  botElo,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-3 text-2xl">
            ♟
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t('newGame')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ru'
              ? `Противник: ${botName} (${botElo} Эло)`
              : language === 'tr'
              ? `Rakip: ${botName} (${botElo} Elo)`
              : `Opponent: ${botName} (${botElo} Elo)`}
          </p>
          <p className="text-sm font-semibold text-slate-200 mt-3">
            {t('chooseColor')}
          </p>
        </div>

        {/* 3 Color Options */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* White */}
          <button
            onClick={() => onSelectColor('white')}
            className="group flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:bg-slate-700 border border-slate-700 hover:border-emerald-400/80 transition-all duration-150 transform hover:-translate-y-0.5 shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-3xl text-slate-900 font-bold shadow-md mb-2.5 group-hover:scale-110 transition-transform">
              ♔
            </div>
            <span className="text-sm font-bold text-white">
              {t('playWhite')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 text-center leading-tight">
              {t('playWhiteDesc')}
            </span>
          </button>

          {/* Random */}
          <button
            onClick={() => onSelectColor('random')}
            className="group flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:bg-slate-700 border border-slate-700 hover:border-cyan-400/80 transition-all duration-150 transform hover:-translate-y-0.5 shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-900 flex items-center justify-center text-2xl text-cyan-300 font-bold shadow-md mb-2.5 group-hover:scale-110 transition-transform">
              <Dices className="w-7 h-7 text-white drop-shadow" />
            </div>
            <span className="text-sm font-bold text-white">
              {t('playRandom')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 text-center leading-tight">
              {t('playRandomDesc')}
            </span>
          </button>

          {/* Black */}
          <button
            onClick={() => onSelectColor('black')}
            className="group flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:bg-slate-700 border border-slate-700 hover:border-emerald-400/80 transition-all duration-150 transform hover:-translate-y-0.5 shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-3xl text-white font-bold shadow-md mb-2.5 group-hover:scale-110 transition-transform">
              ♚
            </div>
            <span className="text-sm font-bold text-white">
              {t('playBlack')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 text-center leading-tight">
              {t('playBlackDesc')}
            </span>
          </button>
        </div>

        {/* Footer Hint */}
        <p className="text-[11px] text-slate-400 text-center">
          {language === 'ru'
            ? 'При выборе Чёрных или Random бот сразу начнёт партию ходом белых.'
            : language === 'tr'
            ? 'Siyah veya Rastgele seçildiğinde bot hemen beyaz ile ilk hamleyi yapar.'
            : 'Choosing Black or Random will make the bot start immediately as White.'}
        </p>
      </div>
    </div>
  );
};
