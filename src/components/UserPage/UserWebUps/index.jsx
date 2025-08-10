import React, { useState, useEffect, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import routes from '../../../routes';
import { useNavigate } from 'react-router-dom';
import WeblistModalForm from './WeblistModalForm';
import WeblistDetailModal from './WeblistDetailModal';
import WeblistCarouselModal from './WeblistCarouselModal';

const Index = () => {
  const { apiRequest } = useContext(AuthApi);
  const navigate = useNavigate();

  const [weblist, setWeblist] = useState([]);
  const [category, setCategory] = useState([]);
  const [popup, setPopup] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedWeb, setSelectedWeb] = useState(null);
  const [modalType, setModalType] = useState(null); // 'form' | 'detail' | 'carousel'

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

  return (
    <div className="min-h-screen p-6 pt-32 bg-gray-50">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">🎨 Weblist Kamu</h2>
        <button
          onClick={() => { setSelectedWeb(null); setModalType('form'); }}
          className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
        >
          + Tambah Weblist
        </button>
      </div>

      {popup && <div className="p-3 mb-4 text-purple-800 bg-purple-100 rounded">{popup}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {weblist.map(w => (
          <div key={w.id} className="p-4 bg-white rounded shadow">
            <img src={w.image_path} alt={w.title} className="object-cover w-full h-40 mb-2 rounded" />
            <h3 className="font-bold">{w.title}</h3>
            <p className="text-sm text-gray-500">{w.category?.name}</p>
            <div className="mt-2 space-x-2">
              <button onClick={() => { setSelectedWeb(w); setModalType('form'); }} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(w.id)} className="text-red-600">Hapus</button>
              <button onClick={() => { setSelectedWeb(w); setModalType('detail'); }} className="text-green-600">Detail</button>
              <button onClick={() => { setSelectedWeb(w); setModalType('carousel'); }} className="text-orange-600">Carousel</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal handler */}
      {modalType === 'form' && (
        <WeblistModalForm
          close={() => setModalType(null)}
          fetchWeblist={fetchWeblist}
          category={category}
          web={selectedWeb}
        />
      )}
      {modalType === 'detail' && (
        <WeblistDetailModal
          close={() => setModalType(null)}
          web={selectedWeb}
        />
      )}
      {modalType === 'carousel' && (
        <WeblistCarouselModal
          close={() => setModalType(null)}
          web={selectedWeb}
        />
      )}
    </div>
  );
};

export default Index;
