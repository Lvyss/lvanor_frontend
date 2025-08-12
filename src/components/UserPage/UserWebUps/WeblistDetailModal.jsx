import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import { FiX, FiCheck } from 'react-icons/fi';
import toast from "react-hot-toast";
const WeblistDetailModal = ({ close, web }) => {
  const { apiRequest } = useContext(AuthApi);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [techStack, setTechStack] = useState('');
  const [price, setPrice] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [popup, setPopup] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await apiRequest(`my-weblist/${web.id}`, 'GET');
      const detail = res.data.weblist_detail || {};
      setDescription(detail.description || '');
      setFeatures(Array.isArray(detail.features) ? detail.features.join('\n') : '');
      setTechStack(detail.tech_stack || '');
      setPrice(detail.price || '');
      setWebsiteLink(detail.website_link || '');
    } catch {
      toast.error('Gagal ambil detail.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiRequest(`my-weblist/${web.id}/detail`, 'POST', {
        ...(description && { description }),
        ...(features && {
          features: features.split('\n').map(f => f.trim()).filter(Boolean),
        }),
        ...(techStack && { tech_stack: techStack }),
        ...(price && { price }),
        ...(websiteLink && { website_link: websiteLink }),
      });
      toast.success('Berhasil simpan detail.');
      setTimeout(close, 800);
    } catch {
      toast.error('Gagal simpan detail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="w-full max-w-4xl p-10 text-white border shadow-lg bg-black/50 backdrop-blur-lg rounded-2xl border-white/20 font-satoshi"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Judul */}
        <div className="mt-5 mb-5 text-center">
          <h1 className="text-[30px] font-satoshi italic font-bold">
            Detail {web.title}
          </h1>
        </div>
        {/* Popup */}
        {popup && (
          <div className="p-3 mb-6 font-medium text-center rounded-lg select-none">
            {popup}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 md:grid-cols-2">
<textarea
  placeholder="Deskripsi"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  className="scroll-hide w-full h-40 px-3 py-2 bg-white/20 border border-blue-950 rounded-xl text-white placeholder-[#a3b0ff] focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none overflow-y-scroll"
/>

<textarea
  placeholder="Fitur (pisahkan baris)"
  value={features}
  onChange={(e) => setFeatures(e.target.value)}
  className="scroll-hide w-full h-40 px-3 py-2 bg-white/20 border border-blue-950 rounded-xl text-white placeholder-[#a3b0ff] focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none overflow-y-scroll"
/>

          <input
            type="text"
            placeholder="Tech Stack"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full px-3 py-2 bg-white/20 border border-blue-950 rounded-xl text-white placeholder-[#a3b0ff] focus:outline-none focus:ring-2 focus:ring-blue-950 text-center"
          />
          <input
            type="number"
            placeholder="Harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 bg-white/20 border border-blue-950 rounded-xl text-white placeholder-[#a3b0ff] focus:outline-none focus:ring-2 focus:ring-blue-950 text-center"
          />
          <input
            type="url"
            placeholder="Website Link"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="w-full col-span-1 md:col-span-2 px-3 py-2 bg-white/20 border border-blue-950 rounded-xl text-white placeholder-[#a3b0ff] focus:outline-none focus:ring-2 focus:ring-blue-950 text-center"
          />

          {/* Tombol */}
          <div className="flex justify-center col-span-1 gap-6 mt-4 md:col-span-2">
            <button
              type="button"
              onClick={close}
              aria-label="Batal"
              title="Batal"
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

        {/* Footer */}
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

export default WeblistDetailModal;
