# SCSS themes & dynamic CSS (Society Management)

## Structure

- **style.scss** – Main entry; imports theme vars, dynamic vars, and custom styles.
- **_themes-vars.module.scss** – Default theme (blue & white). SCSS variables + `:export` for JS.
- **_theme1.module.scss** – Theme 1: blue grey & teal.
- **_theme2.module.scss** – Theme 2: teal & orange.
- **_theme3.module.scss** – Theme 3: teal & orange (variant).
- **_theme4.module.scss** – Theme 4: navy & teal.
- **_theme5.module.scss** – Theme 5: navy & mint.
- **_theme6.module.scss** – Theme 6: indigo.
- **_dynamic-vars.scss** – CSS custom properties on `:root`. Fallbacks only; values are set from TS when theme changes.
- **_custom.scss** – Shared UI (spinner, form button loading, form labels). Uses `var(--primary-main)` etc. so it follows the active theme.

## All theme options

| Preset    | Description        |
|----------|--------------------|
| default  | Blue & white       |
| theme1   | Blue grey & teal   |
| theme2   | Teal & orange      |
| theme3   | Teal & orange      |
| theme4   | Navy & teal        |
| theme5   | Navy & mint        |
| theme6   | Indigo             |

## Multiple themes (dynamic option)

1. **Preset switch** – `useConfig()` exposes `presetColor` (`'default' | 'theme1' | ... | 'theme6'`) and `setPresetColor()`. Changing it swaps the MUI palette and updates CSS variables.
2. **Adding a theme** – Add `_themeN.module.scss` with the same variable + `:export` shape, add to `PresetColor` in `ConfigContext`, import in `theme/palette.ts` and add to `THEME_MAP`.
3. **Dynamic CSS** – `utils/themeCssVars.ts` writes the active palette to `document.documentElement` (e.g. `--primary-main`). Use in any CSS/SCSS: `color: var(--primary-main);`.

## Usage in components

- **MUI** – Use `theme.palette` (e.g. `sx={{ color: 'primary.main' }}`). It already comes from the active preset.
- **Plain CSS/SCSS** – Use `var(--primary-main)`, `var(--grey-600)`, etc. so styles stay in sync when the user switches theme.
