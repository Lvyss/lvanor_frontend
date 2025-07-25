import React from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

const LoginText = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center px-5 py-2 md:px-6 md:py-2.5 space-x-2 overflow-hidden text-xs md:text-sm text-white border border-[#5B73F2]/40 bg-[#5B73F2]/30 rounded-3xl cursor-pointer transition-all duration-300 group backdrop-blur-sm"
    >
      {/* Ripple hover effect */}
      <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 group-hover:w-[50%] group-hover:h-[180%] group-hover:opacity-20 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#5B73F2]" />

      {/* Icon */}
      <LogIn className="relative z-10 text-white size-[16px]" />

      {/* Text */}
      <span className="relative z-10 italic font-light tracking-wide">
        Login
      </span>
    </motion.div>
  );
};

export default LoginText;
