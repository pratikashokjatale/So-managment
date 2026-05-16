import { createTheme } from '@mui/material/styles';
import defaultColors from '../assets/scss/_themes-vars.module.scss';
import theme1Colors from '../assets/scss/_theme1.module.scss';
import theme2Colors from '../assets/scss/_theme2.module.scss';
import theme3Colors from '../assets/scss/_theme3.module.scss';
import theme4Colors from '../assets/scss/_theme4.module.scss';
import theme5Colors from '../assets/scss/_theme5.module.scss';
import theme6Colors from '../assets/scss/_theme6.module.scss';
import type { NavType, PresetColor } from '../contexts/ConfigContext';

type ThemeModule = typeof defaultColors;

const THEME_MAP: Record<PresetColor, ThemeModule> = {
  default: defaultColors,
  theme1: theme1Colors as ThemeModule,
  theme2: theme2Colors as ThemeModule,
  theme3: theme3Colors as ThemeModule,
  theme4: theme4Colors as ThemeModule,
  theme5: theme5Colors as ThemeModule,
  theme6: theme6Colors as ThemeModule,
};

function getColors(preset: PresetColor): ThemeModule {
  return THEME_MAP[preset] ?? defaultColors;
}

export function buildPalette(navType: NavType, presetColor: PresetColor) {
  const c = getColors(presetColor);
  const isDark = navType === 'dark';

  return createTheme({
    palette: {
      mode: navType,
      primary: {
        light: isDark ? c.darkPrimaryLight : c.primaryLight,
        main: isDark ? c.darkPrimaryMain : c.primaryMain,
        dark: isDark ? c.darkPrimaryDark : c.primaryDark,
        contrastText: '#ffffff',
        ...(isDark ? { 200: c.darkPrimary200, 800: c.darkPrimary800 } : { 200: c.primary200, 800: c.primary800 }),
      },
      secondary: {
        light: isDark ? c.darkSecondaryLight : c.secondaryLight,
        main: isDark ? c.darkSecondaryMain : c.secondaryMain,
        dark: isDark ? c.darkSecondaryDark : c.secondaryDark,
        contrastText: '#ffffff',
        ...(isDark ? { 200: c.darkSecondary200, 800: c.darkSecondary800 } : { 200: c.secondary200, 800: c.secondary800 }),
      },
      background: {
        default: isDark ? c.darkPaper : c.paper,
        paper: isDark ? c.darkLevel2 : c.paper,
      },
      text: {
        primary: isDark ? c.darkTextPrimary : c.grey700,
        secondary: isDark ? c.darkTextSecondary : c.grey500,
        disabled: c.grey300,
      },
      divider: isDark ? c.darkTextPrimary : c.grey200,
      success: { light: c.successLight, main: c.successMain, dark: c.successDark },
      error: { light: c.errorLight, main: c.errorMain, dark: c.errorDark },
      warning: { light: c.warningLight, main: c.warningMain, dark: c.warningDark },
      grey: {
        50: c.grey50,
        100: c.grey100,
        200: c.grey200,
        300: c.grey300,
        500: isDark ? c.darkTextSecondary : c.grey500,
        600: isDark ? c.darkTextTitle : c.grey600,
        700: isDark ? c.darkTextPrimary : c.grey700,
        900: isDark ? c.darkTextPrimary : c.grey900,
      },
    },
  }).palette;
}
