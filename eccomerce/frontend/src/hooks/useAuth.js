import { useCallback, useMemo, useState } from "react";

const AUTH_KEY = "fasil-auth-user";

function readStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to read auth user", error);
    return null;
  }
}

export default function useAuth() {
  const [user, setUser] = useState(readStoredUser);

  const persistUser = useCallback((nextUser) => {
    if (typeof window !== "undefined") {
      if (nextUser) {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const login = useCallback(
    (credentials = {}) => {
      const nextUser = {
        name:
          credentials.name || credentials.email?.split("@")[0] || "Customer",
        email: credentials.email || "",
      };

      persistUser(nextUser);
      setUser(nextUser);
      return nextUser;
    },
    [persistUser],
  );

  const register = useCallback(
    (form = {}) => {
      const nextUser = {
        name: form.name || form.email?.split("@")[0] || "Customer",
        email: form.email || "",
      };

      persistUser(nextUser);
      setUser(nextUser);
      return nextUser;
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    persistUser(null);
    setUser(null);
  }, [persistUser]);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, isAuthenticated, login, register, logout],
  );
}
