import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import { useNavigate } from 'react-router-dom';
import routes from '../../../routes';

// Popup Component
const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
      <p className="mb-4">{message}</p>
      <button onClick={onClose} className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600">OK</button>
    </div>
  </div>
);

// Item Card
const WebListItem = ({ image, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-white rounded shadow">
      <img src={image.image_path} alt={image.title} className="object-cover w-full h-48 mb-4 rounded" />
      <h3 className="mb-2 text-lg font-semibold">{image.title}</h3>
      <p className="mb-2 text-sm text-gray-600">Kategori: {image.category?.name || 'Unknown'}</p>
      {image.user && (
        <div className="flex items-center mb-2 space-x-2">
          <img src={image.user.profile_picture || '/images/default-profile.png'} alt="Uploader" className="object-cover w-8 h-8 rounded-full" />
          <span className="text-sm text-gray-700">{image.user.name}</span>
        </div>
      )}
      <div className="flex space-x-2">
        <button onClick={() => onDelete(image.id)} className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">Hapus</button>
        <button onClick={() => navigate(routes.adminWeblistDetailEdit(image.id))} className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600">Detail</button>
      </div>
    </div>
  );
};

// Hook untuk ambil data
const useWebList = () => {
  const { apiRequest } = useContext(AuthApi);
  const [images, setImages] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await apiRequest('admin/weblist', 'GET');
      setImages(res.data);
    } catch {
      showError('Gagal mengambil gambar.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin mau hapus?')) return;
    setLoading(true);
    try {
      await apiRequest(`admin/weblist/${id}`, 'DELETE');
      showSuccess('Data berhasil dihapus.');
      fetchImages();
    } catch (error) {
      showError(error?.data?.message || 'Gagal hapus gambar.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => { setPopupMessage(msg); setShowPopup(true); };
  const showError = (msg) => { setPopupMessage(`Error: ${msg}`); setShowPopup(true); };
  const closePopup = () => { setPopupMessage(''); setShowPopup(false); };

  return {
    images,
    popupMessage,
    showPopup,
    closePopup,
    loading,
    handleDelete,
  };
};

// Komponen Utama Admin
const Index = () => {
  const {
    images,
    popupMessage,
    showPopup,
    closePopup,
    loading,
    handleDelete,
  } = useWebList();

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Kelola Weblist 🛠️</h1>
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {images.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">Belum ada gambar.</p>
        ) : (
          images.map((img) => (
            <WebListItem key={img.id} image={img} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
