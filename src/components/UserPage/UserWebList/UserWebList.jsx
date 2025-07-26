// UserWebList.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { useNavigate } from "react-router-dom";
import routes from "../../../routes";

const UserWebList = () => {
  const { apiRequest } = useContext(AuthApi);
  const [weblist, setWeblist] = useState([]);
  const [category, setCategory] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(3);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const buttonsRef = useRef({});
  const navigate = useNavigate();

    useEffect(() => {
    fetchWeblist();
    fetchCategory();
  }, []);
  
const fetchWeblist = async () => {
  try {
    const response = await apiRequest("explore-weblist", "GET");
    console.log("🚀 Response Explore Weblist:", response.data);
    if (response && response.data) {
      const weblist = response.data.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category?.name || "Unknown",
        uploader: item.user?.name || "Anonymous",
        profile: item.user?.profile_picture || "/images/default-profile.png",
        image: item.image_path,
        likes: item.weblist_detail?.likes ?? 0, // ambil dari weblist_detail
        views: item.weblist_detail?.views ?? 0, // ambil dari weblist_detail
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



const handleLike = async (id) => {
  try {
    const response = await apiRequest(`weblist/${id}/like`, "POST");
    if (response?.data?.success) {
      const detailResponse = await apiRequest(`weblist/${id}`, "GET");
      if (detailResponse?.data) {
        const updatedWeblist = weblist.map((item) =>
          item.id === id
            ? {
                ...item,
                likes: detailResponse.data.likes,
              }
            : item
        );
        setWeblist(updatedWeblist);
      }
    }
  } catch (error) {
    console.error("Gagal menambahkan like:", error);
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

  const filteredProducts =
    selectedCategory === "All"
      ? weblist
      : weblist.filter((weblist) => weblist.category === selectedCategory);

  const visibleWeblist = filteredProducts.slice(0, visibleCount);

  return (
    <section
      id="weblist"
      className="flex flex-col items-center justify-center w-full min-h-screen py-20 bg-[linear-gradient(to_top,_rgba(193,206,229,1),_rgb(99,144,204))] text-white"
    >
      <h2
        id="category"
        className="mt-2 mb-2 text-4xl font-bold tracking-tight font-satoshi"
      >
        Jelajahi Website
      </h2>
      <p className="mb-5 text-center text-sm text-white/40 font-poppins leading-relaxed">
        Temukan berbagai website menarik dari kategori pilihan. Scroll dan
        jelajahi karya terbaik kami.
      </p>

      {/* Kategori */}
      <div className="relative flex flex-wrap justify-center mb-10 gap-2 px-4">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute h-9 rounded-full bg-white shadow-md"
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

      {/* Produk */}
      <div className="grid w-full grid-cols-1 gap-6 px-8 max-w-7xl md:grid-cols-3">
        <AnimatePresence>
          {visibleWeblist.map((weblist) => (
            <motion.div
              key={weblist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate(routes.userWeblistDetailAll(weblist.id))}
              className="flex flex-col overflow-hidden text-black transition-all duration-300 transform bg-white/10 backdrop-blur-md shadow-sm cursor-pointer rounded-xl hover:scale-[1.03] hover:shadow-xl border border-white/10"
            >
              <div className="relative w-full overflow-hidden aspect-video group">
                <img
                  src={weblist.image}
                  alt={weblist.uploader}
                  className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Overlay Title */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm w-1/2 font-medium px-4 pb-3 truncate">
                    {weblist.title || "Judul Website"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-4 bg-white/30 backdrop-blur-md border-t border-white/10">
                {/* Uploader Info */}
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={weblist.profile}
                    alt={weblist.uploader}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <span className="text-sm font-medium text-black truncate max-w-[120px]">
                    {weblist.uploader.length > 18
                      ? weblist.uploader.slice(0, 15) + "..."
                      : weblist.uploader}
                  </span>
                </div>

                {/* Likes & Views */}
                <div className="flex items-center gap-3 text-xs text-gray-700">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span>{(weblist.views ?? 0).toLocaleString()}</span>
                  </div>
                  <div
  className="flex items-center gap-1 cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    handleLike(weblist.id);
  }}
>
  <Heart className="w-4 h-4 text-gray-500" />
  <span>{(weblist.likes ?? 0).toLocaleString()}</span>
</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleCount < filteredProducts.length && (
        <button
          onClick={handleLoadMore}
          className="px-6 py-2 mt-12 text-white rounded-full bg-invaPurple hover:bg-invaPink transition-all shadow-md hover:shadow-lg"
        >
          Load More
        </button>
      )}
    </section>
  );
};

export default UserWebList;
