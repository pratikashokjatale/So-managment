import { useMemo, useEffect } from "react";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import {
  ThemeProvider,
  createTheme,
  type ThemeOptions,
} from "@mui/material/styles";
import { useConfig } from "../contexts/ConfigContext";
import { buildPalette } from "./palette";
import typography from "./typography";
import { applyThemeCssVars } from "../utils/themeCssVars";

interface ThemeCustomizationProps {
  children: React.ReactNode;
}

export default function ThemeCustomization({
  children,
}: ThemeCustomizationProps) {
  const { navType, presetColor } = useConfig();

  const palette = useMemo(
    () => buildPalette(navType, presetColor),
    [navType, presetColor],
  );

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette,
      typography,
      shape: { borderRadius: 8 },
      mixins: {
        toolbar: { minHeight: 56, paddingLeft: 16, paddingRight: 16 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { borderRadius: 8, fontWeight: 600, textTransform: "none" },
            contained: {
              boxShadow: "none",
              "&:hover": { boxShadow: "0 2px 8px rgba(25, 118, 210, 0.35)" },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: { borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
          },
        },
      },
    }),
    [palette],
  );

  const theme = useMemo(() => createTheme(themeOptions), [themeOptions]);

  useEffect(() => {
    applyThemeCssVars(theme.palette);
  }, [theme.palette]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
