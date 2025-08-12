import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck } from "react-icons/fi";

const EditFieldModal = ({ field, label, initialValue, onClose, onSave }) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(field, value);
  };

  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modal = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose} // klik luar tutup modal
      >
        <motion.div
          className="w-full max-w-md p-10 italic text-white border shadow-lg bg-black/50 backdrop-blur-lg rounded-2xl border-white/20 font-poppins"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} // cegah klik di dalam modal close
        >
            <div className="mt-5 mb-5 text-center">
              <h1 className="text-[30px] font-satoshi font-bold">{label}</h1>
            </div>

  <input
    type="text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className="w-full px-3 py-2 bg-white/20 border font-satoshi border-blue-950 rounded-lg text-white placeholder-[#a3b0ff] focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-opacity-80 transition text-center"
    placeholder={`Masukkan ${label.toLowerCase()}`}
  />


<div className="flex justify-center gap-6 mt-4">
  <button
    onClick={onClose}
    aria-label="Batal"
    title="Batal"
    className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
  >
    <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
    <FiX className="relative z-10 text-xl" />
  </button>

  <button
    onClick={handleSave}
    aria-label="Simpan"
    title="Simpan"
    className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden text-white transition-all duration-300 border shadow-xl cursor-pointer border-white/30 rounded-3xl group"
  >
    <span className="absolute inset-0 w-0 h-0 bg-white rounded-full opacity-0 transition-all duration-500 ease-out transform group-hover:w-[70%] group-hover:h-[70%] group-hover:opacity-30 group-hover:scale-150 drop-shadow-[0_0_8px_#A78BFA]" />
    <FiCheck className="relative z-10 text-xl" />
  </button>
</div>


                    <div className="flex items-center justify-center gap-3 mt-6">
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
    </AnimatePresence>
  );
};

export default EditFieldModal;
