import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearStoredTokens = useCallback(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      // Try to get current user
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch {
      // Token might be expired, try refresh
      try {
        const response = await api.post("/auth/refresh");
        if (response.data.success && response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          const meResponse = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          });
          if (meResponse.data.success) {
            setUser(meResponse.data.data);
          }
        } else {
          clearStoredTokens();
        }
      } catch {
        // Clear invalid tokens
        clearStoredTokens();
      }
    } finally {
      setLoading(false);
    }
  }, [clearStoredTokens]);

  // Check for existing session on mount
  useEffect(() => {
    // Initial auth bootstrap from persisted token/cookies.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuthStatus();
  }, [checkAuthStatus]);

  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.success) {
        const { accessToken, data: userDataResponse } = response.data;
        localStorage.setItem("accessToken", accessToken);
        setUser(userDataResponse);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.success) {
        const { accessToken, data: userData } = response.data;
        localStorage.setItem("accessToken", accessToken);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch {
      // Continue with logout even if API fails
    } finally {
      clearStoredTokens();
      setUser(null);
    }
  }, [clearStoredTokens]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      register,
      login,
      logout,
      clearError,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    }),
    [user, loading, error, register, login, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;