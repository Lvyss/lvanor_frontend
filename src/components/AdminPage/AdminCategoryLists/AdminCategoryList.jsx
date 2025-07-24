import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from "../../LoginRegister/api/AuthApi";

const AdminCategoryList = () => {
  const { apiRequest } = useContext(AuthApi);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  // Ambil semua kategori
const fetchCategory = async () => {
  setLoading(true);
  try {
    const response = await apiRequest('admin/category', 'GET');
    console.log('✅ Response:', response); // Cek isinya

    // Ubah di sini:
    setCategory(response.data); // Kalau hasil console berupa { status, message, data }

    // Kalau hasil console berupa array langsung, cukup pakai ini:
    // setCategory(response);

  } catch (error) {
    showPopup(error.response?.data?.message || 'Gagal mengambil kategori!', 'error');
    console.error('❌ Gagal mengambil kategori:', error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCategory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showPopup('Nama kategori tidak boleh kosong!', 'error');
      return;
    }

    try {
      if (editId) {
        await apiRequest(`admin/category/${editId}`, 'PUT', { name });
        showPopup('Kategori berhasil diupdate!', 'success');
      } else {
        await apiRequest('admin/category', 'POST', { name });
        showPopup('Kategori berhasil ditambahkan!', 'success');
      }

      setName('');
      setEditId(null);
      fetchCategory();
    } catch (error) {
      showPopup(error.response?.data?.message || 'Gagal menyimpan kategori!', 'error');
      console.error('❌ Gagal menyimpan kategori:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus kategori ini?')) return;

    try {
      await apiRequest(`admin/category/${id}`, 'DELETE');
      showPopup('Kategori berhasil dihapus!', 'success');
      fetchCategory();
    } catch (error) {
      showPopup(error.response?.data?.message || 'Gagal menghapus kategori!', 'error');
      console.error('❌ Gagal menghapus kategori:', error.response?.data || error.message);
    }
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setName(category.name);
  };

  const showPopup = (message, type = 'success') => {
    setPopup({ show: true, message, type });
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: 'success' });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Manajemen Kategori 🗂️</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col max-w-md p-6 mx-auto mb-8 space-y-4 bg-white rounded shadow">
        <input
          type="text"
          placeholder="Nama Kategori"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
        >
          {editId ? 'Update Kategori' : 'Tambah Kategori'}
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <p className="mb-4 text-center text-blue-500">Memuat data kategori...</p>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {category.length > 0 ? (
          category.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 bg-white rounded shadow">
              <span>{category.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-500">Belum ada kategori.</p>
        )}
      </div>

      {/* Popup */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <h3 className={`mb-4 text-xl font-bold ${popup.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {popup.type === 'success' ? 'Berhasil' : 'Gagal'}
            </h3>
            <p className="mb-4">{popup.message}</p>
            <button
              onClick={closePopup}
              className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryList;
