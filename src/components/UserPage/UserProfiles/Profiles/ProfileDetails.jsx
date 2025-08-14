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
import toast from "react-hot-toast";

const socialLinks = [
  { field: "tiktok", Icon: FaTiktok, label: "TikTok" },
  { field: "github", Icon: FaGithub, label: "GitHub" },
  { field: "linkedin", Icon: FaLinkedin, label: "LinkedIn" },
  { field: "instagram", Icon: FaInstagram, label: "Instagram" },
  { field: "email", Icon: FaEnvelope, label: "Email" },
    { field: "website", Icon: FaGlobe, label: "Portfolio Website" },
];

const ProfileDetails = ({ profile, onEditField, fetchProfile, apiRequest }) => {
  const [isSplineLoading, setIsSplineLoading] = useState(false);

  // State baru untuk popup pilihan sosial
  const [isSocialChoiceOpen, setIsSocialChoiceOpen] = useState(false);

  // Handle pilih sosial dari popup pilihan
  const handleSocialChoice = (field) => {
    setIsSocialChoiceOpen(false);
    // Panggil onEditField dengan field sosial yang dipilih dan value saat ini
    onEditField(
      field,
      socialLinks.find((s) => s.field === field)?.label || field,
      profile[field] || ""
    );
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const dataToSend = new FormData();
    dataToSend.append("profile_picture", file);

    try {
      await apiRequest("/profile/update", "PUT", dataToSend, true);
      toast.success("Foto berhasil diperbarui!");
      fetchProfile();
    } catch (err) {
  console.error("Upload foto error:", err);
  if (err.response) {
    console.error("Status:", err.response.status);
    console.error("Data:", err.response.data);
  }
  toast.error("Gagal mengunggah foto");
}

  };

  return (
    <div className="relative w-full pt-16 pb-10 mx-auto bg-gradient-blue md:pt-24">
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
            <div className="flex items-start gap-2">
              <p className="max-w-lg leading-relaxed text-md text-white/90 font-satoshi">
                {profile.bio}
              </p>
              <FaPen
                onClick={() => onEditField("bio", "Bio", profile.bio)}
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </div>

          {/* Lokasi */}
            <p className="flex items-center gap-2 text-sm font-satoshi text-white/60">
              <FaMapMarkerAlt className="text-white/40" /> {profile.location}
              <FaPen
                onClick={() =>
                  onEditField("location", "Lokasi", profile.location)
                }
                className="cursor-pointer text-white/50 hover:text-white"
              />
            </p>


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

            {/* Tombol edit link sosial: buka popup pilihan */}
            <button
              onClick={() => setIsSocialChoiceOpen(true)}
              aria-label="Edit Social Links"
            >
              <FaPen className="cursor-pointer text-white/50 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Spline Kanan */}
        <div className="w-full md:w-[50%] pr-[5%] flex justify-center items-center relative">
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
              onClick={() =>
                onEditField("spline", "Spline Link", profile.spline)
              }
              className="absolute px-3 py-3 text-xs text-white rounded bg-blue-950 bottom-2 right-2 hover:to-blue-700"
            >
              <FaPen className="cursor-pointer text-white/50 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup Pilihan Sosial Links */}
      {isSocialChoiceOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsSocialChoiceOpen(false)}
        >
          <div
            className="w-full max-w-md p-10 italic text-white border shadow-lg bg-black/50 backdrop-blur-lg rounded-2xl border-white/20 font-poppins"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-5 mb-5 text-center">
              <h1 className="text-[30px] font-satoshi font-bold">
                Pilih Link Sosial
              </h1>
            </div>
            <div className="mt-4">
              <ul className="grid grid-cols-3 gap-6 justify-items-center">
                {socialLinks.map(({ field, Icon, label }) => (
                  <li key={field}>
                    <button
                      onClick={() => handleSocialChoice(field)}
                      title={label}
                      aria-label={`Edit ${label}`}
                      className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
                    >
                      <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
                      <Icon className="relative z-10 text-xl" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
      )}
    </div>
  );
};




export default ProfileDetails;
