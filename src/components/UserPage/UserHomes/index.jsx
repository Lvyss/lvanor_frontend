import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Simple hooks + small components in one file for copy-paste speed.
 * - useVh: sets --vh (mobile viewport fix)
 * - useHideOnScroll: hides footer on scroll down using ref + rAF throttle
 * - LazyIframe: loads iframe after a delay or when visible
 */

/* ---------- Hooks ---------- */
function useVh() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);
}

function useHideOnScroll(threshold = 100) {
  const lastY = useRef(0);
  const ticking = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          if (currentY > lastY.current && currentY > threshold) {
            setVisible(false);
          } else {
            setVisible(true);
          }
          lastY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}

/* ---------- Components ---------- */
const LeftColumn = memo(function LeftColumn({ onExploreClick }) {
  return (
    <div className="w-full md:w-[50%] h-full p-[5%] md:pl-[10%] space-y-6 text-left flex flex-col justify-center">
      <div className="flex items-center space-x-5 md:ml-[-13%]">
        <div className="w-10 h-[1px] bg-white/60" />
        <img src="/images/logo.png" alt="Logo" className="object-contain w-7 h-7" />
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
        onClick={onExploreClick}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex w-[70%] items-center px-6 py-3 space-x-2 overflow-hidden text-sm text-white transition-all duration-300 border cursor-pointer rounded-3xl md:text-base bg-white/20 border-white/30 group"
        role="button"
        tabIndex={0}
      >
        <span className="absolute inset-0 w-0 h-0 bg-white rounded-full group-hover:w-[50%] group-hover:h-[500%] group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]"></span>
        <ArrowRight className="relative z-10 text-white size-5" />
        <button className="relative z-10">Jelajahi Sekarang</button>
      </motion.div>
    </div>
  );
});

function LazyIframe({ src, placeholderDelay = 3000 }) {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Wait placeholderDelay then render iframe -> imitates your original behavior
    timeoutRef.current = setTimeout(() => {
      setShouldRender(true);
      setLoading(false);
    }, placeholderDelay);

    return () => clearTimeout(timeoutRef.current);
  }, [placeholderDelay]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      {loading && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-10 h-10 border-4 rounded-full border-white/30 border-t-white animate-spin" />
        </div>
      )}

      {shouldRender && (
        <motion.iframe
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.0, ease: "easeInOut", delay: 0.5 }}
          src={src}
          frameBorder="0"
          className="absolute top-0 left-0 w-full h-full md:relative md:w-[100%] md:h-[100%] md:rounded-lg md:opacity-100 opacity-40 scale-[1.4] translate-x-[20%] md:scale-100 md:translate-x-0 pointer-events-none z-0"
          allow="autoplay; fullscreen"
          title="spline-scene"
        />
      )}
    </div>
  );
}

const RightColumn = memo(function RightColumn({ isLoaded }) {
  return (
    <div className="w-full h-full md:w-[50%] md:relative absolute top-0 md:top-8 left-0 z-0 flex items-center justify-center">
      <LazyIframe src="https://my.spline.design/untitled-j1jPSS2tv357Jxqskcr4PXve/" />
    </div>
  );
});

function Footer({ visible }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
  );
}

/* ---------- Main ---------- */
const Index = () => {
  useVh();
  const footerVisible = useHideOnScroll(100);

  const onExploreClick = useCallback(() => {
    const el = document.getElementById("weblist");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-[calc(var(--vh,1vh)*100)] overflow-hidden bg-gradient-blue"
    >
      <div className="relative z-20 flex flex-col items-center justify-between w-full h-full py-16 md:flex-row md:py-0">
        <LeftColumn onExploreClick={onExploreClick} />
        <RightColumn />
        <Footer visible={footerVisible} />
      </div>
    </section>
  );
};

export default Index;
