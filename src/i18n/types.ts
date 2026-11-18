export type Language = 'ru' | 'en' | 'tr' | 'he' | 'uk' | 'es' | 'de' | 'fr';

export interface TranslationDictionary {
  [key: string]: string;
}

export const RTL_LANGUAGES: Language[] = ['he'];
export const isRTL = (lang: Language): boolean => RTL_LANGUAGES.includes(lang);
