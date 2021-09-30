const path = require('path');
const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  future: {
    webpack5: true,
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'ui': path.join(__dirname, 'components/ui')
    };
    // config.resolve.modules.unshift(__dirname);
    // const originalEntry = config.entry;
    // config.entry = async () => {
    //   const entries = await originalEntry();

    //   if (entries['main.js'] && !entries['main.js'].includes('./polyfills/index.js')) {
    //     entries['main.js'].unshift('./polyfills/index.js');
    //   }

    //   return entries;
    // }

    return config;
  },
  publicRuntimeConfig: {
    SITE_URL: process.env.SITE_URI,
  }
};
