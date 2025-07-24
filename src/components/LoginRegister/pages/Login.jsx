import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthApi } from "../api/AuthApi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import routes from "../../../routes";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { login } = useContext(AuthApi);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const isAdminLogin = location.pathname === "/admin/login";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (!form.email || !form.password) {
      toast.error("Email dan password wajib diisi!");
      setIsButtonLoading(false);
      return;
    }

    e.preventDefault();
    setIsButtonLoading(true);

    try {
      const res = await login(form, isAdminLogin);
      toast.success("Login berhasil!");

      const role = res.user.role;
      if (role === "admin") {
        navigate(routes.admin);
      } else {
        navigate(routes.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal!");
      console.error("Login error:", error.response?.data);
    } finally {
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="mb-6 text-3xl font-bold tracking-wide text-center text-gray-800">
          {isAdminLogin ? "Admin Login" : "User Login"} 👋
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <input
            ref={emailRef}
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 text-sm text-purple-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className={`flex items-center justify-center p-3 font-semibold text-white transition duration-300 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl hover:from-purple-600 hover:to-blue-600 ${
              isButtonLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <ClipLoader size={20} color="#fff" /> : "Login"}
          </button>
        </form>

        {!isAdminLogin && (
          <div className="mt-6 text-center">
            <span className="text-gray-600">Belum punya akun? </span>
            <Link
              to={routes.register}
              className="font-semibold text-purple-600 hover:underline"
            >
              Daftar di sini
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
