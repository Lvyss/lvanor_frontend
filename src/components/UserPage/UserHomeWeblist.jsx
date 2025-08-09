import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserHome from "./UserHomes";
import UserWebList from "./UserWebList/UserWebList";

const UserHomeWeblist = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        // Delay kecil untuk pastikan komponen sudah dirender
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div>
      {/* Pastikan komponen-komponen di bawah memiliki elemen dengan ID yang sesuai */}
      <UserHome />
      <UserWebList />
    </div>
  );
};

export default UserHomeWeblist;
