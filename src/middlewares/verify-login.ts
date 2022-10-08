import { Handler } from 'express';

import getEnv from '../utils/dotenv';
import { getCookies } from '../utils/cookies';

const verifyLogin: Handler = (req, res, next) => {
  const { COOKIES_VERSION } = getEnv();
  const { accessToken, cookiesVersion } = getCookies(req);
  if (cookiesVersion === COOKIES_VERSION && accessToken !== undefined) {
    next();
    return;
  }

  res.status(401).json({ message: 'Unauthorized' });
};

export default verifyLogin;
