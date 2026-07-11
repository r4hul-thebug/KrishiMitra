import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Default to English. User can explicitly set this.
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('krishimitraaz_lang') || 'en');
  
  // The dynamically detected 3rd language (e.g., 'mr', 'ta')
  const [detectedLocalLang, setDetectedLocalLang] = useState(null);

  useEffect(() => {
    localStorage.setItem('krishimitraaz_lang', currentLang);
  }, [currentLang]);

  // Translation helper function
  const t = (key) => {
    // Fallback chain: Requested Lang -> English -> Key string
    if (translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      setCurrentLang, 
      detectedLocalLang, 
      setDetectedLocalLang,
      t,
      availableLangs: translations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
