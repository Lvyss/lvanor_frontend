import React from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react"; // Icon login dari lucide

const LoginText = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 20,
        mass: 1,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className=" relative flex items-center px-4 py-2 space-x-2 overflow-hidden text-[12px] italic tracking-wide  transition-all duration-100 border rounded-full cursor-pointer md:px-6 md:py-2 md:text-sm border-invaPurple font-satoshi  group "
    >
      {/* Ripple Fill Effect */}
      <span className="absolute inset-0 w-0 h-0 bg-white  rounded-full group-hover:w-72 group-hover:h-72 group-hover:opacity-40 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#FF4FCB]"></span>

      {/* Icon Login */}
      <LogIn  className="relative z-10 md:size-[13px] size-[12px] text-black " />

      {/* Button Text */}
      <span className="relative z-10 text-black transition-all duration-300P">
        Login
      </span>
    </motion.div>
  );
};

export default LoginText;
