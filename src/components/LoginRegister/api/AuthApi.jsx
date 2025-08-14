import React, { createContext, useState, useEffect, useMemo } from "react";
import AxiosClient from "./AxiosClient";
import toast from "react-hot-toast";

export const AuthApi = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: "", user: null });
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helpers
  const setTokenHeader = (token) => {
    AxiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const clearTokenHeader = () => {
    delete AxiosClient.defaults.headers.common["Authorization"];
  };

  // Axios interceptor
  useEffect(() => {
    const interceptor = AxiosClient.interceptors.response.use(
      res => res,
      err => {
        if (isInitializing || isLoggingOut) return Promise.reject(err);

        if (err.response?.status === 401) {
          if (!isLoggingOut) {
            toast.error("Sesi kamu habis, silakan login ulang.");
            logout({ redirect: false });
          }
        } else if (err.response?.status === 403) {
          toast.error("Akses ditolak.");
        }
        return Promise.reject(err);
      }
    );

    return () => AxiosClient.interceptors.response.eject(interceptor);
  }, [isInitializing, isLoggingOut]);

  // Restore auth on init
  useEffect(() => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("authUser"));

  if (token && user) {
    setTokenHeader(token);
    setAuth({ token, user });
    validateToken(token); // kirim token langsung
  } else {
    setIsInitializing(false);
  }
}, []);

const validateToken = async (token) => {
  if (!token) {
    setIsInitializing(false);
    return;
  }

  try {
    const response = await AxiosClient.get("user/profile");
    setAuth(prev => ({ ...prev, user: response.data }));
  } catch (error) {
    console.warn("Token validation failed:", error.message);
  } finally {
    setIsInitializing(false);
  }
};


  // Public API
  const publicRequest = async (endpoint, method = "GET", body = null) => {
    try {
      const config = {
        url: endpoint,
        method,
        headers: { "Content-Type": "application/json" },
        ...(method !== "GET" && { data: body }),
      };
      const response = await AxiosClient(config);
      return response.data;
    } catch (error) {
      console.error("Public API error:", error);
      toast.error("Gagal menghubungi server.");
      return null;
    }
  };

  // Authenticated API
  const apiRequest = async (url, method = "GET", data = {}, isFormData = false) => {
    if (!auth.token) {
      return null;
    }

    setLoading(true);
    try {
      const config = { url, method, headers: {} };
      if (method !== "GET") {
        if (isFormData) {
          if (["PUT", "DELETE"].includes(method)) {
            data.append("_method", method);
            config.method = "POST";
          }
          config.data = data;
        } else {
          config.headers["Content-Type"] = "application/json";
          config.data = data;
        }
      }
      const response = await AxiosClient(config);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Social login
  const socialLogin = async (data) => {
    setLoading(true);
    try {
      const response = await publicRequest("social-login", "POST", data);
      if (response?.token && response?.user) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("authUser", JSON.stringify(response.user));
        setTokenHeader(response.token);
        setAuth({ token: response.token, user: response.user });
      }
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async ({ redirect = true } = {}) => {
    setIsLoggingOut(true);
    setLoading(true);
    try {
      const endpoint = auth.user?.role === "admin" ? "admin/logout" : "logout";
      if (auth.token) await AxiosClient.post(endpoint);
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      clearTokenHeader();
      setAuth({ token: "", user: null });
      setLoading(false);
      setIsLoggingOut(false);
      if (redirect) window.location.href = "/";
    }
  };

  const authValue = useMemo(() => ({
    auth,
    isAdmin: () => auth.user?.role === "admin",
    isUser: () => auth.user?.role === "user",
    socialLogin,
    logout,
    apiRequest,
    publicRequest,
    loading,
    isInitializing,
  }), [auth, loading, isInitializing]);

  return <AuthApi.Provider value={authValue}>{children}</AuthApi.Provider>;
};
