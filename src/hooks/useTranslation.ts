import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (ns?: 'common' | 'history') => {
  const { t, i18n } = useI18nTranslation(ns);

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};
