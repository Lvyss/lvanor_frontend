import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbars";
import UserFooter from "./UserFooters";

const Index = () => {
  return (
    <div>
          <div className="fixed inset-0 pointer-events-none z-[9999]">
  {/* Garis Vertikal */}
  <div className="absolute top-0 bottom-0 w-px bg-red-500 left-1/2" ></div>
  {/* Garis Horizontal */}
  <div className="absolute left-0 right-0 h-px bg-blue-500 top-1/2" ></div>
</div>
      <UserNavbar />
      <Outlet /> {/* Semua konten halaman user akan muncul di sini */}
      <UserFooter />
    </div>
  );
};

export default Index;
