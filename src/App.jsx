import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthApi } from "./components/LoginRegister/api/AuthApi";
import { ClipLoader } from "react-spinners";
import { useContext } from "react";
import routes from "./routes";
import { Toaster } from "react-hot-toast";

import NotFound from "./components/NotFound";

import PrivateRoute from "./components/LoginRegister/pages/components/PrivateRoute";
import GuestRoute from "./components/LoginRegister/pages/components/GuestRoute";

import AdminLayout from "./components/AdminPage";
import AdminHome from "./components/AdminPage/AdminHomes";
import AdminCategoryList from "./components/AdminPage/AdminCategoryLists";
import AdminUserList from "./components/AdminPage/AdminUserLists";
import AdminWebList from "./components/AdminPage/AdminWebLists";
import AdminWebDetail from "./components/AdminPage/AdminWebLists/AdminWeblistDetail";
import AdminProfile from "./components/AdminPage/AdminProfiles";

import StartPage from "./components/UserPage/StartPage";
import UserLayout from "./components/UserPage";
import UserHomeWeblist from "./components/UserPage/UserHomeWeblist";
import UserProfile from "./components/UserPage/UserProfiles/Profiles";
import UserPublicProfile from "./components/UserPage/UserProfiles/PublicProfiles";
import UserWebUp from "./components/UserPage/UserWebUps";


function AppContent() {
  const { isInitializing, loading } = useContext(AuthApi);

  // ⏳ Saat aplikasi pertama kali dijalankan, tunggu cek localStorage
  if (isInitializing) {
    return (
      
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <ClipLoader size={40} color="#6B46C1" />
      </div>
    );
  }

  return (
    
    <>
          {/* Konten aplikasi kamu */}
      <Toaster position="top-right" />
      {/* ⏳ Loader global ketika ada request berjalan */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <ClipLoader size={40} color="#6B46C1" />
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
          <Route path="/user/user-profile/:id" element={<UserPublicProfile />} />
          <Route path={routes.userProfile} element={<UserProfile />} />
          <Route path={routes.userWeblist} element={<UserWebUp />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

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
