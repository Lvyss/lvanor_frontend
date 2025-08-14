import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthApi } from '../../../LoginRegister/api/AuthApi';
import {
  FaGithub, FaLinkedin, FaInstagram, FaTiktok,
  FaGlobe, FaEnvelope, FaMapMarkerAlt
} from 'react-icons/fa';
import { AnimatePresence, motion } from "framer-motion";
import UserWeblistDetail from "../../UserWebList/UserWeblistDetails";

// Cache sederhana untuk sesi ini
const profileCache = {
  profile: null,
  weblist: null,
  categories: null
};

const index = () => {
  const { apiRequest } = useContext(AuthApi);

  // ===================== STATE =====================
  const [profile, setProfile] = useState(null);
  const [weblist, setWeblist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeblist, setSelectedWeblist] = useState(null);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSplineLoading, setIsSplineLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);

  const fetchedOnce = useRef(false);

  // ===================== HANDLERS =====================
  const handleOpenDetail = async (id) => {
    try {
      const res = await apiRequest(`explore-weblist/${id}`, "GET");
      setDetailData(res.data);
      setSelectedWeblist(id);
    } catch (err) {
      console.error("Gagal fetch detail:", err);
    }
  };

  const fetchProfileAndWeblist = async () => {
    // Pakai cache kalau ada
    if (profileCache.profile && profileCache.weblist) {
      setProfile(profileCache.profile);
      setWeblist(profileCache.weblist);
      setCategories(profileCache.categories);
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Ambil profile
      const response = await apiRequest('profile', 'GET');
      const detail = response.data?.detail || response.detail || {};

      const filled = {
        id: detail.id || null,
        full_name: detail.full_name || '',
        username: detail.username || '',
        email: detail.email || '',
        profile_picture: detail.profile_picture || '',
        bio: detail.bio || '',
        location: detail.location || '',
        linkedin: detail.linkedin || '',
        github: detail.github || '',
        website: detail.website || '',
        tiktok: detail.tiktok || '',
        instagram: detail.instagram || '',
        spline: detail.spline || '',
      };

      // 2️⃣ Ambil weblist (kalau ID ada)
      let data = [];
      let cats = ["All"];
      if (filled.id) {
        const listResponse = await apiRequest(`public-weblist/${filled.id}`, 'GET');
        data = listResponse.data || [];
        cats = ["All", ...Array.from(new Set(data.map(item => item.category?.name).filter(Boolean))).sort()];
      }

      // Simpan ke state
      setProfile(filled);
      setWeblist(data);
      setCategories(cats);

      // Simpan ke cache
      profileCache.profile = filled;
      profileCache.weblist = data;
      profileCache.categories = cats;

    } catch (error) {
      console.error('❌ Gagal mengambil data profil publik:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===================== EFFECTS =====================
  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchProfileAndWeblist();
    }
  }, []);

  // ===================== EARLY RETURN =====================
  if (loading) return <p className="mt-20 text-center">Loading...</p>;
  if (!profile) return <p className="mt-20 text-center text-red-500">Profil tidak ditemukan.</p>;

  // ===================== FILTER =====================
  const filteredWeblist = selectedCategory === "All"
    ? weblist
    : weblist.filter(item => item.category?.name === selectedCategory);

  // ===================== RENDER =====================
  return (
    <section className="relative w-full">
      {/* HEADER */}
      <div className="relative w-full pt-16 pb-10 mx-auto bg-gradient-blue md:pt-24">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          
          {/* LEFT - PROFILE */}
          <div className="w-full pl-[5%] md:w-[45%] flex flex-col gap-1 text-white">
            {profile.profile_picture
              ? <img src={profile.profile_picture} alt={profile.full_name}
                  className="object-cover w-24 h-24 border-2 rounded-full shadow-xl border-white/20" />
              : <div className="w-24 h-24 rounded-full bg-white/30" />
            }
            <div>
              <h1 className="mt-5 text-lg font-satoshi text-white/90">@{profile.username}</h1>
              <h2 className="text-[40px] font-bold font-satoshi">{profile.full_name}</h2>
            </div>
            {profile.bio && <p className="max-w-lg leading-relaxed text-md text-white/90 font-satoshi">{profile.bio}</p>}
            {profile.location && (
              <p className="flex items-center gap-2 text-sm font-satoshi text-white/60">
                <FaMapMarkerAlt className="text-white/40" /> {profile.location}
              </p>
            )}

            {/* SOCIAL LINKS */}
            <div className="flex flex-wrap gap-3 mt-6">
              {profile.tiktok && <SocialButton href={profile.tiktok} icon={<FaTiktok />} text="TikTok" />}
              {profile.github && <SocialButton href={profile.github} icon={<FaGithub />} text="GitHub" />}
              {profile.linkedin && <SocialButton href={profile.linkedin} icon={<FaLinkedin />} text="LinkedIn" />}
              {profile.instagram && <SocialButton href={profile.instagram} icon={<FaInstagram />} text="Instagram" />}
              {profile.email && <SocialButton href={`mailto:${profile.email}`} icon={<FaEnvelope />} text="Email" />}
              {profile.website && <SocialButton href={profile.website} icon={<FaGlobe />} text="Portfolio Website" />}
              
            </div>
          </div>

          {/* RIGHT - SPLINE */}
          <div className="w-full md:w-[50%] pr-[5%] flex justify-center items-center relative">
            <div className="w-full h-[300px] md:h-[450px] rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden relative">
              {isSplineLoading && (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="w-10 h-10 border-4 rounded-2xl border-white/30 border-t-white animate-spin" />
                </div>
              )}
              {profile.spline && (
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.0, ease: "easeInOut", delay: 0.2 }}
                  src={profile.spline}
                  frameBorder="0"
                  className="absolute top-0 left-0 w-full h-full "
                  allow="autoplay; fullscreen"
                  onLoad={() => setIsSplineLoading(false)} // ✅ sinkron
                />
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* CATEGORY FILTER */}
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
          </div>
        )}

        {/* WEBLIST GRID */}
        <div className="px-[5%] py-12">
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
                    onClick={() => handleOpenDetail(item.id)}
                    className="flex flex-col overflow-hidden text-black transition-all duration-300 transform rounded-md cursor-pointer relative
                      after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-black/50 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    <div className="relative w-full overflow-hidden aspect-[4/3] group">
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
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

// ===================== SUB COMPONENT =====================
const SocialButton = ({ href, icon, text }) => (
  <a href={href} target="_blank" rel="noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition border rounded-full font-satoshi border-white/30 hover:bg-white/10">
    {icon} {text}
  </a>
);

export default index;
