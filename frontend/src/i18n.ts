import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';
import translationPL from './locales/pl/translation.json';
import translationRO from './locales/ro/translation.json';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  de: { translation: translationDE },
  pl: { translation: translationPL },
  ro: { translation: translationRO },
};

i18n
  .use(LanguageDetector) // detects browser language
  .use(initReactI18next) // passes i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export const languageMap: Record<string, string> = {
  English: 'en',
  French: 'fr',
  German: 'de',
  Polish: 'pl',
  Romanian: 'ro'
};

export default i18n;
