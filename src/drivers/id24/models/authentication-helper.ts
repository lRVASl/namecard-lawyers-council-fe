import { OrganizationUserAccess } from './organization-user-access';

export type TokenInfo = {
  tokenAccess: OrganizationUserAccess;
  rawAccessToken: string;
};

export type AuthenticationHelper = {
  authorize: (redirectUrl: string, autoLogin: boolean) => void;
  renewAccessToken: () => Promise<TokenInfo | null>;
  logout: () => Promise<void>;
  reloadPage: () => void;
};
