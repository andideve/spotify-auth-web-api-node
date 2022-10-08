import { Response } from 'express';

const OPTIONS = 'Path=/;SameSite=Strict;Secure;HttpOnly';

interface Options {
  accessToken: string;
  refreshToken: string;
  /** Number in seconds */
  expiresIn: number;
  cookiesVersion?: string | number;
  /**
   * Number in seconds, set for `refreshToken` and `cookiesVersion`.
   * Same as `expiresIn` by default.
   */
  longExpiresIn?: number;
}

function createExpires(seconds: number) {
  const date = new Date();
  date.setTime(date.getTime() + seconds * 1000);

  return date.toUTCString();
}

export default function setCookies(
  res: Response,
  { accessToken, refreshToken, expiresIn, cookiesVersion, longExpiresIn }: Options,
) {
  const accessTokenExpires = createExpires(expiresIn);
  const longExpires = longExpiresIn ? createExpires(longExpiresIn) : accessTokenExpires;
  const cookies = [
    `access_token=${accessToken};${OPTIONS};Expires=${accessTokenExpires}`,
    `refresh_token=${refreshToken};${OPTIONS};Expires=${longExpires}`,
  ];
  if (cookiesVersion) {
    cookies.push(`cookies_version=${cookiesVersion};${OPTIONS};Expires=${longExpires}`);
  }

  res.setHeader('Set-Cookie', cookies);
}
