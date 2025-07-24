import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import { useNavigate } from 'react-router-dom';
import routes
 from '../../../routes';
const UserWebUp = () => {
  const { apiRequest } = useContext(AuthApi);
  const [weblist, setWeblist] = useState([]);
  const [category, setCategory] = useState([]);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const [popup, setPopup] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeblist();
    fetchCategory();
  }, []);

  const fetchWeblist = async () => {
    try {
      const res = await apiRequest('my-weblist', 'GET');
      setWeblist(res.data);
    } catch {
      setPopup('Gagal ambil data Weblist.');
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await apiRequest('category', 'GET');
      setCategory(res.data);
    } catch {
      setPopup('Gagal ambil kategori.');
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !categoryId || (!editId && !image)) {
    return setPopup('Isi semua form.');
  }

  setLoading(true);

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category_id', categoryId);
  if (image) formData.append('image', image);

  try {
    if (editId) {

await apiRequest(`my-weblist/${editId}`, 'PUT', formData, true);

      setPopup('Berhasil update Weblist.');
    } else {
      await apiRequest('my-weblist', 'POST', formData, true);
      setPopup('Berhasil tambah Weblist.');
    }

    resetForm();
    fetchWeblist();
  } catch {
    setPopup('Gagal simpan Weblist.');
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setCategoryId(item.category_id);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus Weblist ini?')) return;
    setLoading(true);
    try {
      await apiRequest(`my-weblist/${id}`, 'DELETE');
      setPopup('Berhasil hapus Weblist.');
      fetchWeblist();
    } catch {
      setPopup('Gagal hapus Weblist.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setCategoryId('');
    setImage(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="mb-6 text-2xl font-bold text-center">🎨 Weblist Kamu</h2>

      {popup && (
        <div className="p-4 mb-4 text-purple-800 bg-purple-100 rounded">{popup}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg p-4 mx-auto mb-6 space-y-4 bg-white rounded shadow">
<input
  type="text"
  placeholder="Judul"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className={`w-full p-2 border rounded ${!title.trim() && 'border-red-500'}`}
/>

<select
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  className={`w-full p-2 border rounded ${!categoryId && 'border-red-500'}`}
>
  <option value="">Pilih Kategori</option>
  {category.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full py-2 text-white bg-purple-500 rounded hover:bg-purple-600">
          {editId ? 'Update' : 'Upload'}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {weblist.map(w => (
          <div key={w.id} className="p-4 bg-white rounded shadow">
            <img src={w.image_path} alt={w.title} className="object-cover w-full h-40 mb-2 rounded" />
            <h3 className="font-bold">{w.title}</h3>
            <p className="text-sm text-gray-500">{w.category?.name}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(w)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(w.id)} className="text-red-600">Hapus</button>
              <button onClick={() => navigate(routes.userWeblistEditDetail(w.id))} className="text-green-600">Detail</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWebUp;
