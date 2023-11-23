import { Id24, Id24Authorized, Id24State, Id24Unauthorized } from '../Id24';
import { createHash, HashAlgorithm } from '../create-hash';
import { parseToken } from '../parse-token';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../parse-token', () => ({
  ...jest.requireActual('../parse-token'),
  parseToken: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Id24', () => {
  const authService = {
    refreshToken: jest.fn(),
    exchangeCodeWithToken: jest.fn(),
    logout: jest.fn(),
  } as any;
  const windowHistoryReplace = jest.fn();
  const windowLocationReplace = jest.fn();
  const mockedParsedToken: any = parseToken;
  const mockedUUIDV4: any = uuidv4;
  const code = 'code';
  const authServer = 'http://auth.id24.com';
  const windowObject = {
    location: {
      search: `?code=${code}`,
      origin: 'http://localhost',
      pathname: '/abc',
      replace: windowLocationReplace,
      reload: jest.fn(),
    },
    history: {
      replaceState: windowHistoryReplace,
    },
  } as any;
  const localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  } as any;
  const organizationUserAccess = {
    organizationId: 'organizationId',
    userAccess: [{ groupId: 'group-id', groupName: 'groupName', roles: [] }],
  };
  const clientId = 'clientId';
  const token = 'token';
  const id24 = Id24(
    windowObject,
    localStorage,
    authService,
    authServer,
    clientId,
  );

  describe('init', () => {
    const { init } = id24;

    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.getItem.mockReturnValue('challenge');
      authService.exchangeCodeWithToken.mockResolvedValue(token);
      mockedParsedToken.mockReturnValue(organizationUserAccess);
    });

    describe('Authorized', () => {
      it('should not call get access token when code and challenge does not exists', async () => {
        await Id24(
          {
            location: {
              search: `?other=${code}`,
              origin: 'http://localhost',
              pathname: '/abc',
            },
          } as any,
          localStorage,
          authService,
          authServer,
          clientId,
        ).init();

        expect(authService.exchangeCodeWithToken).not.toHaveBeenCalled();
      });

      it('should remove code when code exists in url', async () => {
        await init();

        expect(windowHistoryReplace).toHaveBeenCalledWith(
          null,
          '',
          'http://localhost/abc',
        );
      });

      it('should remove code and leave other queries when code exists in url', async () => {
        await Id24(
          {
            location: {
              search: `?code=${code}&other=def`,
              origin: 'http://localhost',
              pathname: '/abc',
            },
            history: {
              replaceState: windowHistoryReplace,
            },
          } as any,
          localStorage,
          authService,
          authServer,
          clientId,
        ).init();

        expect(windowHistoryReplace).toHaveBeenCalledWith(
          null,
          '',
          'http://localhost/abc?other=def',
        );
      });

      it('should call exchange token when code and challenge exists', async () => {
        await init();

        expect(authService.exchangeCodeWithToken).toHaveBeenCalledWith(
          clientId,
          code,
          'challenge',
        );
      });

      it('should try refresh token when code or challenge does not exists', async () => {
        localStorage.getItem.mockReturnValue(null);

        await init();

        expect(authService.refreshToken).toHaveBeenCalled();
      });

      it('should return authorized state when successfully refresh token', async () => {
        localStorage.getItem.mockReturnValue(null);

        const actual = await init();

        expect(actual.state).toEqual(Id24State.Authorized);
      });

      it('should return parsed refresh token correctly', async () => {
        localStorage.getItem.mockReturnValue(null);

        const actual = (await init()) as Id24Authorized;

        expect(actual.tokenAccess).toEqual(organizationUserAccess);
      });

      it('should parse token correctly', async () => {
        await init();

        expect(parseToken).toHaveBeenCalledWith(token);
      });

      it('should return authorized state when can retrieve token', async () => {
        const actual = await init();

        expect(actual.state).toEqual(Id24State.Authorized);
      });

      it('should return token when can retrieve token', async () => {
        const actual = (await init()) as Id24Authorized;

        expect(actual.tokenAccess).toEqual(organizationUserAccess);
      });

      it('should also return raw token for API Call', async () => {
        const actual = (await init()) as Id24Authorized;

        expect(actual.rawAccessToken).toEqual(token);
      });

      describe('renewAccessToken', () => {
        it('should call refresh token correctly', async () => {
          const { renewAccessToken } = (await init()) as Id24Authorized;

          await renewAccessToken();

          expect(authService.refreshToken).toHaveBeenCalled();
        });

        it('should return new object that can use reloadPage when refresh token successful', async () => {
          authService.refreshToken.mockResolvedValue(token);

          const { renewAccessToken } = (await init()) as Id24Authorized;

          const { reloadPage } = (await renewAccessToken()) as Id24Authorized;
          reloadPage();

          expect(windowObject.location.reload).toHaveBeenCalled();
        });

        it('should return unauthorized when refresh token return failure', async () => {
          authService.refreshToken.mockRejectedValue(new Error('Unauthorized'));

          const { renewAccessToken } = (await init()) as Id24Authorized;
          const actual = await renewAccessToken();

          expect(actual.state).toEqual(Id24State.Unauthorized);
        });
      });

      describe('logout', () => {
        it('should call logout', async () => {
          const { logout } = (await init()) as Id24Authorized;

          await logout();

          expect(authService.logout).toHaveBeenCalled();
        });
      });

      describe('reloadPage', () => {
        it('should call window refresh when call refresh', async () => {
          const { reloadPage } = (await init()) as Id24Authorized;

          reloadPage();

          expect(windowObject.location.reload).toHaveBeenCalled();
        });
      });
    });

    describe('Unauthorized', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        authService.refreshToken.mockRejectedValue(
          new Error('refresh token failed'),
        );
        authService.exchangeCodeWithToken.mockRejectedValue(
          new Error('exchange code failed'),
        );
      });

      it('should return unauthorized state when retrieve refresh token failed', async () => {
        localStorage.getItem.mockReturnValue(null);

        const actual = await init();

        expect(actual.state).toEqual(Id24State.Unauthorized);
      });

      it('should return unauthorized when exchange code failed', async () => {
        const actual = await init();

        expect(actual.state).toEqual(Id24State.Unauthorized);
      });

      describe('authorize', () => {
        const challengeValue = 'challengeValue';
        const redirectUrl = 'http://redirect.com';

        beforeEach(() => {
          jest.clearAllMocks();
          mockedUUIDV4.mockReturnValue(challengeValue);
        });

        it('should set local storage with uuid correctly', async () => {
          const { authorize } = (await init()) as Id24Unauthorized;
          await authorize(redirectUrl);

          localStorage.setItem('challenge', challengeValue);
        });

        it('should redirect to correct url', async () => {
          const { authorize } = (await init()) as Id24Unauthorized;
          await authorize(redirectUrl);

          const codeVerifier = createHash(HashAlgorithm.SHA256, challengeValue);
          const encodedCodeVerifier = encodeURIComponent(codeVerifier);
          const encodedRedirectUrl = encodeURIComponent(redirectUrl);
          const authUrl = `${authServer}/login?clientId=${clientId}&redirectUrl=${encodedRedirectUrl}&codeVerifier=${encodedCodeVerifier}&autoLogin=true`;
          expect(windowLocationReplace).toHaveBeenCalledWith(authUrl);
        });
      });
    });
  });

  describe('authorize', () => {
    const { authorize } = id24;
    const challengeValue = 'challengeValue';
    const redirectUrl = 'http://redirect.com';

    beforeEach(() => {
      jest.clearAllMocks();
      mockedUUIDV4.mockReturnValue(challengeValue);
    });

    it('should set local storage with uuid correctly', async () => {
      await authorize(redirectUrl);

      localStorage.setItem('challenge', challengeValue);
    });

    it('should redirect to correct url', async () => {
      await authorize(redirectUrl);

      const codeVerifier = createHash(HashAlgorithm.SHA256, challengeValue);
      const encodedCodeVerifier = encodeURIComponent(codeVerifier);
      const encodedRedirectUrl = encodeURIComponent(redirectUrl);
      const authUrl = `${authServer}/login?clientId=${clientId}&redirectUrl=${encodedRedirectUrl}&codeVerifier=${encodedCodeVerifier}&autoLogin=true`;
      expect(windowLocationReplace).toHaveBeenCalledWith(authUrl);
    });

    it('should redirect with auto false when specify auto false', async () => {
      await authorize(redirectUrl, false);

      const codeVerifier = createHash(HashAlgorithm.SHA256, challengeValue);
      const encodedCodeVerifier = encodeURIComponent(codeVerifier);
      const encodedRedirectUrl = encodeURIComponent(redirectUrl);
      const authUrl = `${authServer}/login?clientId=${clientId}&redirectUrl=${encodedRedirectUrl}&codeVerifier=${encodedCodeVerifier}&autoLogin=false`;
      expect(windowLocationReplace).toHaveBeenCalledWith(authUrl);
    });
  });
  describe('renewAccessToken', () => {
    const { renewAccessToken } = id24;

    beforeEach(() => {
      jest.clearAllMocks();
      localStorage.getItem.mockReturnValue('challenge');
      authService.exchangeCodeWithToken.mockResolvedValue(token);
      mockedParsedToken.mockReturnValue(organizationUserAccess);
    });

    it('should call refresh token correctly', async () => {
      await renewAccessToken();

      expect(authService.refreshToken).toHaveBeenCalled();
    });

    it('should return new object that can use reloadPage when refresh token successful', async () => {
      authService.refreshToken.mockResolvedValue(token);

      const { reloadPage } = (await renewAccessToken()) as Id24Authorized;
      reloadPage();

      expect(windowObject.location.reload).toHaveBeenCalled();
    });

    it('should return unauthorized when refresh token return failure', async () => {
      authService.refreshToken.mockRejectedValue(new Error('Unauthorized'));

      const actual = await renewAccessToken();

      expect(actual.state).toEqual(Id24State.Unauthorized);
    });
  });

  describe('logout', () => {
    const { logout } = id24;
    it('should call logout', async () => {
      await logout();

      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('reloadPage', () => {
    const { reloadPage } = id24;
    it('should call window location reload page', () => {
      reloadPage();

      expect(windowObject.location.reload).toHaveBeenCalled();
    });
  });
});
