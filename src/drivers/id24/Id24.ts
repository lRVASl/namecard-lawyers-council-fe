import { IAuthService } from './auth-service';
import { createHash, HashAlgorithm } from './create-hash';
import { OrganizationUserAccess } from './models/organization-user-access';
import { parseToken } from './parse-token';
import { v4 as uuidv4 } from 'uuid';

export enum Id24State {
  Authorized = 'authorized',
  Unauthorized = 'unauthorized',
  Uninitialized = 'uninitialized',
}

export type Id24Authorized = {
  state: Id24State.Authorized;
  tokenAccess: OrganizationUserAccess;
  rawAccessToken: string;
  renewAccessToken: () => Promise<Id24Instance>;
  logout: () => Promise<void>;
  reloadPage: () => void;
};

export type Id24Uninitialized = {
  state: Id24State.Uninitialized;
};

export type Id24Unauthorized = {
  state: Id24State.Unauthorized;
  authorize: (redirectUrl: string) => void;
};

export type Id24Instance =
  | Id24Authorized
  | Id24Unauthorized
  | Id24Uninitialized;

const authorize =
  (
    challengeKey: string,
    authServer: string,
    clientId: string,
    windowObject: Window,
  ) =>
  (redirectUrl: string, autoLogin = true) => {
    const challenge = uuidv4();
    localStorage.setItem(challengeKey, challenge);
    const codeVerifier = createHash(HashAlgorithm.SHA256, challenge);
    const encodedCodeVerifier = encodeURIComponent(codeVerifier);
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    const auto = autoLogin ? 'true' : 'false';
    const authUrl = `${authServer}/login?clientId=${clientId}&redirectUrl=${encodedRedirectUrl}&codeVerifier=${encodedCodeVerifier}&autoLogin=${auto}`;
    windowObject.location.replace(authUrl);
  };

const renewAccessToken =
  (
    authService: IAuthService,
    windowObject: Window,
    challengeKey: string,
    authServer: string,
    clientId: string,
  ) =>
  async (): Promise<Id24Instance> => {
    try {
      const token = await authService.refreshToken(clientId);
      return {
        state: Id24State.Authorized,
        tokenAccess: parseToken(token),
        rawAccessToken: token,
        renewAccessToken: renewAccessToken(
          authService,
          windowObject,
          challengeKey,
          authServer,
          clientId,
        ),
        logout: () => authService.logout(clientId),
        reloadPage: windowObject.location.reload,
      };
    } catch (e) {
      return {
        state: Id24State.Unauthorized,
        authorize: authorize(challengeKey, authServer, clientId, windowObject),
      };
    }
  };

export const Id24 = (
  windowObject: Window,
  localStorage: Storage,
  authService: IAuthService,
  authServer: string,
  clientId: string,
) => {
  const codeKey = 'code';
  const challengeKey = 'challenge';
  return {
    init: async (): Promise<Id24Instance> => {
      const urlSearchParams = new URLSearchParams(windowObject.location.search);
      const code = urlSearchParams.get(codeKey);
      if (code) {
        urlSearchParams.delete(codeKey);
        const queryString = urlSearchParams.toString();
        const fullPath = `${windowObject.location.origin}${windowObject.location.pathname}`;
        const targetUrl =
          queryString.length > 0 ? `${fullPath}?${urlSearchParams}` : fullPath;
        windowObject.history.replaceState(null, '', targetUrl);
      }
      const challenge = localStorage.getItem(challengeKey);
      try {
        if (code && challenge) {
          const token = await authService.exchangeCodeWithToken(
            clientId,
            code,
            challenge,
          );
          const parsedToken = parseToken(token);
          return {
            state: Id24State.Authorized,
            tokenAccess: parsedToken,
            rawAccessToken: token,
            renewAccessToken: renewAccessToken(
              authService,
              windowObject,
              challengeKey,
              authServer,
              clientId,
            ),
            logout: () => authService.logout(clientId),
            reloadPage: windowObject.location.reload,
          };
        }

        return await renewAccessToken(
          authService,
          windowObject,
          challengeKey,
          authServer,
          clientId,
        )();
      } catch (e) {
        return {
          state: Id24State.Unauthorized,
          authorize: authorize(
            challengeKey,
            authServer,
            clientId,
            windowObject,
          ),
        };
      }
    },
    authorize: authorize(challengeKey, authServer, clientId, windowObject),
    renewAccessToken: renewAccessToken(
      authService,
      windowObject,
      challengeKey,
      authServer,
      clientId,
    ),
    logout: () => authService.logout(clientId),
    reloadPage: () => windowObject.location.reload(),
  };
};
