import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthApi } from "../api/AuthApi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import routes from "../../../routes";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPopup = ({ show, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { socialLogin } = useContext(AuthApi);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
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
        onClose();
        navigate(response.user.role === "admin" ? routes.admin : routes.user);
      } catch (err) {
        toast.error("Login Google gagal!");
      } finally {
        setIsLoading(false);
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
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute text-xl text-white top-4 right-4 hover:text-white"
            >
              <MdClose />
            </button>

            {/* Logo and Title */}
            <div className="mt-2 text-center">
              <h1 className="text-[45px] font-antiqua">LVANOR</h1>
            </div>

            <div className="flex justify-center">
              <p className="mb-14 text-[11px] italic text-white font-poppins text-center">
                Untuk menggunakan Lvanor, Anda harus masuk ke akun google menggunakan icon di bawah ini
              </p>
            </div>

            {/* Google login */}
            <motion.div
              onClick={() => login()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center px-6 py-3 mb-20 space-x-5 overflow-hidden text-base text-white transition-all duration-300 border cursor-pointer rounded-3xl bg-white/20 border-white/30 group"
          >
            <span className="absolute inset-0 w-0 h-0 bg-white rounded-full group-hover:w-[50%] group-hover:h-[500%] group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]"></span>
            <FaGoogle className="relative z-10 text-white size-5" />
            <button className="relative z-10">Login dengan Google</button>
          </motion.div>
          <div className="flex items-center justify-center gap-3 -mb-12">
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
