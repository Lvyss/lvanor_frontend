import React, { useContext, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "../../../LoginRegister/api/AuthApi";
import LoginLogoutButton from "./LoginLogoutButton";
import routes from "../../../../routes";

const MobileMenu = ({ isOpen, handleMenuClick, activePage }) => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthApi);

  const menuRef = useRef(); // 🆕 Untuk deteksi klik di luar

  // 🆕 Detect click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        handleMenuClick(); // Close the menu
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen, handleMenuClick]);

  const menuItems = [
    { name: "Beranda", link: routes.user },
    { name: "Kategori", link: routes.user },
    { name: "Tentang Kami", link: "#about" },
    { name: "Profil", link: routes.userProfile },
    { name: "WebUp", link: routes.userWeblist },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const handleClick = (menu) => {
    handleMenuClick(menu.name);
    if (menu.link.startsWith("#")) return;
    navigate(menu.link);
  };

  const handleLogout = () => {
    logout();
    handleMenuClick();
    navigate(routes.login);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef} // 🆕 Ref untuk deteksi klik luar
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-[65px] inset-x-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center z-[999]"
        >
          <motion.ul
            className="flex flex-col items-center space-y-5 text-[13px] font-light font-poppins italic text-white tracking-wide"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {menuItems.map((menu, index) => (
              <motion.li
                key={index}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className="relative group w-full text-center"
              >
                {menu.link.startsWith("#") ? (
                  <a
                    onClick={() => handleClick(menu)}
                    className={`relative outline-none px-2 transition duration-300 ${
                      activePage === menu.name
                        ? "text-[#5B73F2]"
                        : "text-white group-hover:text-white"
                    }`}
                  >
                    {menu.name}
                    <span className="absolute left-1/2 -bottom-1 w-0 h-[1px] bg-gradient-to-r from-[#8caeff] to-[#5B73F2] rounded-full opacity-0 transform -translate-x-1/2 transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
                    {activePage === menu.name && (
                      <span className="absolute left-1/2 -bottom-1 w-full h-[0.5px] bg-[#5B73F2] rounded-full transform -translate-x-1/2 drop-shadow-[0_0_4px_#5B73F2]" />
                    )}
                  </a>
                ) : (
                  <button
                    onClick={() => handleClick(menu)}
                    className={`relative outline-none px-2 transition duration-300 ${
                      activePage === menu.name
                        ? "text-[#5B73F2]"
                        : "text-white group-hover:text-white"
                    }`}
                  >
                    {menu.name}
                    <span className="absolute left-1/2 -bottom-1 w-0 h-[1px] bg-gradient-to-r from-[#8caeff] to-[#5B73F2] rounded-full opacity-0 transform -translate-x-1/2 transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
                    {activePage === menu.name && (
                      <span className="absolute left-1/2 -bottom-1 w-full h-[0.5px] bg-[#5B73F2] rounded-full transform -translate-x-1/2 drop-shadow-[0_0_4px_#5B73F2]" />
                    )}
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>

          {/* Divider */}
          <div className="my-6 w-full border-t border-white/40" />

          {/* Login/Logout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            {!auth.token ? (
              <Link to={routes.login} onClick={handleMenuClick}>
                <LoginLogoutButton type="login" />
              </Link>
            ) : (
              <LoginLogoutButton type="logout" onClick={handleLogout} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
