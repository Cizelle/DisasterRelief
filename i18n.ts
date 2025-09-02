import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './locales/en.json';
import hi from './locales/hi.json';

const getLanguageCode = () => {
  let locale: string | null | undefined;

  if (Platform.OS === 'ios') {
    locale =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else {
    locale = NativeModules.I18nManager.localeIdentifier;
  }

  // Handle case where locale is undefined or null
  if (locale) {
    const parts = locale.split(/[-_]/);
    return parts[0].toLowerCase();
  }

  // Fallback to a default language
  return 'en';
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
    lng: getLanguageCode(),
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;