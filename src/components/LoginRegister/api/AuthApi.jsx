import React, { createContext, useState, useEffect, useMemo } from "react";
import AxiosClient from "./AxiosClient";
import { toast } from "react-toastify";

export const AuthApi = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: "", user: null });
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // 🧠 Helpers
  const setTokenHeader = (token) => {
    AxiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const clearTokenHeader = () => {
    delete AxiosClient.defaults.headers.common["Authorization"];
  };

  // 🛑 Axios Interceptor
  useEffect(() => {
    const interceptor = AxiosClient.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout({ redirect: false });
          toast.error("Sesi kamu habis, silakan login ulang.");
        } else if (err.response?.status === 403) {
          toast.error("Akses ditolak.");
        }
        return Promise.reject(err);
      }
    );
    return () => AxiosClient.interceptors.response.eject(interceptor);
  }, []);

  // 🚀 On init: restore auth
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("authUser"));

    if (token && user) {
      setTokenHeader(token);
      setAuth({ token, user });
      validateToken(token);
    } else {
      setIsInitializing(false);
    }
  }, []);

  // 🔍 Validate Token (ping protected route)
const validateToken = async () => {
  try {
    const response = await AxiosClient.get("user/profile");
    setAuth((prev) => ({ ...prev, user: response.data }));
  } catch (error) {
    console.warn("Token validation failed:", error.message);
    // ❌ Jangan langsung logout. Biarin token tetap tersimpan.
    // Atau bisa tampilkan pesan, tapi jangan hard logout otomatis.
  } finally {
    setIsInitializing(false);
  }
};


  // 📡 Public API
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

  // 🔐 Authenticated API
const apiRequest = async (url, method = "GET", data = {}, isFormData = false) => {
  setLoading(true);
  try {
    const config = {
      url,
      method,
      headers: {},
    };

    if (method !== "GET") {
      if (isFormData) {
        if (method === "PUT" || method === "DELETE") {
          data.append("_method", method);
          config.method = "POST"; // ⬅️ spoof via POST
        }
        config.data = data;
        // No manual Content-Type for FormData
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




  // 🔐 Social Login
  const socialLogin = async (data) => {
    const response = await publicRequest("social-login", "POST", data);
    if (response?.token && response?.user) {
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.user));
      setTokenHeader(response.token);
      setAuth({ token: response.token, user: response.user });
    }
    return response;
  };

  // 🔓 Logout
  const logout = async ({ redirect = true } = {}) => {
    try {
      const endpoint = auth.user?.role === "admin" ? "admin/logout" : "logout";
      await AxiosClient.post(endpoint);
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      clearTokenHeader();
      setAuth({ token: "", user: null });
      if (redirect) window.location.href = "/";
    }
  };

  // 🧠 Global Context Value
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

