import React, { useEffect, useState, useContext } from "react";
import { AuthApi } from "../../LoginRegister/api/AuthApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  FaTiktok,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPen
} from "react-icons/fa";
import EditFieldModal from "./EditFieldModal";

const ProfilePage = () => {
  const { apiRequest } = useContext(AuthApi);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // Spline state
  const [isSplineLoading, setIsSplineLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [activeLabel, setActiveLabel] = useState("");
  const [activeValue, setActiveValue] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await apiRequest("profile", "GET");
      const detail = res.data?.detail || {};

      const filled = {
        id: detail.id || null,
        full_name: detail.full_name || "",
        username: detail.username || "",
        email: detail.email || "",
        profile_picture: detail.profile_picture || "",
        bio: detail.bio || "",
        location: detail.location || "",
        linkedin: detail.linkedin || "",
        github: detail.github || "",
        website: detail.website || "",
        tiktok: detail.tiktok || "",
        instagram: detail.instagram || "",
        spline: detail.spline || "",
      };

      setProfile(filled);

      if (filled.spline) setIsSplineLoading(true);
    } catch (err) {
      toast.error("❌ Gagal mengambil profil");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (field, label, value) => {
    setActiveField(field);
    setActiveLabel(label);
    setActiveValue(value || "");
    setShowModal(true);
  };

  const handleUpdateField = async (field, value) => {
    try {
      const dataToSend = new FormData();

      if (field === "social_links") {
        // Append semua field sosial media
        Object.keys(value).forEach((key) => {
          dataToSend.append(key, value[key] || "");
        });
      } else {
        dataToSend.append(field, value);
      }

      await apiRequest("/profile/update", "PUT", dataToSend, true);
      toast.success("✅ Data berhasil diperbarui!");
      fetchProfile();
    } catch (err) {
      toast.error("❌ Gagal update");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <p className="mt-20 text-center">Loading...</p>;
  }

  return (
    <div className="relative z-20 w-full pt-16 mx-auto bg-gradient-blue md:pt-24">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Profil Kiri */}
        <div className="w-full pl-[5%] md:w-[50%] flex flex-col gap-3 text-white">

          {/* Foto Profil */}
          <div className="flex flex-col items-start gap-2">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.full_name}
                className="object-cover w-24 h-24 border-2 rounded-full shadow-xl border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/30" />
            )}

            {/* Upload foto langsung */}
            <label
              htmlFor="profilePicUpload"
              className="px-3 py-1 text-xs text-white bg-purple-500 rounded cursor-pointer hover:bg-purple-600"
            >
              Ganti Foto
            </label>
            <input
              type="file"
              id="profilePicUpload"
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const dataToSend = new FormData();
                dataToSend.append("profile_picture", file);

                try {
                  toast.info("📤 Mengunggah foto...");
                  await apiRequest("/profile/update", "PUT", dataToSend, true);
                  toast.success("✅ Foto berhasil diperbarui!");
                  fetchProfile();
                } catch (err) {
                  toast.error("❌ Gagal mengunggah foto");
                }
              }}
            />
          </div>

          {/* Nama & Username */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-satoshi text-white/90">
                @{profile.username}
              </h1>
              <FaPen
                onClick={() => handleOpenModal("username", "Username", profile.username)}
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-[40px] font-bold font-satoshi">
                {profile.full_name}
              </h2>
              <FaPen
                onClick={() => handleOpenModal("full_name", "Nama Lengkap", profile.full_name)}
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="flex items-start gap-2">
              <p className="max-w-lg leading-relaxed text-md text-white/90 font-satoshi">
                {profile.bio}
              </p>
              <FaPen
                onClick={() => handleOpenModal("bio", "Bio", profile.bio)}
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </div>
          )}

          {/* Lokasi */}
          {profile.location && (
            <p className="flex items-center gap-2 text-sm font-satoshi text-white/60">
              <FaMapMarkerAlt className="text-white/40" /> {profile.location}
              <FaPen
                onClick={() =>
                  handleOpenModal("location", "Lokasi", profile.location)
                }
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </p>
          )}

          {/* Link Sosial */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sosial Media</h3>
              <button
                onClick={() =>
                  handleOpenModal("social_links", "Link Sosial Media", {
                    tiktok: profile.tiktok,
                    github: profile.github,
                    linkedin: profile.linkedin,
                    instagram: profile.instagram,
                    website: profile.website,
                    email: profile.email
                  })
                }
                className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-purple-500 rounded hover:bg-purple-600"
              >
                <FaPen /> Edit Semua
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { field: "tiktok", label: <FaTiktok />, text: "TikTok" },
                { field: "github", label: <FaGithub />, text: "GitHub" },
                { field: "linkedin", label: <FaLinkedin />, text: "LinkedIn" },
                { field: "instagram", label: <FaInstagram />, text: "Instagram" },
                { field: "website", label: <FaGlobe />, text: "Website" },
                { field: "email", label: <FaEnvelope />, text: "Email" },
              ].map(
                (link) =>
                  profile[link.field] && (
                    <a
                      key={link.field}
                      href={link.field === "email"
                        ? `mailto:${profile.email}`
                        : profile[link.field]
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition border rounded-full font-satoshi border-white/30 hover:bg-white/10"
                    >
                      {link.label} {link.text}
                    </a>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Spline Kanan */}
        <div className="w-full md:w-[50%] flex justify-center items-center relative">
          <div className="w-full h-[300px] md:h-[480px] bg-white/10 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden relative">
            {profile.spline && (
              <>
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSplineLoading ? 0 : 1 }}
                  transition={{
                    duration: 1.0,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  src={profile.spline}
                  frameBorder="0"
                  className="absolute top-0 left-0 w-full h-full md:rounded-2xl"
                  allow="autoplay; fullscreen"
                  onLoad={() => setIsSplineLoading(false)}
                />
                {isSplineLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 border-4 rounded-full border-white/30 border-t-white animate-spin" />
                  </div>
                )}
              </>
            )}

            {/* Edit spline */}
            <button
              onClick={() =>
                handleOpenModal("spline", "Spline Link", profile.spline)
              }
              className="absolute px-3 py-1 text-xs text-white bg-purple-500 rounded bottom-2 right-2 hover:bg-purple-600"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <EditFieldModal
          field={activeField}
          label={activeLabel}
          initialValue={activeValue}
          onClose={() => setShowModal(false)}
          onSave={(field, value) => handleUpdateField(field, value)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
