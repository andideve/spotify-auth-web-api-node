// Docs: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/

import express from 'express';
import dotenv from 'dotenv';
import qs from 'query-string';
import axios, { AxiosError } from 'axios';

import setCookies from './utils/cookies';
import {
  UserAuthRequestQueryParameters,
  UserAuthResponseQueryParameters,
  AccessTokenRequestBodyParameters,
  AccessTokenResponseBody,
  RefreshAccessTokenRequestBodyParameters,
  RefreshAccessTokenResponseBody,
} from './types';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const AUTH_SCOPE = process.env.AUTH_SCOPE;
const REDIRECT_URI = process.env.REDIRECT_URI;
const COOKIES_VERSION = process.env.COOKIES_VERSION;

const app = express();

app.listen(8080, () => {
  console.log('Server is running on port: 8080');
});

/**
 * Request User Authorization
 * https://accounts.spotify.com/authorize
 */

app.get('/login', (req, res) => {
  res.redirect(
    `https://accounts.spotify.com/authorize?${qs.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: AUTH_SCOPE,
      redirect_uri: REDIRECT_URI,
    } as UserAuthRequestQueryParameters)}`,
  );
});

/**
 * Request Access Token
 * https://accounts.spotify.com/api/token
 */

app.get('/callback', async (req, res) => {
  const { code } = req.query as Partial<UserAuthResponseQueryParameters>;
  if (!(typeof code === 'string')) {
    res.status(400).json({ message: 'Missing required parameter: code' });
    return;
  }
  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${BASIC}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      } as AccessTokenRequestBodyParameters,
    };
    const data: AccessTokenResponseBody = await axios
      .post(authOptions.url, authOptions.form, {
        headers: authOptions.headers,
      })
      .then((res) => res.data);
    setCookies(res, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      cookiesVersion: COOKIES_VERSION,
      longExpiresIn: data.expires_in + 60 * 60 * 24 * 7,
    });
    res.json({ message: 'Success' });
  } catch (err) {
    res.status(400).json((err as AxiosError).response?.data || {});
  }
});

// just for test mode only, use GET.
app.get('/logout', (req, res) => {
  setCookies(res, {
    accessToken: '',
    refreshToken: '',
    expiresIn: 0,
    cookiesVersion: -1,
  });
  res.json({ message: 'Success' });
});

/**
 * Request a refreshed Access Token
 * https://accounts.spotify.com/api/token
 */

app.get('/refresh_token', async (req, res) => {
  const { refresh_token } = req.query;
  if (!(typeof refresh_token === 'string')) {
    res.status(400).json({ message: 'Missing required parameter: refresh_token' });
    return;
  }
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${BASIC}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    } as RefreshAccessTokenRequestBodyParameters,
  };
  try {
    const data: RefreshAccessTokenResponseBody = await axios
      .post(authOptions.url, authOptions.form, {
        headers: authOptions.headers,
      })
      .then((res) => res.data);
    res.json(data);
  } catch (err) {
    res.status(400).json((err as AxiosError).response?.data || {});
  }
});
