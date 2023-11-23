import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Id24Provider, useId24 } from '../Id24Provider';
import { Id24InstanceProvider } from '../Id24InstanceProvider';
import {
  Id24Authorized,
  Id24Instance,
  Id24State,
  Id24Unauthorized,
} from '../Id24';
import { OrganizationUserAccess } from '@enersys/common-auth';
import axios, { AxiosInstance } from 'axios';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  create: jest.fn(),
}));

type ChildComponentDebugger = {
  checkAuthorized: (authorized: boolean) => void;
  checkTokenAccess: (tokenAccess: OrganizationUserAccess | null) => void;
  checkAxios: (axios: AxiosInstance) => void;
  apiBaseUrl?: string;
};

const ChildComponent: React.FC<ChildComponentDebugger> = ({
  checkAuthorized,
  checkTokenAccess,
  checkAxios,
  apiBaseUrl,
}): React.ReactElement => {
  const { authenticated, tokenAccess, login, logout, id24Axios } = useId24();
  checkAuthorized(authenticated);
  checkTokenAccess(tokenAccess);
  if (!authenticated) {
    login('url', true);
  } else {
    checkAxios(id24Axios(apiBaseUrl));
    logout();
  }
  return <>Child Component</>;
};

describe('Id24Provider', () => {
  const retrieveAccessToken = jest.fn();
  const renewAccessToken = jest.fn();
  const createAxios: any = axios.create;
  const logout = jest.fn();
  const reloadPage = jest.fn();
  const rawAccessToken = 'rawAccessToken';
  const tokenAccess = {
    organizationId: 'organizationId',
    userAccess: [],
  };
  const tokenAccess2 = {
    ...tokenAccess,
    organizationId: 'organizationId2',
  };
  const createdAxios = { createdAxios: '' };
  const authorizedId24Instance: Id24Authorized = {
    state: Id24State.Authorized,
    tokenAccess,
    rawAccessToken,
    renewAccessToken,
    logout,
    reloadPage,
  };
  const unauthorizedId24Instance: Id24Unauthorized = {
    state: Id24State.Unauthorized,
    authorize: jest.fn(),
  };

  const checkAuthorized = jest.fn();
  const checkTokenAccess = jest.fn();
  const checkAxios = jest.fn();

  const providerConfig = {
    refreshTokenIntervalInSeconds: 1,
    resourceApiBaseUrl: 'http://localhost:8080',
  };

  const authenticationHelper = {
    authorize: jest.fn(),
    renewAccessToken: jest.fn(),
    logout: jest.fn(),
    reloadPage: jest.fn(),
  };

  type TestAbleProps = {
    id24Instance: Id24Instance;
    apiBaseUrl?: string;
  };
  const TestAble: React.FC<TestAbleProps> = ({
    id24Instance,
    apiBaseUrl,
  }): React.ReactElement => (
    <>
      <Id24InstanceProvider
        instance={id24Instance}
        authenticationHelper={authenticationHelper}
      >
        <Id24Provider config={providerConfig}>
          <ChildComponent
            checkAuthorized={checkAuthorized}
            checkTokenAccess={checkTokenAccess}
            checkAxios={checkAxios}
            apiBaseUrl={apiBaseUrl}
          />
        </Id24Provider>
      </Id24InstanceProvider>
    </>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    retrieveAccessToken.mockResolvedValue('abc');
    createAxios.mockReturnValue(createdAxios);
  });

  it('should be able to render', () => {
    expect(() =>
      render(<TestAble id24Instance={authorizedId24Instance} />),
    ).not.toThrow();
  });

  describe('authorizedId24Instance', () => {
    const renewTokenResult = {
      ...authorizedId24Instance,
      tokenAccess: tokenAccess2,
    };
    const tokenInfo = {
      tokenAccess: tokenAccess2,
      rawAccessToken: 'rawAccessToken',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      checkAuthorized.mockClear();
      renewAccessToken.mockResolvedValue(renewTokenResult);
      authenticationHelper.renewAccessToken.mockResolvedValue(tokenInfo);
    });

    it('should authenticated when instance is authorized', () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      expect(checkAuthorized).toHaveBeenCalledWith(true);
    });

    it('should be able to renew access token when authorized', async () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      await waitFor(() =>
        expect(authenticationHelper.renewAccessToken).toHaveBeenCalled(),
      );
    });

    it('should use original user access when init with authorized', () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      expect(checkTokenAccess).toHaveBeenCalledWith(tokenAccess);
    });

    it('should renew access token when time passed', async () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      expect(checkTokenAccess).toHaveBeenCalledWith(tokenAccess);
      await waitFor(() =>
        expect(checkTokenAccess).toHaveBeenCalledWith(tokenAccess2),
      );
    });

    it('should become unauthorized when renew token return null', async () => {
      authenticationHelper.renewAccessToken.mockResolvedValue(null);

      render(<TestAble id24Instance={authorizedId24Instance} />);

      await waitFor(() => expect(checkAuthorized).toHaveBeenCalledWith(true));
      await waitFor(() => expect(checkAuthorized).toHaveBeenCalledWith(false));
      expect(checkAuthorized).toHaveBeenCalledTimes(2);
    });

    it('should support login when renew token return null', async () => {
      authenticationHelper.renewAccessToken.mockResolvedValue(null);

      render(<TestAble id24Instance={authorizedId24Instance} />);

      await waitFor(() =>
        expect(authenticationHelper.authorize).toHaveBeenCalledWith('url'),
      );
    });

    it('should support logout', async () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      expect(authenticationHelper.logout).toHaveBeenCalled();
    });

    it.skip('should reload window location when logout', () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      expect(authenticationHelper.reloadPage).toHaveBeenCalled();
    });

    it('should init axios correctly', async () => {
      render(<TestAble id24Instance={authorizedId24Instance} />);

      await waitFor(() =>
        expect(createAxios).toHaveBeenCalledWith({
          baseURL: 'http://localhost:8080',
          headers: {
            Authorization: `Bearer ${rawAccessToken}`,
          },
        }),
      );
    });

    it('should init axios correctly with override url', async () => {
      const apiBaseUrl = 'https://api.resource.com';
      render(
        <TestAble
          id24Instance={authorizedId24Instance}
          apiBaseUrl={apiBaseUrl}
        />,
      );

      await waitFor(() =>
        expect(createAxios).toHaveBeenCalledWith({
          baseURL: apiBaseUrl,
          headers: {
            Authorization: `Bearer ${rawAccessToken}`,
          },
        }),
      );
    });
  });

  describe('unauthorizedId24Instance', () => {
    it('should know as it authenticated when instance is Unauthorized', () => {
      render(<TestAble id24Instance={unauthorizedId24Instance} />);

      expect(checkAuthorized).toHaveBeenCalledWith(false);
    });

    it('should not call renew access token when not authorized', () => {
      render(<TestAble id24Instance={unauthorizedId24Instance} />);

      expect(authenticationHelper.renewAccessToken).not.toHaveBeenCalled();
    });

    it('should has token access as null when init with unauthorized', () => {
      render(<TestAble id24Instance={unauthorizedId24Instance} />);

      expect(checkTokenAccess).toHaveBeenCalledWith(null);
    });

    it('should support authorize', () => {
      render(<TestAble id24Instance={unauthorizedId24Instance} />);

      expect(authenticationHelper.authorize).toHaveBeenCalledWith('url');
    });
  });
});
