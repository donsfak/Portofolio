import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr/translation.json';
import en from './locales/en/translation.json';

// Translations are bundled: no extra request, and no raw keys if a fetch fails.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: 'fr', // French unless the visitor already picked English
    supportedLngs: ['fr', 'en'],
    detection: { order: ['localStorage'], caches: ['localStorage'] },
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
