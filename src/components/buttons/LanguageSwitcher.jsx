import React from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLang = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="contained"
      onClick={toggleLang}
      startIcon={<LanguageIcon />}
      sx={{
        textTransform: "none",
        fontWeight: "600",
        fontSize: "21px",          // ← increased text size
        px: 3.5,
        py: 1.5,
        borderRadius: "10px",
        backgroundColor: "#ffffffff",
        color: "#1d4a6d",
        boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.22)",

        "& .MuiSvgIcon-root": {
          color: "#1d4a6d",
          fontSize: "29px",       // ← larger icon too (optional)
        },

        "&:hover": {
          backgroundColor: "#ffffffff",
          boxShadow: "0px 6px 18px rgba(250, 248, 248, 0.29)",
        }
      }}
    >
      {i18n.language === "ar" ? "English" : "عربي"}
    </Button>
  );
}
