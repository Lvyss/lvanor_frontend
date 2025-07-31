import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import UserWeblistDetail from "./UserWeblistDetails";

const UserWebList = () => {
  const { apiRequest } = useContext(AuthApi);
  const [weblist, setWeblist] = useState([]);
  const [category, setCategory] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(4);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const buttonsRef = useRef({});
  const [selectedWeblist, setSelectedWeblist] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    fetchWeblist();
    fetchCategory();
  }, []);

  const fetchWeblist = async () => {
    try {
      const response = await apiRequest("explore-weblist", "GET");
      if (response && response.data) {
        const weblist = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category?.name || "Unknown",
          uploader: item.user?.name || "Anonymous",
          profile: item.user?.profile_picture || "/images/default-profile.png",
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
      const response = await apiRequest("category", "GET");
      if (response && response.data) {
        const categoryNames = response.data.map((cat) => cat.name);
        setCategory(["All", ...categoryNames]);
      }
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  const handleLoadMore = () => setVisibleCount((prev) => prev + 3);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleCount(3);
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

  const handleOpenDetail = async (id) => {
    try {
      const res = await apiRequest(`explore-weblist/${id}`, "GET");
      setDetailData(res.data);
      setSelectedWeblist(id);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? weblist
      : weblist.filter((weblist) => weblist.category === selectedCategory);

  const visibleWeblist = filteredProducts.slice(0, visibleCount);

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

      {/* Kategori */}
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
          {visibleWeblist.map((weblist) => (
            <motion.div
              key={weblist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              onClick={() => handleOpenDetail(weblist.id)}
              className="flex flex-col overflow-hidden text-black transition-all duration-300 transform rounded-md cursor-pointer relative
after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-black/50 after:transition-all after:duration-300 hover:after:w-full"
            >
              <div className="relative w-full overflow-hidden aspect-[4/3] group">
                <img
                  src={weblist.image}
                  alt={weblist.uploader}
                  className="object-cover w-full h-full transition-transform duration-500 ease-out rounded-md group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end transition-opacity duration-300 rounded-sm opacity-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:opacity-100">
                  <p className="w-1/2 px-4 pb-3 text-[15px] font-semibold text-white truncate font-poppins">
                    {weblist.title || "Judul Website"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 ">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <img
                    src={weblist.profile}
                    alt={weblist.uploader}
                    className="object-cover w-6 h-6 rounded-full"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] font-medium text-black truncate font-poppins max-w-[100px]">
                      {weblist.uploader?.length > 18
                        ? weblist.uploader.slice(0, 15) + "..."
                        : weblist.uploader || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Icons */}
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

      {visibleCount < filteredProducts.length && (
        <button
          onClick={handleLoadMore}
          className="px-6 py-2 mt-12 text-white transition-all rounded-full shadow-md bg-invaPurple hover:bg-invaPink hover:shadow-lg"
        >
          Load More
        </button>
      )}

      {/* Weblist Detail Modal */}

      <UserWeblistDetail
        isOpen={!!selectedWeblist}
        onClose={() => {
          setSelectedWeblist(null);
          setDetailData(null);
        }}
        data={detailData}
      />
    </section>
  );
};

export default UserWebList;
