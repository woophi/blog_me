import NextI18Next, { InitConfig } from 'next-i18next';
import { VisitorCookie } from '../models';

const options: InitConfig = {
  defaultLanguage: 'en',
  fallbackLng: 'en',
  load: 'languageOnly', // we only provide en, de -> no region specific locals like en-US, de-DE
  otherLanguages: ['ru', 'cs'],
  // have a common namespace used around the full app
  ns: ['common', 'server'],
  defaultNS: 'common',

  debug: false, //process.env.NODE_ENV !== 'production',
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase()
        return value
    }
  },
  detection: {
    lookupCookie: VisitorCookie.Lang,
    order: ['cookie', 'header', 'querystring'],
    caches: ['cookie'],
  },
  react: {
    useSuspense: false
  },
  localePath: 'locales'
};

const i18n = new NextI18Next(options);

export const appWithTranslation = i18n.appWithTranslation;
export const useTranslation = i18n.useTranslation;
export const i18next = i18n.i18n;
export const withTranslation = i18n.withTranslation;

export default i18n;
