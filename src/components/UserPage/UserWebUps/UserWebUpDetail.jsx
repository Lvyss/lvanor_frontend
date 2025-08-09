import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthApi } from '../../LoginRegister/api/AuthApi';

const UserWebUpDetail = () => {
  const { id } = useParams();
  const { apiRequest } = useContext(AuthApi);

  const [web, setWeb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [techStack, setTechStack] = useState('');
  const [price, setPrice] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [carouselFiles, setCarouselFiles] = useState([]);

  const [popup, setPopup] = useState('');

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`my-weblist/${id}`, 'GET');
      const detail = res.data.weblist_detail || {};

      setWeb(res.data);
      setDescription(detail.description || '');
      setFeatures(Array.isArray(detail.features) ? detail.features.join('\n') : '');

      setTechStack(detail.tech_stack || '');
      setPrice(detail.price || '');
      setWebsiteLink(detail.website_link || '');
    } catch {
      setPopup('Gagal mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetail = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
await apiRequest(`my-weblist/${id}/detail`, 'POST', {
  ...(description && { description }),
...(features && {
  features: features
    .split('\n') // pisah per baris, bukan koma
    .map(f => f.trim())
    .filter(Boolean), // hilangkan baris kosong
}),

  ...(techStack && { tech_stack: techStack }),
  ...(price && { price }), // biarkan 0 tetap dikirim
  ...(websiteLink && { website_link: websiteLink }),
});


      setPopup('Detail berhasil diperbarui.');
      fetchDetail();
    } catch {
      setPopup('Gagal update detail.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUploadCarousel = async (e) => {
    e.preventDefault();
    if (carouselFiles.length === 0) return setPopup('Pilih gambar terlebih dahulu.');

    setCarouselLoading(true);
    const formData = new FormData();
    carouselFiles.forEach(file => formData.append('carousel_images[]', file));

    try {
      await apiRequest(`my-weblist/${id}/images`, 'POST', formData, true);
      setPopup('Gambar carousel diupload.');
      setCarouselFiles([]);
      document.getElementById('carouselInput').value = '';
      fetchDetail();
    } catch {
      setPopup('Gagal upload carousel.');
    } finally {
      setCarouselLoading(false);
    }
  };

  const handleDeleteCarousel = async (imageId) => {
    if (!window.confirm('Yakin hapus gambar?')) return;

    setDeleteLoadingId(imageId);
    try {
      await apiRequest(`my-weblist/images/${imageId}`, 'DELETE');
      setPopup('Gambar dihapus.');
      fetchDetail();
    } catch {
      setPopup('Gagal hapus gambar.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading || !web) return <p className="p-8 text-center">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center">🧩 Detail Weblist: {web.title}</h1>

      {popup && (
        <div className="p-4 mb-4 text-purple-800 bg-purple-100 rounded">
          {popup}
        </div>
      )}

      {/* Form Detail */}
      <form onSubmit={handleUpdateDetail} className="max-w-xl p-6 mx-auto mb-6 space-y-4 bg-white rounded shadow">
        <textarea placeholder="Deskripsi" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-2 border rounded" />
        <textarea placeholder="Fitur (pisahkan koma)" value={features} onChange={(e) => setFeatures(e.target.value)} className="w-full h-24 p-2 border rounded" />
        <input type="text" placeholder="Tech Stack" value={techStack} onChange={(e) => setTechStack(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" />
        <input type="url" placeholder="Website Link" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" disabled={submitLoading} className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          {submitLoading ? 'Loading...' : 'Simpan Detail'}
        </button>
      </form>

      {/* Form Upload Carousel */}
      <form onSubmit={handleUploadCarousel} className="max-w-xl p-6 mx-auto mb-6 space-y-4 bg-white rounded shadow">
        <input type="file" multiple id="carouselInput" onChange={(e) => setCarouselFiles([...e.target.files])} className="w-full p-2 border rounded" />
        <button type="submit" disabled={carouselLoading} className="w-full py-2 text-white bg-green-500 rounded hover:bg-green-600">
          {carouselLoading ? 'Uploading...' : 'Upload Gambar Carousel'}
        </button>
      </form>

      {/* Tampilkan Carousel */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {web.weblist_images?.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">Tidak ada gambar carousel.</p>
        ) : (
          web.weblist_images.map((img) => (
            <div key={img.id} className="relative p-4 bg-white rounded shadow">
              <img src={img.image_path} alt="Carousel" className="object-cover w-full h-40 rounded" />
              <button
                onClick={() => handleDeleteCarousel(img.id)}
                disabled={deleteLoadingId === img.id}
                className="absolute px-2 py-1 text-xs text-white bg-red-500 rounded top-2 right-2 hover:bg-red-600"
              >
                {deleteLoadingId === img.id ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserWebUpDetail;
