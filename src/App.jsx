import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthApi } from "./components/LoginRegister/api/AuthApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { useContext } from "react";
import routes from "./routes";
import NotFound from "./components/NotFound";

import Login from "./components/LoginRegister/pages/Login";
import Register from "./components/LoginRegister/pages/Register";

import PrivateRoute from "./components/LoginRegister/pages/components/PrivateRoute";
import GuestRoute from "./components/LoginRegister/pages/components/GuestRoute";

import AdminLayout from "./components/AdminPage/AdminLayout";
import AdminHome from "./components/AdminPage/AdminHomes/AdminHome";
import AdminCategoryList from "./components/AdminPage/AdminCategoryLists/AdminCategoryList";
import AdminUserList from "./components/AdminPage/AdminUserLists/AdminUserList";
import AdminWebList from "./components/AdminPage/AdminWebLists/AdminWebList";
import AdminWebDetail from "./components/AdminPage/AdminWebLists/AdminWeblistDetail";
import AdminProfile from "./components/AdminPage/AdminProfiles/AdminProfile";

import StartPage from "./components/UserPage/StartPage";
import UserLayout from "./components/UserPage/UserLayout";
import UserHomeWeblist from "./components/UserPage/UserHomeWeblist";
import UserProfile from "./components/UserPage/UserProfiles/UserProfile";
import UserWebUp from "./components/UserPage/UserWebUp/UserWebUp";
import UserWebUpDetail from "./components/UserPage/UserWebUp/UserWebUpDetail";

function AppContent() {
  const { isInitializing, loading } = useContext(AuthApi);

  // ⏳ Saat aplikasi pertama kali dijalankan, tunggu cek localStorage
  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <ClipLoader size={80} color="#6B46C1" />
      </div>
    );
  }

  return (
    <>
      {/* ⏳ Loader global ketika ada request berjalan */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <ClipLoader size={80} color="#6B46C1" />
        </div>
      )}

      <Routes>
        {/* 🏠 Halaman Publik */}
        <Route
  path={routes.home}
  element={
    <GuestRoute>
      <StartPage />
    </GuestRoute>
  }
/>


        {/* 🔒 Halaman Login & Register (hanya untuk yang belum login) */}
        <Route
          path={routes.login}
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path={routes.register}
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* 🔐 Halaman Admin */}
        <Route
          path={routes.admin}
          element={
            <PrivateRoute role="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path={routes.adminUsers} element={<AdminUserList />} />
          <Route path={routes.adminCategory} element={<AdminCategoryList />} />
          <Route path={routes.adminWeblist} element={<AdminWebList />} />
          <Route path={routes.adminProfile} element={<AdminProfile />} />
          <Route
            path={routes.adminWeblistDetailEdit()}
            element={<AdminWebDetail />}
          />
        </Route>

        {/* 🔐 Halaman User */}
        <Route
          path={routes.user}
          element={
            <PrivateRoute role="user">
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<UserHomeWeblist />} />
          <Route path={routes.userProfile} element={<UserProfile />} />
          <Route path={routes.userWeblist} element={<UserWebUp />} />
          <Route
            path={routes.userWeblistEditDetail()}
            element={<UserWebUpDetail />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
