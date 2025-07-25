import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const UserHome = () => {
  return (
    <section
      id="home"
      className="relative w-full h-auto overflow-hidden bg-[linear-gradient(to_top,_rgb(99,144,204),_rgba(193,206,229,1))] md:h-screen"


    >

      {/* Ice Blue Gradient Overlay */}
      {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-blue-900/40 to-transparent" /> */}

      {/* Content Grid */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between w-full h-full px-6 md:px-[100px] py-16 md:py-0">
        {/* Left Content */}
        <div className="w-full space-y-6 text-left md:w-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[32px] md:text-4xl lg:text-[45px] font-bold text-white font-satoshi leading-tight"
          >
            Temukan Website<br />Temukan Cerita Dibaliknya
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[14px] md:text-base lg:text-[15px] italic text-white/90 font-poppins"
          >
            "Galeri digital tempat website kami hidup dan bercerita. <br />
            Jelajahi karya, temukan inspirasi di setiap halaman."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center px-6 py-3 space-x-2 text-sm text-white border rounded-lg cursor-pointer md:text-base bg-white/20 border-white/30 group"
          >
            <span className="absolute inset-0 w-0 h-0 bg-white opacity-20 rounded-full group-hover:w-72 group-hover:h-72 group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]"></span>

            <ArrowRight className="relative z-10 text-white size-5" />
            <a href="#weblist" className="relative z-10">
              Jelajahi Sekarang
            </a>
          </motion.div>
        </div>

        {/* Right Content - Spline */}
        <div className="flex items-center justify-center w-full mt-10 md:w-1/2 md:mt-0">
          <iframe
            src="https://my.spline.design/untitled-j1jPSS2tv357Jxqskcr4PXve/"
            frameBorder="0"
            className="w-full h-[400px] md:h-[500px] rounded-lg shadow-xl"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default UserHome;
