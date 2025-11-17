import React, { useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";

import { getTheme, rtlCache, ltrCache } from "./styles/CustomTheme";
import CompanyRegistrationPage from "./pages/CompanyRegistration/CompanyRegistrationPage";

function App() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const theme = useMemo(() => getTheme(isRTL ? "rtl" : "ltr"), [isRTL]);
  const cache = isRTL ? rtlCache : ltrCache;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CompanyRegistrationPage />} />
            <Route path="/company-registration" element={<CompanyRegistrationPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;