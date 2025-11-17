import React from "react";
import { Box, Card } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../buttons/LanguageSwitcher";

export default function MainLayout({ children }) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar' || i18n.dir() === 'rtl';

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#eae9f4ff",
        p: 4,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Language Switch */}
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: isRTL ? "flex-start" : "flex-end", 
          mb: 3 
        }}
      >
        <LanguageSwitcher />
      </Box>

      {/* Main centered background card */}
      <Card
        sx={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 4,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "#fafafaff",
        }}
      >
        {children}
      </Card>
    </Box>
  );
}