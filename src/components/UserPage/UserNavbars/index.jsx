import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TitleText from "./Components/TitleText";
import MenuText from "./Components/MenuText";
import ToggleButton from "./Components/ToogleButton";
import MobileMenu from "./Components/MobileMenu";
import FloatingLogo from "./Components/FloatingLogo";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { FaUser } from "react-icons/fa";
import toast from "react-hot-toast";
import Login from "../../LoginRegister/pages/Login";
import routes from "../../../routes";
const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const [activePage, setActivePage] = useState("Beranda");
  const [timeoutId, setTimeoutId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const dropdownRef = useRef(null);
  const { auth, apiRequest, logout } = useContext(AuthApi);

  // Ambil foto profil saat login
  useEffect(() => {
    if (!auth.token) return;
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
  }, [auth.token]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleLogin = () => setShowLoginPopup(true);

  const handleLogout = async () => {
    toast.success("Berhasil logout!");
    setTimeout(async () => {
      await logout();
    }, 800);
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
            className="fixed top-0 z-50 w-full py-[4%] md:py-[1%] shadow-sm px-[5%] backdrop-blur-[10px] border-b-2 border-white/20"
          >
            {/* Desktop */}
            <div className="items-center justify-between hidden w-full md:flex">
              {/* Logo */}
              <div className="flex items-center space-x-3 cursor-pointer font-antiqua">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  className="w-7 h-7 md:w-10 md:h-10 animate-spin-slow"
                />
                <TitleText text="LVANOR" />
              </div>

              {/* Menu */}
              <div className="flex items-center space-x-8">
                <MenuText activePage={activePage} setActivePage={setActivePage} />
              </div>

              {/* Profil & Toggle */}
              <div className="relative flex items-center space-x-4">
{auth.token ? (
  profilePic ? (
    // Kalau login & ada foto profil
    <>
<button
  onClick={() => setShowDropdown((prev) => !prev)}
  aria-label="Buka menu profil"
  title="Profil"
  className="relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 border rounded-full shadow-xl cursor-pointer w-14 h-14 text-blue-950/80 border-blue-950/40 group"
>
  <img
    src={profilePic}
    alt="Profile"
    className="relative z-10 object-cover rounded-full w-14 h-14"
  />
</button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 w-40 py-2 mt-10 text-sm text-gray-700 bg-white rounded-lg shadow-lg"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = routes.userProfile;
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Profil
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  ) : (
    // Kalau login tapi foto profil kosong → pakai FaUser versi login
    <>
<button
  onClick={() => setShowDropdown((prev) => !prev)}
  aria-label="Login"
  title="Login"
  className="relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 border rounded-full shadow-xl cursor-pointer w-14 h-14 text-blue-950/80 border-blue-950/40 group"
>
  <span className="absolute inset-0 w-0 h-0 bg-blue-950 rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
  <FaUser className="relative z-10 text-xl text-blue-950" />
</button>

          <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 w-40 py-2 mt-10 text-sm text-gray-700 bg-white rounded-lg shadow-lg"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = routes.userProfile;
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              Profil
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
) : (
  // Kalau belum login → FaUser versi login popup
<button
  onClick={handleLogin}
  aria-label="Login"
  title="Login"
  className="relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 border rounded-full shadow-xl cursor-pointer w-14 h-14 text-blue-950/80 border-blue-950/40 group"
>
  <span className="absolute inset-0 w-0 h-0 bg-blue-950 rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
  <FaUser className="relative z-10 text-xl" />
</button>

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

              <div className="relative">
                {auth.token ? (
                  <>
                    <button
  onClick={() => setShowDropdown((prev) => !prev)}
  aria-label="Buka menu profil"
  title="Profil"
  className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden transition-all duration-300 border rounded-full shadow-xl cursor-pointer text-blue-950/80 border-blue-950/40 group"
>
  <img V   
    src={profilePic}
    alt="Profile"
    className="relative z-10 object-cover w-12 h-12 rounded-full"
  />
</button>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          ref={dropdownRef}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 w-40 py-2 mt-10 text-sm text-gray-700 bg-white rounded-lg shadow-lg"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = "/user/profile";
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100"
                          >
                            Profil
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogout();
                            }}
                            className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <FaUser className="cursor-pointer" onClick={handleLogin} />
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

      {/* Popup Login */}
      <Login show={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
    </>
  );
};

export default Index;
