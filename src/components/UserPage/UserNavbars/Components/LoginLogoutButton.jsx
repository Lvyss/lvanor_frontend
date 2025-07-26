// src/components/LoginLogoutButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { DoorOpen, DoorClosed } from "lucide-react";

const LoginLogoutButton = ({ type = "login", onClick }) => {
  const isLogin = type === "login";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center px-5 py-2 md:px-6 md:py-2.5 space-x-2 overflow-hidden text-xs md:text-sm text-white border ${
        isLogin ? "border-[#5B73F2]/40 bg-[#5B73F2]/30" : "border-red-500/40 bg-red-500/30"
      } rounded-3xl cursor-pointer transition-all duration-300 group backdrop-blur-sm`}
    >
      {/* Ripple hover effect */}
      <span
        className={`absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 group-hover:w-[50%] group-hover:h-[180%] group-hover:opacity-20 transition-all duration-700 ease-out transform group-hover:scale-150 ${
          isLogin ? "drop-shadow-[0_0_8px_#5B73F2]" : "drop-shadow-[0_0_8px_#EF4444]"
        }`}
      />

      {/* Icon */}
      {isLogin ? (
        <DoorOpen className="relative z-10 text-white size-[16px]" />
      ) : (
        <DoorClosed className="relative z-10 text-white size-[16px]" />
      )}

      {/* Text */}
      <span className="relative z-10 italic font-light tracking-wide">
        {isLogin ? "Login" : "Logout"}
      </span>
    </motion.div>
  );
};

export default LoginLogoutButton;
