import React, { useState, useContext, useEffect } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';

const WeblistModalForm = ({ close, fetchWeblist, category, web }) => {
  const { apiRequest } = useContext(AuthApi);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState('');

  useEffect(() => {
    if (web) {
      setTitle(web.title || '');
      setCategoryId(web.category_id || '');
    }
  }, [web]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    if (categoryId) formData.append('category_id', categoryId);
    if (image) formData.append('image', image);

    try {
      if (web) {
        await apiRequest(`my-weblist/${web.id}`, 'PUT', formData, true);
        setPopup('Berhasil update Weblist.');
      } else {
        await apiRequest('my-weblist', 'POST', formData, true);
        setPopup('Berhasil tambah Weblist.');
      }
      fetchWeblist();
      setTimeout(close, 800);
    } catch {
      setPopup('Gagal simpan Weblist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg p-6 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">{web ? 'Edit Weblist' : 'Tambah Weblist'}</h2>
        {popup && <div className="p-2 mb-3 text-sm text-purple-800 bg-purple-100 rounded">{popup}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Judul Web"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Pilih Kategori</option>
            {category.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={close} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeblistModalForm;
