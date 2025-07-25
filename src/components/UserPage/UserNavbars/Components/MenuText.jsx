import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import routes from "../../../../routes";

const MenuText = ({ activePage, setActivePage }) => {
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
  className="flex items-center space-x-4 text-[11.5px] font-light  absolute left-1/2 transform -translate-x-1/2 font-poppins tracking-wide text-white"
>
  {menuItems.map((menu, index) => (
    <React.Fragment key={index}>
      <motion.li
        variants={item}
        whileHover={{ scale: 1.05 }}
        className="relative group"
      >
        <button
          onClick={() => handleClick(menu)}
          className={`relative px-1 outline-none transition duration-300 italic
            ${
              activePage === menu.name
                ? "text-[#5B73F2]"
                : "group-hover:text-white"
            }
          `}
        >
          {menu.name}

          {/* Hover underline */}
          <span
            className="absolute left-1/2 -bottom-1 w-0 h-[1px] bg-gradient-to-r from-[#8caeff] to-[#5B73F2] rounded-full opacity-0 transform -translate-x-1/2 transition-all duration-300 group-hover:w-full group-hover:opacity-100"
          ></span>

          {/* Active underline */}
          {activePage === menu.name && (
            <span className="absolute left-1/2 -bottom-1 w-full h-[0.5px] bg-[#5B73F2] rounded-full transform -translate-x-1/2 drop-shadow-[0_0_4px_#5B73F2]" />
          )}
        </button>
      </motion.li>

      {/* Dot Separator (kecuali terakhir) */}
      {index < menuItems.length - 1 && (
        <span className="text-[#5B73F2]/40 text-[10px] select-none">•</span>
      )}
    </React.Fragment>
  ))}
</motion.ul>



  );
};

export default MenuText;
