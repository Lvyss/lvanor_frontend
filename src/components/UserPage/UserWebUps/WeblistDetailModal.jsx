import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';

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
      setPopup('Gagal ambil detail.');
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
      setPopup('Berhasil simpan detail.');
      setTimeout(close, 800);
    } catch {
      setPopup('Gagal simpan detail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Detail {web.title}</h2>
        {popup && <div className="p-2 mb-3 text-sm text-purple-800 bg-purple-100 rounded">{popup}</div>}
        <form onSubmit={handleSave} className="space-y-3">
          <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-2 border rounded" />
          <textarea placeholder="Fitur (pisahkan baris)" value={features} onChange={(e) => setFeatures(e.target.value)} className="w-full h-24 p-2 border rounded" />
          <input type="text" placeholder="Tech Stack" value={techStack} onChange={(e) => setTechStack(e.target.value)} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" />
          <input type="url" placeholder="Website Link" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} className="w-full p-2 border rounded" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={close} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeblistDetailModal;
