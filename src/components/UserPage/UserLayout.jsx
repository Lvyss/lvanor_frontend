import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbars/UserNavbar";
import UserFooter from "./UserFooters/UserFooter";

const UserLayout = () => {
  return (
    <div>
      <UserNavbar />
      <Outlet /> {/* Semua konten halaman user akan muncul di sini */}
      <UserFooter />
    </div>
  );
};

export default UserLayout;
