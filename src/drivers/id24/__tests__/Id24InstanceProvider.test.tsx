import React from 'react';
import { Id24InstanceProvider, useId24Instance } from '../Id24InstanceProvider';
import { render } from '@testing-library/react';
import { Id24Authorized, Id24Instance, Id24State } from '../Id24';
import { AuthenticationHelper } from '../../../App';

type ChildElementProps = {
  instanceValidator: (input: any) => void;
};

const ChildElement: React.FC<ChildElementProps> = ({
  instanceValidator,
}): React.ReactElement => {
  const { instance, authenticationHelper } = useId24Instance();
  instanceValidator(instance);
  instanceValidator(authenticationHelper);
  return <>ChildElement</>;
};

type TestAbleProps = {
  id24Instance: Id24Instance;
};

const validator = jest.fn();
const authenticationHelper: AuthenticationHelper = {
  authorize: jest.fn(),
  renewAccessToken: jest.fn(),
  logout: jest.fn(),
};

const TestAble: React.FC<TestAbleProps> = ({
  id24Instance,
}): React.ReactElement => (
  <Id24InstanceProvider
    instance={id24Instance}
    authenticationHelper={authenticationHelper}
  >
    <ChildElement instanceValidator={validator} />
  </Id24InstanceProvider>
);

describe('Id24InstanceProvider', () => {
  const id24Instance: Id24Authorized = {
    state: Id24State.Authorized,
    tokenAccess: {
      organizationId: 'organizationId',
      userAccess: [],
    },
    rawAccessToken: 'rawAccessToken',
    logout: jest.fn(),
    renewAccessToken: jest.fn(),
    reloadPage: jest.fn,
  };

  it('should be able to render', () => {
    expect(() =>
      render(<TestAble id24Instance={id24Instance} />),
    ).not.toThrow();
  });

  it('should be able to access instance', () => {
    render(<TestAble id24Instance={id24Instance} />);

    expect(validator).toHaveBeenCalledWith(id24Instance);
  });

  it('should be able to access authenticationHelper', () => {
    render(<TestAble id24Instance={id24Instance} />);

    expect(validator).toHaveBeenCalledWith(authenticationHelper);
  });
});
