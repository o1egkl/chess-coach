import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/types';
import { Globe, Check, Sparkles } from 'lucide-react';

export const LanguageModal: React.FC = () => {
  const { language, setLanguage, t, isLanguageModalOpen, setIsLanguageModalOpen } = useLanguage();

  if (!isLanguageModalOpen) return null;

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const handleConfirm = () => {
    setIsLanguageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Glow decoration */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>{t('chooseLanguage')}</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h2>
            <p className="text-xs text-slate-400">
              Выберите язык / Select your language
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          {language === 'ru'
            ? 'Вы сможете изменить язык в любой момент в верхнем меню.'
            : 'You can change the language anytime from the top navigation bar.'}
        </p>

        {/* Language Options */}
        <div className="space-y-3 mb-6">
          {/* Russian Option */}
          <button
            type="button"
            onClick={() => handleSelectLanguage('ru')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
              language === 'ru'
                ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-md'
                : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl" role="img" aria-label="Russian Flag">
                🇷🇺
              </span>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Русский</span>
                  {language === 'ru' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      Активен
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Интерфейс, тренер, подсказки и правила
                </div>
              </div>
            </div>
            {language === 'ru' && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => handleSelectLanguage('en')}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
              language === 'en'
                ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/30 shadow-md'
                : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl" role="img" aria-label="UK Flag">
                🇬🇧
              </span>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>English</span>
                  {language === 'en' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Interface, chess coach, hints and rules
                </div>
              </div>
            </div>
            {language === 'en' && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] font-bold text-sm text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
        >
          <span>{t('saveLanguage')}</span>
        </button>
      </div>
    </div>
  );
};
