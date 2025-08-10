import React, { useState, useEffect, useContext } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import UserWeblistDetail from "../../UserWebList/UserWeblistDetails";
import WeblistModalForm from '../../UserWebUps/WeblistModalForm';
import WeblistDetailModal from '../../UserWebUps/WeblistDetailModal';
import WeblistCarouselModal from '../../UserWebUps/WeblistCarouselModal';
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
}) => {
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
      console.error("Gagal fetch detail:", err);
    }
  };
  const [selectedWeb, setSelectedWeb] = useState(null);
  const [modalType, setModalType] = useState(null);
const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState('');
  useEffect(() => {
    fetchWeblist();
    fetchCategory();
  }, []);

  const fetchWeblist = async () => {
    try {
      const res = await apiRequest('my-weblist', 'GET');
      weblist(res.data);
    } catch {
      setPopup('Gagal ambil data Weblist.');
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await apiRequest('category', 'GET');
      setCategory(res.data);
    } catch {
      setPopup('Gagal ambil kategori.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus Weblist ini?')) return;
    setLoading(true);
    try {
      await apiRequest(`my-weblist/${id}`, 'DELETE');
      setPopup('Berhasil hapus Weblist.');
      fetchWeblist();
    } catch {
      setPopup('Gagal hapus Weblist.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <div className="bg-gradient-white">
      {/* KATEGORI - Full width */}
{weblist.length > 0 && (
  <div className="pl-[5%] pr-[5%] flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap flex-grow gap-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`relative z-10 px-5 py-2 rounded-full text-sm font-poppins transition-all duration-200 ${
            selectedCategory === cat
              ? "text-white border border-white/30 shadow-xl"
              : "text-white hover:bg-white/10 hover:text-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
    <button
      onClick={() => {
        setSelectedWeb(null);
        setModalType("form");
      }}
      className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 whitespace-nowrap"
    >
      + Tambah Weblist
    </button>
  </div>
)}


      {/* SECTION WEBLIST */}
      <div className="px-[5%] py-12 ">
        {filteredWeblist.length === 0 ? (
          <p className="text-gray-500 font-poppins">Belum ada weblist yang diunggah.</p>
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
                  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-black/50 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {/* Gambar */}
                  <div  onClick={() => handleOpenDetail(item.id)}
                  className="relative w-full overflow-hidden aspect-[4/3] group">
                    <img
                   
                      src={item.image_path}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 ease-out rounded-md group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end transition-opacity duration-300 rounded-sm opacity-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:opacity-100">
                      <p className="w-1/2 px-4 pb-3 text-[15px] font-semibold text-white truncate font-poppins">
                        {item.title || "Judul Website"}
                      </p>
                    </div>
                    
                  </div>
                              <div className="mt-10 space-x-2">
              <button onClick={() => { setSelectedWeb(item); setModalType('form'); }} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600">Hapus</button>
              <button onClick={() => { setSelectedWeb(item); setModalType('detail'); }} className="text-green-600">Detail</button>
              <button onClick={() => { setSelectedWeb(item); setModalType('carousel'); }} className="text-orange-600">Carousel</button>
            </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      </div>

 {/* Modal handler */}
      {modalType === 'form' && (
        <WeblistModalForm
          close={() => setModalType(null)}
          fetchWeblist={fetchWeblist}
          category={category}
          web={selectedWeb}
        />
      )}
      {modalType === 'detail' && (
        <WeblistDetailModal
          close={() => setModalType(null)}
          web={selectedWeb}
        />
      )}
      {modalType === 'carousel' && (
        <WeblistCarouselModal
          close={() => setModalType(null)}
          web={selectedWeb}
        />
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
    </>
    
  );
};

export default WeblistSection;
