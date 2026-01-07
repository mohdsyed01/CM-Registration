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
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

// 🔥 Automatic RTL/LTR switching
document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";

i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;
