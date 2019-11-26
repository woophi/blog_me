

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
  FB_APP_SECRET: process.env.FB_APP_SECRET
}
