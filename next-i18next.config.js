module.exports = {
  i18n: {
    defaultLocale: 'ru',
    locales: ['en', 'ru', 'cs'],
    ns: ['common'],
    defaultNS: 'common',
    detection: {
      lookupCookie: 'blog_me_lng',
      order: ['cookie', 'header', 'querystring'],
      caches: ['cookie'],
    },
  },
}