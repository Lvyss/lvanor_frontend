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
        damping: 12,
        stiffness: 100,
        delay: 0.1 * i, // delay manual per huruf
      },
    }),
  };

  return (
    <motion.div
      className="flex space-x-[0.5px] font-atiqua text-[18px] md:text-2xl tracking-normal"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          custom={letters.length - index - 1} // bikin delay-nya kebalik
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
