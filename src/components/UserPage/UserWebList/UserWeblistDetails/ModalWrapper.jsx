// ModalWrapper.jsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ModalWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-x-0 bottom-0 z-50 flex items-start justify-center top-10 bg-gradient-to-b to-[#6390cc] via-[#b5d5ff] from-[#edf5ff]"
      >
        <button
          onClick={onClose}
          className="absolute z-[999] p-2 rounded-full shadow md:top-6 md:right-6 right-3 top-3 bg-black/80 hover:bg-[#6390cc]"
        >
          <X className="w-4 h-4 text-white md:h-5 md:w-5" />
        </button>
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWrapper;
