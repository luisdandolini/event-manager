import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptCommon from "./locales/pt/common.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import heCommon from "./locales/he/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { common: ptCommon },
      en: { common: enCommon },
      es: { common: esCommon },
      he: { common: heCommon },
    },
    fallbackLng: "en",
    supportedLngs: ["pt", "en", "es", "he"],
    defaultNS: "common",
    ns: ["common"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "lang",
    },
  });

export default i18n;
