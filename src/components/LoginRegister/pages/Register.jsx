import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthApi } from "../api/AuthApi";
import { ClipLoader } from "react-spinners";
import routes from "../../../routes";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useContext(AuthApi);
  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus(); // Auto focus input pertama
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.password_confirmation.trim()
    ) {
      setErrorMessage("Semua field harus diisi.");
      setShowError(true);
      return;
    }

    // 💡 Tambahan validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMessage("Format email tidak valid.");
      setShowError(true);
      return;
    }

    if (form.password !== form.password_confirmation) {
      setErrorMessage("Password dan konfirmasi password tidak sesuai.");
      setShowError(true);
      return;
    }

    if (form.password !== form.password_confirmation) {
      setErrorMessage("Password dan konfirmasi password tidak sesuai.");
      setShowError(true);
      return;
    }

    setIsButtonLoading(true);

    try {
      await register(form);
      setSuccessMessage("Registrasi berhasil! Silakan login.");
      setShowSuccess(true);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const messages = Object.values(errors).flat().join("\n");
        setErrorMessage(messages);
      } else {
        setErrorMessage("Registrasi gagal. Terjadi kesalahan tak terduga.");
      }
      setShowError(true);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleNavigate = () => {
    setTimeout(() => {
      navigate(routes.login);
    }, 300); // Sedikit delay biar smooth
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-blue-100">
      {/* Popup Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-green-600">
              Registrasi Berhasil!
            </h3>
            <p className="mb-4">{successMessage}</p>
            <button
              onClick={handleNavigate}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Popup Error */}
      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-red-600">
              Registrasi Gagal
            </h3>
            <p className="mb-4 whitespace-pre-line">{errorMessage}</p>
            <button
              onClick={() => setShowError(false)}
              className="px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold tracking-wide text-center text-gray-800">
          Daftar Akun 🔐
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <input
            ref={nameRef}
            name="name"
            placeholder="Nama Lengkap"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-xl w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              onChange={handleChange}
              placeholder="Konfirmasi Password"
              className="p-3 border border-gray-300 rounded-xl w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-500"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isButtonLoading}
            className="flex items-center justify-center p-3 font-semibold text-white transition duration-300 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600"
          >
            {isButtonLoading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Sudah punya akun? </span>
          <Link
            to={routes.login}
            className="font-semibold text-purple-600 hover:underline"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
