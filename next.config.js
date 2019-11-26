const withCSS = require('@zeit/next-css');
const path = require('path');
module.exports = withCSS({
  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'ui': path.join(__dirname, 'components/ui')
    };
    config.resolve.modules.unshift(__dirname);
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./polyfills/index.js')) {
        entries['main.js'].unshift('./polyfills/index.js');
      }

      return entries;
    }

    return config;
  },
  publicRuntimeConfig: {
    SITE_URL: process.env.SITE_URI
  }
});
