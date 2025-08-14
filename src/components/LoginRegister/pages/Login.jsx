import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthApi } from "../api/AuthApi";
import toast from "react-hot-toast";
import routes from "../../../routes";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPopup = ({ show, onClose }) => {
  const { socialLogin } = useContext(AuthApi);
  const navigate = useNavigate();

const login = useGoogleLogin({ 
  onSuccess: async (tokenResponse) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      });
      const userInfo = await res.json();

      const response = await socialLogin({
        provider: "google",
        provider_id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.picture,
      });

      toast.success("Login Google berhasil!");

   

      navigate(response.user.role === "admin" ? routes.admin : routes.user);
    } catch (err) {
      toast.error("Login Google gagal!");
      // ❌ jangan tutup popup jika gagal
    }
  },
  onError: () => toast.error("Login dibatalkan atau gagal"),
});


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="login-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md p-20 text-white shadow-lg bg-black/50 rounded-xl"
          >
            <button
              onClick={onClose}
              className="absolute text-xl text-white top-4 right-4 hover:text-white"
            >
              <MdClose />
            </button>

            <div className="mt-2 text-center">
              <h1 className="text-[45px] font-antiqua">LVANOR</h1>
            </div>

            <div className="flex justify-center">
              <p className="mb-14 text-[11px] italic text-white font-poppins text-center">
                Untuk menggunakan Lvanor, Anda harus masuk ke akun google menggunakan icon di bawah ini
              </p>
            </div>

<motion.div
    onClick={() => {
    onClose(); // ❌ langsung tutup popup
    login();   // lanjutkan proses login di background
  }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="relative flex items-center justify-center px-6 py-3 mb-20 space-x-3 overflow-hidden text-base text-white transition-all duration-300 border cursor-pointer rounded-3xl bg-white/20 border-white/30 group"
>
  <FaGoogle className="relative z-10 text-white size-5" />
  <span className="relative z-10">Login dengan Google</span>
</motion.div>



            <div className="flex items-center justify-center gap-3 -mb-6">
              <div className="flex-1 h-[1px] bg-white/50" />
              <img
                src="/images/logo.png"
                alt="logo"
                className="object-cover rounded-full w-7 h-7 animate-spin-slow"
              />
              <div className="flex-1 h-[1px] bg-white/50" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopup;
