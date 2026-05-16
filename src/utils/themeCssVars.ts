import type { Palette } from '@mui/material/styles';


export function applyThemeCssVars(palette: Palette | undefined): void {
  if (!palette || typeof document === 'undefined') return;

  const root = document.documentElement;

  const primary = palette.primary as unknown as Record<string, string> | undefined;
  const secondary = palette.secondary as unknown as Record<string, string> | undefined;
  const orange = (palette as unknown as Record<string, { main?: string }>).orange;

  const vars: Record<string, string | undefined> = {
    '--primary-light': palette.primary?.light,
    '--primary-main': palette.primary?.main,
    '--primary-dark': palette.primary?.dark,
    '--primary-200': primary?.['200'],
    '--primary-800': primary?.['800'],
    '--secondary-light': palette.secondary?.light,
    '--secondary-main': palette.secondary?.main,
    '--secondary-dark': palette.secondary?.dark,
    '--secondary-200': secondary?.['200'],
    '--secondary-800': secondary?.['800'],
    '--success-main': palette.success?.main,
    '--error-main': palette.error?.main,
    '--warning-main': palette.warning?.main,
    '--orange-main': orange?.main,
    '--grey-50': palette.grey?.[50],
    '--grey-100': palette.grey?.[100],
    '--grey-200': palette.grey?.[200],
    '--grey-500': palette.grey?.[500],
    '--grey-600': palette.grey?.[600],
    '--grey-700': palette.grey?.[700],
    '--grey-900': palette.grey?.[900],
    '--paper': palette.background?.paper,
    '--background-default': palette.background?.default,
  };

  Object.entries(vars).forEach(([key, value]) => {
    if (value != null) root.style.setProperty(key, value);
  });
}
