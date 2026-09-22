/* eslint-disable react/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Restrict to English and Hindi as requested
  const getInitialLang = () => {
    const saved = localStorage.getItem('krishimitraaz_lang');
    return saved === 'hi' ? 'hi' : 'en';
  };

  const [currentLang, setCurrentLangState] = useState(getInitialLang);

  const setCurrentLang = (lang) => {
    const valid = lang === 'hi' ? 'hi' : 'en';
    setCurrentLangState(valid);
    localStorage.setItem('krishimitraaz_lang', valid);
  };

  useEffect(() => {
    localStorage.setItem('krishimitraaz_lang', currentLang);
  }, [currentLang]);

  // Translation helper function
  const t = (key) => {
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
      t,
      supportedLanguages: [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
      ]
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
