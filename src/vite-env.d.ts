/// <reference types="vite/client" />

interface ThemeModuleExport {
  paper: string;
  primaryLight: string;
  primaryMain: string;
  primaryDark: string;
  primary200: string;
  primary800: string;
  secondaryLight: string;
  secondaryMain: string;
  secondaryDark: string;
  secondary200: string;
  secondary800: string;
  successLight: string;
  successMain: string;
  successDark: string;
  errorLight: string;
  errorMain: string;
  errorDark: string;
  warningLight: string;
  warningMain: string;
  warningDark: string;
  orangeLight: string;
  orangeMain: string;
  orangeDark: string;
  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey900: string;
  darkPaper: string;
  darkBackground: string;
  darkLevel1: string;
  darkLevel2: string;
  darkTextPrimary: string;
  darkTextSecondary: string;
  darkTextTitle: string;
  darkPrimaryLight: string;
  darkPrimaryMain: string;
  darkPrimaryDark: string;
  darkPrimary200: string;
  darkPrimary800: string;
  darkSecondaryLight: string;
  darkSecondaryMain: string;
  darkSecondaryDark: string;
  darkSecondary200: string;
  darkSecondary800: string;
}

declare module '*.module.scss' {
  const classes: ThemeModuleExport;
  export default classes;
}
