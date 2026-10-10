import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../services/api";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const refreshUser =
    async () => {

      try {

        const current =
          await api.me();

        if (
          current &&
          typeof current === "object" &&
          current.role
        ) {
          setUser(current);
        } else {
          setUser(null);
        }

      } catch {

        setUser(null);

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {
    refreshUser();
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}