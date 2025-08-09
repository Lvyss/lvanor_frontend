// ModalContent.jsx
import { useEffect, useRef, useState } from "react";
import { Mail, Bookmark, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import UserFooter from "../../../UserFooters";

const ModalContent = ({ data }) => {
  const scrollRef = useRef(null);
  const [scrolledHeader, setScrolledHeader] = useState(false);

  const detail = data.weblist_detail;
  const images = data.weblist_images || [];

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrolledHeader(scrollRef.current.scrollTop > 100);
      }
    };

    document.body.classList.add("overflow-hidden");
    scrollRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      document.body.classList.remove("overflow-hidden");
      scrollRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-h-screen overflow-y-auto shadow-xl"
    >
      <div className="bg-[linear-gradient(to_top,_rgb(99,144,204),_rgba(193,206,229,1))] pb-10  pt-14">

        <h2 className="md:pr-[20%] md:pl-[20%] pr-[10%] pl-[10%] w-full text-2xl text-gray-900 break-words font-poppins">
          {data.title}
        </h2>

        {/* Sticky Header */}
        
        <div
          className={`sticky top-0 z-50 pt-6 pb-4 transition-all duration-1000 ${
            scrolledHeader
              ? "bg-white/100 bg-blur-sm shadow-sm"
              : "bg-transparent"
          }`}
        >
          <div className="flex flex-col md:mr-[20%] md:ml-[20%] mr-[10%] ml-[10%] justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <img
                src={data.user?.profile_picture || "/images/default-profile.png"}
                alt={data.user?.name || "Uploader"}
                className="object-cover w-10 h-10 rounded-full"
              />
              <div className="text-sm">
                <p className="font-semibold text-black">{data.user?.name}</p>
                <p className="flex items-center gap-1 text-black">
                  <Mail size={14} className="inline-block" />
                  {data.user?.email || "design@example.com"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 border rounded-full hover:border-black hover:text-black">
                <Heart size={18} />
              </button>
              <button className="p-2 text-gray-500 border rounded-full hover:border-black hover:text-black">
                <Bookmark size={18} />
              </button>
              <a
                href={detail.website_link}
                className="relative inline-flex items-center px-6 py-2 overflow-hidden text-sm text-white transition-all duration-300 bg-black border cursor-pointer rounded-3xl md:text-base border-white/30 group"
              >
                <span className="absolute inset-0 w-0 h-0 bg-white rounded-full group-hover:w-[50%] group-hover:h-[500%] group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Kunjungi Demo</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="md:mr-[20%] md:ml-[20%] mr-[10%] ml-[10%] overflow-hidden bg-gray-100 rounded-md aspect-[4/3]">
          <img
            src={data.image_path}
            alt={data.title}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Description */}
        <div className="mt-8 md:mr-[20%] md:ml-[20%] mr-[10%] ml-[10%] space-y-4 font-poppins text-sm leading-relaxed text-gray-800">
          <p>
            <strong>Derkripsi:</strong>
            <br /> {detail?.description || "Tidak ada deskripsi."}
          </p>
          <p>
            <strong>Fitur:</strong>
            {detail?.features?.length ? (
              <ul className="list-disc list-inside">
                {detail.features.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="">Tidak ada fitur yang ditampilkan.</p>
            )}
          </p>
          <p>
            <strong>Alat yang digunakan:</strong>
            <br /> {detail?.tech_stack || "-"}
          </p>
          <p
            className={`inline-block px-9 py-3 rounded-full font-medium text-sm ${
              Number(detail?.price) > 0
                ? "bg-orange-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {Number(detail?.price) > 0
              ? `Dapatkan : Rp ${Number(detail.price).toLocaleString("id-ID")}`
              : "Dapatkan : Gratis"}
          </p>
        </div>
<div className="bg-[linear-gradient(to_top,_#C0CDE5,_#91AED8)]"
>        {/* Swiper */}
        {images.length > 0 && (
          <div className="mt-12 mb-16 md:mr-[20%] md:ml-[20%] mr-[10%] ml-[10%]">
            <p className="mb-4 text-gray-800 text-md font-poppins">
              <strong>Tampilan Lainnya:</strong>
            </p>
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              autoplay={{ delay: 2500 }}
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 120,
                modifier: 2.5,
                slideShadows: true,
              }}
              pagination={{ clickable: true }}
              modules={[EffectCoverflow, Autoplay, Pagination]}
              className="w-full max-w-6xl mx-auto"
            >
              {images.map((img, index) => (
                <SwiperSlide
                  key={index}
                  className="w-64 h-40 overflow-hidden bg-white shadow-lg rounded-xl"
                >
                  <img
                    src={img.image_path}
                    alt={`screenshot-${index}`}
                    className="object-cover w-full h-full"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Footer Info */}
        <div className=" mt-60 mb-60 pr-[10%] pl-[10%] text-center ">
          <div className="flex items-center justify-center gap-6">
            <div className="flex-1 h-[2px] bg-white/50" />
            <img
              src={data.user?.profile_picture || "/images/default-profile.png"}
              alt={data.user?.name || "Uploader"}
              className="object-cover rounded-full shadow-md w-14 h-14"
            />
            <div className="flex-1 h-[2px] bg-white/50" />
          </div>
          <h2 className="mt-4 text-gray-900 text-md font-poppins">
            {data.user?.name || "Nama Pengguna"}
          </h2>
          {detail?.website_link && (
            <a
              href={detail.website_link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center px-6 py-3 mt-4 overflow-hidden text-sm text-white transition-all duration-300 bg-black border cursor-pointer rounded-3xl md:text-base border-white/30 group"
            >
              <span className="absolute inset-0 w-0 h-0 bg-white rounded-full group-hover:w-[50%] group-hover:h-[500%] group-hover:opacity-30 transition-all duration-700 ease-out transform group-hover:scale-150 drop-shadow-[0_0_8px_#60A5FA]" />
              <span className="relative z-10 flex items-center gap-2">
                <span>Kunjungi Demo</span>
              </span>
            </a>
          )}
        </div><UserFooter /></div>
        
        </div>
      </div>

  );
};

export default ModalContent;
