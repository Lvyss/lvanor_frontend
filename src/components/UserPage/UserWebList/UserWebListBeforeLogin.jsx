import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes";
import Login from "../../LoginRegister/pages/Login"; // ✅ Import login popup

const UserWebList = () => {
  const navigate = useNavigate();
  const { publicRequest } = useContext(AuthApi);
  const [weblist, setWeblist] = useState([]);
  const [category, setCategory] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(4);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const buttonsRef = useRef({});
  const [showLoginPopup, setShowLoginPopup] = useState(false); // ✅ Popup state

  useEffect(() => {
    fetchWeblist();
    fetchCategory();
  }, []);

const fetchWeblist = async () => {
  try {
    const response = await publicRequest("explore-weblist", "GET");
    if (response && response.data) {
      const weblist = response.data.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category?.name || "Unknown",
        uploader: item.user?.detail?.username || "Anonymous", // 👈 gunakan username dari user detail
        profile: item.user?.detail?.profile_picture || "/images/default-profile.png", // 👈 ambil profile pic dari detail
        image: item.image_path,
      }));
      setWeblist(weblist);
    }
  } catch (error) {
    console.error("Gagal mengambil data weblist:", error);
  }
};

  const fetchCategory = async () => {
    try {
      const response = await publicRequest("category");
      if (response && response.data) {
        const categoryNames = response.data.map((cat) => cat.name);
        setCategory(["All", ...categoryNames]);
      }
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(4);
  };

  useEffect(() => {
    const currentButton = buttonsRef.current[selectedCategory];
    if (currentButton) {
      setIndicatorStyle({
        width: currentButton.offsetWidth,
        left: currentButton.offsetLeft,
      });
    }
  }, [selectedCategory]);

  const handleClickWeblist = () => {
    setShowLoginPopup(true); // ✅ Tampilkan popup login
  };

  const filteredWeblist =
    selectedCategory === "All"
      ? weblist
      : weblist.filter((item) => item.category === selectedCategory);

  const visibleWeblist = filteredWeblist.slice(0, visibleCount);

  return (
    <section
      id="weblist"
      className="flex flex-col items-center justify-center w-full min-h-screen py-24 bg-gradient-to-t from-[#c1cee5] to-[#6390cc] text-white"
    >
      <h2 className="mt-2 mb-2 text-4xl font-bold tracking-tight font-satoshi">
        Jelajahi Website
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-center text-white/40 font-poppins">
        Temukan berbagai website menarik dari kategori pilihan. Scroll dan
        jelajahi karya terbaik kami.
      </p>

      {/* Kategori Filter */}
      <div className="relative flex flex-wrap justify-center gap-2 px-4 mb-10">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute bg-white rounded-full shadow-md h-9"
          style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
        />
        {category.map((cat) => (
          <button
            key={cat}
            ref={(el) => (buttonsRef.current[cat] = el)}
            onClick={() => handleCategoryChange(cat)}
            className={`relative z-10 px-5 py-2 rounded-full text-sm font-poppins transition-all duration-200
              ${
                selectedCategory === cat
                  ? "text-black bg-white shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Weblist Cards */}
      <div className="grid w-full grid-cols-1 gap-8 px-8 max-w-7xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {visibleWeblist.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              onClick={handleClickWeblist}
              className="flex flex-col overflow-hidden text-black transition-all duration-300 transform rounded-md cursor-pointer relative
after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-black/50 after:transition-all after:duration-300 hover:after:w-full"
            >
              <div className="relative w-full overflow-hidden aspect-[4/3] group">
                <img
                  src={item.image}
                  alt={item.uploader}
                  className="object-cover w-full h-full transition-transform duration-500 ease-out rounded-md group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end transition-opacity duration-300 rounded-sm opacity-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:opacity-100">
                  <p className="w-1/2 px-4 pb-3 text-[15px] font-semibold text-white truncate font-poppins">
                    {item.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <img
                    src={item.profile}
                    alt={item.uploader}
                    className="object-cover w-6 h-6 rounded-full"
                  />
                  <span className="text-[12px] font-medium text-black truncate font-poppins max-w-[100px]">
                    {item.uploader?.length > 18
                      ? item.uploader.slice(0, 15) + "..."
                      : item.uploader}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Heart className="w-4 h-4 text-black" />
                  <span className="text-black">0</span>
                  <Eye className="w-4 h-4 ml-2 text-black" />
                  <span className="text-black">0</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleCount < filteredWeblist.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 4)}
          className="px-6 py-2 mt-12 text-white transition-all rounded-full shadow-md bg-invaPurple hover:bg-invaPink hover:shadow-lg"
        >
          Load More
        </button>
      )}

      {/* ✅ Login Popup */}
      {showLoginPopup && (
        <Login show={showLoginPopup} onClose={() => setShowLoginPopup(false)} />
      )}
    </section>
  );
};

export default UserWebList;
