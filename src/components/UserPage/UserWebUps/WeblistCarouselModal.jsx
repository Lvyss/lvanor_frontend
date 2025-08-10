import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';

const WeblistCarouselModal = ({ close, web }) => {
  const { apiRequest } = useContext(AuthApi);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [popup, setPopup] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await apiRequest(`my-weblist/${web.id}`, 'GET');
      setImages(res.data.weblist_images || []);
    } catch {
      setPopup('Gagal ambil gambar.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return setPopup('Pilih gambar dulu.');

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('carousel_images[]', file));

    try {
      await apiRequest(`my-weblist/${web.id}/images`, 'POST', formData, true);
      setPopup('Berhasil upload gambar.');
      setFiles([]);
      fetchImages();
    } catch {
      setPopup('Gagal upload gambar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus gambar ini?')) return;
    setDeleteId(id);
    try {
      await apiRequest(`my-weblist/images/${id}`, 'DELETE');
      setPopup('Gambar dihapus.');
      fetchImages();
    } catch {
      setPopup('Gagal hapus gambar.');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Carousel {web.title}</h2>
        {popup && <div className="p-2 mb-3 text-sm text-purple-800 bg-purple-100 rounded">{popup}</div>}
        
        <form onSubmit={handleUpload} className="flex mb-4 space-x-2">
          <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} className="flex-1 p-2 border rounded" />
          <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500">Tidak ada gambar.</p>
          ) : (
            images.map(img => (
              <div key={img.id} className="relative">
                <img src={img.image_path} alt="" className="object-cover w-full h-40 rounded" />
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleteId === img.id}
                  className="absolute px-2 py-1 text-xs text-white bg-red-500 rounded top-2 right-2 hover:bg-red-600"
                >
                  {deleteId === img.id ? '...' : 'Hapus'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={close} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Tutup</button>
        </div>
      </div>
    </div>
  );
};

export default WeblistCarouselModal;
