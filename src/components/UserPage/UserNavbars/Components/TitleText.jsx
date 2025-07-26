import React from 'react';
import { motion } from 'framer-motion';

const TitleText = ({ text }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: -20,
      filter: 'blur(4px)',
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 200,
        delay: 0.03 * i, // lebih cepat per huruf
      },
    }),
  };

  return (
    <motion.div
      className="text-white flex space-x-[0.5px] font-antiqua text-[18px] md:text-2xl tracking-normal"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          custom={letters.length - index - 1}
          variants={child}
          initial="hidden"
          animate="visible"
          className="relative transition-transform duration-100 cursor-pointer hover:scale-125"
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TitleText;
