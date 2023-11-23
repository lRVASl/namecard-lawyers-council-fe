import { AxiosInstance } from 'axios';

type AuthorizeInfo = {
  clientId: string;
  redirectUrl: string;
  codeVerifier: string;
  credential: {
    username: string;
    password: string;
  };
  rememberMe: boolean;
};

type TryAuthorizationInfo = {
  clientId: string;
  redirectUrl: string;
  codeVerifier: string;
};
type AuthorizationResult = { code?: string; updatePasswordToken?: string };

export type IAuthService = {
  authorize: (authorizationInfo: AuthorizeInfo) => Promise<AuthorizationResult>;
  authorizeLdap: (
    authorizationInfo: AuthorizeInfo,
  ) => Promise<AuthorizationResult>;
  authorizeLdapWithQuery: (
    authorizationInfo: AuthorizeInfo,
  ) => Promise<AuthorizationResult>;
  tryAuthorize: (
    tryAuthorizationInfo: TryAuthorizationInfo,
  ) => Promise<AuthorizationResult>;
  isAuthorized: () => Promise<void>;
  exchangeCodeWithToken: (
    clientId: string,
    code: string,
    challenge: string,
  ) => Promise<string>;
  refreshToken: (clientId: string) => Promise<string>;
  logout: (clientId: string) => Promise<void>;
  deAuthorize: () => Promise<void>;
  getClientName: (clientId: string) => Promise<string>;
};

export const AuthService = (axiosInstance: AxiosInstance): IAuthService => ({
  authorize: (authorizationInfo: AuthorizeInfo): Promise<AuthorizationResult> =>
    axiosInstance
      .post('/auth/authorize', authorizationInfo)
      .then(result => {
        return result.data as AuthorizationResult;
      })
      .catch(error => {
        const { message } = error.response.data;
        if (message) {
          throw new Error(message);
        }
        throw new Error('Something wrong');
      }),
  authorizeLdap: (
    authorizationInfo: AuthorizeInfo,
  ): Promise<AuthorizationResult> =>
    axiosInstance
      .post('/auth/authorize-ldap', authorizationInfo)
      .then(result => {
        return result.data as AuthorizationResult;
      })
      .catch(error => {
        const { message } = error.response.data;
        if (message) {
          throw new Error(message);
        }
        throw new Error('Something wrong');
      }),
  authorizeLdapWithQuery: (
    authorizationInfo: AuthorizeInfo,
  ): Promise<AuthorizationResult> =>
    axiosInstance
      .post('/auth/authorize-ldap-query', authorizationInfo)
      .then(result => {
        return result.data as AuthorizationResult;
      })
      .catch(error => {
        const { message } = error.response.data;
        if (message) {
          throw new Error(message);
        }
        throw new Error('Something wrong');
      }),
  tryAuthorize: (tryAuthorizationInfo: TryAuthorizationInfo) =>
    axiosInstance
      .post('/auth/try-authorize', tryAuthorizationInfo)
      .then(result => result.data as AuthorizationResult)
      .catch(error => {
        const { message } = error.response.data;
        if (message) {
          throw new Error(message);
        }
        throw new Error('Something wrong');
      }),
  isAuthorized: () => axiosInstance.get('/auth/authorize'),
  exchangeCodeWithToken: (clientId: string, code: string, challenge: string) =>
    axiosInstance
      .post('/auth/token', { clientId, code, challenge })
      .then(result => result.data.access_token),
  refreshToken: (clientId: string) =>
    axiosInstance
      .get(`/auth/refresh?clientId=${clientId}`)
      .then(result => result.data.access_token),
  logout: (clientId: string) =>
    axiosInstance.post(`/auth/logout?clientId=${clientId}`),
  deAuthorize: () => axiosInstance.delete('/auth/authorize'),
  getClientName: (clientId: string) =>
    axiosInstance
      .get(`/auth/clients/${clientId}/name`)
      .then(result => result.data.name),
});
