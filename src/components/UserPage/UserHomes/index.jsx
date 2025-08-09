import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const [isSplineLoading, setIsSplineLoading] = useState(true);

  const [showFooter, setShowFooter] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setShowFooter(false); // scroll down
    } else {
      setShowFooter(true); // scroll up
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);

  // Fix: set --vh untuk viewport height yang akurat di mobile
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSplineLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-[calc(var(--vh,1vh)*100)] overflow-hidden bg-gradient-blue"
    >
      <div className="relative z-20 flex flex-col items-center justify-between w-full h-full py-16 md:flex-row md:py-0">
        {/* Kiri */}
        <div className="w-full md:w-[50%] h-full p-[5%] md:pl-[10%] space-y-6 text-left flex flex-col justify-center">
          <div className="flex items-center space-x-5 md:ml-[-13%]">
            <div className="w-10 h-[1px] bg-white/60" />
            <img
              src="/images/logo.png"
              alt="Logo"
              className="object-contain w-7 h-7"
            />
            <p className="text-[10px] text-white/70 tracking-widest uppercase font-semibold">
              LVANOR WEBSITE
            </p>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[40px] md:text-[50px] font-bold text-white font-satoshi leading-[100%]"
          >
            Temukan Website
            <br /> Temukan Cerita Dibaliknya
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[15px] italic text-white/90 font-poppins"
          >
            "Galeri digital tempat website kami hidup dan bercerita. <br />
            Jelajahi karya, temukan inspirasi di setiap halaman."
          </motion.p>

          <motion.div
            onClick={() => {
              const el = document.getElementById("weblist");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex w-[70%] items-center px-6 py-3 space-x-2 overflow-hidden text-sm text-white transition-all duration-300 border cursor-pointer rounded-3xl md:text-base bg-white/20 border-white/30 group"
          >
            <span className="absolute inset-0 w-0 h-0 bg-white rounded-full group-hover:w-[50%] group-hover:h-[500%] group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]"></span>
            <ArrowRight className="relative z-10 text-white size-5" />
            <button className="relative z-10">Jelajahi Sekarang</button>
          </motion.div>
        </div>

        {/* Kanan (Spline + Spinner) */}
        <div
          className="
            w-full h-full 
            md:w-[50%] md:relative
            absolute top-0 left-0 z-0
            flex items-center justify-center
          "
        >
          {isSplineLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              {/* Spinner */}
              <div className="w-10 h-10 border-4 rounded-full border-white/30 border-t-white animate-spin" />
            </div>
          ) : (
            <motion.iframe
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1.0, ease: "easeInOut", delay: 0.5 }}
              src="https://my.spline.design/untitled-j1jPSS2tv357Jxqskcr4PXve/"
              frameBorder="0"
              className="
                absolute top-0 left-0
                w-full h-full 
                md:relative 
                md:w-[100%] md:h-[100%] 
                md:rounded-lg 
                md:opacity-100
                opacity-40
                scale-[1.4] translate-x-[20%] 
                md:scale-100 md:translate-x-0
                pointer-events-none
                z-0
              "
              allow="autoplay; fullscreen"
            />
          )}
        </div>

        {/* Footer */}
        <motion.div
  initial={{ opacity: 1, y: 0 }}
  animate={showFooter ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="absolute left-0 z-30 w-full bottom-4"
>

          <div className="pl-[5%] pr-[5%] flex justify-between items-center text-white text-[10px] font-poppins uppercase tracking-widest">
            <p>TEMUKAN WEBSITE YANG TERASA SEPERTIMU.</p>
            <p>|| 2025</p>
          </div>

          <div className="w-full h-[1px] bg-white/60 my-2" />

          <div className="pl-[5%] pr-[5%] flex justify-between items-center text-white text-[10px] font-poppins tracking-wider">
            <p>GULIR UNTUK MENJELAJAHI</p>
            <div className="flex gap-2">
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="w-1 h-1 rounded-full bg-white/60" />
              <span className="w-1 h-1 rounded-full bg-white/90" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Index;
