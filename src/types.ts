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
  /** A space-separated list of scopes. */
  scope?: string;
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
  /** Basic \<base64 encoded client_id:client_secret> */
  Authorization: string;
  'Content-Type': 'application/x-www-form-urlencoded';
}
interface TokenResponseBody {
  access_token: string;
  token_type: 'Bearer';
  /** A space-separated list of scopes. */
  scope: string;
  /** The time period (in seconds) for which the Access Token is valid. */
  expires_in: number;
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
