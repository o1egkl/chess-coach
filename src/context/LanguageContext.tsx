import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, isRTL } from '../i18n/types';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'chess_coach_lang';
const VALID_LANGUAGES: Language[] = ['ru', 'en', 'tr', 'he', 'uk', 'es', 'de'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved && VALID_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }
    // Check browser language
    if (typeof navigator !== 'undefined' && navigator.language) {
      const code = navigator.language.toLowerCase();
      if (code.startsWith('he') || code.startsWith('iw')) return 'he';
      if (code.startsWith('uk')) return 'uk';
      if (code.startsWith('es')) return 'es';
      if (code.startsWith('de')) return 'de';
      if (code.startsWith('tr')) return 'tr';
      if (code.startsWith('en')) return 'en';
      if (code.startsWith('ru')) return 'ru';
    }
    return 'ru';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(() => {
    // If user has never selected a language before, show language modal at start of game
    return !localStorage.getItem(STORAGE_LANG_KEY);
  });

  const isRtl = isRTL(language);

  // Sync document RTL direction and lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }
  }, [language, isRtl]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language to localStorage', e);
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[language] || translations.ru;
      let text = dict[key] || translations.en[key] || translations.ru[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
