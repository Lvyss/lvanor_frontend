import React, { useContext, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { AuthApi } from "../../api/AuthApi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const PrivateRoute = ({ children, role }) => {
  const { auth, isInitializing, logout } = useContext(AuthApi);
  const hasShownToast = useRef(false); // 🔐 Cegah duplikat toast

  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <ClipLoader size={60} color="#6B46C1" />
      </div>
    );
  }

  if (!auth.token || !auth.user) {
    return <Navigate to="/" replace />;
  }

  if (role && auth.user.role !== role) {
    if (!hasShownToast.current) {
      toast.error("Akses ditolak: Role tidak sesuai");
      hasShownToast.current = true;
    }
    logout(); // 🔐 Logout biar bersih
    return null;
  }

  return children;
};

export default PrivateRoute;
