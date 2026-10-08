import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { languages, translations } from "../data/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const dict = translations[language] ?? translations.en;

    const t = (key) => {
      return key.split(".").reduce((acc, part) => acc?.[part], dict) ?? key;
    };

    return {
      language,
      setLanguage,
      languages,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
