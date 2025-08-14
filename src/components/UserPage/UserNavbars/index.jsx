import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TitleText from "./Components/TitleText";
import MenuText from "./Components/MenuText";
import ToggleButton from "./Components/ToogleButton";
import MobileMenu from "./Components/MobileMenu";
import FloatingLogo from "./Components/FloatingLogo";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import {
  FaUser
} from "react-icons/fa";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const [activePage, setActivePage] = useState("Beranda");
  const [timeoutId, setTimeoutId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const { apiRequest } = useContext(AuthApi);

  // Ambil hanya profile_picture
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiRequest("profile", "GET");
        setProfilePic(res.data?.detail?.profile_picture || null);
      } catch (err) {
        console.error("Gagal fetch profile:", err);
        setProfilePic(null);
      }
    };
    fetchProfile();
  }, []);

  const handleScroll = () => {
    if (isMenuOpen) return;

    if (window.scrollY > lastScrollY) {
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => setShowNavbar(false), 50);
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

  const handleFloatingLogoClick = () => {
    setIsLogoClicked(true);
    setTimeout(() => {
      setShowNavbar(true);
      setIsLogoClicked(false);
    }, 500);
  };

  const handleProfileClick = () => {
    window.location.href = "/user/profile";
  };


  return (
    <>
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
            {/* Desktop */}
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
                <MenuText activePage={activePage} setActivePage={setActivePage} />
              </div>

              <div className="flex items-center space-x-4">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="object-cover w-8 h-8 rounded-full cursor-pointer"
                    onClick={handleProfileClick}
                  />
                ) : (
                  <FaUser />
                )}

                <ToggleButton
                  isOpen={isMenuOpen}
                  toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                />
              </div>
            </div>

            {/* Mobile */}
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

              <div onClick={handleProfileClick}>
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="object-cover w-8 h-8 rounded-full cursor-pointer"
                  />
                ) : (
                  <FaUser />
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
    </>
  );
};

export default Index;
