import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginText from "./LoginText";
import routes from "../../../../routes";
const MobileMenu = ({ isOpen, handleMenuClick, activePage }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Beranda", link: routes.user },
    { name: "Kategori", link: routes.user },
    { name: "Tentang Kami", link: "#about" },
    { name: "Profil", link: routes.userProfile },
    { name: "WebUp", link: routes.userWeblist},
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
    handleMenuClick(menu.name); // setActivePage
    if (menu.link.startsWith("#")) return; // scroll ke anchor
    navigate(menu.link); // route biasa
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed top-[65px] right-4 w-[150px] bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-4 flex flex-col space-y-4 z-[999]"
        >
          <motion.ul
            className="flex flex-col space-y-4 text-[12px] font-poppins italic"
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
                {menu.link.startsWith("#") ? (
                  <a
                    href={menu.link}
                    onClick={() => handleClick(menu)}
                    className="relative"
                  >
                    {menu.name}
                    {activePage === menu.name && (
                      <motion.span
                        key={menu.name}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        exit={{ width: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="absolute -bottom-[3px] left-1/2 transform -translate-x-1/2 h-[0.1px] bg-invaPurple rounded-full drop-shadow-[0_0_4px_#FF4FCB]"
                      ></motion.span>
                    )}
                  </a>
                ) : (
                  <button
                    onClick={() => handleClick(menu)}
                    className="relative outline-none"
                  >
                    {menu.name}
                    {activePage === menu.name && (
                      <motion.span
                        key={menu.name}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        exit={{ width: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="absolute -bottom-[3px] left-1/2 transform -translate-x-1/2 h-[0.1px] bg-invaPurple rounded-full drop-shadow-[0_0_4px_#FF4FCB]"
                      ></motion.span>
                    )}
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>

          {/* LoginText (auth / tombol login) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-2 border-t border-black/10"
          >
            <LoginText />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
