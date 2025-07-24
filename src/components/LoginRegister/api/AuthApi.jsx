import React, { createContext, useState, useEffect, useMemo } from "react";
import axiosClient from "./axiosClient";
import { toast } from "react-toastify";

export const AuthApi = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "",
    user: null,
  });

  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // 🔸 Axios Interceptor: Auto logout jika token expired
  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast.error("Sesi kamu sudah habis, silakan login ulang.");
        } else if (error.response?.status === 403) {
          toast.error("Akses ditolak. Kamu tidak memiliki izin.");
        }
        return Promise.reject(error);
      }
    );

    return () => axiosClient.interceptors.response.eject(interceptor);
  }, []);

  // 🔸 Cek token di localStorage saat pertama buka aplikasi
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("authUser"));

    if (token && user) {
      setAuth({ token, user });
      validateToken(token);
    } else {
      setIsInitializing(false);
    }
  }, []);

  // 🔸 Validasi token di backend
  const validateToken = async (token) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("authUser"));
      const role = storedUser?.role;
      const url = role === "admin" ? "/admin/profile" : "/user/profile";

      const response = await axiosClient.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAuth({ token, user: response.data });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Sesi kamu habis, silakan login ulang.");
        logout();
      } else if (error.response?.status === 403) {
        toast.error("Akses ditolak: Anda tidak punya izin.");
        logout(); // tetap logout karena token invalid
      } else {
        console.error("Error validateToken:", error);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // 🔸 Fungsi universal untuk request API
const apiRequest = async (url, method, data = {}, isFormData = false) => {
  setLoading(true);
  try {
    const actualMethod = isFormData && method === "PUT" ? "POST" : method;

    if (isFormData && method === "PUT") {
      if (data instanceof FormData) {
        data.append("_method", "PUT");
      } else {
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        formData.append("_method", "PUT");
        data = formData;
      }
    }

    const config = {
      url,
      method: actualMethod,
      headers: {
        Authorization: `Bearer ${auth.token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      ...(method === "GET" ? {} : { data }),
    };

    const response = await axiosClient(config);
    return response.data;
  } finally {
    setLoading(false);
  }
};



  // 🔸 Register
  const register = async (form) => await apiRequest("register", "POST", form);

  // 🔸 Login (admin/user)
  const login = async (form, isAdmin = false) => {
    const url = isAdmin ? "admin/login" : "login";
    const response = await apiRequest(url, "POST", form);

    localStorage.setItem("authToken", response.token);
    localStorage.setItem("authUser", JSON.stringify(response.user));

    setAuth({ token: response.token, user: response.user });

    return response;
  };

  // 🔸 Logout
  const logout = async () => {
    try {
      const isAdmin = auth.user?.role === "admin";
      await apiRequest(isAdmin ? "admin/logout" : "logout", "POST");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setAuth({ token: "", user: null });

      // 🔁 Redirect manual sesuai role
      const redirectPath =
        auth.user?.role === "admin" ? "/admin/login" : "/login";
      window.location.href = redirectPath;
    }
  };

  // ✅ Optimisasi context value dengan useMemo
  const authValue = useMemo(
    () => ({
      auth,
      register,
      login,
      logout,
      apiRequest,
      loading,
      isInitializing,
    }),
    [auth, loading, isInitializing]
  );

  return <AuthApi.Provider value={authValue}>{children}</AuthApi.Provider>;
};
