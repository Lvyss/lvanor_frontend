import React, { useState, useEffect, useContext } from "react";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { FiX, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const WeblistCarouselModal = ({ close, web }) => {
  const { apiRequest } = useContext(AuthApi);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await apiRequest(`my-weblist/${web.id}`, "GET");
      setImages(res.data.weblist_images || []);
    } catch {
      toast.error("Gagal ambil gambar.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      setLoading(true);
      await apiRequest(`my-weblist/${imageId}/images/`, "DELETE");
      toast.success("Berhasil hapus gambar.");
      fetchImages();
    } catch {
      toast.error("Gagal hapus gambar.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return toast.error("Pilih gambar dulu.");

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("carousel_images[]", file));

    try {
      await apiRequest(`my-weblist/${web.id}/images`, "POST", formData, true);
      toast.success("Berhasil upload gambar.");
      setFiles([]);
      fetchImages();
    } catch {
      toast.error("Gagal upload gambar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="w-full max-w-md p-10 text-white border shadow-lg bg-black/50 backdrop-blur-lg rounded-2xl border-white/20 font-poppins"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-5 mb-5 text-center">
          <h1 className="text-[30px] font-satoshi italic font-bold">
            Carousel {web.title}
          </h1>
        </div>

        {images.length > 0 ? (
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            loop
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 120,
              modifier: 2.5,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="w-64 h-40 max-w-2xl mx-auto mb-6"
          >
            {images.map((img, index) => (
              <SwiperSlide
                key={index}
                className="relative overflow-hidden bg-white shadow-lg rounded-xl"
              >
                {/* Tombol hapus pojok atas kanan */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(img.id);
                  }}
                  className="absolute z-20 p-1 text-white transition bg-red-600 rounded-full top-2 right-2 hover:bg-red-700"
                  title="Hapus Gambar"
                  aria-label="Hapus Gambar"
                >
                  <FiX className="w-4 h-4" />
                </button>

                <img
                  src={img.image_path}
                  alt={`carousel-${index}`}
                  className="object-cover w-full h-full rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="mb-6 italic text-center text-gray-400">
            Tidak ada gambar.
          </p>
        )}

        {/* Form upload dan tombol lain tetap sama */}
        <form onSubmit={handleUpload} className="flex flex-col items-center gap-4">
          {/* ... kode label dan input file */}
          <label className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden text-white transition-all duration-300 border rounded-full shadow-xl cursor-pointer border-white/30 group">
            <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[50%] group-hover:h-[200%] group-hover:opacity-20 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="relative z-10 w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V8m0 0l-3 3m3-3l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="relative z-10 font-satoshi">Tambah Gambar</span>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
              className="hidden"
            />
          </label>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={close}
              aria-label="Tutup"
              title="Tutup"
              className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
            >
              <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
              <FiX className="relative z-10 text-xl" />
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-label="Simpan"
              title="Simpan"
              className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
            >
              <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
              ) : (
                <FiCheck className="relative z-10 text-xl" />
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex-1 h-[1px] bg-white/50" />
          <img
            src="/images/logo.png"
            alt="logo"
            className="object-cover rounded-full w-7 h-7 animate-spin-slow"
          />
          <div className="flex-1 h-[1px] bg-white/50" />
        </div>
      </div>
    </div>
  );
};

export default WeblistCarouselModal;
