import {
  getMe,
  GetMeResponse,
  loginRestaurant,
  logoutRestaurant,
  registerRestaurant,
} from "@/api/auth";
import { useAuth } from "@/hooks";
import React, { createContext } from "react";

export const AuthContext = createContext<
  | {
      me: GetMeResponse | null;
      login: (email: string, password: string) => Promise<any>;
      register: (email: string, name: string, password: string) => Promise<any>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { me, setMe } = useAuth();

  const login = (email: string, password: string) =>
    loginRestaurant({ email, password })
      .then(() => getMe())
      .then((me) => setMe(me))
      .catch((err) => {
        setMe(null);
        throw err;
      });

  const register = (email: string, name: string, password: string) =>
    registerRestaurant({ email, name, password })
      .then(() => getMe())
      .then((me) => setMe(me))
      .catch((err) => {
        setMe(null);
        throw err;
      });

  const logout = () => logoutRestaurant();

  return (
    <AuthContext.Provider
      value={me !== undefined ? { me, login, register, logout } : undefined}
    >
      {children}
    </AuthContext.Provider>
  );
};
