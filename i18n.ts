import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './locales/en.json';
import hi from './locales/hi.json';

const getLanguageCode = () => {
  const locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;
  return locale.split('_')[0].split('-')[0];
};

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLanguageCode() || 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;