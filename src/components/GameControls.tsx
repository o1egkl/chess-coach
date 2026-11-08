import React from 'react';
import { Color, BoardTheme } from '../types/chess';
import { Language } from '../i18n/types';
import { useLanguage } from '../context/LanguageContext';
import { RotateCcw, Volume2, VolumeX, RefreshCw, Palette, Undo2 } from 'lucide-react';

interface GameControlsProps {
  playerColor: Color;
  onSelectColor: (color: Color) => void;
  onNewGame: () => void;
  onTakeback: () => void;
  canTakeback: boolean;
  onFlipBoard: () => void;
  theme: BoardTheme;
  onSelectTheme: (theme: BoardTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isBotThinking: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  playerColor,
  onSelectColor,
  onNewGame,
  onTakeback,
  canTakeback,
  onFlipBoard,
  theme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  isBotThinking,
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-xl space-y-3">
      {/* Primary Actions: New Game & Takeback */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onNewGame}
          disabled={isBotThinking}
          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('newGame')}</span>
        </button>

        <button
          onClick={onTakeback}
          disabled={!canTakeback || isBotThinking}
          className="py-2.5 px-3 bg-slate-700 hover:bg-slate-650 active:bg-slate-800 disabled:opacity-40 text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition border border-slate-600"
        >
          <Undo2 className="w-4 h-4" />
          <span>{t('takeback')}</span>
        </button>
      </div>

      {/* Color Selection & Board Flip */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-700/50">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1">
            {language === 'ru' ? 'Играть за:' : language === 'tr' ? 'Renk:' : 'Play as:'}
          </span>
          <button
            onClick={() => onSelectColor('white')}
            className={`w-7 h-7 rounded-md font-bold text-sm border flex items-center justify-center transition ${
              playerColor === 'white'
                ? 'bg-slate-100 text-slate-900 border-emerald-400 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={language === 'ru' ? 'Играть белыми' : language === 'tr' ? 'Beyaz ile Oyna' : 'Play White'}
          >
            ♔
          </button>
          <button
            onClick={() => onSelectColor('black')}
            className={`w-7 h-7 rounded-md font-bold text-sm border flex items-center justify-center transition ${
              playerColor === 'black'
                ? 'bg-slate-900 text-slate-100 border-emerald-400 shadow ring-1 ring-emerald-400'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={language === 'ru' ? 'Играть черными' : language === 'tr' ? 'Siyah ile Oyna' : 'Play Black'}
          >
            ♚
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onFlipBoard}
            className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={language === 'ru' ? 'Перевернуть доску' : language === 'tr' ? 'Tahtayı Çevir' : 'Flip board'}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title={soundEnabled ? t('soundOff') : t('soundOn')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Board Theme Selector */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'ru' ? 'Тема доски:' : language === 'tr' ? 'Tema:' : 'Theme:'}</span>
        </div>
        <div className="flex items-center gap-1">
          {(['green', 'wood', 'blue', 'graphite'] as BoardTheme[]).map((thm) => {
            const labels: Record<BoardTheme, Record<Language, string>> = {
              green: { ru: 'Турнир', en: 'Green', tr: 'Yeşil' },
              wood: { ru: 'Дерево', en: 'Wood', tr: 'Ahşap' },
              blue: { ru: 'Синий', en: 'Blue', tr: 'Mavi' },
              graphite: { ru: 'Графит', en: 'OLED', tr: 'Grafit' },
            };
            return (
              <button
                key={thm}
                onClick={() => onSelectTheme(thm)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition uppercase ${
                  theme === thm
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {labels[thm][language] || labels[thm].ru}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
