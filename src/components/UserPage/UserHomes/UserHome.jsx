import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const UserHome = () => {
  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden bg-[linear-gradient(to_top,_rgb(99,144,204),_rgba(193,206,229,1))]"
    >
      {/* Full Height Wrapper */}
      <div className="relative z-20 flex flex-col items-center justify-between w-full h-full py-16 md:flex-row md:py-0">
        {/* Left Content with fixed % size */}
        <div className="w-full md:w-[60%] h-full p-[5%] md:pl-[10%] space-y-6 text-left flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[32px] md:text-4xl lg:text-[45px] font-bold text-white font-satoshi leading-tight"
          >
            Temukan Website
            <br />
            Temukan Cerita Dibaliknya
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
            className="relative flex w-[70%] items-center px-6 py-3 space-x-2 overflow-hidden text-sm text-white transition-all duration-300 border cursor-pointer rounded-3xl md:text-base bg-white/20 border-white/30 group"
          >
            {/* Ripple Fill Effect */}
            <span className="absolute inset-0 w-0 h-0 bg-white rounded-full group-hover:w-[50%] group-hover:h-[500%] group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]"></span>


            {/* Icon and Text */}
            <ArrowRight className="relative z-10 text-white size-5" />
            <a href="#weblist" className="relative z-10">
              Jelajahi Sekarang
            </a>
          </motion.div>
        </div>

{/* Right Content (Spline) */}
<div className="
  w-full h-full 
  md:w-[40%] md:pr-[10%] md:relative
  absolute top-0 left-0 z-0
  flex items-center justify-center
">
  <iframe
    src="https://my.spline.design/untitled-j1jPSS2tv357Jxqskcr4PXve/"
    frameBorder="0"
    className="
      w-[140%] h-[140%] 
      md:w-[100%] md:h-[100%] 
      md:rounded-lg 
      opacity-30 md:opacity-100
      scale-[1.4] translate-x-[20%] 
      md:scale-100 md:translate-x-0
      pointer-events-none  // supaya tidak menghalangi klik elemen lain
    "
    allow="autoplay; fullscreen"
  ></iframe>
</div>

      </div>
    </section>
  );
};

export default UserHome;
