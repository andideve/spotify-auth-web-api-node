// Docs: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/

/**
 * Request User Authorization
 * https://accounts.spotify.com/authorize
 */

export interface UserAuthRequestQueryParameters {
  client_id: string;
  response_type: 'code';
  redirect_uri: string;
  state?: string;
  scope?: string; // A space-separated list of scopes.
  show_dialog?: boolean;
}
export interface UserAuthResponseQueryParameters {
  code: string;
  state?: string;
}

interface TokenRequestBodyParameters {
  grant_type: 'authorization_code' | 'refresh_token';
}
export interface TokenRequestHeaderParameters {
  Authorization: string; // Basic <base64 encoded client_id:client_secret>
  'Content-Type': 'application/x-www-form-urlencoded';
}
interface TokenResponseBody {
  access_token: string;
  token_type: 'Bearer';
  scope: string; // A space-separated list of scopes.
  expires_in: number; // The time period (in seconds)
}

/**
 * Request Access Token
 * https://accounts.spotify.com/api/token
 */

export interface AccessTokenRequestBodyParameters extends TokenRequestBodyParameters {
  code: string;
  redirect_uri: string;
}
export interface AccessTokenResponseBody extends TokenResponseBody {
  refresh_token: string;
}

/**
 * Request a refreshed Access Token
 * https://accounts.spotify.com/api/token
 */

export interface RefreshAccessTokenRequestBodyParameters extends TokenRequestBodyParameters {
  refresh_token: string;
}
export type RefreshAccessTokenResponseBody = TokenResponseBody;
