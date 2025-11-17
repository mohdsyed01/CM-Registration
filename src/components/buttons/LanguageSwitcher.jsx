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
      variant="outlined"
      onClick={toggleLang}
      startIcon={<LanguageIcon />}
      sx={{ 
        textTransform: "none", 
        fontWeight: "bold",
        borderColor: "#8279CF",
        color: "#8279CF",
        px: 3,
        py: 1,
        borderRadius: "20px",
        "&:hover": {
          borderColor: "#6f66b8",
          backgroundColor: "rgba(130, 121, 207, 0.08)",
        },
      }}
    >
      {i18n.language === "ar" ? "English" : "عربي"}
    </Button>
  );
}