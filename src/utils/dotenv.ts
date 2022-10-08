export default function getEnv() {
  return {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    AUTH_SCOPE: process.env.AUTH_SCOPE,
    REDIRECT_URI: process.env.REDIRECT_URI,
    COOKIES_VERSION: process.env.COOKIES_VERSION,
  };
}
