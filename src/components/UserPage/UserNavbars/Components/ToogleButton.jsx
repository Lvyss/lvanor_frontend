import React from "react";
import { MoreVertical, X } from 'lucide-react';

const ToggleButton = ({ isOpen, toggleMenu }) => {
  return (
    <div className="md:hidden z-[999] cursor-pointer" onClick={toggleMenu}>
      {isOpen ? (
        <X  className="text-black transition-transform duration-300 w-7 h-7" />
      ) : (
        <MoreVertical  className="text-black transition-transform duration-300 w-7 h-7" />
      )}
    </div>
  );
};

export default ToggleButton;
