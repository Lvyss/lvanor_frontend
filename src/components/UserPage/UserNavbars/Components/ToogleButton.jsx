import React from "react";
import { AlignLeft, AlignRight } from "lucide-react";

const ToggleButton = ({ isOpen, toggleMenu }) => {
  return (
    <div className="md:hidden z-[999] cursor-pointer" onClick={toggleMenu}>
      {isOpen ? (
        <AlignRight className="w-8 h-8 text-white transition-transform duration-300" />
      ) : (
        <AlignLeft className="w-8 h-8 text-white transition-transform duration-300" />
      )}
    </div>
  );
};

export default ToggleButton;
