import React from "react";
import {
  fetchProfile,
  login as loginRequest,
  register as registerRequest,
} from "api/auth";

const AuthContext = React.createContext(null);

const TOKEN_KEY = "erp_token";
const USER_KEY = "erp_user";

const readJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage errors (private mode or disabled storage)
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = React.useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = React.useState(() => readJson(USER_KEY));
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const persistSession = React.useCallback((nextToken, nextUser) => {
    try {
      if (nextToken) {
        localStorage.setItem(TOKEN_KEY, nextToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      // Ignore storage errors
    }

    if (nextUser) {
      writeJson(USER_KEY, nextUser);
    } else {
      try {
        localStorage.removeItem(USER_KEY);
      } catch (error) {
        // Ignore storage errors
      }
    }
  }, []);

  const login = React.useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(email, password);
      setToken(data.token);
      setUser(data);
      persistSession(data.token, data);
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const register = React.useCallback(
    async ({ name, email, password, company_name, phone }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await registerRequest({
          name,
          email,
          password,
          company_name,
          phone,
        });
        setToken(data.token);
        setUser(data);
        persistSession(data.token, data);
        return data;
      } catch (err) {
        setError(err.message || "Registration failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [persistSession]
  );

  const logout = React.useCallback(() => {
    setToken(null);
    setUser(null);
    persistSession(null, null);
  }, [persistSession]);

  React.useEffect(() => {
    let isMounted = true;

    const hydrateProfile = async () => {
      if (!token || user) {
        return;
      }
      setLoading(true);
      try {
        const profile = await fetchProfile();
        if (!isMounted) return;
        const mergedUser = { ...(user || {}), ...profile };
        setUser(mergedUser);
        writeJson(USER_KEY, mergedUser);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load profile");
        if (err.status === 401) {
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateProfile();
    return () => {
      isMounted = false;
    };
  }, [token, user, logout]);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    loading,
    error,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
