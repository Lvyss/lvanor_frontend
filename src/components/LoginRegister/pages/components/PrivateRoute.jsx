import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthApi } from "../../api/AuthApi";
import routes from "../../../../routes";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify"; // ✅ Tambahkan ini

const PrivateRoute = ({ children, role }) => {
  const { auth, isInitializing } = useContext(AuthApi);
const { logout } = useContext(AuthApi);
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <ClipLoader size={60} color="#6B46C1" />
      </div>
    );
  }

  if (!auth.token || !auth.user) {
    const redirectPath = role === "admin" ? "/admin/login" : routes.login;
    return <Navigate to={redirectPath} replace />;
  }
if (auth.user.role !== role) {
  toast.error("Akses ditolak: Role tidak sesuai");
  logout();
  return null;
}

  return children;
};

export default PrivateRoute;
