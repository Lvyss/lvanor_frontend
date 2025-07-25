import React, { useEffect, useState, useContext } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { apiRequest } = useContext(AuthApi);
  const [form, setForm] = useState({
    name: '',
    email: '',
    profile_picture: '',
    bio: '',
    phone: '',
    address: '',
  });

  const [originalForm, setOriginalForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await apiRequest('profile', 'GET');
      const user = response.data || response;

      const filledForm = {
        name: user.name || '',
        email: user.email || '',
        profile_picture: user.profile_picture || '',
        bio: user.bio || '',
        phone: user.phone || '',
        address: user.address || '',
      };

      setForm(filledForm);
      setOriginalForm(filledForm); // untuk bandingkan perubahan
      setPreviewImage(user.profile_picture);
    } catch (error) {
      console.error('❌ Gagal mengambil profil:', error);
      toast.error('❌ Gagal mengambil data profil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profile_picture: file });
      setPreviewImage(URL.createObjectURL(file));
      setProfilePictureChanged(true);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('_method', 'PUT'); // override jadi PUT

  Object.entries(form).forEach(([key, value]) => {
    if (key === 'profile_picture') {
      if (profilePictureChanged && value instanceof File) {
        formData.append(key, value);
      }
    } else {
      const originalValue = originalForm[key] || '';
      const trimmed = value?.toString().trim();
      if (trimmed && trimmed !== originalValue) {
        formData.append(key, trimmed);
      }
    }
  });

  if (!formData.has('profile_picture') && formData.keys().next().done) {
    toast.info('⚠️ Tidak ada perubahan yang dikirim.');
    return;
  }

  try {
    await apiRequest('/profile/update', 'POST', formData, true); // tetap pakai POST
    toast.success('✅ Profil berhasil diperbarui!');
    fetchProfile();
  } catch (error) {
    console.error('❌ Gagal update profil:', error);
    toast.error('❌ Update gagal: ' + (error.response?.data?.message || error.message));
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Profil Saya</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md p-6 mx-auto space-y-4 bg-white rounded shadow"
      >
        <div className="flex justify-center">
          <img
            src={previewImage || '/images/default-profile.png'}
            alt="Profile"
            className="object-cover w-32 h-32 mb-4 rounded-full"
          />
        </div>

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Nama"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          disabled
          className="w-full p-2 bg-gray-200 border rounded cursor-not-allowed"
          placeholder="Email"
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Bio"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Telepon"
        />

        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Alamat"
        />

        <button
          type="submit"
          className="w-full py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
