import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthApi } from "../../api/AuthApi";
import routes from "../../../../routes";
import { ClipLoader } from "react-spinners";

const GuestRoute = ({ children }) => {
  const { auth, isInitializing } = useContext(AuthApi);

  // ⏳ Jangan render apapun saat validasi awal masih berlangsung
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <ClipLoader size={60} color="#6B46C1" />
      </div>
    );
  }
  // ✅ Kalau sudah login, langsung lempar ke dashboard sesuai role
  if (auth.token && auth.user) {
    if (auth.user.role === 'admin') {
      return <Navigate to={routes.admin} replace />;
    } else {
      return <Navigate to={routes.user} replace />;
    }
  }

  // ✅ Kalau belum login, biarkan tetap di halaman guest
  return children;
};

export default GuestRoute;
