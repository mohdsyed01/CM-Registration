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
        fontWeight: 600,
        fontSize: { xs: "10px", sm: "11px", md: "12px" },
        px: { xs: 1.5, sm: 2, md: 2.5 },
        py: { xs: 0.6, sm: 0.75, md: 0.9 },
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#1d4a6d",
        boxShadow: "0px 2px 8px rgba(255, 255, 255, 0.2)",
        minWidth: "auto",

        "& .MuiSvgIcon-root": {
          color: "#1d4a6d",
          fontSize: { xs: "16px", sm: "18px", md: "20px" },
        },

        "&:hover": {
          backgroundColor: "#f5f5f5",
          boxShadow: "0px 4px 12px rgba(250, 248, 248, 0.25)",
        }
      }}
    >
      {i18n.language === "ar" ? "English" : "عربي"}
    </Button>
  );
}