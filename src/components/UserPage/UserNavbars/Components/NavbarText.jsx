import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../../routes";

const NavbarText = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Beranda", link: "#home", page: routes.user },
    { name: "Kategori", link: "#category", page: routes.user  },
    { name: "Tentang Kami", link: "#about" },
    { name: "Profil", link: routes.userProfile },
    { name: "WebUp", link: routes.userWeblist },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClick = (menu) => {
    setActivePage(menu.name);

    const isAnchor = menu.link.startsWith("#");

    if (isAnchor) {
      const id = menu.link.slice(1);

      // Jika halaman sekarang sudah benar (misalnya sudah di /user)
      if (location.pathname === (menu.page || location.pathname)) {
        scrollToId(id);
      } else {
        // Jika pindah halaman, tunggu render dulu baru scroll
        navigate(menu.page || routes.user);
        setTimeout(() => scrollToId(id), 100); // delay kecil agar DOM siap
      }

      return;
    }

    // Untuk route biasa
    navigate(menu.link);
  };

  return (
    <motion.ul
      className="flex space-x-7 text-[12.5px] absolute left-1/2 transform -translate-x-1/2 font-poppins italic"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {menuItems.map((menu, index) => (
        <motion.li
          key={index}
          variants={item}
          whileHover={{ scale: 1.05 }}
          className="relative tracking-wide text-black transition-all duration-100 cursor-pointer hover:text-invaPurple group"
        >
          <button
            onClick={() => handleClick(menu)}
            className="relative outline-none"
          >
            {menu.name}
            {activePage === menu.name && (
              <span className="absolute -bottom-[3px] left-1/2 transform -translate-x-1/2 w-full h-[0.1px] bg-invaPurple rounded-full drop-shadow-[0_0_4px_#FF4FCB]"></span>
            )}
          </button>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default NavbarText;
