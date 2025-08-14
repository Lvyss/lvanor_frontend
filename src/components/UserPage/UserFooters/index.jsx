import React, { useContext, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import Login from '../../LoginRegister/pages/Login';
import toast from 'react-hot-toast';

const Index = () => {
  const { auth, logout } = useContext(AuthApi);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

const handleLogout = async () => {
  await logout(); // AuthProvider akan redirect otomatis
  toast.success("Berhasil logout!"); // ❌ toast mungkin tidak sempat tampil karena halaman reload
};


  const handleLogin = () => setShowLoginPopup(true);

  return (
    <>
      <footer id="about" className="flex flex-col items-center w-full px-8 py-8 border-t bg-gradient-blue backdrop-blur-lg">

        {/* Bagian Atas */}
        <div className="flex flex-col items-center justify-between w-full mb-4 md:flex-row max-w-7xl">

          {/* Logo dan Nama */}
          <div className="flex items-center mb-4 space-x-2 md:mb-0">
            <img src="/images/logo.png" alt="Ilvanor Logo" className="object-contain w-8 h-8" />
            <span className="text-2xl font-antiqua">Ilvanor</span>
          </div>

          {/* Menu */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm font-medium">
            <a href="#" className="transition hover:text-invaPink">For designers</a>
            <a href="#" className="transition hover:text-invaPink">Hire talent</a>
            <a href="#" className="transition hover:text-invaPink">Inspiration</a>
            <a href="#" className="transition hover:text-invaPink">Blog</a>
            <a href="#" className="transition hover:text-invaPink">About</a>
            <a href="#" className="transition hover:text-invaPink">Support</a>
                      {!auth.token ? (
              <a onClick={handleLogin} href="#" className="transition hover:text-invaPink">Login</a>
          ) : (
              <a onClick={handleLogout} href="#" className="transition hover:text-invaPink">Logout</a>
          )}
          </div>

          {/* Social Media */}
          <div className="flex mt-4 space-x-4 md:mt-0">
            <a href="#"><FaTwitter className="transition hover:text-invaPink" /></a>
            <a href="#"><FaFacebookF className="transition hover:text-invaPink" /></a>
            <a href="#"><FaInstagram className="transition hover:text-invaPink" /></a>
            <a href="#"><FaPinterestP className="transition hover:text-invaPink" /></a>
          </div>
        </div>

        {/* Bagian Bawah */}
        <div className="flex flex-col items-center justify-between w-full mt-4 space-y-2 text-xs text-gray-500 md:flex-row max-w-7xl md:space-y-0">
          <span>© 2025 Ilvanor. All rights reserved.</span>

          <div className="flex space-x-4">
            <a href="#" className="transition hover:text-invaPink">Terms</a>
            <a href="#" className="transition hover:text-invaPink">Privacy</a>
            <a href="#" className="transition hover:text-invaPink">Cookies</a>
          </div>
        </div>

      </footer>

      {/* Popup Login */}
      <Login
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
}

export default Index;
