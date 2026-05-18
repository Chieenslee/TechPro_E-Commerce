import { createContext } from 'react';

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  translate: (value) => value
});
