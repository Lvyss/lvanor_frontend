import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UserWeblistDetail from "../../UserWebList/UserWeblistDetails";
import WeblistModalForm from "../../UserWebUps/WeblistModalForm";
import WeblistDetailModal from "../../UserWebUps/WeblistDetailModal";
import WeblistCarouselModal from "../../UserWebUps/WeblistCarouselModal";
import toast from "react-hot-toast";
import { FiEdit, FiTrash, FiEye, FiImage } from "react-icons/fi";
const WeblistSection = ({
  weblist,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedWeblist,
  setSelectedWeblist,
  detailData,
  setDetailData,
  apiRequest,
  refreshData, // <-- terima ini
}) => {
  const [selectedWeb, setSelectedWeb] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [categories, setCategories] = useState([]);
  const filteredWeblist =
    selectedCategory === "All"
      ? weblist
      : weblist.filter((item) => item.category?.name === selectedCategory);

  const handleOpenDetail = async (id) => {
    try {
      const res = await apiRequest(`explore-weblist/${id}`, "GET");
      setDetailData(res.data);
      setSelectedWeblist(id);
    } catch (err) {
      toast.error("Gagal fetch detail.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus Weblist ini?")) return;
    setLoading(true);
    try {
      await apiRequest(`my-weblist/${id}`, "DELETE");
      toast.success("Berhasil hapus Weblist.");
      if (refreshData) refreshData(); // <-- refresh data di parent
    } catch {
      toast.error("Gagal hapus Weblist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-white">
        {categories.length > 0 && (
          <div className="pl-[5%] pr-[5%] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap flex-grow gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id ?? cat.name ?? cat}
                  onClick={() => setSelectedCategory(cat.name ?? cat)}
                  className={`relative z-10 px-5 py-2 rounded-full text-sm font-poppins transition-all duration-200 ${
                    selectedCategory === (cat.name ?? cat)
                      ? "text-white border border-white/30 shadow-xl"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.name ?? cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedWeb(null);
                setModalType("form");
              }}
              className="relative inline-flex items-center px-6 py-3 overflow-hidden text-sm text-white transition-all duration-300 border shadow-xl cursor-pointer rounded-3xl md:text-base border-white/30 group "
            >
              <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-700 ease-out transform group-hover:w-[50%] group-hover:h-[200%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
              <span className="relative z-10 flex items-center text-sm font-poppins">
                + Tambah Weblist
              </span>
            </button>
          </div>
        )}

        <div className="px-[5%] py-12 ">
          {filteredWeblist.length === 0 ? (
            <p className="text-gray-500 font-poppins">
              Belum ada weblist yang diunggah.
            </p>
          ) : (
            <div className="grid w-full grid-cols-1 gap-12 max-w-7xl sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredWeblist.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col overflow-hidden text-black transition-all duration-300 transform rounded-md cursor-pointer relative
                    after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[3px] after:w-0 after:bg-white after:transition-all after:duration-700 hover:after:w-full"
                  >
                    <div
                      onClick={() => handleOpenDetail(item.id)}
                      className="relative w-full overflow-hidden aspect-[4/3] group cursor-pointer"
                    >
                      <img
                        src={item.image_path}
                        alt={item.title}
                        className="object-cover w-full h-full transition-transform duration-500 ease-out rounded-md group-hover:scale-105"
                      />

                      {/* Judul tetap di sini, muncul saat hover */}
                      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-3 transition-opacity duration-300 rounded-sm opacity-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:opacity-100">
                        <p className="w-full mb-2 text-[15px] font-semibold text-white truncate font-poppins">
                          {item.title || "Judul Website"}
                        </p>
                      </div>

                      {/* Tombol selalu muncul, terpisah dari div judul */}
                      <div className="absolute flex space-x-2 z-9 top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWeb(item);
                            setModalType("form");
                          }}
                          className="p-2 text-blue-600 border rounded-full border-white/50 bg-black/20 hover:bg-white/20"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          disabled={loading}
                          className="p-2 text-red-600 border rounded-full border-white/50 bg-black/20 hover:bg-white/20"
                          title="Hapus"
                        >
                          <FiTrash className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWeb(item);
                            setModalType("detail");
                          }}
                          className="p-2 text-green-600 border rounded-full border-white/50 bg-black/20 hover:bg-white/20"
                          title="Detail"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWeb(item);
                            setModalType("carousel");
                          }}
                          className="p-2 text-orange-600 border rounded-full border-white/50 bg-black/20 hover:bg-white/20"
                          title="Carousel"
                        >
                          <FiImage className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {modalType === "form" && (
        <WeblistModalForm
          close={() => setModalType(null)}
          fetchWeblist={refreshData} // Kalau perlu, bisa passing callback dari parent
          category={categories}
          web={selectedWeb}
        />
      )}
      {modalType === "detail" && (
        <WeblistDetailModal
          close={() => setModalType(null)}
          web={selectedWeb}
        />
      )}
      {modalType === "carousel" && (
        <WeblistCarouselModal
          close={() => setModalType(null)}
          web={selectedWeb}
        />
      )}

      <UserWeblistDetail
        isOpen={!!selectedWeblist}
        onClose={() => {
          setSelectedWeblist(null);
          setDetailData(null);
        }}
        data={detailData}
      />
    </>
  );
};


export default WeblistSection;
