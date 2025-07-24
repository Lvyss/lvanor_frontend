// src/pages/AdminLayout.jsx
import React, { useEffect } from "react"; // ✅ FIX: Tambahkan useEffect
import { Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "./AdminNavbars/AdminNavbar";
import AdminFooter from "./AdminFooters/AdminFooter";

const AdminLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
