import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TitleText from "./Components/TitleText";
import NavbarText from "./Components/NavbarText";
import LoginText from "./Components/LoginText";
import ToggleButton from "./Components/ToogleButton";
import MobileMenu from "./Components/MobileMenu";
import FloatingLogo from "./Components/FloatingLogo";

import { Link } from "react-router-dom";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import routes from "../../../routes";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const [activePage, setActivePage] = useState("Beranda");
  const [timeoutId, setTimeoutId] = useState(null);

  // 🔥 Ambil auth gabungan dan logout universal
  const { auth, logout } = useContext(AuthApi);

  // Popup Logout
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Scroll Navbar
  const handleScroll = () => {
    if (isMenuOpen) return;
    if (window.scrollY > lastScrollY) {
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        setShowNavbar(false);
      }, 300);
      setTimeoutId(newTimeoutId);
    } else {
      setShowNavbar(true);
      clearTimeout(timeoutId);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen, timeoutId]);

  const handleMenuClick = (menu) => {
    setActivePage(menu);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);
  };

  const handleFloatingLogoClick = () => {
    setIsLogoClicked(true);
    setTimeout(() => {
      setShowNavbar(true);
      setIsLogoClicked(false);
    }, 500);
  };

  // Logout Universal
  const handleLogout = async () => {
    await logout(); // 🔥 Pakai logout universal
    sessionStorage.setItem('showLogoutPopup', 'true');
    window.location.href = '/';
  };

  // Tampilkan popup kalau ada flag
  useEffect(() => {
    const shouldShowPopup = sessionStorage.getItem('showLogoutPopup');
    if (shouldShowPopup === 'true') {
      setShowLogoutPopup(true);
    }
  }, []);

  // Tutup popup
  const handleLogoutNavigate = () => {
    setShowLogoutPopup(false);
    sessionStorage.removeItem('showLogoutPopup');
  };

  return (
    <>
      {/* Navbar */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            key="navbar"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 z-50 flex items-center justify-between w-full px-4 py-4 shadow-lg md:px-[70px] backdrop-blur-[1px]"
          >
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer font-antiqua">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="w-7 h-7 md:w-10 md:h-10 animate-spin-slow"
              />
              <TitleText text="INVANOR" />
            </div>

            {/* Menu Tengah */}
            <div className="items-center hidden space-x-8 md:flex">
              <NavbarText
                activePage={activePage}
                setActivePage={setActivePage}
              />
            </div>

            {/* Kanan */}
            <div className="flex items-center space-x-4">
              {!auth.token ? ( // 🔥 Pakai auth universal
                <Link to={routes.login}>
                  <div onClick={handleLoginClick}>
                    <LoginText />
                  </div>
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 rounded"
                >
                  Logout
                </button>
              )}
              <ToggleButton
                isOpen={isMenuOpen}
                toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={isMenuOpen}
        handleMenuClick={handleMenuClick}
        activePage={activePage}
      />


      {/* Floating Logo */}
      <FloatingLogo
        show={!showNavbar && !isLogoClicked}
        onClick={handleFloatingLogoClick}
      />

      {/* Popup Logout */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-green-600">Berhasil Logout</h3>
            <p className="mb-4">Anda telah berhasil keluar.</p>
            <button
              onClick={handleLogoutNavigate}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
