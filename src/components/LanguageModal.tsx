import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/types';
import { Globe, Check, Sparkles } from 'lucide-react';

interface LanguageOption {
  code: Language;
  flag: string;
  name: string;
  nativeDesc: string;
  badge?: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ru', flag: '🇷🇺', name: 'Русский', nativeDesc: 'Интерфейс, тренер и подсказки' },
  { code: 'en', flag: '🇬🇧', name: 'English', nativeDesc: 'Interface, coach & hints' },
  { code: 'he', flag: '🇮🇱', name: 'עברית', nativeDesc: 'ממשק, מאמן שחמט ורמזים', badge: 'RTL' },
  { code: 'uk', flag: '🇺🇦', name: 'Українська', nativeDesc: 'Інтерфейс, тренер і підказки' },
  { code: 'es', flag: '🇪🇸', name: 'Español', nativeDesc: 'Interfaz, entrenador y pistas' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', nativeDesc: 'Oberfläche, Trainer und Hinweise' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe', nativeDesc: 'Arayüz, antrenör ve ipuçları' },
];

export const LanguageModal: React.FC = () => {
  const { language, setLanguage, t, isLanguageModalOpen, setIsLanguageModalOpen, isRtl } = useLanguage();

  if (!isLanguageModalOpen) return null;

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const handleConfirm = () => {
    setIsLanguageModalOpen(false);
  };

  const getSubtitle = () => {
    switch (language) {
      case 'he':
        return 'ניתן לשנות את השפה בכל רגע דרך סרגל הכלים העליון.';
      case 'uk':
        return 'Ви можете змінити мову в будь-який момент у верхньому меню.';
      case 'es':
        return 'Puedes cambiar el idioma en cualquier momento desde la barra superior.';
      case 'de':
        return 'Du kannst die Sprache jederzeit in der oberen Menüleiste ändern.';
      case 'tr':
        return 'Dili dilediğiniz zaman üst menüden değiştirebilirsiniz.';
      case 'ru':
        return 'Вы сможете изменить язык в любой момент в верхнем меню.';
      case 'en':
      default:
        return 'You can change the language anytime from the top navigation bar.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 text-slate-100 flex flex-col max-h-[90vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Glow decoration */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 mb-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 truncate">
              <span>{t('chooseLanguage')}</span>
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
              7 Languages Available / 7 языков / 7 שפות זמינות
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed flex-shrink-0">
          {getSubtitle()}
        </p>

        {/* Language Options Grid (2 columns on sm/desktop, 1 or 2 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto custom-scrollbar pr-1 mb-5 flex-1 min-h-0">
          {LANGUAGE_OPTIONS.map((opt) => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelectLanguage(opt.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
                style={opt.code === 'he' ? { direction: 'rtl', textAlign: 'right' } : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0" role="img" aria-label={opt.name}>
                    {opt.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      <span className="truncate">{opt.name}</span>
                      {opt.badge && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                      {opt.nativeDesc}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow flex-shrink-0 ml-2">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Confirm Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] font-bold text-xs sm:text-sm text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>{t('saveLanguage')}</span>
        </button>
      </div>
    </div>
  );
};
