import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { intersection } from "lodash";
import { defaultPath } from "../configs/menus";

export type Role = "admin" | "oa" | "bank";

export type Roules =
  | "dashboard"
  | "appointment"
  | "dutyday"
  | "casereports"
  | "createusers"
  | "setting"
  | "createaddress"
  | "volunteers"
  | "queue"
  | "home_settings"
  | "settingaddress"
  | "news";

type User = {
  id: string;
  roles: Role[];
};

type AuthContextType = {
  user?: User;
  signin: (user: User) => void;
  signout: (cb: VoidFunction) => void;
};

const AuthContext = React.createContext<AuthContextType>({
  signin: () => {},
  signout: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();

  return (
    <AuthContext.Provider
      value={{
        user,
        signin: setUser,
        signout: () => {
          setUser(undefined);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth: React.FC<{
  children: JSX.Element;
  allowedRoles: Role[];
}> = ({ children, allowedRoles }) => {
  const auth = useAuth();
  const location = useLocation();

  return intersection(auth.user?.roles, allowedRoles).length ? (
    children
  ) : (
    <Navigate to={defaultPath} state={{ from: location }} replace />
  );
};
