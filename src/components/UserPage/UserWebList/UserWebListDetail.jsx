import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const UserWebListDetail = () => {
  const { id } = useParams();
  const { apiRequest } = useContext(AuthApi);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWebDetail = async () => {
    try {
      const res = await apiRequest(`explore-weblist/${id}`, 'GET');
      setData(res.data);
    } catch (err) {
      console.error("Gagal ambil detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebDetail();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-700">Loading...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">Data tidak ditemukan</div>;

  const detail = data.weblist_detail;
  const images = data.weblist_images || [];

  return (
    <div className="relative z-10 min-h-screen px-6 py-20 bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="max-w-5xl p-8 mx-auto bg-white border shadow-2xl bg-opacity-70 backdrop-blur-lg rounded-3xl md:p-12 border-white/50">

        {/* Gambar Utama */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 overflow-hidden rounded-2xl"
        >
          <img
            src={data.image_path}
            alt={data.title}
            className="object-cover w-full h-64 shadow-md md:h-96 rounded-2xl"
          />
        </motion.div>

        {/* Judul */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 text-4xl font-bold text-center text-blue-800 font-poppins drop-shadow"
        >
          {data.title}
        </motion.h1>

        {/* Detail */}
        {detail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 text-lg leading-relaxed text-gray-800"
          >
            <p><span className="font-semibold text-blue-900">📝 Deskripsi:</span> {detail.description}</p>

            <div>
              <p className="font-semibold text-blue-900">✨ Fitur:</p>
              <ul className="pl-5 list-disc">
                {JSON.parse(detail.features || "[]").map((fitur, i) => (
                  <li key={i}>{fitur}</li>
                ))}
              </ul>
            </div>

            <p><span className="font-semibold text-blue-900">🧠 Tech Stack:</span> {detail.tech_stack}</p>
            <p><span className="font-semibold text-blue-900">💸 Harga:</span> {detail.price ? `Rp ${detail.price.toLocaleString()}` : 'Gratis'}</p>

            {detail.website_link && (
              <a
                href={detail.website_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 mt-4 text-white transition-all duration-300 shadow-md rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 hover:scale-105"
              >
                🔗 Kunjungi Website
              </a>
            )}
          </motion.div>
        )}

        {/* Carousel */}
        {images.length > 0 && (
          <div className="mt-16">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6 text-2xl font-bold text-center text-blue-700"
            >
              🎞️ Galeri Carousel
            </motion.h3>

            <Swiper
              modules={[EffectCoverflow, Navigation, Pagination]}
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              loop
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{ clickable: true }}
              navigation
              className="w-full px-4"
            >
              {images.map((img, i) => (
                <SwiperSlide
                  key={img.id || i}
                  className="max-w-sm overflow-hidden shadow-lg rounded-2xl"
                >
                  <img
                    src={img.image_path}
                    alt={`carousel-${i}`}
                    className="object-cover w-full h-64 rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWebListDetail;
