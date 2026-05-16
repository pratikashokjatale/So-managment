import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type PresetColor = 'default' | 'theme1' | 'theme2' | 'theme3' | 'theme4' | 'theme5' | 'theme6';
export type NavType = 'light' | 'dark';
export type Locale = 'en' | 'pnb';

interface ConfigState {
  presetColor: PresetColor;
  navType: NavType;
  locale: Locale;
}

interface ConfigContextValue extends ConfigState {
  setPresetColor: (preset: PresetColor) => void;
  setNavType: (mode: NavType) => void;
  setLocale: (locale: Locale) => void;
}

const defaultConfig: ConfigState = {
  presetColor: 'default',
  navType: 'light',
  locale: 'en',
};

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ConfigState>(() => {
    try {
      const stored = localStorage.getItem('society-management-config');
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ConfigState>;
        return { ...defaultConfig, ...parsed };
      }
    } catch {
      // ignore
    }
    return defaultConfig;
  });

  const setPresetColor = useCallback((presetColor: PresetColor) => {
    setConfig((prev) => {
      const next = { ...prev, presetColor };
      try {
        localStorage.setItem('society-management-config', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setNavType = useCallback((navType: NavType) => {
    setConfig((prev) => {
      const next = { ...prev, navType };
      try {
        localStorage.setItem('society-management-config', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    setConfig((prev) => {
      const next = { ...prev, locale };
      try {
        localStorage.setItem('society-management-config', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value = useMemo<ConfigContextValue>(
    () => ({
      ...config,
      setPresetColor,
      setNavType,
      setLocale,
    }),
    [config, setPresetColor, setNavType, setLocale]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
