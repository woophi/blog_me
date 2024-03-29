export default {
  PORT_CORE: parseInt(process.env.PORT || '3000', 10),
  SITE_URI: process.env.SITE_URI,
  PORT_MONGO: process.env.MONGO_URI || process.env.MONGODB_URI,

  DEV_MODE: process.env.NODE_ENV !== 'production',

  COOKIE_SECRET: process.env.COOKIE_SECRET,

  ACCESS_SECRET: process.env.ACCESS_SECRET,

  // gmail
  GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
  GMAIL_USER: process.env.GMAIL_USER,

  //cloudinary
  FS_CLOUD_NAME: process.env.FS_CLOUD_NAME,
  FS_API_KEY: process.env.FS_API_KEY,
  FS_API_SECRET: process.env.FS_API_SECRET,

  // instagram
  IG_USERNAME: process.env.IG_USERNAME,
  IG_PASSWORD: process.env.IG_PASSWORD,

  //faceebook
  FB_APP_ID: process.env.FB_APP_ID,
  FB_APP_SECRET: process.env.FB_APP_SECRET,

  FB_BOT_SECRET: process.env.FB_BOT_SECRET,
  FB_BOT_TOKEN: process.env.FB_BOT_TOKEN,
  FB_BOT_PAGE_TOKEN: process.env.FB_BOT_PAGE_TOKEN,

  // google
  G_CLIENT_ID: process.env.G_CLIENT_ID,
  G_CLIENT_SECRET: process.env.G_CLIENT_SECRET,

  // vk
  VK_CLIENT_ID: process.env.VK_CLIENT_ID,
  VK_CLIENT_SECRET: process.env.VK_CLIENT_SECRET,
  VK_SERVICE: process.env.VK_SERVICE,

  // hk
  HEROKU_TOKEN: process.env.HEROKU_TOKEN,
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,

  // testfriendship
  FRIENDS_URL: process.env.FRIENDS_URL,
  FRIENDS_API_KEY: process.env.FRIENDS_API_KEY,

  TW_API_KEY: process.env.TW_API_KEY,
  TW_API_SECRET: process.env.TW_API_SECRET,
  TW_ACCESS_TOKEN: process.env.TW_ACCESS_TOKEN,
  TW_ACCESS_TOKEN_SECRET: process.env.TW_ACCESS_TOKEN_SECRET,
};

