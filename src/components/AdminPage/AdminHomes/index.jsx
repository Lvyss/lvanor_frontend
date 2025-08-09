import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
<section 
  id="Beranda" 
  className="relative w-full h-auto aspect-[10/11] md:aspect-auto md:h-screen overflow-hidden bg-black flex justify-center"
>
  {/* Background Image */}
  <img 
    src="https://res.cloudinary.com/dq0kdch2r/image/upload/v1753005056/bg_objgpn.jpg" 
    alt="Background" 
    className="absolute top-0 left-0 object-cover w-full h-full object-[70%] md:object-center" 
  />
{/* Gradient Overlay */}
<div className="absolute top-0 left-0 w-3/4 h-full pointer-events-none bg-gradient-to-r from-black/60 to-transparent"></div>

{/* Content */}
<div className="absolute top-0 left-0 flex items-center justify-start w-full h-full px-5 md:px-[100px]">
  <div className="max-w-[60%] md:max-w-[50%] space-y-4 text-left">
    {/* Judul */}
    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="mt-[-100px] md:mt-0 text-[35px] md:text-4xl lg:text-[45px] tracking-wider font-bold text-black font-satoshi leading-[35px] md:leading-[45px]"
    >
      Temukan Website<br />Temukan Cerita Dibaliknya
    </motion.h1>

    {/* Deskripsi */}
    <motion.p
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="text-[12px] md:text-base lg:text-[13.5px] italic text-black font-poppins"
    >
      "Galeri digital tempat website kami hidup dan bercerita. <br />
      Jelajahi karya, temukan inspirasi di setiap halaman."
    </motion.p>

    {/* Tombol */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex items-center justify-center px-[20px] py-[10px] space-x-2 overflow-hidden text-[15px]  text-black transition-all duration-300 border rounded-lg cursor-pointer md:px-8 md:py-3 md:text-md bg-white/30 border-invaPurple font-satoshi font-bold group"
    >
      {/* Ripple Fill Effect */}
      <span className="absolute inset-0 w-0 h-0 bg-white opacity-20 rounded-full group-hover:w-72 group-hover:h-72 group-hover:opacity-40 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#FF4FCB]"></span>

      {/* Icon */}
      <ArrowRight className="relative z-10 transition-all duration-300 size-[15px] md:size-[20px]  text-white" />

      {/* Button Text */}
      <a href='#WebList' className="relative z-10 text-white transition-all duration-300 ">
        Jelajahi Sekarang
      </a >
    </motion.div>
  </div>
</div>



</section>


  )
}

export default Index;
