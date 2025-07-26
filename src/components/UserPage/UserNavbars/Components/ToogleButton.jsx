import React from "react";
import { AlignLeft, AlignRight } from "lucide-react";

const ToggleButton = ({ isOpen, toggleMenu }) => {
  return (
    <div className="md:hidden z-[999] cursor-pointer" onClick={toggleMenu}>
      {isOpen ? (
        <AlignRight className="text-white transition-transform duration-300 w-8 h-8" />
      ) : (
        <AlignLeft className="text-white transition-transform duration-300 w-8 h-8" />
      )}
    </div>
  );
};

export default ToggleButton;
