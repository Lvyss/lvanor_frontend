import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingLogo = ({ show, onClick }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="floating-logo"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ duration: 0.25 }}
          className="fixed top-4 left-[48%] transform -translate-x-1/2 z-[999] cursor-pointer group"
          onClick={(e) => {
            // Ripple Effect
            const ripple = document.createElement("span");
            ripple.classList.add("ripple");
            ripple.style.left = `${e.nativeEvent.offsetX}px`;
            ripple.style.top = `${e.nativeEvent.offsetY}px`;
            e.currentTarget.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);

            // Trigger callback ke Navbar
            onClick();
          }}
        >
          <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden transition-transform duration-100 border rounded-full shadow-2xl md:w-[60px] md:h-[60px] bg-gradient-to-br from-white/30 to-invaPurple/30 backdrop-blur-[10px] border-white/20 hover:scale-110 animate-glow">
            <div className="absolute inset-0 rounded-full"></div>
            <img src="/images/logo.png" alt="Menu Logo" className="h-8 w-8 md:h-[45px] md:w-[45px] animate-spin-slow" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingLogo;
