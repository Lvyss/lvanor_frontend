// src/components/NotFound.jsx
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-center p-4">
      <div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg">Halaman tidak ditemukan.</p>
        <p className="mt-2 opacity-60">Mungkin kamu membuka portal ke dunia yang salah.</p>
      </div>
    </div>
  );
};

export default NotFound;
