import { createTheme } from "@mui/material/styles";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";

// RTL cache
export const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// LTR cache
export const ltrCache = createCache({
  key: "muiltr",
  stylisPlugins: [prefixer],
});

// Create theme function
export const getTheme = (direction = "ltr") => {
  return createTheme({
    direction: direction,
    palette: {
      primary: {
        main: "#8279CF",
        light: "#9d95db",
        dark: "#6f66b8",
      },
      secondary: {
        main: "#eae9f4",
      },
      background: {
        default: "#eae9f4",
        paper: "#fafafa",
      },
    },
    typography: {
      fontFamily:
        direction === "rtl"
          ? "'Cairo', 'Tajawal', 'Arial', sans-serif"
          : "'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
    components: {
      MuiTextField: {
        defaultProps: {
          InputLabelProps: {
            sx: {
              right: direction === "rtl" ? 24 : "auto",
              left: direction === "rtl" ? "auto" : 0,
              transformOrigin: direction === "rtl" ? "top right" : "top left",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            transformOrigin: direction === "rtl" ? "top right" : "top left",
            right: direction === "rtl" ? 24 : "auto",
            left: direction === "rtl" ? "auto" : 0,
          },
        },
      },
    },
  });
};