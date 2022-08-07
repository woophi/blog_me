const path = require('path');
module.exports = {
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'ui': path.join(__dirname, 'components/ui')
    };
    return config;
  },
  publicRuntimeConfig: {
    SITE_URL: process.env.SITE_URI,
  }
};
