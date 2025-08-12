import React, { useState, useContext, useEffect, Fragment } from 'react';
import { AuthApi } from '../../LoginRegister/api/AuthApi';
import { FiX, FiCheck } from 'react-icons/fi';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import toast from "react-hot-toast";
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
      if (web.image) {
        setExistingImage(web.image);
      }
    }
  }, [web]);

  const selectedCategory = category.find((c) => c.id === categoryId) || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    if (categoryId) formData.append('category_id', categoryId);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (web) {
        await apiRequest(`my-weblist/${web.id}`, 'PUT', formData, true);
        toast.success('Berhasil update Weblist.');
      } else {
        await apiRequest('my-weblist', 'POST', formData, true);
        toast.success('Berhasil tambah Weblist.');
      }
      fetchWeblist();
      setTimeout(close, 800);
    } catch {
      toast.error('Gagal simpan Weblist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="w-full max-w-md p-10 text-white border shadow-lg bg-black/50 backdrop-blur-lg rounded-xl border-white/20 font-satoshi"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-5 mb-5 text-center">
          <h1 className="text-[30px] font-satoshi italic font-bold">
            {web ? 'Edit Weblist' : 'Tambah Weblist'}
          </h1>
        </div>

        {popup && (
          <div className="p-2 mb-4 text-sm text-center rounded font-satoshi">
            {popup}
          </div>
        )}


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Judul */}
            <input
              type="text"
              placeholder="Judul Web"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm text-white placeholder-[#a3b0ff] bg-white/20 border border-blue-950 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-950"
              required
            />

            {/* Kategori & Upload */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Headless UI Category Select */}
              <div className="sm:w-1/2">
                <Listbox value={selectedCategory} onChange={(cat) => setCategoryId(cat.id)}>
                  <div className="relative">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left text-white border rounded-lg shadow-md cursor-pointer bg-white/20 border-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-950 sm:text-sm">
                      <span className="block truncate">
                        {selectedCategory ? selectedCategory.name : 'Pilih Kategori'}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon className="w-5 h-5 text-gray-300" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base rounded-lg shadow-lg bg-black/50 max-h-60 ring-1 ring-white/20 focus:outline-none sm:text-sm">
                        {category
                          .filter((cat) => cat.name && cat.name.trim() !== '')
                          .map((cat) => (
                            <Listbox.Option
                              key={cat.id}
                              value={cat}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-white/20 text-white' : 'text-white'
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {cat.name}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-300">
                                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                    </span>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              {/* Upload Button */}
              <div className="flex flex-col items-center sm:w-1/2">
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setExistingImage(null);
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="relative inline-flex items-center justify-center w-full h-10 px-4 overflow-hidden text-sm text-white transition-all duration-300 border rounded-lg shadow-xl cursor-pointer border-white/30 group"
                >
                  <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[50%] group-hover:h-[200%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
                  <span className="relative z-10">{web ? 'Ganti Gambar' : 'Tambah Gambar'}</span>
                </label>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-center gap-6 mt-5 mb-5">
              <button
                onClick={close}
                aria-label="Batal"
                title="Batal"
                type="button"
                className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
              >
                <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
                <FiX className="relative z-10 text-xl" />
              </button>

              <button
                type="submit"
                disabled={loading}
                aria-label="Simpan"
                title="Simpan"
                className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
              >
                <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
                              {loading ? (
                                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                              ) : (
                                <FiCheck className="relative z-10 text-xl" />
                              )}
              </button>
            </div>
          </form>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex-1 h-[1px] bg-white/50" />
          <img
            src="/images/logo.png"
            alt="logo"
            className="object-cover rounded-full w-7 h-7 animate-spin-slow"
          />
          <div className="flex-1 h-[1px] bg-white/50" />
        </div>
      </div>
    </div>
  );
};

export default WeblistModalForm;
