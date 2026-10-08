import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-transparent border border-gray-300 dark:border-gray-700 text-xs font-medium rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
    >
      <option value="en">English</option>
      <option value="am">አማርኛ</option>
      <option value="om">Afaan Oromoo</option>
    </select>
  );
};

export default LanguageSwitcher;
