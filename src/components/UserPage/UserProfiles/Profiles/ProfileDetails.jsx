import React, { useState } from "react";
import {
  FaTiktok,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const socialLinks = [
  { field: "tiktok", Icon: FaTiktok, label: "TikTok" },
  { field: "github", Icon: FaGithub, label: "GitHub" },
  { field: "linkedin", Icon: FaLinkedin, label: "LinkedIn" },
  { field: "instagram", Icon: FaInstagram, label: "Instagram" },
  { field: "website", Icon: FaGlobe, label: "Website" },
  { field: "email", Icon: FaEnvelope, label: "Email" },
];

const ProfileDetails = ({ profile, onEditField, fetchProfile, apiRequest }) => {
  const [isSplineLoading, setIsSplineLoading] = useState(false);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const dataToSend = new FormData();
    dataToSend.append("profile_picture", file);

    try {
      toast.info("📤 Mengunggah foto...");
      await apiRequest("/profile/update", "PUT", dataToSend, true);
      toast.success("✅ Foto berhasil diperbarui!");
      fetchProfile();
    } catch {
      toast.error("❌ Gagal mengunggah foto");
    }
  };

  return (
    <div className="relative z-20 w-full pt-16 pb-10 mx-auto bg-gradient-blue md:pt-24">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Profil Kiri */}
        <div className="w-full pl-[5%] md:w-[45%] flex flex-col gap-1 text-white">
          {/* Foto Profil */}
          <div className="flex items-center gap-2">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.full_name}
                className="object-cover w-24 h-24 border-2 rounded-full shadow-xl border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/30" />
            )}

            <label htmlFor="profilePicUpload" className="flex items-center">
              <FaPen className="cursor-pointer text-white/50 hover:text-white" />
              <input
                type="file"
                id="profilePicUpload"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </label>
          </div>

          {/* Nama & Username */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="mt-5 text-lg font-satoshi text-white/90">
                @{profile.username}
              </h1>
              <FaPen
                onClick={() =>
                  onEditField("username", "Username", profile.username)
                }
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-[40px] font-bold font-satoshi">
                {profile.full_name}
              </h2>
              <FaPen
                onClick={() =>
                  onEditField("full_name", "Nama Lengkap", profile.full_name)
                }
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
                onClick={() => onEditField("bio", "Bio", profile.bio)}
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
                  onEditField("location", "Lokasi", profile.location)
                }
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </p>
          )}

          {/* Link Sosial */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {socialLinks.map(({ field, Icon, label }) =>
              profile[field] ? (
                <a
                  key={field}
                  href={
                    field === "email"
                      ? `mailto:${profile.email}`
                      : profile[field]
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition border rounded-full font-satoshi border-white/30 hover:bg-white/10"
                >
                  <Icon /> {label}
                </a>
              ) : null
            )}

            <button
              onClick={() =>
                onEditField("social_links", "Link Sosial Media", {
                  tiktok: profile.tiktok,
                  github: profile.github,
                  linkedin: profile.linkedin,
                  instagram: profile.instagram,
                  website: profile.website,
                  email: profile.email,
                })
              }
              aria-label="Edit Social Links"
            >
              <FaPen className="cursor-pointer text-white/50 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Spline Kanan */}
        <div className="w-full md:w-[50%] flex justify-center items-center relative">
          <div className="w-full h-[300px] md:h-[450px] bg-white/10 rounded-2xl shadow-lg backdrop-blur-sm overflow-hidden relative">
            {profile.spline && (
              <>
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSplineLoading ? 0 : 1 }}
                  transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                  src={profile.spline}
                  frameBorder="0"
                  className="absolute top-0 left-0 w-full h-full md:rounded-2xl"
                  allow="autoplay; fullscreen"
                  onLoad={() => setIsSplineLoading(false)}
                  onLoadStart={() => setIsSplineLoading(true)}
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
              onClick={() => onEditField("spline", "Spline Link", profile.spline)}
              className="absolute px-3 py-3 text-xs text-white rounded bg-blue-950 bottom-2 right-2 hover:to-blue-700"
            >
              <FaPen className="cursor-pointer text-white/50 hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
