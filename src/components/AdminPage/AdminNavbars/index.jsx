import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import routes from '../../../routes';
const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthApi);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // 🔥 Pakai logout universal
    sessionStorage.setItem('showLogoutPopup', 'true');
    window.location.href = '/';
  };

  return (
    <>
      <AnimatePresence>
        <motion.nav
          key="admin-navbar"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 z-50 flex items-center justify-between w-full px-6 py-4 text-white bg-purple-700 shadow-lg"
        >
          <div className="flex items-center space-x-3 text-xl font-bold">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
            <span>Admin Panel</span>
          </div>

          <div className="items-center hidden space-x-8 md:flex">
            <Link to={routes.admin} className="hover:underline">Home</Link>
            <Link to={routes.adminUsers} className="hover:underline">Data User</Link>
            <Link to={routes.adminCategory} className="hover:underline">Kategori</Link>
            <Link to={routes.adminWeblist} className="hover:underline">Data Gambar</Link>
            <Link to={routes.adminProfile} className="hover:underline">Profil</Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <button
            className="block md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </motion.nav>
      </AnimatePresence>

      {isMenuOpen && (
        <div className="p-4 space-y-4 text-white bg-purple-700 md:hidden">
          <Link to={routes.admin} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to={routes.adminUsers} onClick={() => setIsMenuOpen(false)}>Data User</Link>
          <Link to={routes.adminCategory} onClick={() => setIsMenuOpen(false)}>Kategori</Link>
          <Link to={routes.adminWeblist} onClick={() => setIsMenuOpen(false)}>Data Gambar</Link>
          <button
            onClick={handleLogout}
            className="block w-full px-3 py-1 bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Index;
