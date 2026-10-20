import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { english } from './translations';

export const languageStorageKey = 'carlos-language';
const LanguageContext = createContext(null);

export function readLanguage() {
  try { return localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'pt'; }
  catch { return 'pt'; }
}

export function translate(text, language) {
  return language === 'en' && typeof text === 'string' ? (english[text] ?? text) : text;
}

// Translate display text while keeping project IDs, links and filter values stable.
export function localizeContent(value, language) {
  if (Array.isArray(value)) return value.map(item => localizeContent(item, language));
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, localizeContent(item, language)])
  );
  return translate(value, language);
}

export function applyLanguage(language) {
  const t = text => translate(text, language);
  document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
  document.documentElement.dataset.language = language;
  document.title = t('Carlos Eduardo | Desenvolvedor C# e .NET');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('Carlos Eduardo, desenvolvedor C# e .NET. Conheça meus projetos, minha trajetória e minha experiência com APIs, Docker, bancos de dados e computação em nuvem.'));
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', t('Projetos, código e uma trajetória em desenvolvimento, cloud e dados.'));
  try { localStorage.setItem(languageStorageKey, language); } catch {}
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readLanguage);
  const t = useMemo(() => text => translate(text, language), [language]);

  useEffect(() => { applyLanguage(language); }, [language]);

  const value = useMemo(() => ({ language, t, toggleLanguage: () => setLanguage(current => current === 'pt' ? 'en' : 'pt') }), [language, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage requires LanguageProvider');
  return context;
}
