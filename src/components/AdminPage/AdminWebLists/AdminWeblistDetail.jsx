import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthApi } from '../../LoginRegister/api/AuthApi';

const AdminWeblistDetail = () => {
  const { apiRequest } = useContext(AuthApi);
  const { id } = useParams();

  const [web, setWeb] = useState(null);
  const [loading, setLoading] = useState(true);

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => { fetchWebDetail(); }, []);

  const fetchWebDetail = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`admin/weblist/${id}`, 'GET');
      setWeb({
        ...res.data,
        weblist_images: res.data.weblist_images || [],
        weblist_detail: res.data.weblist_detail || {},
      });
    } catch {
      showError('Gagal mengambil detail web.');
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg) => { setPopupMessage(`Error: ${msg}`); setShowPopup(true); };
  const closePopup = () => { setShowPopup(false); setPopupMessage(''); };

  if (loading || !web) return <p className="p-8 text-center">Loading...</p>;

  const detail = web.weblist_detail;
  const features = detail.features ? JSON.parse(detail.features) : [];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Detail Web: {web.title}</h1>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <p className="mb-4">{popupMessage}</p>
            <button onClick={closePopup} className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600">OK</button>
          </div>
        </div>
      )}

      {/* Detail Web Info */}
      <div className="max-w-xl p-6 mx-auto mb-8 space-y-4 bg-white rounded shadow">
        <p><strong>Deskripsi:</strong> {detail.description || '-'}</p>
        <p><strong>Fitur:</strong> {features.length > 0 ? features.join(', ') : '-'}</p>
        <p><strong>Tech Stack:</strong> {detail.tech_stack || '-'}</p>
        <p><strong>Harga:</strong> {detail.price ? `Rp${detail.price}` : '-'}</p>
        <p><strong>Link Website:</strong> {detail.website_link ? (
          <a href={detail.website_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{detail.website_link}</a>
        ) : '-'}</p>
      </div>

      {/* Carousel Images */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {web.weblist_images.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">Belum ada gambar carousel.</p>
        ) : (
          web.weblist_images.map((img) => (
            <div key={img.id} className="p-4 bg-white rounded shadow">
              <img src={img.image_path} alt="Carousel" className="object-cover w-full h-48 mb-2 rounded" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminWeblistDetail;
