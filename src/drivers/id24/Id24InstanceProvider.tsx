import React from 'react';
import { Id24Instance, Id24State } from './Id24';
import { AuthenticationHelper } from './models/authentication-helper';

type Props = {
  children: React.ReactElement;
  instance: Id24Instance;
  authenticationHelper: AuthenticationHelper;
};

type Id24InstanceValue = {
  instance: Id24Instance;
  authenticationHelper: AuthenticationHelper;
};

const Id24InstanceContext = React.createContext<Id24InstanceValue>({
  instance: { state: Id24State.Uninitialized },
  authenticationHelper: {} as any,
});

export const Id24InstanceProvider: React.FC<Props> = ({
  children,
  instance,
  authenticationHelper,
}) => {
  return (
    <Id24InstanceContext.Provider value={{ instance, authenticationHelper }}>
      {children}
    </Id24InstanceContext.Provider>
  );
};

export const useId24Instance = () => React.useContext(Id24InstanceContext);
