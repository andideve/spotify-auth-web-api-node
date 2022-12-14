import { Request, Response } from 'express';

const OPTIONS = 'Path=/;SameSite=Strict;Secure;HttpOnly';

interface Cookies {
  accessToken: string;
  refreshToken?: string;
  cookiesVersion?: string | number;
}

interface Options extends Cookies {
  /** Number in seconds */
  expiresIn: number;
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

export function setCookies(
  res: Response,
  { accessToken, expiresIn, refreshToken, cookiesVersion, longExpiresIn }: Options,
) {
  const accessTokenExpires = createExpires(expiresIn);
  const longExpires = longExpiresIn ? createExpires(longExpiresIn) : accessTokenExpires;
  const cookies = [`access_token=${accessToken};${OPTIONS};Expires=${accessTokenExpires}`];
  if (refreshToken !== undefined) {
    cookies.push(`refresh_token=${refreshToken};${OPTIONS};Expires=${longExpires}`);
  }
  if (cookiesVersion !== undefined) {
    cookies.push(`cookies_version=${cookiesVersion};${OPTIONS};Expires=${longExpires}`);
  }

  res.setHeader('Set-Cookie', cookies);
}

function parseCookie(cookie?: string): Record<string, string> {
  if (!cookie) return {};
  return cookie.split(';').reduce((prev, curr) => {
    const [key, val] = curr.split('=');
    return { ...prev, [key.trim()]: val };
  }, {});
}

export function getCookies({ headers }: Request): Partial<Cookies> {
  const cookies = parseCookie(headers.cookie);
  return {
    accessToken: cookies.access_token,
    refreshToken: cookies.refresh_token,
    cookiesVersion: cookies.cookies_version,
  };
}
