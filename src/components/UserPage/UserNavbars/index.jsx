import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TitleText from "./Components/TitleText";
import MenuText from "./Components/MenuText";
import LoginLogoutButton from "./Components/LoginLogoutButton";
import ToggleButton from "./Components/ToogleButton";
import MobileMenu from "./Components/MobileMenu";
import FloatingLogo from "./Components/FloatingLogo";
import Login from "../../LoginRegister/pages/Login"; // ✅ Tambahan

import { Link } from "react-router-dom";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import routes from "../../../routes";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const [activePage, setActivePage] = useState("Beranda");
  const [timeoutId, setTimeoutId] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // ✅ Tambahan

  const { auth, logout } = useContext(AuthApi);

  const handleScroll = () => {
    if (isMenuOpen) return;

    if (window.scrollY > lastScrollY) {
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        setShowNavbar(false);
      }, 50);
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
    setShowLoginPopup(true); // ✅ Munculkan popup login
  };

  const handleFloatingLogoClick = () => {
    setIsLogoClicked(true);
    setTimeout(() => {
      setShowNavbar(true);
      setIsLogoClicked(false);
    }, 500);
  };

  const handleLogout = async () => {
    await logout();
    sessionStorage.setItem("showLogoutPopup", "true");
    window.location.href = "/";
  };

  useEffect(() => {
    const shouldShowPopup = sessionStorage.getItem("showLogoutPopup");
    if (shouldShowPopup === "true") {
      setShowLogoutPopup(true);
    }
  }, []);

  const handleLogoutNavigate = () => {
    setShowLogoutPopup(false);
    sessionStorage.removeItem("showLogoutPopup");
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
            className="fixed top-0 z-50 w-full py-[4%] md:py-[1.5%] shadow-lg px-[5%] backdrop-blur-[5px] border-b border-white/20"
          >
            {/* 🖥️ Desktop Layout */}
            <div className="items-center justify-between hidden w-full md:flex">
              <div className="flex items-center space-x-3 cursor-pointer font-antiqua">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-7 h-7 md:w-10 md:h-10 animate-spin-slow"
                />
                <TitleText text="LVANOR" />
              </div>

              <div className="flex items-center space-x-8">
                <MenuText
                  activePage={activePage}
                  setActivePage={setActivePage}
                />
              </div>

              <div className="flex items-center space-x-4">
                {!auth.token ? (
                  <LoginLogoutButton
                    type="login"
                    onClick={handleLoginClick} // ✅ popup
                  />
                ) : (
                  <LoginLogoutButton type="logout" onClick={handleLogout} />
                )}
                <ToggleButton
                  isOpen={isMenuOpen}
                  toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                />
              </div>
            </div>

            {/* 📱 Mobile Layout */}
            <div className="flex items-center justify-between w-full md:hidden">
              <div className="flex items-center space-x-3">
                <ToggleButton
                  isOpen={isMenuOpen}
                  toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                />
                <div className="flex items-center space-x-2">
                  <img
                    src="/images/logo.png"
                    alt="Logo"
                    className="w-10 h-10 animate-spin-slow"
                  />
                  <TitleText text="LVANOR" />
                </div>
              </div>

              <div>
                {!auth.token ? (
                  <LoginLogoutButton
                    type="login"
                    onClick={handleLoginClick} // ✅ popup
                  />
                ) : (
                  <LoginLogoutButton type="logout" onClick={handleLogout} />
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <MobileMenu
        isOpen={isMenuOpen}
        handleMenuClick={handleMenuClick}
        activePage={activePage}
      />

      <FloatingLogo
        show={!showNavbar && !isLogoClicked}
        onClick={handleFloatingLogoClick}
      />

      {/* ✅ Login Popup */}
      <Login
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-green-600">
              Berhasil Logout
            </h3>
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

export default Index;
