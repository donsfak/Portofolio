import { useTranslation } from 'react-i18next';
import type { Localized } from '../data/portfolio';

/** Returns a function picking the current language's text from a { fr, en } value. */
export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';
  return (text: Localized) => text[lang];
}
