import { useCallback, useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './LanguageContextValue';
import { translateText } from '../i18n/translations';

const textLikeAttributes = ['placeholder', 'aria-label', 'title', 'alt'];

const shouldSkipNode = (node) => {
  const parent = node.parentElement;
  if (!parent) return true;
  const tagName = parent.tagName?.toLowerCase();
  return ['script', 'style', 'code', 'pre', 'textarea'].includes(tagName);
};

const translateTextNode = (node, language) => {
  if (shouldSkipNode(node)) return;
  const original = node.__techproOriginalText ?? node.nodeValue;
  node.__techproOriginalText = original;
  const translated = translateText(original, language);
  if (translated !== node.nodeValue) {
    node.nodeValue = translated;
  }
};

const translateAttributes = (element, language) => {
  textLikeAttributes.forEach((attribute) => {
    if (!element.hasAttribute(attribute)) return;
    const dataKey = `i18nOriginal${attribute.replace(/(^|-)(\w)/g, (_, __, char) => char.toUpperCase())}`;
    const original = element.dataset[dataKey] ?? element.getAttribute(attribute);
    element.dataset[dataKey] = original;
    element.setAttribute(attribute, translateText(original, language));
  });
};

const translateDom = (language) => {
  const root = document.getElementById('root');
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let current = walker.nextNode();
  while (current) {
    if (current.nodeValue?.trim()) {
      textNodes.push(current);
    }
    current = walker.nextNode();
  }

  textNodes.forEach((node) => translateTextNode(node, language));
  root.querySelectorAll('*').forEach((element) => translateAttributes(element, language));
  document.documentElement.lang = language === 'vi' ? 'vi' : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('techpro_language') || 'en');

  useEffect(() => {
    localStorage.setItem('techpro_language', language);
    window.setTimeout(() => translateDom(language), 0);

    const observer = new MutationObserver(() => {
      window.setTimeout(() => translateDom(language), 0);
    });

    const root = document.getElementById('root');
    if (root) {
      observer.observe(root, {
        childList: true,
        subtree: true
      });
    }

    return () => observer.disconnect();
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((current) => (current === 'en' ? 'vi' : 'en'));
  }, []);

  const translate = useCallback((value) => translateText(value, language), [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    translate
  }), [language, toggleLanguage, translate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
