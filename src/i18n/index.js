import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import ar from "./ar/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: "ar", // Default language set to Arabic
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

// Automatic RTL/LTR switching
const setLanguageDirection = (lng) => {
  const isRTL = lng === "ar";
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = lng;
  document.body.dir = isRTL ? "rtl" : "ltr";
};

// Set initial direction
setLanguageDirection(i18n.language);

// Listen for language changes
i18n.on("languageChanged", (lng) => {
  setLanguageDirection(lng);
});

export default i18n;