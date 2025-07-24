import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';

const AdminFooter = () => {
  return (
    <footer className="flex flex-col items-center w-full px-8 py-8 border-t bg-gradient-to-b from-blue-300 to-blue-100 backdrop-blur-lg ">

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
      <div className="flex flex-col items-center justify-between w-full space-y-2 text-xs text-gray-500 md:flex-row max-w-7xl md:space-y-0">
        <span>© 2025 Ilvanor. All rights reserved.</span>

        <div className="flex space-x-4">
          <a href="#" className="transition hover:text-invaPink">Terms</a>
          <a href="#" className="transition hover:text-invaPink">Privacy</a>
          <a href="#" className="transition hover:text-invaPink">Cookies</a>
        </div>
      </div>

    </footer>
  )
}

export default AdminFooter;
