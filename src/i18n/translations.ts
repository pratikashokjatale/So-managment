import { useState, useEffect } from 'react';
import { useConfig, type Locale } from '../contexts/ConfigContext';

const translationCache: Record<string, Record<string, string>> = {};

const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export async function loadLanguage(locale: Locale) {
  if (translationCache[locale]) {
    return;
  }

  try {
    if (locale !== 'en' && !translationCache['en']) {
      const enRes = await fetch('/en.json');
      translationCache['en'] = await enRes.json();
    }

    const res = await fetch(`/${locale}.json`);
    translationCache[locale] = await res.json();

    notifyListeners();
  } catch (error) {
    console.error(`Failed to load translation for locale: ${locale}`, error);
  }
}

export function t(locale: Locale, key: string): string {
  return translationCache[locale]?.[key] ?? translationCache.en?.[key] ?? key;
}

export function useTranslation() {
  const { locale } = useConfig();
  const [, setTick] = useState(0);

  useEffect(() => {
    loadLanguage(locale);

    const listener = () => setTick((t) => t + 1);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, [locale]);

  return {
    t: (key: string) => t(locale, key),
  };
}
